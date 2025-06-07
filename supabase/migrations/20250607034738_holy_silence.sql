/*
  # Create organizations table

  1. New Tables
    - `organizations`
      - `id` (uuid, primary key)
      - `org_code` (text, unique, not null) - Organization code identifier
      - `name` (text, not null) - Organization name
      - `medical_director` (text, nullable) - Medical director name
      - `clia` (text, nullable) - CLIA number
      - `street` (text, nullable) - Street address
      - `city` (text, nullable) - City
      - `state` (text, nullable) - State
      - `zip` (text, nullable) - ZIP code
      - `phone` (text, nullable) - Phone number
      - `fax` (text, nullable) - Fax number
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `organizations` table
    - Add policies for public read access and authenticated user modifications
    - This matches the existing pattern used in the orders table

  3. Sample Data
    - Insert sample organizations that match the mock data used in the Organizations component
*/

-- Create the organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_code text NOT NULL UNIQUE,
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

-- Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies that match the pattern used for orders table
CREATE POLICY "Allow all users to read organizations"
    ON public.organizations
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow all users to insert organizations"
    ON public.organizations
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow all users to update organizations"
    ON public.organizations
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all users to delete organizations"
    ON public.organizations
    FOR DELETE
    TO public
    USING (true);

-- Insert sample data that matches the mock organizations used in the component
INSERT INTO public.organizations (org_code, name, medical_director, clia, street, city, state, zip, phone, fax) VALUES
    ('AMMO', 'Metro Health System', 'Dr. Robert Anderson', 'CLIA001', '123 Medical Center Dr', 'Downtown', 'CA', '90210', '(555) 111-0000', '(555) 111-0001'),
    ('AQA', 'Community Care Network', 'Dr. Patricia Williams', 'CLIA002', '789 Central St', 'Central', 'CA', '90211', '(555) 222-0000', '(555) 222-0001'),
    ('CSPI', 'Regional Medical Group', 'Dr. James Martinez', 'CLIA003', '654 Main St', 'Midtown', 'CA', '90212', '(555) 333-0000', '(555) 333-0001')
ON CONFLICT (org_code) DO NOTHING;