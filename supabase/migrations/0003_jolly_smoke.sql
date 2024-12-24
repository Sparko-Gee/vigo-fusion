/*
  # Add voice message support
  
  1. Changes
    - Add voice message type to messages table
    - Create voice messages storage bucket
    - Update RLS policies
  
  2. Storage
    - Create voice-messages bucket
    - Add storage policies for authenticated users
*/

-- Add type column to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS type text CHECK (type IN ('text', 'voice')) DEFAULT 'text';

-- Create voice messages bucket and policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('voice-messages', 'voice-messages', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for the bucket
UPDATE storage.buckets 
SET public = false,
    file_size_limit = 5242880, -- 5MB
    allowed_mime_types = ARRAY['audio/webm', 'audio/ogg', 'audio/mpeg']
WHERE id = 'voice-messages';

-- Create storage policies
CREATE POLICY "Authenticated users can upload voice messages"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'voice-messages' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can read voice messages"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'voice-messages' AND
  auth.role() = 'authenticated'
);