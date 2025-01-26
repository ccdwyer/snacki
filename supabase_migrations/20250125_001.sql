BEGIN;

--------------------------------------------------------------------------------
-- 1) COMPANIES TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.companies (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id   uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  name       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- RLS policies for companies:

-- (a) Anyone can read
DROP POLICY IF EXISTS "Allow read to all on companies" ON public.companies;
CREATE POLICY "Allow read to all on companies"
  ON public.companies
  FOR SELECT
  USING (true);

-- (b) Anyone can insert
--   - We typically check that the inserting user sets owner_id = auth.uid().
--   - Otherwise, they could create a company with someone else as the owner.
DROP POLICY IF EXISTS "Allow insert to all on companies" ON public.companies;
CREATE POLICY "Allow insert to all on companies"
  ON public.companies
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- (c) Only the owner can update
DROP POLICY IF EXISTS "Allow update if owner on companies" ON public.companies;
CREATE POLICY "Allow update if owner on companies"
  ON public.companies
  FOR UPDATE
  USING (auth.uid() = owner_id);

-- (d) Only the owner can delete
DROP POLICY IF EXISTS "Allow delete if owner on companies" ON public.companies;
CREATE POLICY "Allow delete if owner on companies"
  ON public.companies
  FOR DELETE
  USING (auth.uid() = owner_id);

--------------------------------------------------------------------------------
-- 2) COMPANY_EMPLOYEES TABLE
--------------------------------------------------------------------------------
CREATE TABLE public.company_employees (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_manager  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on company_employees
ALTER TABLE public.company_employees ENABLE ROW LEVEL SECURITY;

--------------------------------------------------------------------------------
-- 3) RLS POLICIES FOR COMPANY_EMPLOYEES
--------------------------------------------------------------------------------

-- (a) Anyone can read
DROP POLICY IF EXISTS "Allow read to all on company_employees" ON public.company_employees;
CREATE POLICY "Allow read to all on company_employees"
  ON public.company_employees
  FOR SELECT
  USING (true);

-- (b) Only owner or manager can INSERT rows
DROP POLICY IF EXISTS "Allow insert if owner or manager" ON public.company_employees;
CREATE POLICY "Allow insert if owner or manager"
  ON public.company_employees
  FOR INSERT
  WITH CHECK (
    (
      -- Owner check
      auth.uid() = (
        SELECT c.owner_id
        FROM public.companies c
        WHERE c.id = company_id
      )
    )
    OR
    (
      -- Manager check
      auth.uid() IN (
        SELECT ce.user_id
        FROM public.company_employees ce
        WHERE ce.company_id = company_id
          AND ce.is_manager = true
      )
    )
  );

-- (c) Only owner or manager can UPDATE rows
DROP POLICY IF EXISTS "Allow update if owner or manager" ON public.company_employees;
CREATE POLICY "Allow update if owner or manager"
  ON public.company_employees
  FOR UPDATE
  USING (
    (
      auth.uid() = (
        SELECT c.owner_id
        FROM public.companies c
        WHERE c.id = company_id
      )
    )
    OR
    (
      auth.uid() IN (
        SELECT ce.user_id
        FROM public.company_employees ce
        WHERE ce.company_id = company_id
          AND ce.is_manager = true
      )
    )
  );

-- (d) Only owner or manager can DELETE rows
DROP POLICY IF EXISTS "Allow delete if owner or manager" ON public.company_employees;
CREATE POLICY "Allow delete if owner or manager"
  ON public.company_employees
  FOR DELETE
  USING (
    (
      auth.uid() = (
        SELECT c.owner_id
        FROM public.companies c
        WHERE c.id = company_id
      )
    )
    OR
    (
      auth.uid() IN (
        SELECT ce.user_id
        FROM public.company_employees ce
        WHERE ce.company_id = company_id
          AND ce.is_manager = true
      )
    )
  );

COMMIT;
