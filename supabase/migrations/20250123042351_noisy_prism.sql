/*
  # Fix Generation Counts Table

  1. Changes
    - Add ON CONFLICT DO UPDATE clause to handle_new_user function
    - Add function to reset generation counts daily
    - Add trigger for updating last_updated timestamp
*/

-- Function to handle timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updating last_updated
CREATE TRIGGER update_generation_counts_updated_at
  BEFORE UPDATE ON generation_counts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to reset counts daily
CREATE OR REPLACE FUNCTION reset_daily_generation_counts()
RETURNS void AS $$
BEGIN
  INSERT INTO generation_counts (user_id, date, count)
  SELECT 
    user_id,
    CURRENT_DATE,
    0
  FROM auth.users
  ON CONFLICT (user_id, date) 
  DO UPDATE SET count = 0, last_updated = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;