-- Migration Script v2: Standardizing on Supabase

-- 1. Drop old conflicting tables (data loss acceptable as per user)
DROP TABLE IF EXISTS event_registrations;
DROP TABLE IF EXISTS contact_submissions;

-- 2. Alter existing events table
-- Adding new columns
ALTER TABLE events ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS venue TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS banner_public_id TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS seats INT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_deadline DATE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS certificate_template_url TEXT;

-- Migrate data from old columns if they existed
UPDATE events SET venue = location WHERE location IS NOT NULL AND venue IS NULL;
UPDATE events SET banner_url = image_url WHERE image_url IS NOT NULL AND banner_url IS NULL;
UPDATE events SET banner_public_id = image_public_id WHERE image_public_id IS NOT NULL AND banner_public_id IS NULL;

-- 3. Create registrations table
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  event_id UUID REFERENCES events NOT NULL,
  name TEXT,
  mobile TEXT,
  email TEXT,
  location TEXT,
  from_address TEXT,
  status TEXT DEFAULT 'registered', -- registered / attended / cancelled
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, event_id)
);

-- 4. Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fname TEXT,
  lname TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create profiles table for Roles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'user', -- 'user' or 'admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Recreate trigger for profiles
CREATE OR REPLACE FUNCTION public.handle_new_user_profile() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_profile();

-- Copy existing users to profiles if they don't exist
INSERT INTO public.profiles (id, full_name, role)
SELECT id, raw_user_meta_data->>'full_name', 'user' FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 6. Setup Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Clean old events policies
DROP POLICY IF EXISTS "Allow public read-only access on events" ON events;
DROP POLICY IF EXISTS "Allow authenticated full CRUD on events" ON events;
DROP POLICY IF EXISTS "Allow public read-only access on gallery_images" ON gallery_images;
DROP POLICY IF EXISTS "Allow authenticated full CRUD on gallery_images" ON gallery_images;

-- Events & Gallery: public SELECT; INSERT/UPDATE/DELETE only for admins
CREATE POLICY "Public SELECT on events" ON events FOR SELECT USING (true);
CREATE POLICY "Admin ALL on events" ON events FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Public SELECT on gallery_images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Admin ALL on gallery_images" ON gallery_images FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Registrations: users can SELECT/INSERT their own; admins can SELECT all
CREATE POLICY "Users can SELECT own registrations" ON registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can INSERT own registrations" ON registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can SELECT all registrations" ON registrations FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Messages: public INSERT; SELECT/UPDATE only for admins
CREATE POLICY "Public INSERT on messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin SELECT on messages" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Admin UPDATE on messages" ON messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Profiles: users SELECT/UPDATE their own. 
-- We drop recursive Admin policies on 'profiles' to avoid infinite loops.
CREATE POLICY "Users SELECT own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users UPDATE own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- If admins need to read all profiles, they can use a non-recursive SECURITY DEFINER function, 
-- but for the current admin login flow, users just need to read their own profile.
