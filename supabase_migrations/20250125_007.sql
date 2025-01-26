BEGIN;

ALTER TABLE public.company_employees
  ADD CONSTRAINT company_employees_company_id_user_id_key
    UNIQUE (company_id, user_id);

COMMIT;