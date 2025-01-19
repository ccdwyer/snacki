BEGIN;

ALTER TABLE public.food_trucks
  ADD COLUMN instagram_url text NOT NULL DEFAULT '',
  ADD COLUMN facebook_url  text NOT NULL DEFAULT '',
  ADD COLUMN tiktok_url    text NOT NULL DEFAULT '',
  ADD COLUMN website_url   text NOT NULL DEFAULT '';

COMMIT;
