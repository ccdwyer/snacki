BEGIN;

ALTER TABLE public.company_employees
  ADD COLUMN employee_name text;

COMMIT;
