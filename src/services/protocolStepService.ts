import { supabase } from './supabaseClient';
import { Database } from '../types/supabase';

type ProtocolStep = Database['public']['Tables']['protocol_steps']['Row'];
type ProtocolStepInsert = Database['public']['Tables']['protocol_steps']['Insert'];

const fetchProtocolSteps = async (): Promise<ProtocolStep[]> => {
  const { data, error } = await supabase
    .from('protocol_steps')
    .select('*')
    .order('step_order', { ascending: true });

  if (error) {
    console.error('Error fetching protocol steps:', error);
    throw error;
  }

  return data || [];
};

export const fetchProtocolStepsByProtocol = async (protocolId: string): Promise<ProtocolStep[]> => {
  const { data, error } = await supabase
    .from('protocol_steps')
    .select('*')
    .eq('protocol_id', protocolId)
    .order('step_order', { ascending: true });

  if (error) {
    console.error('Error fetching protocol steps by protocol:', error);
    throw error;
  }

  return data || [];
};

const insertProtocolStep = async (step: ProtocolStepInsert): Promise<ProtocolStep> => {
  const { data, error } = await supabase
    .from('protocol_steps')
    .insert(step)
    .select()
    .single();

  if (error) {
    console.error('Error inserting protocol step:', error);
    throw error;
  }

  return data;
};

const updateProtocolStep = async (id: string, updates: Partial<ProtocolStep>): Promise<ProtocolStep> => {
  const { data, error } = await supabase
    .from('protocol_steps')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating protocol step:', error);
    throw error;
  }

  return data;
};

const deleteProtocolStep = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('protocol_steps')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting protocol step:', error);
    throw error;
  }
};

export const getProtocolStepByBarcode = async (barcode: string): Promise<ProtocolStep | null> => {
  const { data, error } = await supabase
    .from('protocol_steps')
    .select('*')
    .or(`start_barcode.eq.${barcode},stop_barcode.eq.${barcode}`)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching protocol step by barcode:', error);
    throw error;
  }

  return data;
};

const generateStepBarcodes = (protocolId: string, stepName: string): { startBarcode: string; stopBarcode: string } => {
  const protocolPrefix = protocolId.slice(0, 8).toUpperCase();
  const stepPrefix = stepName.replace(/\s+/g, '_').toUpperCase().slice(0, 8);
  const timestamp = Date.now().toString().slice(-6);
  
  return {
    startBarcode: `START_${stepPrefix}_${protocolPrefix}_${timestamp}`,
    stopBarcode: `STOP_${stepPrefix}_${protocolPrefix}_${timestamp}`
  };
};

const insertBulkProtocolSteps = async (steps: ProtocolStepInsert[]): Promise<void> => {
  const { error } = await supabase
    .from('protocol_steps')
    .upsert(steps, { onConflict: 'start_barcode' });

  if (error) {
    console.error('Error inserting bulk protocol steps:', error);
    throw error;
  }
};