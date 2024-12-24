/*
  # Fix Auth and Features

  1. Security Updates
    - Update profiles RLS policies for proper insert access
    - Improve access control for authenticated users
  
  2. Enhancements
    - Add duration tracking for voice messages
    - Add performance indexes
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create new policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Add duration tracking for voice messages if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' 
    AND column_name = 'duration'
  ) THEN
    ALTER TABLE messages ADD COLUMN duration integer;
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_created_at 
ON messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_created_at 
ON posts(created_at DESC);

-- Update messages policies
DROP POLICY IF EXISTS "Messages are viewable by authenticated users" ON messages;
CREATE POLICY "Messages are viewable by authenticated users"
ON messages FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can send messages" ON messages;
CREATE POLICY "Authenticated users can send messages"
ON messages FOR INSERT
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = sender_id);

-- Update posts policies
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
CREATE POLICY "Posts are viewable by everyone"
ON posts FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
CREATE POLICY "Authenticated users can create posts"
ON posts FOR INSERT
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);