BEGIN;

ALTER TABLE public.food_trucks
  ADD COLUMN lat double precision,
  ADD COLUMN lng double precision;

COMMIT;