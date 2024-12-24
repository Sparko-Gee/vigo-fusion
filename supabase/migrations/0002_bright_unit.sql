/*
  # Add voice messages support

  1. Changes
    - Add type column to messages table to support different message types (text/voice)
    - Add voice_url column for storing voice message references
    - Add duration column for voice message length

  2. Notes
    - The voice-messages bucket needs to be created manually in the Supabase dashboard
    - Storage policies should be configured through the dashboard
*/

-- Add columns for voice message support
ALTER TABLE messages 
  ADD COLUMN IF NOT EXISTS type text CHECK (type IN ('text', 'voice')) DEFAULT 'text',
  ADD COLUMN IF NOT EXISTS voice_url text,
  ADD COLUMN IF NOT EXISTS duration integer;

-- Add index for faster message type filtering
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(type);

-- Update RLS policy for voice messages
DROP POLICY IF EXISTS "Messages are viewable by authenticated users" ON messages;
CREATE POLICY "Messages are viewable by authenticated users"
  ON messages FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can send messages" ON messages;
CREATE POLICY "Authenticated users can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' 
    AND auth.uid() = sender_id
  );