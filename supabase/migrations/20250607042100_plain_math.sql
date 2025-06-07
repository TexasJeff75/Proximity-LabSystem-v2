/*
  # Create locations table

  1. New Tables
    - `locations`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key to organizations)
      - `location_code` (text, unique identifier for location)
      - `location_name` (text, name of the location)
      - `street` (text, street address)
      - `city` (text, city)
      - `state` (text, state)
      - `zip` (text, zip code)
      - `phone` (text, phone number)
      - `fax` (text, fax number)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `locations` table
    - Add policies for public access (matching other tables)

  3. Data Import
    - Import location data from the provided CSV
*/

-- Create the locations table
CREATE TABLE IF NOT EXISTS public.locations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    location_code text NOT NULL,
    location_name text NOT NULL,
    street text,
    city text,
    state text,
    zip text,
    phone text,
    fax text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Ensure unique location codes within an organization
    CONSTRAINT unique_org_location_code UNIQUE (organization_id, location_code)
);

-- Enable Row Level Security
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies that match the pattern used for other tables
CREATE POLICY "Allow all users to read locations"
    ON public.locations
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow all users to insert locations"
    ON public.locations
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow all users to update locations"
    ON public.locations
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all users to delete locations"
    ON public.locations
    FOR DELETE
    TO public
    USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_locations_organization_id ON public.locations(organization_id);
CREATE INDEX IF NOT EXISTS idx_locations_location_code ON public.locations(location_code);

-- Insert location data from the provided CSV
-- First, we need to map organization codes to organization IDs
INSERT INTO public.locations (organization_id, location_code, location_name, street, city, state, zip, phone, fax)
SELECT 
    o.id as organization_id,
    COALESCE(NULLIF(TRIM(location_code), ''), 'MAIN') as location_code,
    COALESCE(NULLIF(TRIM(location_name), ''), 'Main Location') as location_name,
    NULLIF(TRIM(street), '') as street,
    NULLIF(TRIM(city), '') as city,
    NULLIF(TRIM(state), '') as state,
    NULLIF(TRIM(zip), '') as zip,
    NULLIF(TRIM(phone), '') as phone,
    NULLIF(TRIM(fax), '') as fax
