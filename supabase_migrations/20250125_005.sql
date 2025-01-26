BEGIN;

CREATE OR REPLACE FUNCTION public.get_company_employees(company_id_input uuid)
RETURNS TABLE (
    id uuid,
    company_id uuid,
    user_id uuid,
    is_manager boolean,
    created_at timestamptz,
    updated_at timestamptz,
    auth_user jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ce.id,
        ce.company_id,
        ce.user_id,
        ce.is_manager,
        ce.created_at,
        ce.updated_at,
        jsonb_build_object(
            'email', au.email,
            'user_metadata', au.raw_user_meta_data
        ) as auth_user
    FROM public.company_employees ce
    JOIN auth.users au ON au.id = ce.user_id
    WHERE ce.company_id = company_id_input;
END;
$$;

COMMIT; 