-- ============================================================================
-- Row Level Security policies for the Srishree Vision Foundation Supabase DB.
-- Each table is guarded by an existence check, so missing tables are skipped
-- instead of aborting the script. Run the whole file in Supabase -> SQL Editor.
-- ============================================================================

-- Admin role check helper (role lives in public.profiles.role, keyed by auth.uid())
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((
    select role from public.profiles where id = auth.uid()
  ), 'user') in ('admin', 'super_admin');
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- Public-safe certificate lookup WITHOUT email/phone (PII stays private).
-- Remove any column below that does not exist in your pledge_certificates table.
create or replace function public.verify_certificate(cert_id text)
returns table (
  certificate_id text,
  full_name     text,
  category      text,
  state         text,
  district      text,
  organization  text,
  pledge_taken  boolean,
  created_at    timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select pc.certificate_id, pc.full_name, pc.category,
         pc.state, pc.district, pc.organization, pc.pledge_taken, pc.created_at
  from public.pledge_certificates pc
  where upper(pc.certificate_id) = upper(cert_id)
  limit 1;
$$;

revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;

-- ============================================================================
-- Public, read-only content tables. Everyone SELECTs; only admins write.
-- ============================================================================
DO $$
DECLARE
  tname text;
  tables text[] := array['events', 'news', 'gallery_images', 'programs',
                         'ticker_announcements', 'site_content'];
BEGIN
  FOREACH tname IN ARRAY tables LOOP
    IF to_regclass('public.' || tname) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tname);
      EXECUTE format('DROP POLICY IF EXISTS "Public read %I" ON public.%I', tname, tname);
      EXECUTE format('CREATE POLICY "Public read %I" ON public.%I FOR SELECT USING (true)', tname, tname);
      EXECUTE format('DROP POLICY IF EXISTS "Admin write %I" ON public.%I', tname, tname);
      EXECUTE format('CREATE POLICY "Admin write %I" ON public.%I FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin())', tname, tname);
    END IF;
  END LOOP;
END $$;

-- ============================================================================
-- Messages: anyone may submit a contact message; only admins may read them.
-- ============================================================================
DO $$
BEGIN
  IF to_regclass('public.messages') IS NOT NULL THEN
    ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Anon submit messages" ON public.messages;
    CREATE POLICY "Anon submit messages" ON public.messages
      FOR INSERT TO anon, authenticated WITH CHECK (true);
    DROP POLICY IF EXISTS "Admin read messages" ON public.messages;
    CREATE POLICY "Admin read messages" ON public.messages FOR SELECT USING (public.is_admin());
    DROP POLICY IF EXISTS "Admin update messages" ON public.messages;
    CREATE POLICY "Admin update messages" ON public.messages FOR UPDATE USING (public.is_admin());
    DROP POLICY IF EXISTS "Admin delete messages" ON public.messages;
    CREATE POLICY "Admin delete messages" ON public.messages FOR DELETE USING (public.is_admin());
  END IF;
END $$;

-- ============================================================================
-- Pledge certificates: anyone may submit; raw rows (with contact details) are
-- admin-only. Public verification goes through verify_certificate() above.
-- ============================================================================
DO $$
BEGIN
  IF to_regclass('public.pledge_certificates') IS NOT NULL THEN
    ALTER TABLE public.pledge_certificates ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Anon submit pledge_certificates" ON public.pledge_certificates;
    CREATE POLICY "Anon submit pledge_certificates" ON public.pledge_certificates
      FOR INSERT TO anon, authenticated WITH CHECK (true);
    DROP POLICY IF EXISTS "Admin read pledge_certificates" ON public.pledge_certificates;
    CREATE POLICY "Admin read pledge_certificates" ON public.pledge_certificates FOR SELECT USING (public.is_admin());
    DROP POLICY IF EXISTS "Admin update pledge_certificates" ON public.pledge_certificates;
    CREATE POLICY "Admin update pledge_certificates" ON public.pledge_certificates FOR UPDATE USING (public.is_admin());
    DROP POLICY IF EXISTS "Admin delete pledge_certificates" ON public.pledge_certificates;
    CREATE POLICY "Admin delete pledge_certificates" ON public.pledge_certificates FOR DELETE USING (public.is_admin());
  END IF;
