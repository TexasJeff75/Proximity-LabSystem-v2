/*
  # Fix orders table migration

  1. New Tables
    - Ensures `orders` table exists with all required columns
  2. Security
    - Enables RLS on `orders` table if not already enabled
    - Adds policies for authenticated users to read, insert, and update orders (with existence checks)
*/

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  accession_id text UNIQUE NOT NULL,
  status text NOT NULL,
  organization text NOT NULL,
  location text NOT NULL,
  provider text NOT NULL,
  patient_name text NOT NULL,
  request_date timestamp with time zone NOT NULL,
  collection_date timestamp with time zone NOT NULL,
  received_date timestamp with time zone,
  finalized_date timestamp with time zone,
  test_method text NOT NULL,
  order_panels text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'orders' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- Create policies if they don't exist
DO $$
BEGIN
  -- Check if "Users can read orders" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' 
    AND policyname = 'Users can read orders'
  ) THEN
    CREATE POLICY "Users can read orders"
      ON orders
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Check if "Users can insert orders" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' 
    AND policyname = 'Users can insert orders'
  ) THEN
    CREATE POLICY "Users can insert orders"
      ON orders
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  -- Check if "Users can update orders" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' 
    AND policyname = 'Users can update orders'
  ) THEN
    CREATE POLICY "Users can update orders"
      ON orders
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END
$$;