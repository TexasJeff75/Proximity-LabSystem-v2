import { supabase } from './supabaseClient';
import { Database } from '../types/supabase';

export type TestPanel = Database['public']['Tables']['test_panels']['Row'];
export type TestPanelInsert = Database['public']['Tables']['test_panels']['Insert'];

export const fetchTestPanels = async (): Promise<TestPanel[]> => {
  const { data, error } = await supabase
    .from('test_panels')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching test panels:', error);
    throw error;
  }

  return data || [];
};

export const fetchTestPanelsByMethod = async (testMethodId: string): Promise<TestPanel[]> => {
  const { data, error } = await supabase
    .from('test_panels')
    .select('*')
    .eq('test_method_id', testMethodId)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching test panels by method:', error);
    throw error;
  }

  return data || [];
};

export const insertTestPanel = async (testPanel: TestPanelInsert): Promise<TestPanel> => {
  const { data, error } = await supabase
    .from('test_panels')
    .insert(testPanel)
    .select()
    .single();

  if (error) {
    console.error('Error inserting test panel:', error);
    throw error;
  }

  return data;
};

export const updateTestPanel = async (id: string, updates: Partial<TestPanel>): Promise<TestPanel> => {
  const { data, error } = await supabase
    .from('test_panels')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating test panel:', error);
    throw error;
  }

  return data;
};

export const deleteTestPanel = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('test_panels')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting test panel:', error);
    throw error;
  }
};

export const getTestPanelByCode = async (testMethodId: string, panelCode: string): Promise<TestPanel | null> => {
  const { data, error } = await supabase
    .from('test_panels')
    .select('*')
    .eq('test_method_id', testMethodId)
    .eq('panel_code', panelCode)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching test panel by code:', error);
    throw error;
  }

  return data;
};

export const insertBulkTestPanels = async (panels: TestPanelInsert[]): Promise<void> => {
  const { error } = await supabase
    .from('test_panels')
    .upsert(panels, { onConflict: 'test_method_id,panel_code' });

  if (error) {
    console.error('Error inserting bulk test panels:', error);
    throw error;
  }
};