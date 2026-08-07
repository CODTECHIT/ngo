-- SQL Schema for Donations Table in Supabase
-- Run this in your Supabase Dashboard -> SQL Editor to create the donations table and fix 404 errors.

CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT,
  pan TEXT,
  amount NUMERIC NOT NULL,
  cause TEXT,
  payment_id TEXT,
  status TEXT DEFAULT 'paid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create Security Policies
CREATE POLICY "Allow public insert on donations" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on donations" ON donations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full CRUD on donations" ON donations FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin', 'manager'))
);
