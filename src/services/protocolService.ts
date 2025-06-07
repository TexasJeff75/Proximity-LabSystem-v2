import { supabase } from './supabaseClient';
import { Database } from '../types/supabase';

type Protocol = Database['public']['Tables']['protocols']['Row'];
export type ProtocolInsert = Database['public']['Tables']['protocols']['Insert'];
type TestMethodProtocol = Database['public']['Tables']['test_method_protocols']['Row'];
type TestMethodProtocolInsert = Database['public']['Tables']['test_method_protocols']['Insert'];

// Extended protocol type that includes test method associations
export interface ProtocolWithTestMethods extends Protocol {
  test_methods?: Array<{
    id: string;
    name: string;
    organization_id: string;
  }>;
}

const fetchProtocols = async (): Promise<Protocol[]> => {
  const { data, error } = await supabase
    .from('protocols')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching protocols:', error);
    throw error;
  }

  return data || [];
};

export const fetchProtocolsWithTestMethods = async (): Promise<ProtocolWithTestMethods[]> => {
  const { data, error } = await supabase
    .from('protocols')
    .select(`
      *,
      test_method_protocols (
        test_methods (
          id,
          name,
          organization_id
        )
      )
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching protocols with test methods:', error);
    throw error;
  }

  // Transform the data to flatten the test methods
  const protocolsWithTestMethods = data?.map(protocol => ({
    ...protocol,
    test_methods: protocol.test_method_protocols?.map(tmp => tmp.test_methods).filter(Boolean) || []
  })) || [];

  return protocolsWithTestMethods;
};

const fetchProtocolsByTestMethod = async (testMethodId: string): Promise<Protocol[]> => {
  const { data, error } = await supabase
    .from('protocols')
    .select(`
      *,
      test_method_protocols!inner (
        test_method_id
      )
    `)
    .eq('test_method_protocols.test_method_id', testMethodId)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching protocols by test method:', error);
    throw error;
  }

  return data || [];
};

export const insertProtocol = async (protocol: ProtocolInsert): Promise<Protocol> => {
  const { data, error } = await supabase
    .from('protocols')
    .insert(protocol)
    .select()
    .single();

  if (error) {
    console.error('Error inserting protocol:', error);
    throw error;
  }

  return data;
};

export const updateProtocol = async (id: string, updates: Partial<Protocol>): Promise<Protocol> => {
  const { data, error } = await supabase
    .from('protocols')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating protocol:', error);
    throw error;
  }

  return data;
};

export const deleteProtocol = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('protocols')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting protocol:', error);
    throw error;
  }
};

const getProtocolByName = async (name: string): Promise<Protocol | null> => {
  const { data, error } = await supabase
    .from('protocols')
    .select('*')
    .eq('name', name)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching protocol by name:', error);
    throw error;
  }

  return data;
};

// Test Method Protocol Association Functions
const associateProtocolWithTestMethod = async (
  testMethodId: string, 
  protocolId: string
): Promise<TestMethodProtocol> => {
  const { data, error } = await supabase
    .from('test_method_protocols')
    .insert({
      test_method_id: testMethodId,
      protocol_id: protocolId
    })
    .select()
    .single();

  if (error) {
    console.error('Error associating protocol with test method:', error);
    throw error;
  }

  return data;
};

const removeProtocolFromTestMethod = async (
  testMethodId: string, 
  protocolId: string
): Promise<void> => {
  const { error } = await supabase
    .from('test_method_protocols')
    .delete()
    .eq('test_method_id', testMethodId)
    .eq('protocol_id', protocolId);

  if (error) {
    console.error('Error removing protocol from test method:', error);
    throw error;
  }
};

const updateTestMethodProtocols = async (
  testMethodId: string, 
  protocolIds: string[]
): Promise<void> => {
  // First, remove all existing associations
  const { error: deleteError } = await supabase
    .from('test_method_protocols')
    .delete()
    .eq('test_method_id', testMethodId);

  if (deleteError) {
    console.error('Error removing existing protocol associations:', deleteError);
    throw deleteError;
  }

  // Then, add new associations
  if (protocolIds.length > 0) {
    const associations = protocolIds.map(protocolId => ({
      test_method_id: testMethodId,
      protocol_id: protocolId
    }));

    const { error: insertError } = await supabase
      .from('test_method_protocols')
      .insert(associations);

    if (insertError) {
      console.error('Error inserting new protocol associations:', insertError);
      throw insertError;
    }
  }
};

const insertBulkProtocols = async (protocols: ProtocolInsert[]): Promise<void> => {
  const { error } = await supabase
    .from('protocols')
    .upsert(protocols, { onConflict: 'name' });

  if (error) {
    console.error('Error inserting bulk protocols:', error);
    throw error;
  }
};