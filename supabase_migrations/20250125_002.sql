BEGIN;

--------------------------------------------------------------------------------
-- 1) CREATE A TRIGGER FUNCTION TO ADD THE COMPANY OWNER AS MANAGER
--------------------------------------------------------------------------------
-- Whenever a new company is created, this function inserts the owner as a manager
CREATE OR REPLACE FUNCTION public.fn_add_company_owner_as_manager()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.company_employees (company_id, user_id, is_manager)
  VALUES (NEW.id, NEW.owner_id, true);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the AFTER INSERT trigger on companies
DROP TRIGGER IF EXISTS trig_company_owner_as_manager ON public.companies;
CREATE TRIGGER trig_company_owner_as_manager
AFTER INSERT ON public.companies
FOR EACH ROW
EXECUTE PROCEDURE public.fn_add_company_owner_as_manager();

--------------------------------------------------------------------------------
-- 2) ADD A NON-OPTIONAL ASSOCIATION BETWEEN A COMPANY AND A FOOD_TRUCK
--------------------------------------------------------------------------------
-- We assume you already have food_trucks table. Now we add "company_id" (NOT NULL).
-- This ensures every truck is associated with exactly one company.
ALTER TABLE public.food_trucks
  ADD COLUMN company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE;

--------------------------------------------------------------------------------
-- 3) UPDATE RLS FOR FOOD_TRUCKS (MANAGERS CAN INSERT/UPDATE/DELETE)
--------------------------------------------------------------------------------
-- We assume "public.food_trucks" already has RLS enabled. 
-- Drop old policies referencing the truck's user_id if they exist.

DROP POLICY IF EXISTS "Allow insert for owner on food_trucks" ON public.food_trucks;
DROP POLICY IF EXISTS "Allow update for owner on food_trucks" ON public.food_trucks;
DROP POLICY IF EXISTS "Allow delete for owner on food_trucks" ON public.food_trucks;

-- If you had a read policy, you can keep it or re-create it:
-- Everyone can read
DROP POLICY IF EXISTS "Allow read to all on food_trucks" ON public.food_trucks;
CREATE POLICY "Allow read to all on food_trucks"
  ON public.food_trucks
  FOR SELECT
  USING (true);

-- Insert: must be manager in the associated company
CREATE POLICY "Allow insert if manager on food_trucks"
  ON public.food_trucks
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT ce.user_id
      FROM public.company_employees ce
      WHERE ce.company_id = company_id
        AND ce.is_manager = true
    )
  );

-- Update: must be manager
CREATE POLICY "Allow update if manager on food_trucks"
  ON public.food_trucks
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT ce.user_id
      FROM public.company_employees ce
      WHERE ce.company_id = company_id
        AND ce.is_manager = true
    )
  );

-- Delete: must be manager
CREATE POLICY "Allow delete if manager on food_trucks"
  ON public.food_trucks
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT ce.user_id
      FROM public.company_employees ce
      WHERE ce.company_id = company_id
        AND ce.is_manager = true
    )
  );

--------------------------------------------------------------------------------
-- 4) UPDATE RLS FOR MENUS (MANAGERS CAN INSERT/UPDATE/DELETE)
--------------------------------------------------------------------------------
-- We assume "public.menus" has a "food_truck_id" referencing "food_trucks(id)".

DROP POLICY IF EXISTS "Allow insert if owns the food_truck on menus" ON public.menus;
DROP POLICY IF EXISTS "Allow update if owns the food_truck on menus" ON public.menus;
DROP POLICY IF EXISTS "Allow delete if owns the food_truck on menus" ON public.menus;

-- (Optional) Everyone can read
DROP POLICY IF EXISTS "Allow read to all on menus" ON public.menus;
CREATE POLICY "Allow read to all on menus"
  ON public.menus
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert if manager on menus"
  ON public.menus
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT ce.user_id
      FROM public.company_employees ce
      JOIN public.food_trucks ft ON ft.company_id = ce.company_id
      WHERE ft.id = food_truck_id
        AND ce.is_manager = true
    )
  );

CREATE POLICY "Allow update if manager on menus"
  ON public.menus
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT ce.user_id
      FROM public.company_employees ce
      JOIN public.food_trucks ft ON ft.company_id = ce.company_id
      WHERE ft.id = food_truck_id
        AND ce.is_manager = true
    )
  );

