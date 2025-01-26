CREATE OR REPLACE FUNCTION public.add_company_employee(
  _company_id uuid,
  _email text,
  _is_manager boolean
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  is_manager boolean
)
LANGUAGE plpgsql
AS $$
DECLARE
  _auth_user_id uuid;
BEGIN
  -- 1) Find the user by email
  SELECT id
    INTO _auth_user_id
    FROM auth.users
   WHERE email = _email;
   
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No user found with email: %', _email;
  END IF;

  -- 2) Insert into company_employees
  INSERT INTO public.company_employees (company_id, user_id, is_manager)
  VALUES (_company_id, _auth_user_id, _is_manager)
  RETURNING id, user_id, is_manager
  INTO id, user_id, is_manager;
  
  -- 3) Return the newly inserted record
  RETURN NEXT;
END;
$$;
