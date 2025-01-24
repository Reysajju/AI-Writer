/*
  # Add API Keys and Generation Counts

  1. New Tables
    - `user_api_keys`: Stores user's API keys for different AI services
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `service_id` (text)
      - `api_key` (text)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `generation_counts`: Tracks daily generation counts per user
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `date` (date)
      - `count` (integer)
      - `last_updated` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own data
*/

-- Create user_api_keys table
CREATE TABLE IF NOT EXISTS user_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  service_id text NOT NULL,
  api_key text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, service_id)
);

-- Create generation_counts table
CREATE TABLE IF NOT EXISTS generation_counts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  count integer DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_counts ENABLE ROW LEVEL SECURITY;

-- Policies for user_api_keys
CREATE POLICY "Users can read own API keys"
  ON user_api_keys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys"
  ON user_api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys"
  ON user_api_keys
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for generation_counts
CREATE POLICY "Users can read own generation counts"
  ON generation_counts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generation counts"
  ON generation_counts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generation counts"
  ON generation_counts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);