END $$;

-- ============================================================================
-- Registrations
-- ============================================================================
DO $$
BEGIN
  IF to_regclass('public.registrations') IS NOT NULL THEN
    ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "User insert own registration" ON public.registrations;
    CREATE POLICY "User insert own registration" ON public.registrations
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
    DROP POLICY IF EXISTS "User read own registrations" ON public.registrations;
    CREATE POLICY "User read own registrations" ON public.registrations
      FOR SELECT TO authenticated USING (auth.uid() = user_id);
    DROP POLICY IF EXISTS "User update own registrations" ON public.registrations;
    CREATE POLICY "User update own registrations" ON public.registrations
      FOR UPDATE TO authenticated USING (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Admin all registrations" ON public.registrations;
    CREATE POLICY "Admin all registrations" ON public.registrations
      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
END $$;

-- ============================================================================
-- Donations
-- ============================================================================
DO $$
BEGIN
  IF to_regclass('public.donations') IS NOT NULL THEN
    ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "User insert own donation" ON public.donations;
    CREATE POLICY "User insert own donation" ON public.donations
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
    DROP POLICY IF EXISTS "Anon insert donation" ON public.donations;
    CREATE POLICY "Anon insert donation" ON public.donations
      FOR INSERT TO anon WITH CHECK (user_id IS NULL);
    DROP POLICY IF EXISTS "Owner read own donations" ON public.donations;
    CREATE POLICY "Owner read own donations" ON public.donations
      FOR SELECT TO authenticated USING (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Admin read donations" ON public.donations;
    CREATE POLICY "Admin read donations" ON public.donations
      FOR SELECT TO authenticated USING (public.is_admin());
  END IF;
END $$;

-- ============================================================================
-- Applications (only if the table exists)
-- ============================================================================
DO $$
BEGIN
  IF to_regclass('public.applications') IS NOT NULL THEN
    ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Anon submit applications" ON public.applications;
    CREATE POLICY "Anon submit applications" ON public.applications
      FOR INSERT TO anon, authenticated WITH CHECK (true);
    DROP POLICY IF EXISTS "Admin read applications" ON public.applications;
    CREATE POLICY "Admin read applications" ON public.applications FOR SELECT USING (public.is_admin());
    DROP POLICY IF EXISTS "Admin update applications" ON public.applications;
    CREATE POLICY "Admin update applications" ON public.applications FOR UPDATE USING (public.is_admin());
    DROP POLICY IF EXISTS "Admin delete applications" ON public.applications;
    CREATE POLICY "Admin delete applications" ON public.applications FOR DELETE USING (public.is_admin());
  END IF;
END $$;

-- ============================================================================
-- profiles
-- ============================================================================
DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "User insert own profile" ON public.profiles;
    CREATE POLICY "User insert own profile" ON public.profiles
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
    DROP POLICY IF EXISTS "User read own profile" ON public.profiles;
    CREATE POLICY "User read own profile" ON public.profiles
      FOR SELECT USING (auth.uid() = id OR public.is_admin());
    DROP POLICY IF EXISTS "User update own profile" ON public.profiles;
    CREATE POLICY "User update own profile" ON public.profiles
      FOR UPDATE TO authenticated USING (auth.uid() = id);
    DROP POLICY IF EXISTS "Admin all profiles" ON public.profiles;
    CREATE POLICY "Admin all profiles" ON public.profiles
      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
END $$;

-- ============================================================================
-- users_profile (legacy profile table used by Account.tsx)
-- ============================================================================
DO $$
BEGIN
  IF to_regclass('public.users_profile') IS NOT NULL THEN
    ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "User own users_profile" ON public.users_profile;
    CREATE POLICY "User own users_profile" ON public.users_profile
      FOR SELECT TO authenticated USING (auth.uid() = id);
    DROP POLICY IF EXISTS "Admin all users_profile" ON public.users_profile;
    CREATE POLICY "Admin all users_profile" ON public.users_profile
      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
END $$;