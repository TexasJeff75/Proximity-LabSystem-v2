export interface Patient {
  patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  medical_record_number: string;
  contact_number: string;
  address: string;
  created_at: string;
  updated_at: string;
}
export interface Order {
  order_id: string;
  location: string;
  provider: string;
  alt_order_id?: string;
  requisition_date: string;
  requisition_by: string;
  collection_date: string;
  collected_by: string;
  network: string;
  comments?: string;
  order_status: 'pending' | 'processing' | 'completed' | 'cancelled';
  priority: 'routine' | 'urgent' | 'stat';
  specimen_type: string;
  billing_code: string;
  insurance_provider: string;
  created_at: string;
  updated_at: string;
}
export interface OrderPanel {
  order_panel_id: string;
  order_id: string;
  panel_name: string;
  panel_code: string;
  test_types: string[];
  created_at: string;
  updated_at: string;
}
export interface Sample {
  sample_id: string;
  patient_id: string;
  order_id: string;
  customer_id: string;
  test_types: string[];
  volume: number;
  status: 'pending' | 'in_batch' | 'processing' | 'completed';
  collection_date: string;
  barcode: string;
  created_at: string;
  updated_at: string;
}
export interface Batch {
  batch_id: string;
  customer_id: string;
  test_type: string;
  sample_ids: string[];
  protocol_id: string;
  wells: number;
  sample_well_map: Record<string, string>; // wellId -> sampleId
  process_stage: ProcessStage;
  plate_type: '96-well' | '384-well';
  barcode: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}
export interface Protocol {
  protocol_id: string;
  batch_id: string;
  test_type: string;
  sample_count: number;
  process_stage: ProcessStage;
  created_at: string;
  updated_at: string;
}
export interface ProtocolStep {
  step_id: string;
  protocol_id: string;
  step_name: string;
  plate_type: '96-well' | '384-well';
  params: Record<string, any>;
  script: string;
  step_order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
}
export type ProcessStage = 'sample_collection' | 'extraction' | 'pcr_setup' | 'pcr_running' | 'analysis' | 'completed';