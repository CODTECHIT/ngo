-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  img TEXT,
  tag TEXT DEFAULT 'Community',
  date TEXT,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid errors
DROP POLICY IF EXISTS "Allow public read news" ON news;
DROP POLICY IF EXISTS "Allow admin all news" ON news;

-- Public read access
CREATE POLICY "Allow public read news" ON news FOR SELECT USING (true);

-- Admin write access (or service role / authenticated)
CREATE POLICY "Allow admin all news" ON news FOR ALL USING (true);
