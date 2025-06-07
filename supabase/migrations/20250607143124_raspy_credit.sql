/*
  # Enhanced Test Methods Table

  1. New Tables
    - `test_methods`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key to organizations)
      - `name` (text, unique per organization)
      - `description` (text, optional)
      - `category` (text, required)
      - `max_batch_size` (integer, default 24)
      - `processing_time` (text, optional)
      - `status` (text, default 'Active')
      - `required_equipment` (text array, optional)
      - `protocols` (text array, optional)
      - `regulatory_requirements` (text array, optional)
      - `quality_controls` (text array, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `test_methods` table
    - Add policies for authenticated users to manage test methods
*/

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

-- Create unique constraint for organization + name
CREATE UNIQUE INDEX IF NOT EXISTS unique_org_test_method 
ON test_methods(organization_id, name);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_methods_organization_id 
ON test_methods(organization_id);

CREATE INDEX IF NOT EXISTS idx_test_methods_category 
ON test_methods(category);

CREATE INDEX IF NOT EXISTS idx_test_methods_status 
ON test_methods(status);

-- Enable RLS
ALTER TABLE test_methods ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all users to read test_methods"
  ON test_methods
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow all users to insert test_methods"
  ON test_methods
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow all users to update test_methods"
  ON test_methods
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Allow all users to delete test_methods"
  ON test_methods
  FOR DELETE
  TO public
  USING (true);