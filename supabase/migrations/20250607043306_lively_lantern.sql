/*
  # Add AMGA Organization

  1. New Organizations
    - `AMGA` organization (AMGA HC Lab)
      - `org_code` (text, unique): 'AMGA'
      - `name` (text): 'AMGA HC Lab'
      - Other fields set to NULL as defaults

  2. Security
    - Uses existing RLS policies on organizations table
    - ON CONFLICT clause prevents duplicate insertion errors
*/

-- Insert AMGA organization if it doesn't exist
INSERT INTO public.organizations (org_code, name)
VALUES ('AMGA', 'AMGA HC Lab')
ON CONFLICT (org_code) DO NOTHING;