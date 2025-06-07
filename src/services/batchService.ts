import { supabase } from './supabaseClient';
import { Database } from '../types/supabase';

type Batch = Database['public']['Tables']['batches']['Row'];
type BatchInsert = Database['public']['Tables']['batches']['Insert'];

// Extended batch type that includes related data
export interface BatchWithDetails extends Batch {
  test_methods?: {
    id: string;
    name: string;
    organization_id: string;
  } | null;
  protocols?: {
    id: string;
    name: string;
    description: string | null;
  } | null;
  workflow_executions?: Array<{
    id: string;
    protocol_step_id: string;
    status: string;
    started_at: string | null;
    completed_at: string | null;
    started_by: string | null;
    completed_by: string | null;
    protocol_steps?: {
      step_name: string;
      step_order: number;
      description: string | null;
      estimated_duration: string | null;
    } | null;
  }>;
}

const fetchBatches = async (): Promise<Batch[]> => {
  const { data, error } = await supabase
    .from('batches')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching batches:', error);
    throw error;
  }

  return data || [];
};

export const fetchBatchesWithDetails = async (): Promise<BatchWithDetails[]> => {
  const { data, error } = await supabase
    .from('batches')
    .select(`
      *,
      test_methods (
        id,
        name,
        organization_id
      ),
      protocols (
        id,
        name,
        description
      ),
      workflow_executions (
        id,
        protocol_step_id,
        status,
        started_at,
        completed_at,
        started_by,
        completed_by,
        protocol_steps (
          step_name,
          step_order,
          description,
          estimated_duration
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching batches with details:', error);
    throw error;
  }

  return data || [];
};

const fetchBatchById = async (id: string): Promise<BatchWithDetails | null> => {
  const { data, error } = await supabase
    .from('batches')
    .select(`
      *,
      test_methods (
        id,
        name,
        organization_id
      ),
      protocols (
        id,
        name,
        description
      ),
      workflow_executions (
        id,
        protocol_step_id,
        status,
        started_at,
        completed_at,
        started_by,
        completed_by,
        protocol_steps (
          step_name,
          step_order,
          description,
          estimated_duration
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching batch by ID:', error);
    throw error;
  }

  return data;
};

const insertBatch = async (batch: BatchInsert): Promise<Batch> => {
  const { data, error } = await supabase
    .from('batches')
    .insert(batch)
    .select()
    .single();

  if (error) {
    console.error('Error inserting batch:', error);
    throw error;
  }

  return data;
};

const updateBatch = async (id: string, updates: Partial<Batch>): Promise<Batch> => {
  const { data, error } = await supabase
    .from('batches')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating batch:', error);
    throw error;
  }

  return data;
};

const deleteBatch = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('batches')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting batch:', error);
    throw error;
  }
};

export const generateBatchNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const time = now.getHours().toString().padStart(2, '0') + 
               now.getMinutes().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `B${year}${month}${day}${time}${random}`;
};

export const getBatchByNumber = async (batchNumber: string): Promise<Batch | null> => {
  const { data, error } = await supabase
    .from('batches')
    .select('*')
    .eq('batch_number', batchNumber)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching batch by number:', error);
    throw error;
  }

  return data;
};