FROM (VALUES
    ('AMMO', 'AandM', 'A&M - McPherson Medical & Diagnostic, LLC', '304 Teaco Road, Suite A', 'Kennett', 'Missouri', '63857', '5737171072', NULL),
    ('AMMO', 'AMMMDRT', 'A&M - RHC - McPherson Medical & Diagnostic, LLC', '304 Teaco Road, Suite A', 'Kennett', 'Missouri', '63857', NULL, NULL),
    ('AMMO', 'AandMSC', 'A&M Specialty Clinic - McPherson Medical & Diagnostic, LLC', '304 Teaco Road, Suite C', 'Kennett', 'Missouri', '63857', NULL, NULL),
    ('AMMO', 'APRCF', 'Ambrose Park Residential Care Facility', '517 Oak Street', 'Cole Camp', 'Missouri', '65325', NULL, NULL),
    ('AMMO', 'AMMOALGY', 'AMMO Allergy', '901 W Commercial Avenue', 'Kennett', 'Missouri', '31210', NULL, NULL),
    ('AMMO', 'AMMOHCTX', 'AMMO HC Lab Texas', '16922 Telge Rd, Suite 2G', 'Cypress', 'Texas', '77429', NULL, NULL),
    ('AMMO', 'AMMOLAB', 'AMMO LAB', '3071 Grand Ave', 'Carthage', 'Missouri', '64836', NULL, NULL),
    ('AMMO', 'AEL', 'Analytical Edge Laboratories', '120 NE 26th Street', 'Oklahoma City', 'Oklahoma', '73105', NULL, NULL),
    ('AMMO', 'AELAOB', 'Analytical Edge Laboratories - Advanced OBGYN', '120 NE 26th Street', 'Oklahoma City', 'Oklahoma', '73105', NULL, NULL),
    ('AMMO', 'AHRE', 'Anew Healthcare & Rehab of Easton', '515 Dawson Street', 'Easton', 'Kansas', '66020', NULL, NULL),
    ('AMMO', 'AHRN', 'Anew Healthcare & Rehab of Nortonville', '412 E Walnut Street', 'Nortonville', 'Kansas', '66060', NULL, NULL),
    ('AMMO', 'AHRO', 'Anew Healthcare & Rehab of Odessa', '609 Golf Street', 'Odessa', 'Missouri', '64076', NULL, NULL),
    ('AMMO', 'AHRS', 'Anew Healthcare & Rehab of Sarcoxie', '1505 Miner Street', 'Sarcoxie', 'Missouri', '64862', NULL, NULL),
    ('AMMO', 'AHB', 'Anew Healthcare of Brookfield', '215 E Pratt Street', 'Brookfield', 'Missouri', '64628', NULL, NULL),
    ('AMMO', 'AHP', 'Anew Healthcare of Pleasanton', '706 W 15th Street', 'Pleasanton', 'Kansas', '66075', NULL, NULL),
    ('AMMO', 'AandF', 'Ankle & Foot Institute', '1011 Bowles Avenue, Suite #123', 'Fenton', 'Missouri', '63026', NULL, NULL),
    ('AMMO', 'BWPNH', 'Bernard West Pine Nursing Home', '4335 W Pine Boulevard', 'St. Louis', 'Missouri', '63108', NULL, NULL),
    ('AMMO', 'BevMed', 'Bevier Medical Clinic', '211 N Macon Street', 'Bevier', 'Missouri', '63532', NULL, NULL),
    ('AMMO', 'BHCCLLC', 'Bridgewood Health Care Center, LLC', '11515 Troost Avenue', 'Kansas City', 'Missouri', '64131', NULL, NULL),
    ('AMMO', 'BHCC', 'Brunswick Health Care Center', '721 W Harrison Street', 'Brunswick', 'Missouri', '65236', NULL, NULL),
    ('AQA', 'AIVSL', 'Alexander IV Senior Living', '3769 Ridge Avenue', 'Macon', 'Georgia', '31204', NULL, NULL),
    ('AQA', 'AMGAD', 'AMGA Diagnostics', '6501 Peake Road, Suite #400', 'Macon', 'Georgia', '31210', NULL, NULL),
    ('AQA', 'AMGAHCLABFL', 'AMGA HC Lab Florida', '1499 Forest Hills Boulevard, Suite #112', 'West Palm Beach', 'Florida', '33406', NULL, NULL),
    ('AQA', 'AMGAHC', 'AMGA HC Lab Texas', NULL, NULL, NULL, NULL, NULL, NULL),
    ('AQA', 'AMGAO', 'AMGA Ortho Sports & Wound Care', '6501 Peake Road, Suite #400', 'Macon', 'Georgia', '31210', NULL, NULL),
    ('AMTXSealy', 'MCOS', 'Medical Clinics of Sealy', '1036 N Circle Drive', 'Sealy', 'Texas', '77474', '9798770022', '9798853810'),
    ('AMTXStockton', 'MallMC', 'Mallik Medical Clinic', '237 W 21st Street', 'Fort Stockton', 'Texas', '79735', NULL, NULL),
    ('CSPI', 'BMT', 'Beaumont', '3070 College Street, Suite 300', 'Beaumont', 'Texas', '77701', '4098924600', NULL),
    ('CSPI', 'JSP', 'Jasper', '2014 South Wheeler (Hwy 96), Suite 130', 'Jasper', 'Texas', '75951', '4098924600', '4098914605'),
    ('CSPI', 'StratusDX', 'StratusDX', '123 Happy Valley', 'Dallas', 'Texas', '75062', '9726628022', NULL),
    ('FMC', 'FMC Brownsville', 'Brownsville', '1215 E College Street', 'Brownsville', 'Tennessee', '38012', '7317723442', NULL),
    ('FMC', 'FMC Jackson', 'Jackson', '168 W University Parkway, Suite A', 'Jackson', 'Tennessee', '38305', NULL, NULL),
    ('RBUC', 'RBUC', 'Rivers Bend Urgent Care', '87 US-22', 'Maineville', 'Ohio', '45039', NULL, NULL),
    ('SCNC', 'CL', 'SCNC', '1250 Highway 54 West, Suite 102', 'Fayetteville', 'Georgia', '30214', '7707192965', NULL)
) AS location_data(org_code, location_code, location_name, street, city, state, zip, phone, fax)
JOIN public.organizations o ON o.org_code = location_data.org_code
ON CONFLICT (organization_id, location_code) DO UPDATE SET
    location_name = EXCLUDED.location_name,
    street = EXCLUDED.street,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    zip = EXCLUDED.zip,
    phone = EXCLUDED.phone,
    fax = EXCLUDED.fax,
    updated_at = now();