-- Safe migration: Add news ticker columns to existing site_content table
-- Run this in your Supabase SQL Editor

-- Add news_ticker_message column if it doesn't exist
ALTER TABLE site_content
  ADD COLUMN IF NOT EXISTS news_ticker_message TEXT DEFAULT '';

-- Add news_ticker_enabled column if it doesn't exist
ALTER TABLE site_content
  ADD COLUMN IF NOT EXISTS news_ticker_enabled BOOLEAN DEFAULT true;

-- Make sure the default row (id=1) exists
INSERT INTO site_content (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Verify columns were added
SELECT id, news_ticker_message, news_ticker_enabled FROM site_content;
