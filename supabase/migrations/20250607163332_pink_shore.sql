/*
  # Create Workflow and Barcode Tracking Tables

  1. New Tables
    - `batches`
      - `id` (uuid, primary key)
      - `batch_number` (text, unique)
      - `test_method_id` (uuid, foreign key)
      - `protocol_id` (uuid, foreign key)
      - `status` (text)
      - `sample_count` (integer)
      - `created_at` (timestamp)
      - `started_at` (timestamp)
      - `completed_at` (timestamp)
    
    - `protocol_steps`
      - `id` (uuid, primary key)
      - `protocol_id` (uuid, foreign key)
      - `step_name` (text)
      - `step_order` (integer)
      - `description` (text)
      - `estimated_duration` (text)
      - `start_barcode` (text, unique)
      - `stop_barcode` (text, unique)
    
    - `workflow_executions`
      - `id` (uuid, primary key)
      - `batch_id` (uuid, foreign key)
      - `protocol_step_id` (uuid, foreign key)
      - `status` (text)
      - `started_at` (timestamp)
      - `completed_at` (timestamp)
      - `started_by` (text)
      - `completed_by` (text)
      - `notes` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create batches table
CREATE TABLE IF NOT EXISTS batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number text UNIQUE NOT NULL,
  test_method_id uuid NOT NULL REFERENCES test_methods(id) ON DELETE CASCADE,
  protocol_id uuid NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'Created' CHECK (status IN ('Created', 'In Progress', 'Completed', 'Failed', 'Cancelled')),
  sample_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,
  created_by text,
  notes text
);

-- Create protocol_steps table
CREATE TABLE IF NOT EXISTS protocol_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol_id uuid NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
  step_name text NOT NULL,
  step_order integer NOT NULL,
  description text,
  estimated_duration text,
  start_barcode text UNIQUE NOT NULL,
  stop_barcode text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workflow_executions table
CREATE TABLE IF NOT EXISTS workflow_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  protocol_step_id uuid NOT NULL REFERENCES protocol_steps(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Failed', 'Skipped')),
  started_at timestamptz,
  completed_at timestamptz,
  started_by text,
  completed_by text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_batches_batch_number ON batches(batch_number);
CREATE INDEX IF NOT EXISTS idx_batches_test_method_id ON batches(test_method_id);
CREATE INDEX IF NOT EXISTS idx_batches_protocol_id ON batches(protocol_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);

CREATE INDEX IF NOT EXISTS idx_protocol_steps_protocol_id ON protocol_steps(protocol_id);
CREATE INDEX IF NOT EXISTS idx_protocol_steps_step_order ON protocol_steps(protocol_id, step_order);
CREATE INDEX IF NOT EXISTS idx_protocol_steps_start_barcode ON protocol_steps(start_barcode);
CREATE INDEX IF NOT EXISTS idx_protocol_steps_stop_barcode ON protocol_steps(stop_barcode);

CREATE INDEX IF NOT EXISTS idx_workflow_executions_batch_id ON workflow_executions(batch_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_protocol_step_id ON workflow_executions(protocol_step_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);

-- Enable RLS
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocol_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

-- Create policies for batches
CREATE POLICY "Allow all users to read batches"
  ON batches
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow all users to insert batches"
  ON batches
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow all users to update batches"
  ON batches
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Allow all users to delete batches"
  ON batches
  FOR DELETE
  TO public
  USING (true);

-- Create policies for protocol_steps
CREATE POLICY "Allow all users to read protocol_steps"
  ON protocol_steps
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow all users to insert protocol_steps"
  ON protocol_steps
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow all users to update protocol_steps"
  ON protocol_steps
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Allow all users to delete protocol_steps"
  ON protocol_steps
  FOR DELETE
  TO public
  USING (true);

-- Create policies for workflow_executions
CREATE POLICY "Allow all users to read workflow_executions"
  ON workflow_executions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow all users to insert workflow_executions"
  ON workflow_executions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow all users to update workflow_executions"
  ON workflow_executions
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Allow all users to delete workflow_executions"
  ON workflow_executions
  FOR DELETE
  TO public
  USING (true);

-- Insert sample protocol steps for PCR Testing protocol
INSERT INTO protocol_steps (protocol_id, step_name, step_order, description, estimated_duration, start_barcode, stop_barcode)
SELECT 
  p.id,
  'Sample Extraction',
  1,
  'Extract DNA/RNA from samples using automated extraction protocol',
  '45 minutes',
  'START_EXTRACT_' || SUBSTRING(p.id::text, 1, 8),
  'STOP_EXTRACT_' || SUBSTRING(p.id::text, 1, 8)
FROM protocols p 
WHERE p.name = 'PCR Setup Protocol'
ON CONFLICT (start_barcode) DO NOTHING;

INSERT INTO protocol_steps (protocol_id, step_name, step_order, description, estimated_duration, start_barcode, stop_barcode)
SELECT 
  p.id,
  'Sample Plating',
  2,
  'Plate extracted samples onto PCR plate for amplification',
  '20 minutes',
  'START_PLATE_' || SUBSTRING(p.id::text, 1, 8),
  'STOP_PLATE_' || SUBSTRING(p.id::text, 1, 8)
FROM protocols p 
WHERE p.name = 'PCR Setup Protocol'
ON CONFLICT (start_barcode) DO NOTHING;

INSERT INTO protocol_steps (protocol_id, step_name, step_order, description, estimated_duration, start_barcode, stop_barcode)
SELECT 
  p.id,
  'Instrument Run',
  3,
  'Run PCR amplification and detection on thermal cycler',
  '2 hours',
  'START_RUN_' || SUBSTRING(p.id::text, 1, 8),
  'STOP_RUN_' || SUBSTRING(p.id::text, 1, 8)
FROM protocols p 
WHERE p.name = 'PCR Setup Protocol'
ON CONFLICT (start_barcode) DO NOTHING;

-- Insert sample protocol steps for DNA Extraction protocol
INSERT INTO protocol_steps (protocol_id, step_name, step_order, description, estimated_duration, start_barcode, stop_barcode)
SELECT 
  p.id,
  'Sample Preparation',
  1,
  'Prepare blood samples for DNA extraction',
  '15 minutes',
  'START_PREP_' || SUBSTRING(p.id::text, 1, 8),
  'STOP_PREP_' || SUBSTRING(p.id::text, 1, 8)
FROM protocols p 
WHERE p.name = 'DNA Extraction Protocol'
ON CONFLICT (start_barcode) DO NOTHING;

INSERT INTO protocol_steps (protocol_id, step_name, step_order, description, estimated_duration, start_barcode, stop_barcode)
SELECT 
  p.id,
  'Automated Extraction',
  2,
  'Automated DNA extraction using magnetic beads',
  '30 minutes',
  'START_AUTO_' || SUBSTRING(p.id::text, 1, 8),
  'STOP_AUTO_' || SUBSTRING(p.id::text, 1, 8)
FROM protocols p 
WHERE p.name = 'DNA Extraction Protocol'
ON CONFLICT (start_barcode) DO NOTHING;

-- Insert sample protocol steps for ELISA protocol
INSERT INTO protocol_steps (protocol_id, step_name, step_order, description, estimated_duration, start_barcode, stop_barcode)
SELECT 
  p.id,
  'Plate Setup',
  1,
  'Set up ELISA plates with standards and samples',
  '30 minutes',
  'START_SETUP_' || SUBSTRING(p.id::text, 1, 8),
  'STOP_SETUP_' || SUBSTRING(p.id::text, 1, 8)
FROM protocols p 
WHERE p.name = 'ELISA Plate Setup'
ON CONFLICT (start_barcode) DO NOTHING;

INSERT INTO protocol_steps (protocol_id, step_name, step_order, description, estimated_duration, start_barcode, stop_barcode)
SELECT 
  p.id,
  'Incubation',
  2,
  'Incubate plates at specified temperature',
  '60 minutes',
  'START_INCUB_' || SUBSTRING(p.id::text, 1, 8),
  'STOP_INCUB_' || SUBSTRING(p.id::text, 1, 8)
FROM protocols p 
WHERE p.name = 'ELISA Plate Setup'
ON CONFLICT (start_barcode) DO NOTHING;

INSERT INTO protocol_steps (protocol_id, step_name, step_order, description, estimated_duration, start_barcode, stop_barcode)
SELECT 
  p.id,
  'Detection',
  3,
  'Add detection reagents and read results',
  '30 minutes',
  'START_DETECT_' || SUBSTRING(p.id::text, 1, 8),
  'STOP_DETECT_' || SUBSTRING(p.id::text, 1, 8)
FROM protocols p 
WHERE p.name = 'ELISA Plate Setup'
ON CONFLICT (start_barcode) DO NOTHING;