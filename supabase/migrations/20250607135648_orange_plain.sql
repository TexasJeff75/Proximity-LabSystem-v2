/*
  # Create test methods table

  1. New Tables
    - `test_methods`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key to organizations)
      - `name` (text, test method name)
      - `description` (text, detailed description)
      - `category` (text, test category like Hematology, Chemistry, etc.)
      - `max_batch_size` (integer, maximum samples per batch)
      - `processing_time` (text, estimated processing time)
      - `status` (text, Active/Inactive/Draft)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `test_methods` table
    - Add policies for authenticated users to manage test methods

  3. Constraints
    - Unique constraint on organization_id + name to prevent duplicate test method names per organization
    - Check constraint on status values
*/

-- Create the test_methods table
CREATE TABLE IF NOT EXISTS public.test_methods (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    category text NOT NULL,
    max_batch_size integer DEFAULT 24,
    processing_time text,
    status text DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Draft')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Ensure unique test method names within an organization
    CONSTRAINT unique_org_test_method UNIQUE (organization_id, name)
);

-- Enable Row Level Security
ALTER TABLE public.test_methods ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$
BEGIN
    -- Check if policies exist before creating them
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'test_methods' 
        AND policyname = 'Allow all users to read test_methods'
    ) THEN
        CREATE POLICY "Allow all users to read test_methods"
            ON public.test_methods
            FOR SELECT
            TO public
            USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'test_methods' 
        AND policyname = 'Allow all users to insert test_methods'
    ) THEN
        CREATE POLICY "Allow all users to insert test_methods"
            ON public.test_methods
            FOR INSERT
            TO public
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'test_methods' 
        AND policyname = 'Allow all users to update test_methods'
    ) THEN
        CREATE POLICY "Allow all users to update test_methods"
            ON public.test_methods
            FOR UPDATE
            TO public
            USING (true)
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'test_methods' 
        AND policyname = 'Allow all users to delete test_methods'
    ) THEN
        CREATE POLICY "Allow all users to delete test_methods"
            ON public.test_methods
            FOR DELETE
            TO public
            USING (true);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_methods_organization_id ON public.test_methods(organization_id);
CREATE INDEX IF NOT EXISTS idx_test_methods_category ON public.test_methods(category);
CREATE INDEX IF NOT EXISTS idx_test_methods_status ON public.test_methods(status);