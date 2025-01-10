--------------------------------------------------------------------------------
-- 1) CREATE THE COUPONS TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.coupons (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_truck_id       uuid NOT NULL REFERENCES public.food_trucks (id) ON DELETE CASCADE,
  available_quantity  int,              -- Optional max # of total redemptions
  per_person_limit    int,              -- Optional max # of redemptions per user
  name                text NOT NULL,
  description         text,
  cost_in_points      int NOT NULL,     -- How many loyalty points are required
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES ON COUPONS (1 policy per line)
-- 1) Everyone can read coupons
CREATE POLICY "Allow read to all on coupons"
  ON public.coupons
  FOR SELECT
  USING (true);

-- 2) Insert only if the user owns the associated food truck
CREATE POLICY "Allow insert if owns the food_truck on coupons"
  ON public.coupons
  FOR INSERT
  WITH CHECK (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

-- 3) Update only if the user owns the associated food truck
CREATE POLICY "Allow update if owns the food_truck on coupons"
  ON public.coupons
  FOR UPDATE
  USING (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

-- 4) Delete only if the user owns the associated food truck
CREATE POLICY "Allow delete if owns the food_truck on coupons"
  ON public.coupons
  FOR DELETE
  USING (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

--------------------------------------------------------------------------------
-- 2) CREATE THE COUPON_REDEMPTIONS TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.coupon_redemptions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  coupon_id      uuid NOT NULL REFERENCES public.coupons (id) ON DELETE CASCADE,
  redeemed_at    timestamptz NOT NULL DEFAULT now(),
  cost_in_points int NOT NULL,  -- how many points were used to redeem
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES ON COUPON_REDEMPTIONS (1 policy per line)
-- 1) Allow read if the current user is the redeemer OR the truck owner
CREATE POLICY "Allow read if user or truck owner on coupon_redemptions"
  ON public.coupon_redemptions
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.uid() = (
      SELECT ft.user_id
      FROM public.coupons c
      JOIN public.food_trucks ft ON ft.id = c.food_truck_id
      WHERE c.id = coupon_id
    )
  );

-- 2) Allow insert only if the user is self
CREATE POLICY "Allow insert if user is self on coupon_redemptions"
  ON public.coupon_redemptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3) Allow update if user is self OR truck owner
CREATE POLICY "Allow update if user or truck owner on coupon_redemptions"
  ON public.coupon_redemptions
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR auth.uid() = (
      SELECT ft.user_id
      FROM public.coupons c
      JOIN public.food_trucks ft ON ft.id = c.food_truck_id
      WHERE c.id = coupon_id
    )
  );

-- 4) Allow delete if user is self OR truck owner
CREATE POLICY "Allow delete if user or truck owner on coupon_redemptions"
  ON public.coupon_redemptions
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR auth.uid() = (
      SELECT ft.user_id
      FROM public.coupons c
      JOIN public.food_trucks ft ON ft.id = c.food_truck_id
      WHERE c.id = coupon_id
    )
  );

--------------------------------------------------------------------------------
-- 3) ADD TRIGGER + FUNCTION FOR BUSINESS LOGIC
--------------------------------------------------------------------------------
-- This trigger enforces:
--    1) available_quantity > 0 (if not null),
--    2) per_person_limit not exceeded (if not null),
--    3) user has enough loyalty points (and we decrement them),
--    4) we decrement the coupon's available_quantity by 1.

CREATE OR REPLACE FUNCTION public.fn_redeem_coupon_check()
RETURNS TRIGGER AS $$
DECLARE
  l_food_truck_id    uuid;
  l_avail_quantity   int;
  l_person_limit     int;
  l_user_count       int;
  l_points           int;
BEGIN
  -- 1) Fetch the coupon info (food_truck_id, available_quantity, per_person_limit)
  SELECT c.food_truck_id,
         c.available_quantity,
         c.per_person_limit
    INTO l_food_truck_id,
         l_avail_quantity,
         l_person_limit
    FROM public.coupons c
   WHERE c.id = NEW.coupon_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Coupon does not exist';
  END IF;

  -- 2) If available_quantity is specified, ensure there's at least one left
  IF l_avail_quantity IS NOT NULL THEN
    IF l_avail_quantity < 1 THEN
      RAISE EXCEPTION 'No more coupons available to redeem.';
    END IF;
  END IF;

  -- 3) If per_person_limit is specified, check how many times this user has redeemed it
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
    RAISE EXCEPTION 'Insufficient loyalty points to redeem coupon.';
  END IF;

  -- 5) Decrement the coupon's available_quantity if not null
  IF l_avail_quantity IS NOT NULL THEN
    UPDATE public.coupons
       SET available_quantity = available_quantity - 1
     WHERE id = NEW.coupon_id;
  END IF;

  -- 6) Deduct cost_in_points from the user's loyalty_points
  UPDATE public.loyalty_points
     SET points = points - NEW.cost_in_points
   WHERE user_id = NEW.user_id
     AND food_truck_id = l_food_truck_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the BEFORE INSERT trigger to enforce the logic
CREATE TRIGGER trg_coupon_redemptions_check
BEFORE INSERT ON public.coupon_redemptions
FOR EACH ROW
EXECUTE FUNCTION public.fn_redeem_coupon_check();

--------------------------------------------------------------------------------
-- DONE
--------------------------------------------------------------------------------
COMMIT;
