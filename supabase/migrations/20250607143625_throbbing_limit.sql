/*
  # Enhanced Test Methods Table

  1. New Tables
    - `test_methods`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key to organizations)
      - `name` (text, required)
      - `description` (text, optional)
      - `category` (text, required)
      - `max_batch_size` (integer, default 24)
      - `processing_time` (text, optional)
      - `status` (text, default 'Active', constrained)
      - `required_equipment` (text array)
      - `protocols` (text array)
      - `regulatory_requirements` (text array)
      - `quality_controls` (text array)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `test_methods` table
    - Add policies for public access (temporary for development)

  3. Indexes
    - Unique constraint on organization_id + name
    - Performance indexes on organization_id, category, status
*/

-- Create test_methods table if it doesn't exist
CREATE TABLE IF NOT EXISTS test_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  max_batch_size integer DEFAULT 24,
  processing_time text,
  status text DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Draft')),
  required_equipment text[] DEFAULT '{}',
  protocols text[] DEFAULT '{}',
  regulatory_requirements text[] DEFAULT '{}',
  quality_controls text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique constraint for organization + name (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'unique_org_test_method'
  ) THEN
    CREATE UNIQUE INDEX unique_org_test_method 
    ON test_methods(organization_id, name);
  END IF;
END $$;

-- Create indexes for better performance (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_test_methods_organization_id'
  ) THEN
    CREATE INDEX idx_test_methods_organization_id 
    ON test_methods(organization_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_test_methods_category'
  ) THEN
    CREATE INDEX idx_test_methods_category 
    ON test_methods(category);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_test_methods_status'
  ) THEN
    CREATE INDEX idx_test_methods_status 
    ON test_methods(status);
  END IF;
END $$;

-- Enable RLS (safe to run multiple times)
ALTER TABLE test_methods ENABLE ROW LEVEL SECURITY;

-- Create policies (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'test_methods' 
    AND policyname = 'Allow all users to read test_methods'
  ) THEN
    CREATE POLICY "Allow all users to read test_methods"
      ON test_methods
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'test_methods' 
    AND policyname = 'Allow all users to insert test_methods'
  ) THEN
    CREATE POLICY "Allow all users to insert test_methods"
      ON test_methods
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'test_methods' 
    AND policyname = 'Allow all users to update test_methods'
  ) THEN
    CREATE POLICY "Allow all users to update test_methods"
      ON test_methods
      FOR UPDATE
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'test_methods' 
    AND policyname = 'Allow all users to delete test_methods'
  ) THEN
    CREATE POLICY "Allow all users to delete test_methods"
      ON test_methods
      FOR DELETE
      TO public
      USING (true);
  END IF;
END $$;