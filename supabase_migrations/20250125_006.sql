DROP FUNCTION IF EXISTS public.add_company_employee;
CREATE OR REPLACE FUNCTION public.add_company_employee(
  _company_id uuid,
  _email text,
  _is_manager boolean,
  _employee_name text
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  is_manager boolean,
  employee_name varchar(255),
  email varchar(255),
  user_metadata jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _auth_user_id uuid;
  _auth_user_metadata jsonb;
BEGIN
  -- 1) Find the user by email
  SELECT auth.users.id, auth.users.raw_user_meta_data
    INTO _auth_user_id, _auth_user_metadata
    FROM auth.users
   WHERE auth.users.email = _email;
   
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No user found with email: %', _email;
  END IF;

  -- 2) Insert or update company_employees
  RETURN QUERY
  WITH upserted_employee AS (
    INSERT INTO public.company_employees (company_id, user_id, is_manager, employee_name)
    VALUES (_company_id, _auth_user_id, _is_manager, _employee_name)
    ON CONFLICT ON CONSTRAINT company_employees_company_id_user_id_key
    DO UPDATE SET 
      is_manager = EXCLUDED.is_manager,
      employee_name = EXCLUDED.employee_name,
      updated_at = NOW()
    RETURNING 
      company_employees.id,
      company_employees.user_id,
      company_employees.is_manager,
      company_employees.employee_name::varchar(255)
  )
  SELECT 
    ue.id,
    ue.user_id,
    ue.is_manager,
    ue.employee_name,
    au.email::varchar(255),
    au.raw_user_meta_data as user_metadata
  FROM upserted_employee ue
  JOIN auth.users au ON au.id = ue.user_id;
END;
$$;