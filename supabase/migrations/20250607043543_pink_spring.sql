/*
  # Create locations table and import all location data

  1. New Tables
    - `locations`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key to organizations)
      - `location_code` (text)
      - `location_name` (text)
      - `street` (text, nullable)
      - `city` (text, nullable)
      - `state` (text, nullable)
      - `zip` (text, nullable)
      - `phone` (text, nullable)
      - `fax` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `locations` table
    - Add policies for public access (matching existing pattern)

  3. Data Import
    - Import all 153 location records from provided data
    - Link locations to organizations via organization_id
    - Handle conflicts with upsert logic
*/

-- Create the locations table if it doesn't exist
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

-- Create RLS policies that match the pattern used for other tables (with IF NOT EXISTS equivalent)
DO $$
BEGIN
    -- Check if policies exist before creating them
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'locations' 
        AND policyname = 'Allow all users to read locations'
    ) THEN
        CREATE POLICY "Allow all users to read locations"
            ON public.locations
            FOR SELECT
            TO public
            USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'locations' 
        AND policyname = 'Allow all users to insert locations'
    ) THEN
        CREATE POLICY "Allow all users to insert locations"
            ON public.locations
            FOR INSERT
            TO public
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'locations' 
        AND policyname = 'Allow all users to update locations'
    ) THEN
        CREATE POLICY "Allow all users to update locations"
            ON public.locations
            FOR UPDATE
            TO public
            USING (true)
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'locations' 
        AND policyname = 'Allow all users to delete locations'
    ) THEN
        CREATE POLICY "Allow all users to delete locations"
            ON public.locations
            FOR DELETE
            TO public
            USING (true);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_locations_organization_id ON public.locations(organization_id);
CREATE INDEX IF NOT EXISTS idx_locations_location_code ON public.locations(location_code);

