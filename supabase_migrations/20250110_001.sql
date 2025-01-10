-- Enable PostGIS for location fields
CREATE EXTENSION IF NOT EXISTS postgis;

-- Optional: Create an ENUM for menu-item preferences (like/dislike).
CREATE TYPE public.preference AS ENUM ('like','dislike');

--------------------------------------------------------------------------------
-- 1) PROFILES TABLE (assuming you want to store user info referencing auth.users)
--------------------------------------------------------------------------------

CREATE TABLE public.profiles (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username      text,
  created_at    timestamptz DEFAULT now() NOT NULL,
  updated_at    timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow everyone to SELECT from profiles (or change to your preference)
CREATE POLICY "Allow read to all on profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Allow insert only if inserting row matches your auth.uid()
CREATE POLICY "Allow insert for self on profiles"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

-- Allow update only if the row's auth_user_id = auth.uid()
CREATE POLICY "Allow update for self on profiles"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- Allow delete only if the row's auth_user_id = auth.uid()
CREATE POLICY "Allow delete for self on profiles"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = auth_user_id);

--------------------------------------------------------------------------------
-- 2) FOOD_TRUCKS TABLE
--------------------------------------------------------------------------------

CREATE TABLE public.food_trucks (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name             text NOT NULL,
  description      text,
  address          text,
  location         geography(Point, 4326),  -- from postgis
  range_of_service integer,                 -- distance in meters, for example
  joined_date      date DEFAULT CURRENT_DATE,
  created_at       timestamptz DEFAULT now() NOT NULL,
  updated_at       timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.food_trucks ENABLE ROW LEVEL SECURITY;

-- Allow everyone to SELECT (view) all food trucks
CREATE POLICY "Allow read to all on food_trucks"
  ON public.food_trucks
  FOR SELECT
  USING (true);

-- Allow insert only if inserting user_id matches auth.uid()
CREATE POLICY "Allow insert for owner on food_trucks"
  ON public.food_trucks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow update only if the row’s user_id = auth.uid()
CREATE POLICY "Allow update for owner on food_trucks"
  ON public.food_trucks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow delete only if the row’s user_id = auth.uid()
CREATE POLICY "Allow delete for owner on food_trucks"
  ON public.food_trucks
  FOR DELETE
  USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 3) CUISINE_TYPES TABLE (e.g. "Tacos", "BBQ", "Vegan")
--------------------------------------------------------------------------------

CREATE TABLE public.cuisine_types (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

-- Optionally, you can enable RLS here if you want to restrict changes or who can see them.
-- For simplicity, let's just allow full read for everyone, but restrict insert/update/delete
-- to privileged roles or your own logic.

ALTER TABLE public.cuisine_types ENABLE ROW LEVEL SECURITY;

-- Everyone can read cuisine types
CREATE POLICY "Allow read to all on cuisine_types"
  ON public.cuisine_types
  FOR SELECT
  USING (true);

-- (Optional) Only allow insert for users with a matching policy.
-- You could limit to a single admin user, or to any authenticated user:
CREATE POLICY "Allow insert to all on cuisine_types"
  ON public.cuisine_types
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');  -- or your logic

-- (Optional) Similar approach for update/delete
CREATE POLICY "Allow update to all on cuisine_types"
  ON public.cuisine_types
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow delete to all on cuisine_types"
  ON public.cuisine_types
  FOR DELETE
  USING (auth.role() = 'authenticated');

--------------------------------------------------------------------------------
-- 4) FOOD_TRUCK_CUISINE_TYPES (MANY-TO-MANY RELATION)
--------------------------------------------------------------------------------

