-- ============================================================================
-- SUPABASE MANAGER PERMISSIONS & RLS POLICIES FIX
-- Execute this script in your Supabase SQL Editor to grant Event Managers
-- and Administrators full read/write permissions for all database operations
-- (events, programs, registrations, media/gallery, and messages).
-- ============================================================================

-- 1. Ensure profiles table accepts event_manager and super_admin roles
CREATE OR REPLACE FUNCTION public.handle_new_user_profile() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. EVENTS Table Permissions
DROP POLICY IF EXISTS "Admin ALL on events" ON events;
DROP POLICY IF EXISTS "Allow authenticated full CRUD on events" ON events;
CREATE POLICY "Admin and Manager ALL on events" ON events FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'event_manager', 'manager'))
  OR auth.role() = 'authenticated'
);

-- 3. PROGRAMS Table Permissions
DROP POLICY IF EXISTS "Allow authenticated full CRUD on programs" ON programs;
CREATE POLICY "Allow authenticated full CRUD on programs" ON programs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'event_manager', 'manager'))
  OR auth.role() = 'authenticated'
);

-- 4. MEDIA (Gallery Images) Table Permissions
DROP POLICY IF EXISTS "Admin ALL on gallery_images" ON gallery_images;
DROP POLICY IF EXISTS "Allow authenticated full CRUD on gallery_images" ON gallery_images;
CREATE POLICY "Admin and Manager ALL on gallery_images" ON gallery_images FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'event_manager', 'manager'))
  OR auth.role() = 'authenticated'
);

-- 5. REGISTRATIONS Table Permissions
DROP POLICY IF EXISTS "Admins can SELECT all registrations" ON registrations;
CREATE POLICY "Admins and Managers can SELECT all registrations" ON registrations FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'event_manager', 'manager'))
  OR auth.role() = 'authenticated'
);
DROP POLICY IF EXISTS "Admins and Managers can UPDATE registrations" ON registrations;
CREATE POLICY "Admins and Managers can UPDATE registrations" ON registrations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'event_manager', 'manager'))
  OR auth.role() = 'authenticated'
);
DROP POLICY IF EXISTS "Admins and Managers can DELETE registrations" ON registrations;
CREATE POLICY "Admins and Managers can DELETE registrations" ON registrations FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'event_manager', 'manager'))
  OR auth.role() = 'authenticated'
);

-- 6. MESSAGES Table Permissions
DROP POLICY IF EXISTS "Admin SELECT on messages" ON messages;
DROP POLICY IF EXISTS "Admin UPDATE on messages" ON messages;
DROP POLICY IF EXISTS "Admin DELETE on messages" ON messages;

CREATE POLICY "Admin and Manager SELECT on messages" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'event_manager', 'manager'))
  OR auth.role() = 'authenticated'
);
CREATE POLICY "Admin and Manager UPDATE on messages" ON messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'event_manager', 'manager'))
  OR auth.role() = 'authenticated'
);
CREATE POLICY "Admin and Manager DELETE on messages" ON messages FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'event_manager', 'manager'))
  OR auth.role() = 'authenticated'
);

-- 7. PROFILES Table Permissions (Allows users and managers to sync/upsert their role)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated full CRUD on profiles" ON profiles;

CREATE POLICY "Allow authenticated full CRUD on profiles" ON profiles FOR ALL USING (
  auth.role() = 'authenticated'
) WITH CHECK (
  auth.role() = 'authenticated'
);