-- Insert all location data from the provided CSV
INSERT INTO public.locations (organization_id, location_code, location_name, street, city, state, zip, phone, fax)
SELECT 
    o.id as organization_id,
    COALESCE(NULLIF(TRIM(ld.location_code), ''), 'MAIN') as location_code,
    COALESCE(NULLIF(TRIM(ld.location_name), ''), 'Main Location') as location_name,
    NULLIF(TRIM(ld.street), '') as street,
    NULLIF(TRIM(ld.city), '') as city,
    NULLIF(TRIM(ld.state), '') as state,
    NULLIF(TRIM(ld.zip), '') as zip,
    NULLIF(TRIM(ld.phone), '') as phone,
    NULLIF(TRIM(ld.fax), '') as fax
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
    ('AMMO', 'CLHCC', 'Cedars of Liberty Health Care Center', '200 Ruth Ewing Road', 'Liberty', 'Missouri', '64068', NULL, NULL),
    ('AMMO', 'CPHCC', 'Chariton Park Health Care Center', '902 Manor Drive', 'Salisbury', 'Missouri', '65281', NULL, NULL),
    ('AMMO', 'CWHCC', 'Crestwood Health Care Cennter', '11400 Mehl Avenue', 'Florissant', 'Missouri', '63033', NULL, NULL),
    ('AMMO', 'CPW', 'CuraPath Wellness', '1231 1st Street', 'Kennett', 'Missouri', '63857', NULL, NULL),
    ('AMMO', 'EMCC', 'Eastview Manor Care Center', '1622 E 28th Street', 'Trenton', 'Missouri', '64683', NULL, NULL),
    ('AMMO', 'EWM', 'Edgewood Manor', '11900 Jessica Lane', 'Raytown', 'Missouri', '64138', NULL, NULL),
    ('AMMO', 'FVNH', 'Fair View Nursing Home', '1714 W 16th Street', 'Sedalia', 'Missouri', '65301', NULL, NULL),
    ('AMMO', 'FMG', 'Family Medical Group', '201 First Executive Avenue', 'St. Peters', 'Missouri', '63376', NULL, NULL),
    ('AMMO', 'FSLC', 'Four Seasons Living Center', '2800 State Hwy TT', 'Sedalia', 'Missouri', '65301', NULL, NULL),
    ('AMMO', 'GBNHC', 'General Baptist Nursing Home of Campbell', '17108 US-62', 'Campbell', 'Missouri', '63933', NULL, NULL),
    ('AMMO', 'GBNHP', 'General Baptist Nursing Home of Piggott', '450 S 9th Avenue', 'Piggott', 'Arkansas', '72454', NULL, NULL),
    ('AMMO', 'GCC', 'Gideon Care Center', '300 Lunbeck Avenue', 'Gideon', 'Missouri', '63848', NULL, NULL),
    ('AMMO', 'GMC', 'Gideon Medical Clinic', '100 N Main Street', 'Gideon', 'Missouri', '63848', NULL, NULL),
    ('AMMO', 'GMCNRHC', 'Gideon Medical Clinic - Non-RHC', '100 N Main Street', 'Gideon', 'Missouri', '63848', NULL, NULL),
    ('AMMO', 'GMNH', 'Grand Manor Nursing Home', '3645 Cook Avenue', 'St. Louis', 'Missouri', '63113', NULL, NULL),
    ('AMMO', 'GRMC', 'Great River Medical Center', '1520 N Division Street', 'Blytheville', 'Arkansas', '72315', NULL, NULL),
    ('AMMO', 'GMRH', 'Green Meadows Retirement Home', '411 N King''s Highway', 'Sikeston', 'Missouri', '63801', NULL, NULL),
    ('AMMO', 'GVHCC', 'Greenville Health Care Center', '117 Sycamore Street', 'Greenville', 'Missouri', '63944', NULL, NULL),
    ('AMMO', 'GRLC', 'Gregory Ridge Living Center', '7001 Cleveland Avenue', 'Kansas City', 'Missouri', '64132', NULL, NULL),
    ('AMMO', 'HMDXRHC', 'Hayti Medical & Diagnostic - RHC', '223 S 3rd Street', 'Hayti', 'Missouri', '63851', NULL, NULL),
    ('AMMO', 'HMaD', 'Hayti Medical and Diagnostic', '223 S 3rd Street', 'Hayti', 'Missouri', '63851', NULL, NULL),
    ('AMMO', 'HCC', 'Heritage Care Center', '4401 N Hanley Road', 'St. Louis', 'Missouri', '63134', NULL, NULL),
    ('AMMO', 'HNC', 'Heritage Nursing Center', '1802 St. Francis Street', 'Kennett', 'Missouri', '63857', NULL, NULL),
    ('AMMO', 'HHCC', 'Holton Health Care Center', '1121 W 7th Street', 'Holton', 'Kansas', '66436', NULL, NULL),
    ('AMMO', 'HACC', 'Hunter Acres Caring Center', '628 N West Street', 'Sikeston', 'Missouri', '63801', NULL, NULL),
    ('AMMO', 'KPAMNR', 'Kennett Pediatric & Adolescent Medical NON_RHC', '211 Teaco Road', 'Kennett', 'Missouri', '63857', NULL, NULL),
    ('AMMO', 'KPAM', 'Kennett Pediatric - McPherson Medical & Diagnostic, LLC', '211 Teaco Road', 'Kennett', 'Missouri', '63857', '5737171072', NULL),
    ('AMMO', 'LRHCC', 'Levering Regional Health Care Center', '1734 Market Street', 'Hannibal', 'Missouri', '63401', NULL, NULL),
    ('AMMO', 'LRC', 'Levering Residential Care', '1734 Market Street', 'Hannibal', 'Missouri', '63401', NULL, NULL),
    ('AMMO', 'LHSLC', 'Loch Haven Senior Living Community', '701 Sunset Hills Drive', 'Macon', 'Missouri', '63552', NULL, NULL),
    ('AMMO', 'MaHCC', 'Macon Health Care Center', '29612 Kellogg Avenue', 'Macon', 'Missouri', '63552', NULL, NULL),
    ('AMMO', 'MMC', 'Macon Medical Clinic', '307 McKay Street', 'Macon', 'Missouri', '63552', NULL, NULL),
    ('AMMO', 'MFCandD', 'Malden Family Clinic & Diagnostic', '1207 N Douglas Street', 'Malden', 'Missouri', '63863', NULL, NULL),
    ('AMMO', 'MFMCarthage', 'Manzer Family Medicine - Carthage', '3071 Grand Avenue', 'Carthage', 'Missouri', '64836', NULL, NULL),
    ('AMMO', 'MFMColumbus', 'Manzer Family Medicine - Columbus', '915 W Maple Street', 'Columbus', 'Kansas', '66725', NULL, NULL),
    ('AMMO', 'MFMGalena', 'Manzer Family Medicine - Galena', '1605 KS-66', 'Galena', 'Kansas', '66739', NULL, NULL),
    ('AMMO', 'MCMADX', 'McPherson Medical & Diagnostic', '901 W Commercial Avenue', 'Kennett', 'Missouri', '63857', NULL, NULL),
    ('AMMO', 'McP', 'McPherson Medical & Diagnostic, LLC', '901 W Commercial Avenue', 'Kennett', 'Missouri', '63857', '5737171072', NULL),
    ('AMMO', 'MWBJC', 'Midwest Bone & Joint Center', '1706 Prospect Drive', 'Macon', 'Missouri', '63552', NULL, NULL),
    ('AMMO', 'MIGFAC', 'Migrated_Facility', NULL, NULL, NULL, NULL, NULL, NULL),
    ('AMMO', 'MiHCC', 'Milan Health Care Center', '52435 Infirmary Road', 'Milan', 'Missouri', '63556', NULL, NULL),
    ('AMMO', 'MMDDRW', 'MMD Dr. Wood', NULL, NULL, NULL, NULL, NULL, NULL),
    ('AMMO', 'NRHCC', 'Nathan Richard Health Care Center', '700 E Highland Avenue', 'Nevada', 'Missouri', '64772', NULL, NULL),
    ('AMMO', 'NHCHC', 'NHC HealthCare', '1120 Falcon Drive', 'Kennett', 'Missouri', '63857', NULL, NULL),
    ('AMMO', 'NHC', 'Nick''s Healthcare Center', '253 MO-116', 'Plattsburg', 'Missouri', '64477', NULL, NULL),
    ('AMMO', 'NVP', 'North Village Park', '2041 Silva Lane', 'Moberly', 'Missouri', '65270', NULL, NULL),
    ('AMMO', 'NHCC', 'Nortonville Health Care Center', '412 E Walnut Street', 'Nortonville', 'Kansas', '66060', NULL, NULL),
    ('AMMO', 'PHRC', 'Parkway Health & Rehabilitation Center', '2323 Swope Parkway', 'Kansas City', 'Missouri', '64130', NULL, NULL),
    ('AMMO', 'PIPC', 'Pemiscot Interventional Pain Center', '907 E Reed Street', 'Hayti', 'Missouri', '63851', NULL, NULL),
    ('AMMO', 'PMH', 'Pemiscot Memorial Hospital', '946 E Reed Street', 'Hayti', 'Missouri', '63851', NULL, NULL),
    ('AMMO', 'PMHLTSCU', 'Pemiscot Memorial Hospital Long Term Skilled Care Unit', '946 E Reed Street', 'Hayti', 'Missouri', '63851', NULL, NULL),
    ('AMMO', 'PMSING', 'Pemiscot Memorial Scheduling', '946 E Reed Street', 'Hayti', 'Missouri', '63851', NULL, NULL),
    ('AMMO', 'PCAL', 'Pettis County Assisted Living', '3017 Brooking Park Avenue', 'Sedalia', 'Missouri', '65301', NULL, NULL),
    ('AMMO', 'PCH', 'Piggott Community Hospital', '1206 Gordon Duckworth Drive', 'Piggott', 'Arkansas', '72454', NULL, NULL),
    ('AMMO', 'PVHCC', 'Portageville Health Care Center', '290 MO-162', 'Portageville', 'Missouri', '63873', NULL, NULL),
    ('AMMO', 'PORTNURCT', 'Portageville Nursing Center', '290 MO-162', 'Portageville', 'Missouri', '63873', NULL, NULL),
    ('AMMO', 'PFandA', 'Premier Foot and Ankle', '6810 State Route 162, Suite #20', 'Maryville', 'Illinois', '62062', NULL, NULL),
    ('AMMO', 'PWC', 'Probst Wellness Center', '10345 Watson Road', 'St. Louis', 'Missouri', '63127', NULL, NULL),
    ('AMMO', 'RHCRH', 'Rest Haven Convalescent & Retirement Home', '1800 S Ingram Avenue', 'Sedalia', 'Missouri', '65301', NULL, NULL),
    ('AMMO', 'ROCC', 'River Oaks Care Center', '1001 N Walnut Street', 'Steele', 'Missouri', '63877', NULL, NULL),
    ('AMMO', 'SFM', 'Sacry Family Medicine', '433 S Garrison Avenue', 'Carthage', 'Missouri', '64836', NULL, NULL),
    ('AMMO', 'SLNC', 'Saint Luke''s Nursing Center', '1220 E Fairview Avenue', 'Carthage', 'Missouri', '64836', NULL, NULL),
    ('AMMO', 'SamH', 'Samaritan Hospital', '1205 N Missouri Street', 'Macon', 'Missouri', '63552', NULL, NULL),
    ('AMMO', 'MCPMDXLLC', 'Scott City - McPherson Medical & Diagnostic, LLC', '2102 Main Street', 'Scott City', 'Missouri', '63780', NULL, NULL),
    ('AMMO', 'SCMC', 'Scott City Medical Clinic', '2102 Main Street', 'Scott City', 'Missouri', '63780', NULL, NULL),
    ('AMMO', 'MMDXAEL', 'Scott City, Joseph Hazan (AEL LAB) - McPherson Medical & Diagnostic, LLC', '16216 Baxter Road, Suite #100', 'Chesterfield', 'Missouri', '63017', NULL, NULL),
    ('AMMO', 'MMDXJH', 'Scott City, Joseph Hazan - McPherson Medical & Diagnostic, LLC', '16216 Baxter Road, Suite #100', 'Chesterfield', 'Missouri', '63017', NULL, NULL),
    ('AMMO', 'MMDXEMD', 'Scott City, Richard Muckerman - McPherson Medical & Diagnostic, LLC', '16216 Baxter Road, Suite #100', 'Chesterfield', 'Missouri', '63017', NULL, NULL),
    ('AMMO', 'SHCC', 'Senath Health Care Center', '300 E Hornbeck Street', 'Senath', 'Missouri', '63876', NULL, NULL),
    ('AMMO', 'SSHCC', 'Senath South Health Care Center', '300 E Hornbeck Street', 'Senath', 'Missouri', '63876', NULL, NULL),
    ('AMMO', 'SMCRMC', 'SMC Regional Medical Center', '611 W Lee Avenue', 'Osceola', 'Arkansas', '72370', NULL, NULL),
    ('AMMO', 'SGLC', 'Southgate Living Center', '500 N Truman Boulevard', 'Caruthersville', 'Missouri', '63830', NULL, NULL),
    ('AMMO', 'SECC', 'St. Elizabeth Care Center', '649 S Walnut Street', 'St. Elizabeth', 'Missouri', '65075', NULL, NULL),
    ('AMMO', 'SFPSL', 'St. Francis Park Senior Living', '1806 St. Francis Street', 'Kennett', 'Missouri', '63857', NULL, NULL),
    ('AMMO', 'STLHCG', 'St. Louis Healthcare Group', '16216 Baxter Road, Suite #100', 'Chesterfield', 'Missouri', '63017', NULL, NULL),
    ('AMMO', 'SFC', 'Steele Family Clinic', '216 W Main Street', 'Steele', 'Missouri', '63877', NULL, NULL),
    ('AMMO', 'SFCNR', 'Steele Family Clinic - Non RHC', '216 W Main Street', 'Steele', 'Missouri', '63877', NULL, NULL),
    ('AMMO', 'SCHC', 'Stonecrest Healthcare', '2 State Hwy Y', 'Viburnum', 'Missouri', '65566', NULL, NULL),
    ('AMMO', 'TFP', 'Tague Family Practice', '10004 Kennerly Road, Suite #186B', 'St. Louis', 'Missouri', '63128', NULL, NULL),
    ('AMMO', '', 'TEST Location', '123 ABC Way', NULL, NULL, NULL, NULL, NULL),
    ('AMMO', 'TestL', 'Testing', NULL, NULL, NULL, NULL, NULL, NULL),
    ('AMMO', 'WVHCC', 'Wellsville Health Care Center', '250 E Locust Street', 'Wellsville', 'Missouri', '63384', NULL, NULL),
    ('AMMO', 'WVNH', 'Westview Nursing Home', '301 Dunlop Street', 'Center', 'Missouri', '63436', NULL, NULL),
    ('AMGA', 'AIVSL', 'Alexander IV Senior Living', '3769 Ridge Avenue', 'Macon', 'Georgia', '31204', NULL, NULL),
    ('AMGA', 'AMGAD', 'AMGA Diagnostics', '6501 Peake Road, Suite #400', 'Macon', 'Georgia', '31210', NULL, NULL),
    ('AMGA', 'AMGAHCLABFL', 'AMGA HC Lab Florida', '1499 Forest Hills Boulevard, Suite #112', 'West Palm Beach', 'Florida', '33406', NULL, NULL),
    ('AMGA', 'AMGAHC', 'AMGA HC Lab Texas', NULL, NULL, NULL, NULL, NULL, NULL),
    ('AMGA', 'AMGAO', 'AMGA Ortho Sports & Wound Care', '6501 Peake Road, Suite #400', 'Macon', 'Georgia', '31210', NULL, NULL),
    ('AMGA', 'ASLA', 'Antebellum Senior Living on Arlington', '684 Arlington Place', 'Macon', 'Georgia', '31201', NULL, NULL),
    ('AMGA', 'PLANT', 'Baptist Village', '5953 Plantation Villa Drive', 'Macon', 'Georgia', '31210', NULL, NULL),
    ('AMGA', '3001070', 'Carlyle Place Harrington House (Nh 32)', '5300 Zebulon Road', 'Macon', 'Georgia', '31210', NULL, NULL),
    ('AMGA', '3001015', 'Carlyle Place Harrington House (Snf 31)', '5300 Zebulon Road', 'Macon', 'Georgia', '31210', NULL, NULL),
    ('AMGA', '3001105', 'Carlyle Place Senior Living Community', '5300 Zebulon Road', 'Macon', 'Georgia', '31210', NULL, NULL),
    ('AMGA', 'GCA13', 'Church Home Grace Garden', '2470 US-41 N', 'Fort Valley', 'Georgia', '31030', NULL, NULL),
    ('AMGA', 'CHLSRHC', 'Church Home LifeSpring Rehabilitation & Healthcare (Nh 32)', '2470 US-41 N', 'Fort Valley', 'Georgia', '31030', NULL, NULL),
    ('AMGA', 'CHSNF31', 'Church Home LifeSpring Rehabilitation & Healthcare (Snf 31)', '2470 US-41 N', 'Fort Valley', 'Georgia', '31030', NULL, NULL),
    ('AMGA', 'FPoC', 'Family Practice of Conyers', '1039 East Freeway Drive', 'Conyers', 'Georgia', '30094', NULL, NULL),
    ('AMGA', 'GVS', 'Georgia Vascular Specialists', '1718 Peachtree Street NW, Suite #360', 'Atlanta', 'Georgia', '30309', NULL, NULL),
    ('AMGA', 'Harley', 'Harley Institute', '2678 Buford Highway', 'Atlanta', 'Georgia', '30309', NULL, NULL),
    ('AMGA', 'JWVRC', 'John-Wesley Villa Retirement Community', '5471 Thomaston Road', 'Macon', 'Georgia', '31220', NULL, NULL),
    ('AMGA', 'OLWW', 'Oaks at Lake Wildwood', '6191 Peake Road', 'Macon', 'Georgia', '31220', NULL, NULL),
    ('AMGA', '3001069', 'PruittHealth - Eastside (Nh 32)', '2795 Finney Circle', 'Macon', 'Georgia', '31217', NULL, NULL),
    ('AMGA', '3001016', 'PruittHealth - Eastside (Snf 31)', '2795 Finney Circle', 'Macon', 'Georgia', '31217', NULL, NULL),
    ('AMGA', '3001099', 'PruittHealth - Peake (Nh 32)', '6190 Peake Road', 'Macon', 'Georgia', '31220', NULL, NULL),
    ('AMGA', '3001100', 'PruittHealth - Peake (Snf 31)', '6190 Peake Road', 'Macon', 'Georgia', '31220', NULL, NULL),
    ('AMGA', 'SPCB', 'Southern Primary Care - Bowman', '2040 Bowman Park, Suite A', 'Macon', 'Georgia', '31210', NULL, NULL),
    ('AMGA', 'SPCDa', 'Southern Primary Care - Dallas', '51 Seven Hills Boulevard, Suite #102', 'Dallas', 'Georgia', '30132', NULL, NULL),
    ('AMGA', 'SPCDe', 'Southern Primary Care - Decatur', '4153 Flat Shoals Parkway, Suite #300B', 'Decatur', 'Georgia', '30034', NULL, NULL),
    ('AMGA', 'SCPHC', 'Southern Primary Care - House Call', '6501 Peake Road, Suite #400', 'Macon', 'Georgia', '31210', NULL, NULL),
    ('AMGA', 'SPCI', 'Southern Primary Care - Ingleside', '2192 Ingleside Avenue', 'Macon', 'Georgia', '31204', NULL, NULL),
    ('AMGA', 'SPCL', 'Southern Primary Care - Lawrenceville', '1670 McKendree Church Road, Suite #800', 'Lawrenceville', 'Georgia', '30043', NULL, NULL),
    ('AMGA', 'SPCM', 'Southern Primary Care - Macon', '197 Bass Road', 'Macon', 'Georgia', '31210', NULL, NULL),
    ('AMGA', 'SPCR', 'Southern Primary Care - Riverdale', '217 Medical Way', 'Riverdale', 'Georgia', '30274', NULL, NULL),
    ('AMGA', 'SPCUC', 'Southern Primary Care - Union City', '6781 Londonderry Way, Suite #5', 'Union City', 'Georgia', '30291', NULL, NULL),
    ('AMGA', 'SPCWR', 'Southern Primary Care - Warner Robins', '101 Willie Lee Parkway, Suite #400', 'Warner Robins', 'Georgia', '31088', NULL, NULL),
    ('AMGA', '', 'TEST Location', '123 ABC Way', NULL, NULL, NULL, NULL, NULL),
    ('AMGA', 'TCW', 'The Cottages on Wesleyan', '1633 Wesleyan Drive', 'Macon', 'Georgia', '31210', NULL, NULL),
    ('AMGA', 'TOPIAL', 'The Oaks - Peake (Independent and Assisted Living)', '400 Foster Road', 'Macon', 'Georgia', '31210', NULL, NULL),
    ('AMGA', 'TCFM', 'Total Care Family Medicine', '2022 Fairburn Road, Suite D', 'Douglasville', 'Georgia', '30135', NULL, NULL),
    ('AMGA', 'WCSL', 'Watercrest Senior Living', '111 Providence Boulevard', 'Macon', 'Georgia', '31210', NULL, NULL),
    ('AMTXSealy', 'MCOS', 'Medical Clinics of Sealy', '1036 N Circle Drive', 'Sealy', 'Texas', '77474', '9798770022', '9798853810'),
    ('AMTXSealy', '', 'TEST Location', '123 ABC Way', NULL, NULL, NULL, NULL, NULL),
    ('AMTXStockton', 'MallMC', 'Mallik Medical Clinic', '237 W 21st Street', 'Fort Stockton', 'Texas', '79735', NULL, NULL),
    ('AMTXStockton', '', 'TEST Location', NULL, NULL, NULL, NULL, NULL, NULL),
    ('CSPI', 'BMT', 'Beaumont', '3070 College Street, Suite 300', 'Beaumont', 'Texas', '77701', '4098924600', NULL),
    ('CSPI', 'JSP', 'Jasper', '2014 South Wheeler (Hwy 96), Suite 130', 'Jasper', 'Texas', '75951', '4098924600', '4098914605'),
    ('CSPI', '', 'StratusDX', '123 Happy Valley', 'Dallas', 'Texas', '75062', '9726628022', NULL),
    ('CSPI', '', 'TEST Location', '123 ABC Way', NULL, NULL, NULL, NULL, NULL),
    ('FMC', 'FMC Brownsville', 'Brownsville', '1215 E College Street', 'Brownsville', 'Tennessee', '38012', '7317723442', NULL),
    ('FMC', 'FMC Jackson', 'Jackson', '168 W University Parkway, Suite A', 'Jackson', 'Tennessee', '38305', NULL, NULL),
    ('FMC', '', 'Test Location', NULL, NULL, NULL, NULL, NULL, NULL),
    ('RBUC', 'RBUC', 'Rivers Bend Urgent Care', '87 US-22', 'Maineville', 'Ohio', '45039', NULL, NULL),
    ('SCNC', 'CL', 'SCNC', '1250 Highway 54 West, Suite 102', 'Fayetteville', 'Georgia', '30214', '7707192965', NULL),
    ('TEST', '', 'TEST Location', '123 ABC Way', NULL, NULL, NULL, NULL, NULL)
) AS ld(org_code, location_code, location_name, street, city, state, zip, phone, fax)
JOIN public.organizations o ON o.org_code = ld.org_code
ON CONFLICT (organization_id, location_code) DO UPDATE SET
    location_name = EXCLUDED.location_name,
    street = EXCLUDED.street,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    zip = EXCLUDED.zip,
    phone = EXCLUDED.phone,
    fax = EXCLUDED.fax,
    updated_at = now();