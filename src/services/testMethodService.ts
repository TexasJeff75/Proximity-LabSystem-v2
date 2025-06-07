import { supabase } from './supabaseClient';
import { Database } from '../types/supabase';

export type TestMethod = Database['public']['Tables']['test_methods']['Row'];
export type TestMethodInsert = Database['public']['Tables']['test_methods']['Insert'];

// Extended test method type that includes panels
export interface TestMethodWithPanels extends TestMethod {
  test_panels?: TestPanel[];
}

export type TestPanel = Database['public']['Tables']['test_panels']['Row'];

export const fetchTestMethods = async (): Promise<TestMethod[]> => {
  const { data, error } = await supabase
    .from('test_methods')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching test methods:', error);
    throw error;
  }

  return data || [];
};

export const fetchTestMethodsWithPanels = async (): Promise<TestMethodWithPanels[]> => {
  const { data, error } = await supabase
    .from('test_methods')
    .select(`
      *,
      test_panels (
        id,
        name,
        description,
        panel_code,
        created_at,
        updated_at
      )
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching test methods with panels:', error);
    throw error;
  }

  return data || [];
};

export const fetchTestMethodsByOrganization = async (organizationId: string): Promise<TestMethodWithPanels[]> => {
  const { data, error } = await supabase
    .from('test_methods')
    .select(`
      *,
      test_panels (
        id,
        name,
        description,
        panel_code,
        created_at,
        updated_at
      )
    `)
    .eq('organization_id', organizationId)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching test methods by organization:', error);
    throw error;
  }

  return data || [];
};

export const insertTestMethod = async (testMethod: TestMethodInsert): Promise<TestMethod> => {
  const { data, error } = await supabase
    .from('test_methods')
    .insert(testMethod)
    .select()
    .single();

  if (error) {
    console.error('Error inserting test method:', error);
    throw error;
  }

  return data;
};

export const updateTestMethod = async (id: string, updates: Partial<TestMethod>): Promise<TestMethod> => {
  const { data, error } = await supabase
    .from('test_methods')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating test method:', error);
    throw error;
  }

  return data;
};

export const deleteTestMethod = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('test_methods')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting test method:', error);
    throw error;
  }
};

export const getTestMethodByName = async (organizationId: string, name: string): Promise<TestMethod | null> => {
  const { data, error } = await supabase
    .from('test_methods')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('name', name)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching test method by name:', error);
    throw error;
  }

  return data;
};