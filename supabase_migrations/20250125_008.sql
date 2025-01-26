BEGIN;

ALTER TABLE public.event_food_trucks
  ADD COLUMN checked_in_dt timestamptz,
  ADD COLUMN cancelled_dt timestamptz;

COMMIT;
