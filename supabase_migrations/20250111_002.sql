-- (Re)create the coupon redemption check function
CREATE OR REPLACE FUNCTION public.fn_redeem_coupon_check()
RETURNS TRIGGER AS $$
DECLARE
  l_food_truck_id    uuid;
  l_avail_quantity   int;
  l_person_limit     int;
  l_user_count       int;
  l_points           int;
BEGIN
  -- 1) Fetch the coupon info
  SELECT c.food_truck_id,
         c.available_quantity,
         c.per_person_limit
    INTO l_food_truck_id,
         l_avail_quantity,
         l_person_limit
    FROM public.coupons c
   WHERE c.id = NEW.coupon_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Coupon does not exist.';
  END IF;

  -- 2) If available_quantity is specified, ensure there's at least 1 left
  IF l_avail_quantity IS NOT NULL THEN
    IF l_avail_quantity < 1 THEN
      RAISE EXCEPTION 'No more coupons available to redeem.';
    END IF;
  END IF;

  -- 3) If per_person_limit is specified, check how many times this user already redeemed it
  IF l_person_limit IS NOT NULL THEN
    SELECT COUNT(*)
      INTO l_user_count
      FROM public.coupon_redemptions
     WHERE user_id = NEW.user_id
       AND coupon_id = NEW.coupon_id;

    IF l_user_count >= l_person_limit THEN
      RAISE EXCEPTION 'You have reached the redemption limit for this coupon.';
    END IF;
  END IF;

  -- 4) Check if the user has enough loyalty points
  SELECT lp.points
    INTO l_points
    FROM public.loyalty_points lp
   WHERE lp.user_id = NEW.user_id
     AND lp.food_truck_id = l_food_truck_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No loyalty points record found for this user and truck.';
  END IF;

  IF l_points < NEW.cost_in_points THEN
    RAISE EXCEPTION 'Insufficient loyalty points to redeem this coupon.';
  END IF;

  -- 5) Decrement the coupon's available_quantity (if applicable)
  IF l_avail_quantity IS NOT NULL THEN
    UPDATE public.coupons
       SET available_quantity = available_quantity - 1
     WHERE id = NEW.coupon_id;
  END IF;

  -- 6) Deduct cost_in_points from the user’s loyalty_points
  UPDATE public.loyalty_points
     SET points = points - NEW.cost_in_points
   WHERE user_id = NEW.user_id
     AND food_truck_id = l_food_truck_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- (Re)create the trigger to call the function BEFORE INSERT on coupon_redemptions
DROP TRIGGER IF EXISTS trg_coupon_redemptions_check ON public.coupon_redemptions;
CREATE TRIGGER trg_coupon_redemptions_check
BEFORE INSERT ON public.coupon_redemptions
FOR EACH ROW
EXECUTE FUNCTION public.fn_redeem_coupon_check();
