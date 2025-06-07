/*
  # Create Organizations Table

  1. New Tables
    - `organizations`
      - `id` (uuid, primary key)
      - `org_code` (text, unique)
      - `name` (text)
      - `medical_director` (text)
      - `clia` (text)
      - `street` (text)
      - `city` (text)
      - `state` (text)
      - `zip` (text)
      - `phone` (text)
      - `fax` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `organizations` table
    - Add policies for public access to read, insert, update, and delete

  3. Data
    - Insert initial organization data from provided spreadsheet
*/

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_code text UNIQUE NOT NULL,
  name text NOT NULL,
  medical_director text,
  clia text,
  street text,
  city text,
  state text,
  zip text,
  phone text,
  fax text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow all users to read organizations"
  ON organizations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow all users to insert organizations"
  ON organizations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow all users to update organizations"
  ON organizations
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all users to delete organizations"
  ON organizations
  FOR DELETE
  TO public
  USING (true);

-- Insert organization data
INSERT INTO organizations (org_code, name, medical_director, clia, street, city, state, zip, phone, fax) VALUES
('AMMO', 'American Medical Administrators - MO', 'Nguyen Nguyen, PhD', '#26D2300631', '3071 Grand Ave', 'Carthage', 'Missouri', '64836', NULL, NULL),
('AQA', 'AMGA HQ Lab', 'Michael Prejados', '45D2316524', '16922 Telge Road, Suite 2C', 'Cypress', 'Texas', '77429', NULL, NULL),
('AMTXSealy', 'AMTX HC Lab - Sealy', 'Michael Prejados, MD', '45D2316203', '16922 Telge Road, Suite 2H', 'Cypress', 'Texas', '77429', NULL, NULL),
('AMTXStockton', 'AMTX HC Lab - Stockton', NULL, NULL, '16922 Telge Road, Suite 2H', 'Cypress', 'Texas', '77429', NULL, NULL),
('CSPI', 'Coastal Spine & Pain Institute', 'Yizhong Wang', '45D1087627', '16922 Telge Rd, Suite 2A', 'Cypress', 'Texas', '77429', NULL, NULL),
('FMC', 'FirstCare Medical Center PC', 'Congying Gu', '45D2147690', '16922 Telge Rd, Suite 2C', 'Cypress', 'Texas', '77429', NULL, NULL),
('RBUC', 'RBUC HC Lab', 'Yizhong Wang, PhD, NRCC', '45D2319858', '16922 Telge Rd, Suite 2D', 'Cypress', 'Texas', '77429', '5136779117', NULL),
('SCNC', 'Southern Crescent Neurological Clinic', 'Dr. Yizhong Wang', '45D2294566', '16922 Telge Rd, Suite 2B', 'Cypress', 'Texas', '77429', '7707192965', '7707192963'),
('TEST', NULL, NULL, '45D1087698', '123 ABC Way', NULL, NULL, NULL, NULL, NULL);

-- Create index on org_code for faster lookups
CREATE INDEX IF NOT EXISTS idx_organizations_org_code ON organizations(org_code);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();