-- Run this in your Supabase SQL Editor to allow deleting events without foreign key errors!
-- This tells PostgreSQL: When an event is deleted, automatically delete any registrations associated with it.

ALTER TABLE registrations 
  DROP CONSTRAINT IF EXISTS registrations_event_id_fkey;

ALTER TABLE registrations 
  ADD CONSTRAINT registrations_event_id_fkey 
  FOREIGN KEY (event_id) 
  REFERENCES events(id) 
  ON DELETE CASCADE;
