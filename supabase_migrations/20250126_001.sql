CREATE OR REPLACE FUNCTION public.events_in_view_with_day(
  min_lng float,
  max_lng float,
  min_lat float,
  max_lat float,
  day_start timestamptz,
  day_end timestamptz
)
RETURNS TABLE (
  event_id uuid,
  event_title text,
  event_description text,
  event_start timestamptz,
  event_end timestamptz,
  event_address text,
  event_location_desc text,
  event_location geography,
  event_created_at timestamptz,
  event_updated_at timestamptz,
  event_food_truck_id uuid,
  eft_created_at timestamptz,
  food_truck_id uuid,
  food_truck_name text,
  food_truck_description text,
  food_truck_address text,
  food_truck_location geography,
  food_truck_range_of_service int,
  food_truck_joined_date date,
  food_truck_created_at timestamptz,
  food_truck_updated_at timestamptz
)
LANGUAGE sql
AS $$
  SELECT 
    e.id                  AS event_id,
    e.title               AS event_title,
    e.description         AS event_description,
    e.start_time          AS event_start,
    e.end_time            AS event_end,
    e.address             AS event_address,
    e.location_desc       AS event_location_desc,
    e.location            AS event_location,
    e.created_at          AS event_created_at,
    e.updated_at          AS event_updated_at,

    eft.id                AS event_food_truck_id,
    eft.created_at        AS eft_created_at,

    ft.id                 AS food_truck_id,
    ft.name               AS food_truck_name,
    ft.description        AS food_truck_description,
    ft.address            AS food_truck_address,
    ft.location           AS food_truck_location,
    ft.range_of_service   AS food_truck_range_of_service,
    ft.joined_date        AS food_truck_joined_date,
    ft.created_at         AS food_truck_created_at,
    ft.updated_at         AS food_truck_updated_at

  FROM public.events e
  JOIN public.event_food_trucks eft
    ON e.id = eft.event_id
  JOIN public.food_trucks ft
    ON eft.food_truck_id = ft.id

  -- 1) Geographic bounding box filter (like Supabase's example)
  WHERE e.location && ST_SetSRID(
    ST_MakeBox2D(
      ST_Point(min_lng, min_lat),
      ST_Point(max_lng, max_lat)
    ),
    4326
  )

  -- 2) Time overlap filter
  -- Event must end after day_start, and start before day_end
  AND e.start_time <= day_end
  AND e.end_time   >= day_start
$$;
