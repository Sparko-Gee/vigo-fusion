/*
  # Fix Authentication System

  1. Changes
    - Drop and recreate profiles table RLS policies
    - Add proper handling for profile creation
    - Fix auth flow security

  2. Security
    - Enable proper RLS for profiles
    - Allow new users to create their profiles
    - Maintain security for existing operations
*/

-- Drop existing profile policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create new profile policies with proper security
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can create their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);