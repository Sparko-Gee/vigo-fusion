/*
  # Fix RLS policies and enhance features

  1. Security Updates
    - Fix profiles RLS to allow new user creation
    - Update messages table for better real-time support
  
  2. Enhancements
    - Add duration field for voice messages
    - Add indexes for better performance
*/

-- Fix profiles RLS policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Add duration field to messages if not exists
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS duration integer;

-- Add index for real-time updates
CREATE INDEX IF NOT EXISTS idx_messages_created_at 
ON messages(created_at DESC);

-- Add index for posts
CREATE INDEX IF NOT EXISTS idx_posts_created_at 
ON posts(created_at DESC);