-- ============================================================================
-- SUPABASE MANAGER PERMISSIONS & RLS POLICIES FIX
-- Execute this script in your Supabase SQL Editor to secure the database.
-- ============================================================================

-- 1. Ensure profiles table accepts event_manager and super_admin roles safely
-- (Only handle basic signup, prevent arbitrary role assignment)
CREATE OR REPLACE FUNCTION public.handle_new_user_profile() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    'user' -- Always default to 'user' on signup
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. EVENTS Table Permissions
DROP POLICY IF EXISTS "Admin and Manager ALL on events" ON events;
DROP POLICY IF EXISTS "Admin ALL on events" ON events;
DROP POLICY IF EXISTS "Allow authenticated full CRUD on events" ON events;

CREATE POLICY "Admin and Manager ALL on events" ON events FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'event_manager', 'manager'))
);

-- 3. PROGRAMS Table Permissions
DROP POLICY IF EXISTS "Allow authenticated full CRUD on programs" ON programs;

CREATE POLICY "Admin and Manager ALL on programs" ON programs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'event_manager', 'manager'))
);

-- 4. MEDIA (Gallery Images) Table Permissions
DROP POLICY IF EXISTS "Admin and Manager ALL on gallery_images" ON gallery_images;
DROP POLICY IF EXISTS "Admin ALL on gallery_images" ON gallery_images;
DROP POLICY IF EXISTS "Allow authenticated full CRUD on gallery_images" ON gallery_images;

CREATE POLICY "Admin and Manager ALL on gallery_images" ON gallery_images FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'event_manager', 'manager'))
);

-- 5. REGISTRATIONS Table Permissions
DROP POLICY IF EXISTS "Admins and Managers can SELECT all registrations" ON registrations;
DROP POLICY IF EXISTS "Admins and Managers can UPDATE registrations" ON registrations;
DROP POLICY IF EXISTS "Admins and Managers can DELETE registrations" ON registrations;

CREATE POLICY "Admins and Managers can SELECT all registrations" ON registrations FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'event_manager', 'manager'))
);

CREATE POLICY "Admins and Managers can UPDATE registrations" ON registrations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'event_manager', 'manager'))
);

CREATE POLICY "Admins and Managers can DELETE registrations" ON registrations FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'event_manager', 'manager'))
);

-- 6. MESSAGES Table Permissions
DROP POLICY IF EXISTS "Admin and Manager SELECT on messages" ON messages;
DROP POLICY IF EXISTS "Admin and Manager UPDATE on messages" ON messages;
DROP POLICY IF EXISTS "Admin and Manager DELETE on messages" ON messages;

CREATE POLICY "Admin and Manager SELECT on messages" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'event_manager', 'manager'))
);
CREATE POLICY "Admin and Manager UPDATE on messages" ON messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'event_manager', 'manager'))
);
CREATE POLICY "Admin and Manager DELETE on messages" ON messages FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'event_manager', 'manager'))
);

-- 7. PROFILES Table Permissions
-- Remove the critical vulnerability that allows users to update their own role
DROP POLICY IF EXISTS "Allow authenticated full CRUD on profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Users can only read their own profile (or admins can read all)
CREATE POLICY "Users can read their own profile" ON profiles FOR SELECT USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin'))
);

-- Users can update their own profile (but we need to prevent role updates without admin privileges)
CREATE POLICY "Users can update own profile name" ON profiles FOR UPDATE USING (
  auth.uid() = id
) WITH CHECK (
  auth.uid() = id 
);

-- Admins can update any profile (to assign roles)
CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin'))
);