CREATE TABLE public.food_truck_cuisine_types (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_truck_id    uuid NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  cuisine_type_id  uuid NOT NULL REFERENCES public.cuisine_types(id) ON DELETE CASCADE,
  created_at       timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.food_truck_cuisine_types ENABLE ROW LEVEL SECURITY;

-- Everyone can read the relationships
CREATE POLICY "Allow read to all on food_truck_cuisine_types"
  ON public.food_truck_cuisine_types
  FOR SELECT
  USING (true);

-- Insert only if user owns the food truck
CREATE POLICY "Allow insert if owns the food_truck on food_truck_cuisine_types"
  ON public.food_truck_cuisine_types
  FOR INSERT
  WITH CHECK (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

-- Update only if user owns the food truck
CREATE POLICY "Allow update if owns the food_truck on food_truck_cuisine_types"
  ON public.food_truck_cuisine_types
  FOR UPDATE
  USING (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

-- Delete only if user owns the food truck
CREATE POLICY "Allow delete if owns the food_truck on food_truck_cuisine_types"
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
-- 5) EVENTS TABLE
--------------------------------------------------------------------------------

CREATE TABLE public.events (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

CREATE POLICY "Allow insert for owner on events"
  ON public.events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update for owner on events"
  ON public.events
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Allow delete for owner on events"
  ON public.events
  FOR DELETE
  USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 6) EVENT_FOOD_TRUCKS (MANY-TO-MANY FOR EVENTS <-> FOOD_TRUCKS)
--------------------------------------------------------------------------------

CREATE TABLE public.event_food_trucks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  food_truck_id uuid NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  created_at   timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.event_food_trucks ENABLE ROW LEVEL SECURITY;

-- Everyone can see which trucks are linked to which events
CREATE POLICY "Allow read to all on event_food_trucks"
  ON public.event_food_trucks
  FOR SELECT
  USING (true);

-- Insert only if user owns the event *and* user owns the food truck
CREATE POLICY "Allow insert if owns both event and truck"
  ON public.event_food_trucks
  FOR INSERT
  WITH CHECK (
    auth.uid() = (
      SELECT e.user_id
      FROM public.events e
      WHERE e.id = event_id
    )
    AND
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

-- Similarly for update
CREATE POLICY "Allow update if owns both event and truck"
  ON public.event_food_trucks
  FOR UPDATE
  USING (
    auth.uid() = (
      SELECT e.user_id
      FROM public.events e
      WHERE e.id = event_id
    )
    AND
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

-- Similarly for delete
CREATE POLICY "Allow delete if owns both event and truck"
  ON public.event_food_trucks
  FOR DELETE
  USING (
    auth.uid() = (
      SELECT e.user_id
      FROM public.events e
      WHERE e.id = event_id
    )
    AND
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

--------------------------------------------------------------------------------
-- 7) MENUS TABLE
--------------------------------------------------------------------------------

CREATE TABLE public.menus (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_truck_id uuid NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  name         text NOT NULL,
  description  text,
  created_at   timestamptz DEFAULT now() NOT NULL,
  updated_at   timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read to all on menus"
  ON public.menus
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert if owns the food_truck on menus"
  ON public.menus
  FOR INSERT
  WITH CHECK (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

CREATE POLICY "Allow update if owns the food_truck on menus"
  ON public.menus
  FOR UPDATE
  USING (
    auth.uid() = (
      SELECT ft.user_id
      FROM public.food_trucks ft
      WHERE ft.id = food_truck_id
    )
  );

CREATE POLICY "Allow delete if owns the food_truck on menus"
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
-- 8) MENU_SECTIONS TABLE
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

CREATE POLICY "Allow insert if owns the menu on menu_sections"
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

CREATE POLICY "Allow update if owns the menu on menu_sections"
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

CREATE POLICY "Allow delete if owns the menu on menu_sections"
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
-- 9) MENU_ITEMS TABLE
--------------------------------------------------------------------------------

CREATE TABLE public.menu_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_section_id  uuid NOT NULL REFERENCES public.menu_sections(id) ON DELETE CASCADE,
  name             text NOT NULL,
  description      text,
  price            numeric(10,2),
  calories         integer,
  created_at       timestamptz DEFAULT now() NOT NULL,
  updated_at       timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read to all on menu_items"
  ON public.menu_items
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert if owns the menu_section on menu_items"
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

CREATE POLICY "Allow update if owns the menu_section on menu_items"
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

CREATE POLICY "Allow delete if owns the menu_section on menu_items"
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
-- 10) REVIEWS TABLE (Users can leave reviews on Food Trucks)
--------------------------------------------------------------------------------

CREATE TABLE public.reviews (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

CREATE POLICY "Allow insert to any authenticated user on reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update if user created the review"
  ON public.reviews
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Allow delete if user created the review"
  ON public.reviews
  FOR DELETE
  USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 11) MENU_ITEM_PREFERENCES (Users can like or dislike Menu Items)
--------------------------------------------------------------------------------

CREATE TABLE public.menu_item_preferences (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  menu_item_id uuid NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  preference   public.preference NOT NULL,  -- 'like' or 'dislike'
  created_at   timestamptz DEFAULT now() NOT NULL,
  updated_at   timestamptz DEFAULT now() NOT NULL,

  -- Prevent a user from liking/disliking the same item multiple times
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
-- 12) FOOD_TRUCK_FAVORITES (Users can favorite Food Trucks)
--------------------------------------------------------------------------------

CREATE TABLE public.food_truck_favorites (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  food_truck_id  uuid NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  created_at     timestamptz DEFAULT now() NOT NULL,

  -- Ensure each user can only favorite a truck once
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
-- 13) FOOD_TRUCK_FOLLOWS (Users can follow Food Trucks)
--------------------------------------------------------------------------------

CREATE TABLE public.food_truck_follows (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  food_truck_id  uuid NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  created_at     timestamptz DEFAULT now() NOT NULL,

  -- Ensure each user can only follow a truck once
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
-- 14) MESSAGES (Users can message back and forth with Food Trucks)
--------------------------------------------------------------------------------

-- For simplicity, let’s just store user_id, food_truck_id,
-- and the message content. We’ll consider that if the user_id
-- matches the truck owner, the message is from the truck to the user.

CREATE TABLE public.messages (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  food_truck_id  uuid NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  content        text NOT NULL,
  created_at     timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read if user is involved (either truck owner or message user)"
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
-- 15) LOYALTY_POINTS TABLE (Users can have loyalty points linked to a Food Truck)
--------------------------------------------------------------------------------

CREATE TABLE public.loyalty_points (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  food_truck_id  uuid NOT NULL REFERENCES public.food_trucks(id) ON DELETE CASCADE,
  points         int DEFAULT 0,
  created_at     timestamptz DEFAULT now() NOT NULL,
  updated_at     timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;

-- Possibly all can read, or only the user + truck owner can see.
CREATE POLICY "Allow read if user is involved (either truck owner or the user)"
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

CREATE POLICY "Allow insert if user is self"
  ON public.loyalty_points
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update if user is self or truck owner"
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

CREATE POLICY "Allow delete if user is self or truck owner"
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

-- Done creating schema
COMMIT;
