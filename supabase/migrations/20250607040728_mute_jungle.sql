/*
  # Create org_reps table to augment organizations

  1. New Tables
    - `org_reps`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key to organizations)
      - `sales_rep` (text, nullable)
      - `account_manager` (text, nullable)
      - `sales_executive` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `org_reps` table
    - Add policies for public access (matching organizations table pattern)

  3. Relationships
    - Foreign key constraint to organizations table
    - One-to-one relationship (one org_reps record per organization)
*/

-- Create the org_reps table
CREATE TABLE IF NOT EXISTS public.org_reps (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    sales_rep text,
    account_manager text,
    sales_executive text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Ensure one-to-one relationship
    CONSTRAINT unique_organization_id UNIQUE (organization_id)
);

-- Enable Row Level Security
ALTER TABLE public.org_reps ENABLE ROW LEVEL SECURITY;

-- Create RLS policies that match the pattern used for other tables
CREATE POLICY "Allow all users to read org_reps"
    ON public.org_reps
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow all users to insert org_reps"
    ON public.org_reps
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow all users to update org_reps"
    ON public.org_reps
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all users to delete org_reps"
    ON public.org_reps
    FOR DELETE
    TO public
    USING (true);

-- Create index for better performance on foreign key lookups
CREATE INDEX IF NOT EXISTS idx_org_reps_organization_id ON public.org_reps(organization_id);

-- Insert sample data for existing organizations
INSERT INTO public.org_reps (organization_id, sales_rep, account_manager, sales_executive)
SELECT 
    o.id,
    CASE 
        WHEN o.org_code = 'AMMO' THEN 'Jennifer Adams'
        WHEN o.org_code = 'AQA' THEN 'Michael Chen'
        WHEN o.org_code = 'AMTXSealy' THEN 'Sarah Johnson'
        WHEN o.org_code = 'AMTXStockton' THEN 'David Wilson'
        WHEN o.org_code = 'CSPI' THEN 'Lisa Thompson'
        WHEN o.org_code = 'FMC' THEN 'Robert Brown'
        WHEN o.org_code = 'RBUC' THEN 'Maria Garcia'
        WHEN o.org_code = 'SCNC' THEN 'James Miller'
        ELSE NULL
    END as sales_rep,
    CASE 
        WHEN o.org_code = 'AMMO' THEN 'Sarah Johnson'
        WHEN o.org_code = 'AQA' THEN 'David Wilson'
        WHEN o.org_code = 'AMTXSealy' THEN 'Jennifer Adams'
        WHEN o.org_code = 'AMTXStockton' THEN 'Michael Chen'
        WHEN o.org_code = 'CSPI' THEN 'Robert Brown'
        WHEN o.org_code = 'FMC' THEN 'Lisa Thompson'
        WHEN o.org_code = 'RBUC' THEN 'Maria Garcia'
        WHEN o.org_code = 'SCNC' THEN 'James Miller'
        ELSE NULL
    END as account_manager,
    CASE 
        WHEN o.org_code IN ('AMMO', 'AQA', 'AMTXSealy') THEN 'Executive Team Alpha'
        WHEN o.org_code IN ('AMTXStockton', 'CSPI', 'FMC') THEN 'Executive Team Beta'
        WHEN o.org_code IN ('RBUC', 'SCNC') THEN 'Executive Team Gamma'
        ELSE NULL
    END as sales_executive
FROM public.organizations o
ON CONFLICT (organization_id) DO NOTHING;