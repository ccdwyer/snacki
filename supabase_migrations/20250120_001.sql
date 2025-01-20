CREATE OR REPLACE FUNCTION public.get_food_trucks_within_distance(
  lng_in float,
  lat_in float,
  distance_miles int
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  name text,
  lat float,
  lng float,
  distance_meters float
)
LANGUAGE sql
AS $$
  SELECT
    ft.id,
    ft.user_id,
    ft.name,
    /* Convert the geography to geometry to extract lat/lng */
    ST_Y(ft.location::geometry) AS lat,
    ST_X(ft.location::geometry) AS lng,
    /* Calculate the distance from the input point */
    ST_Distance(
      ft.location,
      ST_Point(lng_in, lat_in)::geography
    ) AS distance_meters
  FROM public.food_trucks ft
  WHERE ST_DWithin(
    ft.location,
    ST_Point(lng_in, lat_in)::geography,
    distance_miles * 1609.34  /* convert miles to meters */
  );
$$;
