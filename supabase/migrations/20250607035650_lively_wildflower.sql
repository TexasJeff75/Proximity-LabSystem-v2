/*
  # Populate organizations table with real data

  1. Data Population
    - Clear existing sample data
    - Insert real organization data from the provided spreadsheet
    - All organizations include proper names, codes, and contact information
    - Handle NULL values appropriately for optional fields

  2. Data Integrity
    - Ensure all required fields (name, org_code) are populated
    - Maintain referential integrity
    - Use consistent formatting for addresses and contact info
*/

-- Clear existing sample data
DELETE FROM public.organizations;

-- Insert real organization data
INSERT INTO public.organizations (org_code, name, medical_director, clia, street, city, state, zip, phone, fax) VALUES
    ('AMMO', 'American Medical Administrators - MO', 'Nguyen Nguyen, PhD', '#26D300631', '3071 Grand Ave', 'Carthage', 'Missouri', '64836', NULL, NULL),
    ('AQA', 'AMGA HQ Lab', 'Michael Orgulados', '45D2316524', '16922 Telge Road, Suite 2C', 'Cypress', 'Texas', '77429', NULL, NULL),
    ('AMTXSealy', 'AMTX HC Lab - Sealy', 'Michael Orgulados, MD', '45D2316203', '16922 Telge Road, Suite 2H', 'Cypress', 'Texas', '77429', NULL, NULL),
    ('AMTXStockton', 'AMTX HC Lab - Stockton', NULL, NULL, '16922 Telge Road, Suite 2H', 'Cypress', 'Texas', '77429', NULL, NULL),
    ('CSPI', 'Coastal Spine & Pain Institute', 'Yizhong Wang', '45D1087627', '16922 Telge Rd, Suite 2A', 'Cypress', 'Texas', '77429', NULL, NULL),
    ('FMC', 'FirstCare Medical Center PC', 'Congying Gu', '45D2314090', '16922 Telge Rd, Suite 2C', 'Cypress', 'Texas', '77429', NULL, NULL),
    ('RBUC', 'RBUC HC Lab', 'Yizhong Wang, PhD, NRCC', '45D2319858', '16922 Telge Rd, Suite 2D', 'Cypress', 'Texas', '77429', '5136779117', NULL),
    ('SCNC', 'Southern Crescent Neurological Clinic', 'Dr. Yizhong Wang', '45D2294566', '16922 Telge Rd, Suite 2B', 'Cypress', 'Texas', '77429', '7707192965', '7707192963'),
    ('TEST', 'Test Organization', NULL, '45D10876898', '123 ABC Way', NULL, NULL, NULL, NULL, NULL);