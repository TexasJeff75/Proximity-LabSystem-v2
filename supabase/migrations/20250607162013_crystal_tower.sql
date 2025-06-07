/*
  # Create Protocols and Test Method Protocols Tables

  1. New Tables
    - `protocols`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `duration` (text)
      - `robot_compatibility` (text array)
      - `protocol_type` (text)
      - `plate_format` (text)
      - `sample_capacity` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `test_method_protocols`
      - `test_method_id` (uuid, foreign key)
      - `protocol_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (CRUD operations)

  3. Indexes
    - Add performance indexes for common queries
*/

-- Create protocols table
CREATE TABLE IF NOT EXISTS protocols (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  duration text,
  robot_compatibility text[] DEFAULT '{}',
  protocol_type text,
  plate_format text,
  sample_capacity integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique constraint for protocol name
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'unique_protocol_name'
  ) THEN
    ALTER TABLE protocols ADD CONSTRAINT unique_protocol_name UNIQUE (name);
  END IF;
END $$;

-- Create indexes for better performance
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'idx_protocols_name'
  ) THEN
    CREATE INDEX idx_protocols_name
    ON protocols(name);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'idx_protocols_protocol_type'
  ) THEN
    CREATE INDEX idx_protocols_protocol_type
    ON protocols(protocol_type);
  END IF;
END $$;

-- Enable RLS for protocols
ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;

-- Policies for protocols
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'protocols'
    AND policyname = 'Allow all users to read protocols'
  ) THEN
    CREATE POLICY "Allow all users to read protocols"
      ON protocols
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'protocols'
    AND policyname = 'Allow all users to insert protocols'
  ) THEN
    CREATE POLICY "Allow all users to insert protocols"
      ON protocols
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'protocols'
    AND policyname = 'Allow all users to update protocols'
  ) THEN
    CREATE POLICY "Allow all users to update protocols"
      ON protocols
      FOR UPDATE
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'protocols'
    AND policyname = 'Allow all users to delete protocols'
  ) THEN
    CREATE POLICY "Allow all users to delete protocols"
      ON protocols
      FOR DELETE
      TO public
      USING (true);
  END IF;
END $$;

-- Create test_method_protocols join table
CREATE TABLE IF NOT EXISTS test_method_protocols (
  test_method_id uuid NOT NULL REFERENCES test_methods(id) ON DELETE CASCADE,
  protocol_id uuid NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (test_method_id, protocol_id)
);

-- Create indexes for better performance
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'idx_test_method_protocols_test_method_id'
  ) THEN
    CREATE INDEX idx_test_method_protocols_test_method_id
    ON test_method_protocols(test_method_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'idx_test_method_protocols_protocol_id'
  ) THEN
    CREATE INDEX idx_test_method_protocols_protocol_id
    ON test_method_protocols(protocol_id);
  END IF;
END $$;

-- Enable RLS for test_method_protocols
ALTER TABLE test_method_protocols ENABLE ROW LEVEL SECURITY;

-- Policies for test_method_protocols
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'test_method_protocols'
    AND policyname = 'Allow all users to read test_method_protocols'
  ) THEN
    CREATE POLICY "Allow all users to read test_method_protocols"
      ON test_method_protocols
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'test_method_protocols'
    AND policyname = 'Allow all users to insert test_method_protocols'
  ) THEN
    CREATE POLICY "Allow all users to insert test_method_protocols"
      ON test_method_protocols
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'test_method_protocols'
    AND policyname = 'Allow all users to update test_method_protocols'
  ) THEN
    CREATE POLICY "Allow all users to update test_method_protocols"
      ON test_method_protocols
      FOR UPDATE
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'test_method_protocols'
    AND policyname = 'Allow all users to delete test_method_protocols'
  ) THEN
    CREATE POLICY "Allow all users to delete test_method_protocols"
      ON test_method_protocols
      FOR DELETE
      TO public
      USING (true);
  END IF;
END $$;

-- Insert sample protocols
INSERT INTO protocols (name, description, duration, robot_compatibility, protocol_type, plate_format, sample_capacity)
VALUES 
  ('Complete Blood Count Protocol', 'Automated CBC analysis with differential', '20 min', ARRAY['OT2-001', 'OT2-002', 'FLEX-001'], 'testing', '384-well', 24),
  ('Lipid Analysis Protocol', 'Comprehensive lipid panel processing', '25 min', ARRAY['OT2-002', 'FLEX-001'], 'testing', '384-well', 36),
  ('DNA Extraction Protocol', 'Automated DNA extraction from blood samples', '45 min', ARRAY['OT2-001', 'OT2-002'], 'extraction', '96-well', 24),
  ('PCR Setup Protocol', 'Automated PCR reaction setup with master mix', '30 min', ARRAY['OT2-002'], 'pcr', '96-well', 96),
  ('ELISA Plate Setup', 'Automated ELISA plate preparation and sample loading', '60 min', ARRAY['OT2-001', 'OT2-002', 'FLEX-001'], 'immunoassay', '96-well', 96),
  ('Serial Dilution Protocol', 'Automated serial dilutions for standard curves', '25 min', ARRAY['OT2-001', 'OT2-002'], 'dilution', '48-well', 48)
ON CONFLICT (name) DO NOTHING;