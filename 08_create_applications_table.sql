-- Create applications table for Volunteer / Corporate CSR / Intern / Fundraise / Partner NGO registrations
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  category TEXT NOT NULL DEFAULT 'volunteer', -- volunteer / csr / intern / fundraise / partner
  service TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending / approved / rejected
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Public INSERT (anyone can submit an application)
CREATE POLICY "Public INSERT on applications" ON applications FOR INSERT WITH CHECK (true);

-- Admin SELECT / UPDATE / DELETE (matching the RBAC roles used across the admin panel)
CREATE POLICY "Admin SELECT on applications" ON applications FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin', 'manager', 'event_manager')
  )
);

CREATE POLICY "Admin UPDATE on applications" ON applications FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin', 'manager', 'event_manager')
  )
);

CREATE POLICY "Admin DELETE on applications" ON applications FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'super_admin', 'manager', 'event_manager')
  )
);
