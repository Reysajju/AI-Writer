/*
  # Create characters and worlds tables

  1. New Tables
    - `characters`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `personality` (text)
      - `backstory` (text)
      - `motivation` (text)
      - `physical_description` (text)
      - `generated_image` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `worlds`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `description` (text)
      - `geography` (text)
      - `culture` (text)
      - `history` (text)
      - `magic_system` (text)
      - `technology_level` (text)
      - `generated_image` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  personality text NOT NULL,
  backstory text NOT NULL,
  motivation text NOT NULL,
  physical_description text NOT NULL,
  generated_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create worlds table
CREATE TABLE IF NOT EXISTS worlds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  geography text NOT NULL,
  culture text NOT NULL,
  history text NOT NULL,
  magic_system text,
  technology_level text NOT NULL,
  generated_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE worlds ENABLE ROW LEVEL SECURITY;

-- Policies for characters
CREATE POLICY "Users can read own characters"
  ON characters
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own characters"
  ON characters
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own characters"
  ON characters
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own characters"
  ON characters
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for worlds
CREATE POLICY "Users can read own worlds"
  ON worlds
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own worlds"
  ON worlds
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own worlds"
  ON worlds
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own worlds"
  ON worlds
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updating timestamps
CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_worlds_updated_at
  BEFORE UPDATE ON worlds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();