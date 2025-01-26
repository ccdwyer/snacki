BEGIN;

--------------------------------------------------------------------------------
-- 1) RLS FOR EVENTS
--------------------------------------------------------------------------------

-- Anyone can read events
DROP POLICY IF EXISTS "Allow read to all on events" ON public.events;
CREATE POLICY "Allow read to all on events"
  ON public.events
  FOR SELECT
  USING (true);

-- Anyone can insert (create) events
DROP POLICY IF EXISTS "Allow insert to all on events" ON public.events;
CREATE POLICY "Allow insert to all on events"
  ON public.events
  FOR INSERT
  WITH CHECK (true);

-- Only creator or manager (in same company) can update
DROP POLICY IF EXISTS "Allow update if creator or manager" ON public.events;
CREATE POLICY "Allow update if creator or manager"
  ON public.events
  FOR UPDATE
  USING (
    -- 1) The event's creator is the same as auth.uid()
    auth.uid() = public.events.user_id

    OR

    -- 2) A user who is a manager in the same company as the event’s creator
    EXISTS(
      SELECT 1
      FROM public.company_employees ce_creator
      JOIN public.company_employees ce_manager
        ON ce_creator.company_id = ce_manager.company_id
      WHERE ce_creator.user_id = public.events.user_id  -- explicit reference
        AND ce_manager.user_id = auth.uid()
        AND ce_manager.is_manager = true
    )
  );

-- Only creator or manager (in same company) can delete
DROP POLICY IF EXISTS "Allow delete if creator or manager" ON public.events;
CREATE POLICY "Allow delete if creator or manager"
  ON public.events
  FOR DELETE
  USING (
    -- same logic as update
    auth.uid() = public.events.user_id

    OR

    EXISTS(
      SELECT 1
      FROM public.company_employees ce_creator
      JOIN public.company_employees ce_manager
        ON ce_creator.company_id = ce_manager.company_id
      WHERE ce_creator.user_id = public.events.user_id
        AND ce_manager.user_id = auth.uid()
        AND ce_manager.is_manager = true
    )
  );

--------------------------------------------------------------------------------
-- 2) RLS FOR EVENT_FOOD_TRUCKS
--------------------------------------------------------------------------------

-- Anyone can read
DROP POLICY IF EXISTS "Allow read to all on event_food_trucks" ON public.event_food_trucks;
CREATE POLICY "Allow read to all on event_food_trucks"
  ON public.event_food_trucks
  FOR SELECT
  USING (true);

-- Anyone can insert
DROP POLICY IF EXISTS "Allow insert to all on event_food_trucks" ON public.event_food_trucks;
CREATE POLICY "Allow insert to all on event_food_trucks"
  ON public.event_food_trucks
  FOR INSERT
  WITH CHECK (true);

-- Only managers from the truck's company can update
DROP POLICY IF EXISTS "Allow update if manager on event_food_trucks" ON public.event_food_trucks;
CREATE POLICY "Allow update if manager on event_food_trucks"
  ON public.event_food_trucks
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT ce.user_id
      FROM public.company_employees ce
      JOIN public.food_trucks ft ON ft.company_id = ce.company_id
      WHERE ft.id = public.event_food_trucks.food_truck_id
        AND ce.is_manager = true
    )
  );

-- Only managers from the truck's company can delete
DROP POLICY IF EXISTS "Allow delete if manager on event_food_trucks" ON public.event_food_trucks;
CREATE POLICY "Allow delete if manager on event_food_trucks"
  ON public.event_food_trucks
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT ce.user_id
      FROM public.company_employees ce
      JOIN public.food_trucks ft ON ft.company_id = ce.company_id
      WHERE ft.id = public.event_food_trucks.food_truck_id
        AND ce.is_manager = true
    )
  );

COMMIT;
