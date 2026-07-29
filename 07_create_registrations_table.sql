-- Create registrations table for Get Involved / Registration form submissions
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  involvement_type TEXT NOT NULL DEFAULT 'volunteer',
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Public can insert (submit form)
CREATE POLICY "Allow public insert on registrations"
  ON registrations FOR INSERT
  WITH CHECK (true);

-- Only authenticated (admin) can read/update/delete
CREATE POLICY "Allow authenticated full access on registrations"
  ON registrations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Index for ordering
CREATE INDEX IF NOT EXISTS registrations_created_at_idx ON registrations(created_at DESC);
