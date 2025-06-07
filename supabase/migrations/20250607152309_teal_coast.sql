/*
  # Add missing columns to test_methods table

  1. New Columns
    - `required_equipment` (text array) - Equipment needed for the test method
    - `protocols` (text array) - Protocols associated with the test method  
    - `regulatory_requirements` (text array) - Regulatory requirements for the test method
    - `quality_controls` (text array) - Quality control measures for the test method

  2. Changes
    - All new columns are nullable to maintain compatibility with existing data
    - Uses text[] array type to store multiple values per field
*/

-- Add required_equipment column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'test_methods' AND column_name = 'required_equipment'
  ) THEN
    ALTER TABLE test_methods ADD COLUMN required_equipment text[];
  END IF;
END $$;

-- Add protocols column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'test_methods' AND column_name = 'protocols'
  ) THEN
    ALTER TABLE test_methods ADD COLUMN protocols text[];
  END IF;
END $$;

-- Add regulatory_requirements column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'test_methods' AND column_name = 'regulatory_requirements'
  ) THEN
    ALTER TABLE test_methods ADD COLUMN regulatory_requirements text[];
  END IF;
END $$;

-- Add quality_controls column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'test_methods' AND column_name = 'quality_controls'
  ) THEN
    ALTER TABLE test_methods ADD COLUMN quality_controls text[];
  END IF;
END $$;