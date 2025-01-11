-- OPTIONAL: Enable PostGIS (if you need location columns)
CREATE EXTENSION IF NOT EXISTS postgis;

--------------------------------------------------------------------------------
-- 1) FOOD_TRUCKS TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.food_trucks (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  name             text NOT NULL,
  description      text,
  address          text,
  location         geography(Point, 4326),  -- from postgis, optional
  range_of_service int,
  joined_date      date DEFAULT CURRENT_DATE,
  created_at       timestamptz DEFAULT now() NOT NULL,
  updated_at       timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.food_trucks ENABLE ROW LEVEL SECURITY;

-- Policies (one line each)
CREATE POLICY "Allow read to all on food_trucks"
  ON public.food_trucks
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert if user is self on food_trucks"
  ON public.food_trucks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update if user is self on food_trucks"
  ON public.food_trucks
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Allow delete if user is self on food_trucks"
  ON public.food_trucks
  FOR DELETE
  USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 2) CUISINE_TYPES TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.cuisine_types (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.cuisine_types ENABLE ROW LEVEL SECURITY;

-- Everyone can read; only authenticated users can insert/update/delete
CREATE POLICY "Allow read to all on cuisine_types"
  ON public.cuisine_types
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert to authenticated on cuisine_types"
  ON public.cuisine_types
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update to authenticated on cuisine_types"
  ON public.cuisine_types
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow delete to authenticated on cuisine_types"
  ON public.cuisine_types
  FOR DELETE
  USING (auth.role() = 'authenticated');

--------------------------------------------------------------------------------
-- 3) FOOD_TRUCK_CUISINE_TYPES (MANY-TO-MANY)
--------------------------------------------------------------------------------
CREATE TABLE public.food_truck_cuisine_types (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_truck_id    uuid NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  cuisine_type_id  uuid NOT NULL REFERENCES public.cuisine_types(id) ON DELETE CASCADE,
  created_at       timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.food_truck_cuisine_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read to all on food_truck_cuisine_types"
  ON public.food_truck_cuisine_types
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert if truck owner on food_truck_cuisine_types"
  ON public.food_truck_cuisine_types
  FOR INSERT
  WITH CHECK (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

CREATE POLICY "Allow update if truck owner on food_truck_cuisine_types"
  ON public.food_truck_cuisine_types
  FOR UPDATE
  USING (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

CREATE POLICY "Allow delete if truck owner on food_truck_cuisine_types"
  ON public.food_truck_cuisine_types
  FOR DELETE
  USING (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

--------------------------------------------------------------------------------
-- 4) EVENTS TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.events (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  title            text NOT NULL,
  description      text,
  address          text,
  location_desc    text,
  location         geography(Point, 4326),
  start_time       timestamptz,
  end_time         timestamptz,
  created_at       timestamptz DEFAULT now() NOT NULL,
  updated_at       timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read to all on events"
  ON public.events
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert if user is self on events"
  ON public.events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update if user is self on events"
  ON public.events
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Allow delete if user is self on events"
  ON public.events
  FOR DELETE
  USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 5) EVENT_FOOD_TRUCKS (MANY-TO-MANY)
--------------------------------------------------------------------------------
CREATE TABLE public.event_food_trucks (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  food_truck_id  uuid NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  created_at     timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.event_food_trucks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read to all on event_food_trucks"
  ON public.event_food_trucks
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert if owns event and truck on event_food_trucks"
  ON public.event_food_trucks
  FOR INSERT
  WITH CHECK (
    auth.uid() = (
      SELECT e.user_id FROM public.events e WHERE e.id = event_id
    )
    AND
    auth.uid() = (
      SELECT ft.user_id FROM public.food_trucks ft WHERE ft.id = food_truck_id
    )
  );

CREATE POLICY "Allow update if owns event and truck on event_food_trucks"
  ON public.event_food_trucks
  FOR UPDATE
  USING (
    auth.uid() = (
      SELECT e.user_id FROM public.events e WHERE e.id = event_id
    )
    AND
    auth.uid() = (
      SELECT ft.user_id FROM public.food_trucks ft WHERE ft.id = food_truck_id
    )
  );

CREATE POLICY "Allow delete if owns event and truck on event_food_trucks"
  ON public.event_food_trucks
  FOR DELETE
  USING (
    auth.uid() = (
      SELECT e.user_id FROM public.events e WHERE e.id = event_id
    )
    AND
    auth.uid() = (
      SELECT ft.user_id FROM public.food_trucks ft WHERE ft.id = food_truck_id
    )
  );

--------------------------------------------------------------------------------
-- 6) MENUS TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.menus (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_truck_id uuid NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  name          text NOT NULL,
  description   text,
  created_at    timestamptz DEFAULT now() NOT NULL,
  updated_at    timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read to all on menus"
  ON public.menus
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert if truck owner on menus"
  ON public.menus
  FOR INSERT
  WITH CHECK (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

CREATE POLICY "Allow update if truck owner on menus"
  ON public.menus
  FOR UPDATE
  USING (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

CREATE POLICY "Allow delete if truck owner on menus"
  ON public.menus
  FOR DELETE
  USING (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

--------------------------------------------------------------------------------
-- 7) MENU_SECTIONS TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.menu_sections (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id     uuid NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
  name        text NOT NULL,
  description text,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.menu_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read to all on menu_sections"
  ON public.menu_sections
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert if truck owner on menu_sections"
  ON public.menu_sections
  FOR INSERT
  WITH CHECK (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      JOIN public.menus m ON m.food_truck_id = ft.id
      WHERE m.id = menu_id
    )
  );

CREATE POLICY "Allow update if truck owner on menu_sections"
  ON public.menu_sections
  FOR UPDATE
  USING (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      JOIN public.menus m ON m.food_truck_id = ft.id
      WHERE m.id = menu_id
    )
  );

CREATE POLICY "Allow delete if truck owner on menu_sections"
  ON public.menu_sections
  FOR DELETE
  USING (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      JOIN public.menus m ON m.food_truck_id = ft.id
      WHERE m.id = menu_id
    )
  );

--------------------------------------------------------------------------------
-- 8) MENU_ITEMS TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.menu_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_section_id  uuid NOT NULL REFERENCES public.menu_sections(id) ON DELETE CASCADE,
  name             text NOT NULL,
  description      text,
  price            numeric(10,2),
  calories         int,
  created_at       timestamptz DEFAULT now() NOT NULL,
  updated_at       timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read to all on menu_items"
  ON public.menu_items
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert if truck owner on menu_items"
  ON public.menu_items
  FOR INSERT
  WITH CHECK (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      JOIN public.menus m ON m.food_truck_id = ft.id
      JOIN public.menu_sections ms ON ms.menu_id = m.id
      WHERE ms.id = menu_section_id
    )
  );

CREATE POLICY "Allow update if truck owner on menu_items"
  ON public.menu_items
  FOR UPDATE
  USING (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      JOIN public.menus m ON m.food_truck_id = ft.id
      JOIN public.menu_sections ms ON ms.menu_id = m.id
      WHERE ms.id = menu_section_id
    )
  );

CREATE POLICY "Allow delete if truck owner on menu_items"
  ON public.menu_items
  FOR DELETE
  USING (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      JOIN public.menus m ON m.food_truck_id = ft.id
      JOIN public.menu_sections ms ON ms.menu_id = m.id
      WHERE ms.id = menu_section_id
    )
  );

