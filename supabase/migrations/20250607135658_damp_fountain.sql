/*
  # Create test panels table

  1. New Tables
    - `test_panels`
      - `id` (uuid, primary key)
      - `test_method_id` (uuid, foreign key to test_methods)
      - `name` (text, panel name like Vaginitis, HPV, UTI, etc.)
      - `description` (text, panel description)
      - `panel_code` (text, short code for the panel)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `test_panels` table
    - Add policies for authenticated users to manage test panels

  3. Constraints
    - Unique constraint on test_method_id + name to prevent duplicate panel names per test method
    - Unique constraint on test_method_id + panel_code for unique codes per test method
*/

-- Create the test_panels table
CREATE TABLE IF NOT EXISTS public.test_panels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    test_method_id uuid NOT NULL REFERENCES public.test_methods(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    panel_code text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Ensure unique panel names and codes within a test method
    CONSTRAINT unique_test_method_panel_name UNIQUE (test_method_id, name),
    CONSTRAINT unique_test_method_panel_code UNIQUE (test_method_id, panel_code)
);

-- Enable Row Level Security
ALTER TABLE public.test_panels ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$
BEGIN
    -- Check if policies exist before creating them
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'test_panels' 
        AND policyname = 'Allow all users to read test_panels'
    ) THEN
        CREATE POLICY "Allow all users to read test_panels"
            ON public.test_panels
            FOR SELECT
            TO public
            USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'test_panels' 
        AND policyname = 'Allow all users to insert test_panels'
    ) THEN
        CREATE POLICY "Allow all users to insert test_panels"
            ON public.test_panels
            FOR INSERT
            TO public
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'test_panels' 
        AND policyname = 'Allow all users to update test_panels'
    ) THEN
        CREATE POLICY "Allow all users to update test_panels"
            ON public.test_panels
            FOR UPDATE
            TO public
            USING (true)
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'test_panels' 
        AND policyname = 'Allow all users to delete test_panels'
    ) THEN
        CREATE POLICY "Allow all users to delete test_panels"
            ON public.test_panels
            FOR DELETE
            TO public
            USING (true);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_panels_test_method_id ON public.test_panels(test_method_id);
CREATE INDEX IF NOT EXISTS idx_test_panels_panel_code ON public.test_panels(panel_code);

-- Insert sample PCR Testing panels for demonstration
INSERT INTO public.test_methods (organization_id, name, description, category, max_batch_size, processing_time, status)
SELECT 
    o.id,
    'PCR Testing',
    'Polymerase Chain Reaction testing for various pathogens and conditions',
    'Molecular',
    96,
    '2-4 hours',
    'Active'
FROM public.organizations o 
WHERE o.org_code = 'AMMO'
ON CONFLICT (organization_id, name) DO NOTHING;

-- Insert the PCR panels
WITH pcr_method AS (
    SELECT tm.id as test_method_id
    FROM public.test_methods tm
    JOIN public.organizations o ON tm.organization_id = o.id
    WHERE tm.name = 'PCR Testing' AND o.org_code = 'AMMO'
    LIMIT 1
)
INSERT INTO public.test_panels (test_method_id, name, description, panel_code)
SELECT 
    pcr_method.test_method_id,
    panel_name,
    panel_description,
    panel_code
FROM pcr_method,
(VALUES
    ('Vaginitis', 'Bacterial vaginosis and yeast infection detection', 'VAG'),
    ('HPV', 'Human Papillomavirus detection and typing', 'HPV'),
    ('UTI', 'Urinary tract infection pathogen identification', 'UTI'),
    ('UTI+', 'Extended urinary tract infection panel with resistance markers', 'UTI+'),
    ('RPP+', 'Respiratory pathogen panel plus', 'RPP+'),
    ('RPP Lite', 'Basic respiratory pathogen panel', 'RPPL'),
    ('STI', 'Sexually transmitted infection comprehensive panel', 'STI'),
    ('Wound', 'Wound infection pathogen identification', 'WND'),
    ('GI', 'Gastrointestinal pathogen panel', 'GI'),
    ('CT/NG', 'Chlamydia trachomatis and Neisseria gonorrhoeae', 'CTNG')
) AS panels(panel_name, panel_description, panel_code)
ON CONFLICT (test_method_id, name) DO NOTHING;