CREATE POLICY "Allow delete if manager on menus"
  ON public.menus
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT ce.user_id
      FROM public.company_employees ce
      JOIN public.food_trucks ft ON ft.company_id = ce.company_id
      WHERE ft.id = food_truck_id
        AND ce.is_manager = true
    )
  );

--------------------------------------------------------------------------------
-- 5) UPDATE RLS FOR MENU_SECTIONS
--------------------------------------------------------------------------------
-- "menu_sections" has "menu_id" referencing "menus(id)", which references "food_trucks(id)".

DROP POLICY IF EXISTS "Allow insert if owns the menu on menu_sections" ON public.menu_sections;
DROP POLICY IF EXISTS "Allow update if owns the menu on menu_sections" ON public.menu_sections;
DROP POLICY IF EXISTS "Allow delete if owns the menu on menu_sections" ON public.menu_sections;

-- (Optional) Everyone can read
DROP POLICY IF EXISTS "Allow read to all on menu_sections" ON public.menu_sections;
CREATE POLICY "Allow read to all on menu_sections"
  ON public.menu_sections
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert if manager on menu_sections"
  ON public.menu_sections
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT ce.user_id
      FROM public.company_employees ce
      JOIN public.menus m ON m.id = menu_id
      JOIN public.food_trucks ft ON ft.id = m.food_truck_id
      WHERE ft.company_id = ce.company_id
        AND ce.is_manager = true
    )
  );

CREATE POLICY "Allow update if manager on menu_sections"
  ON public.menu_sections
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT ce.user_id
      FROM public.company_employees ce
      JOIN public.menus m ON m.id = menu_id
      JOIN public.food_trucks ft ON ft.id = m.food_truck_id
      WHERE ft.company_id = ce.company_id
        AND ce.is_manager = true
    )
  );

CREATE POLICY "Allow delete if manager on menu_sections"
  ON public.menu_sections
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT ce.user_id
      FROM public.company_employees ce
      JOIN public.menus m ON m.id = menu_id
      JOIN public.food_trucks ft ON ft.id = m.food_truck_id
      WHERE ft.company_id = ce.company_id
        AND ce.is_manager = true
    )
  );

--------------------------------------------------------------------------------
-- 6) UPDATE RLS FOR MENU_ITEMS
--------------------------------------------------------------------------------
-- "menu_items" references "menu_section_id", which references "menu_sections(menu_id)", 
-- which references "menus(food_truck_id)" -> "food_trucks(company_id)".

DROP POLICY IF EXISTS "Allow insert if owns the menu_section on menu_items" ON public.menu_items;
DROP POLICY IF EXISTS "Allow update if owns the menu_section on menu_items" ON public.menu_items;
DROP POLICY IF EXISTS "Allow delete if owns the menu_section on menu_items" ON public.menu_items;

-- (Optional) Everyone can read
DROP POLICY IF EXISTS "Allow read to all on menu_items" ON public.menu_items;
CREATE POLICY "Allow read to all on menu_items"
  ON public.menu_items
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert if manager on menu_items"
  ON public.menu_items
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT ce.user_id
      FROM public.company_employees ce
      JOIN public.menu_sections ms ON ms.id = menu_section_id
      JOIN public.menus m ON m.id = ms.menu_id
      JOIN public.food_trucks ft ON ft.id = m.food_truck_id
      WHERE ft.company_id = ce.company_id
        AND ce.is_manager = true
    )
  );

CREATE POLICY "Allow update if manager on menu_items"
  ON public.menu_items
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT ce.user_id
      FROM public.company_employees ce
      JOIN public.menu_sections ms ON ms.id = menu_section_id
      JOIN public.menus m ON m.id = ms.menu_id
      JOIN public.food_trucks ft ON ft.id = m.food_truck_id
      WHERE ft.company_id = ce.company_id
        AND ce.is_manager = true
    )
  );

CREATE POLICY "Allow delete if manager on menu_items"
  ON public.menu_items
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT ce.user_id
      FROM public.company_employees ce
      JOIN public.menu_sections ms ON ms.id = menu_section_id
      JOIN public.menus m ON m.id = ms.menu_id
      JOIN public.food_trucks ft ON ft.id = m.food_truck_id
      WHERE ft.company_id = ce.company_id
        AND ce.is_manager = true
    )
  );

COMMIT;