--------------------------------------------------------------------------------
-- 9) REVIEWS TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.reviews (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  food_truck_id  uuid NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  title          text,
  body           text,
  star_value     int CHECK (star_value BETWEEN 1 AND 5),
  created_at     timestamptz DEFAULT now() NOT NULL,
  updated_at     timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read to all on reviews"
  ON public.reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert if user is self on reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update if user is self on reviews"
  ON public.reviews
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Allow delete if user is self on reviews"
  ON public.reviews
  FOR DELETE
  USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 10) MENU_ITEM_PREFERENCES TABLE (ENUM & Like/Dislike)
--------------------------------------------------------------------------------
-- Example enum for preference
CREATE TYPE public.preference AS ENUM ('like', 'dislike');

CREATE TABLE public.menu_item_preferences (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  menu_item_id uuid NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  preference   public.preference NOT NULL,
  created_at   timestamptz DEFAULT now() NOT NULL,
  updated_at   timestamptz DEFAULT now() NOT NULL,

  UNIQUE (user_id, menu_item_id)
);

ALTER TABLE public.menu_item_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read to all on menu_item_preferences"
  ON public.menu_item_preferences
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert if user is self on menu_item_preferences"
  ON public.menu_item_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update if user is self on menu_item_preferences"
  ON public.menu_item_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Allow delete if user is self on menu_item_preferences"
  ON public.menu_item_preferences
  FOR DELETE
  USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 11) FOOD_TRUCK_FAVORITES TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.food_truck_favorites (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  food_truck_id  uuid NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  created_at     timestamptz DEFAULT now() NOT NULL,

  UNIQUE (user_id, food_truck_id)
);

ALTER TABLE public.food_truck_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read to all on food_truck_favorites"
  ON public.food_truck_favorites
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert if user is self on food_truck_favorites"
  ON public.food_truck_favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update if user is self on food_truck_favorites"
  ON public.food_truck_favorites
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Allow delete if user is self on food_truck_favorites"
  ON public.food_truck_favorites
  FOR DELETE
  USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 12) FOOD_TRUCK_FOLLOWS TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.food_truck_follows (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  food_truck_id  uuid NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  created_at     timestamptz DEFAULT now() NOT NULL,

  UNIQUE (user_id, food_truck_id)
);

