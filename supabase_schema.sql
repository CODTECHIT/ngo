-- 1. Create site_content table
CREATE TABLE site_content (
  id INT PRIMARY KEY DEFAULT 1,
  hero_heading TEXT,
  hero_subheading TEXT,
  stats JSONB,
  about_text TEXT,
  mission_text TEXT,
  vision_text TEXT,
  director_name TEXT,
  director_quote TEXT,
  director_photo_url TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  contact_address TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Ensure only one row exists in site_content
ALTER TABLE site_content ADD CONSTRAINT site_content_single_row CHECK (id = 1);

-- Insert the default row
INSERT INTO site_content (id) VALUES (1);

-- 2. Create programs table
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_public_id TEXT,
  event_date DATE,
  location TEXT,
  status TEXT CHECK (status IN ('upcoming', 'completed')) DEFAULT 'upcoming',
  show_register_button BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Create gallery_images table
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  image_public_id TEXT,
  category TEXT CHECK (category IN ('Health', 'Eye Care', 'Women Empowerment', 'Community', 'Awareness Programs', 'Events')),
  caption TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Create contact_submissions table
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- POLICIES FOR site_content
CREATE POLICY "Allow public read-only access on site_content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full CRUD on site_content" ON site_content FOR ALL USING (auth.role() = 'authenticated');

-- POLICIES FOR programs
CREATE POLICY "Allow public read-only access on programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full CRUD on programs" ON programs FOR ALL USING (auth.role() = 'authenticated');

-- POLICIES FOR events
CREATE POLICY "Allow public read-only access on events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full CRUD on events" ON events FOR ALL USING (auth.role() = 'authenticated');

-- POLICIES FOR gallery_images
CREATE POLICY "Allow public read-only access on gallery_images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full CRUD on gallery_images" ON gallery_images FOR ALL USING (auth.role() = 'authenticated');

-- POLICIES FOR contact_submissions
CREATE POLICY "Allow public insert on contact_submissions" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated full CRUD on contact_submissions" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');
