-- Create pledge_certificates table for Nasha Mukt YUVA / Delegate Registration & Free Certificate module
CREATE TABLE IF NOT EXISTS pledge_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Youth',
  gender TEXT,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  organization TEXT,
  pledge_taken BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE pledge_certificates ENABLE ROW LEVEL SECURITY;

-- Public can insert (submit pledge registration)
CREATE POLICY "Allow public insert on pledge_certificates"
  ON pledge_certificates FOR INSERT
  WITH CHECK (true);

-- Public can read to verify certificate by certificate_id or count total pledges
CREATE POLICY "Allow public read on pledge_certificates"
  ON pledge_certificates FOR SELECT
  USING (true);

-- Only authenticated admins can delete/update
CREATE POLICY "Allow authenticated full access on pledge_certificates"
  ON pledge_certificates FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS pledge_certificates_cert_id_idx ON pledge_certificates(certificate_id);
CREATE INDEX IF NOT EXISTS pledge_certificates_created_at_idx ON pledge_certificates(created_at DESC);