ALTER TABLE public.food_truck_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read to all on food_truck_follows"
  ON public.food_truck_follows
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert if user is self on food_truck_follows"
  ON public.food_truck_follows
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update if user is self on food_truck_follows"
  ON public.food_truck_follows
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Allow delete if user is self on food_truck_follows"
  ON public.food_truck_follows
  FOR DELETE
  USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 13) MESSAGES TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.messages (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  food_truck_id  uuid NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  content        text NOT NULL,
  created_at     timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read if user is involved (either truck owner or message sender)"
  ON public.messages
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.uid() = (
      SELECT ft.user_id FROM public.food_trucks ft WHERE ft.id = food_truck_id
    )
  );

CREATE POLICY "Allow insert if user is self on messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update if user is the sender"
  ON public.messages
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Allow delete if user is the sender"
  ON public.messages
  FOR DELETE
  USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 14) LOYALTY_POINTS TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.loyalty_points (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  food_truck_id  uuid NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  points         int DEFAULT 0,
  created_at     timestamptz DEFAULT now() NOT NULL,
  updated_at     timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read if user is self or truck owner on loyalty_points"
  ON public.loyalty_points
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

CREATE POLICY "Allow insert if user is self on loyalty_points"
  ON public.loyalty_points
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update if user is self or truck owner on loyalty_points"
  ON public.loyalty_points
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

CREATE POLICY "Allow delete if user is self or truck owner on loyalty_points"
  ON public.loyalty_points
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

--------------------------------------------------------------------------------
-- 15) COUPONS TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.coupons (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_truck_id      uuid NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  available_quantity int,
  per_person_limit   int,
  name               text NOT NULL,
  description        text,
  cost_in_points     int NOT NULL,
  created_at         timestamptz DEFAULT now() NOT NULL,
  updated_at         timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read to all on coupons"
  ON public.coupons
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert if truck owner on coupons"
  ON public.coupons
  FOR INSERT
  WITH CHECK (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

CREATE POLICY "Allow update if truck owner on coupons"
  ON public.coupons
  FOR UPDATE
  USING (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

CREATE POLICY "Allow delete if truck owner on coupons"
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
-- 16) COUPON_REDEMPTIONS TABLE + TRIGGER LOGIC
--------------------------------------------------------------------------------
CREATE TABLE public.coupon_redemptions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  coupon_id      uuid NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  redeemed_at    timestamptz NOT NULL DEFAULT now(),
  cost_in_points int NOT NULL,
  created_at     timestamptz DEFAULT now() NOT NULL,
  updated_at     timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Allow insert if user is self on coupon_redemptions"
  ON public.coupon_redemptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

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
-- TRIGGER FUNCTION: REDEEM COUPON (Decrement Quantity, Check Points, etc.)
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_redeem_coupon_check()
RETURNS TRIGGER AS $$
DECLARE
  l_food_truck_id    uuid;
  l_avail_quantity   int;
  l_person_limit     int;
  l_user_count       int;
  l_points           int;
BEGIN
  -- Fetch coupon data
  SELECT c.food_truck_id, c.available_quantity, c.per_person_limit
    INTO l_food_truck_id, l_avail_quantity, l_person_limit
    FROM public.coupons c
   WHERE c.id = NEW.coupon_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Coupon does not exist.';
  END IF;

  -- Check availability
  IF l_avail_quantity IS NOT NULL THEN
    IF l_avail_quantity < 1 THEN
      RAISE EXCEPTION 'No coupons left to redeem.';
    END IF;
  END IF;

  -- Check per_person_limit
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

  -- Check user loyalty points
  SELECT lp.points
    INTO l_points
    FROM public.loyalty_points lp
   WHERE lp.user_id = NEW.user_id
     AND lp.food_truck_id = l_food_truck_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User has no loyalty points record with this truck.';
  END IF;

  IF l_points < NEW.cost_in_points THEN
    RAISE EXCEPTION 'Insufficient loyalty points for coupon redemption.';
  END IF;

  -- Decrement coupon quantity if specified
  IF l_avail_quantity IS NOT NULL THEN
    UPDATE public.coupons
       SET available_quantity = available_quantity - 1
     WHERE id = NEW.coupon_id;
  END IF;

  -- Deduct cost_in_points from user's loyalty_points
  UPDATE public.loyalty_points
     SET points = points - NEW.cost_in_points
   WHERE user_id = NEW.user_id
     AND food_truck_id = l_food_truck_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS trg_coupon_redemptions_check ON public.coupon_redemptions;
CREATE TRIGGER trg_coupon_redemptions_check
BEFORE INSERT ON public.coupon_redemptions
FOR EACH ROW
EXECUTE FUNCTION public.fn_redeem_coupon_check();

--------------------------------------------------------------------------------
-- DONE
--------------------------------------------------------------------------------
COMMIT;
