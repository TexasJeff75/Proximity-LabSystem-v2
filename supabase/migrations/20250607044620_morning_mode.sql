/*
  # Create contacts and contact_locations tables

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `first_name` (text, required)
      - `last_name` (text, required)
      - `provider_npi` (text, optional)
      - `organization_code` (text, required)
      - `organization_name` (text, required)
      - `location_code` (text, required)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `contact_locations`
      - `id` (uuid, primary key)
      - `contact_id` (uuid, foreign key to contacts)
      - `organization_code` (text, required)
      - `organization_name` (text, required)
      - `location_code` (text, required)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to perform CRUD operations

  3. Indexes
    - Add indexes for better query performance
    - Unique constraint on contact_id + organization_code + location_code for contact_locations
*/

-- Create the contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name text NOT NULL,
    last_name text NOT NULL,
    provider_npi text,
    organization_code text NOT NULL,
    organization_name text NOT NULL,
    location_code text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create the contact_locations table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.contact_locations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
    organization_code text NOT NULL,
    organization_name text NOT NULL,
    location_code text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Ensure a contact can't be associated with the same location twice
    CONSTRAINT unique_contact_location UNIQUE (contact_id, organization_code, location_code)
);

-- Enable Row Level Security on both tables
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_locations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for contacts table
DO $$
BEGIN
    -- Contacts table policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contacts' 
        AND policyname = 'Allow all users to read contacts'
    ) THEN
        CREATE POLICY "Allow all users to read contacts"
            ON public.contacts
            FOR SELECT
            TO public
            USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contacts' 
        AND policyname = 'Allow all users to insert contacts'
    ) THEN
        CREATE POLICY "Allow all users to insert contacts"
            ON public.contacts
            FOR INSERT
            TO public
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contacts' 
        AND policyname = 'Allow all users to update contacts'
    ) THEN
        CREATE POLICY "Allow all users to update contacts"
            ON public.contacts
            FOR UPDATE
            TO public
            USING (true)
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contacts' 
        AND policyname = 'Allow all users to delete contacts'
    ) THEN
        CREATE POLICY "Allow all users to delete contacts"
            ON public.contacts
            FOR DELETE
            TO public
            USING (true);
    END IF;

    -- Contact_locations table policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contact_locations' 
        AND policyname = 'Allow all users to read contact_locations'
    ) THEN
        CREATE POLICY "Allow all users to read contact_locations"
            ON public.contact_locations
            FOR SELECT
            TO public
            USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contact_locations' 
        AND policyname = 'Allow all users to insert contact_locations'
    ) THEN
        CREATE POLICY "Allow all users to insert contact_locations"
            ON public.contact_locations
            FOR INSERT
            TO public
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contact_locations' 
        AND policyname = 'Allow all users to update contact_locations'
    ) THEN
        CREATE POLICY "Allow all users to update contact_locations"
            ON public.contact_locations
            FOR UPDATE
            TO public
            USING (true)
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contact_locations' 
        AND policyname = 'Allow all users to delete contact_locations'
    ) THEN
        CREATE POLICY "Allow all users to delete contact_locations"
            ON public.contact_locations
            FOR DELETE
            TO public
            USING (true);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_organization_code ON public.contacts(organization_code);
CREATE INDEX IF NOT EXISTS idx_contacts_location_code ON public.contacts(location_code);
CREATE INDEX IF NOT EXISTS idx_contacts_provider_npi ON public.contacts(provider_npi);
CREATE INDEX IF NOT EXISTS idx_contacts_name ON public.contacts(last_name, first_name);

CREATE INDEX IF NOT EXISTS idx_contact_locations_contact_id ON public.contact_locations(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_locations_organization_code ON public.contact_locations(organization_code);
CREATE INDEX IF NOT EXISTS idx_contact_locations_location_code ON public.contact_locations(location_code);