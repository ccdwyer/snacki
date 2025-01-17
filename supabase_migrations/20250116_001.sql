BEGIN;

--------------------------------------------------------------------------------
-- 1) Add the 'description' column to cuisine_types
--    Make it NOT NULL with a default of an empty string
--------------------------------------------------------------------------------
ALTER TABLE public.cuisine_types
  ADD COLUMN description text NOT NULL DEFAULT '';

--------------------------------------------------------------------------------
-- 2) Remove any existing insert/update/delete policies (so none are allowed)
--------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow insert to all on cuisine_types" ON public.cuisine_types;
DROP POLICY IF EXISTS "Allow update to all on cuisine_types" ON public.cuisine_types;
DROP POLICY IF EXISTS "Allow delete to all on cuisine_types" ON public.cuisine_types;

COMMIT;
