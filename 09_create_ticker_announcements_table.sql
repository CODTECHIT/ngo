-- Safe migration: Create ticker_announcements table to store MULTIPLE header news announcements
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS ticker_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE ticker_announcements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid errors
DROP POLICY IF EXISTS "Allow public read ticker_announcements" ON ticker_announcements;
DROP POLICY IF EXISTS "Allow admin all ticker_announcements" ON ticker_announcements;

-- Public read access
CREATE POLICY "Allow public read ticker_announcements" ON ticker_announcements FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Allow admin all ticker_announcements" ON ticker_announcements FOR ALL USING (true);

-- Verify table
SELECT id, message, created_at FROM ticker_announcements ORDER BY created_at DESC;