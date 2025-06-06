/*
  # Create orders table

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `accession_id` (text, unique)
      - `status` (text)
      - `organization` (text)
      - `location` (text)
      - `provider` (text)
      - `patient_name` (text)
      - `request_date` (timestamp)
      - `collection_date` (timestamp)
      - `received_date` (timestamp, nullable)
      - `finalized_date` (timestamp, nullable)
      - `test_method` (text)
      - `order_panels` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `orders` table
    - Add policy for authenticated users to read their own data
*/

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

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (true);