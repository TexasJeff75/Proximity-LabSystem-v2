import { supabase } from './supabaseClient';
import { Database } from '../types/supabase';

export type Organization = Database['public']['Tables']['organizations']['Row'];
export type OrganizationInsert = Database['public']['Tables']['organizations']['Insert'];
export type OrgRep = Database['public']['Tables']['org_reps']['Row'];

// Extended organization type that includes org_reps data
export interface OrganizationWithReps extends Organization {
  org_reps?: OrgRep | null;
}

export const fetchOrganizations = async (): Promise<Organization[]> => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }

  return data || [];
};

export const fetchOrganizationsWithReps = async (): Promise<OrganizationWithReps[]> => {
  const { data, error } = await supabase
    .from('organizations')
    .select(`
      *,
      org_reps (
        id,
        sales_rep,
        account_manager,
        sales_executive,
        created_at,
        updated_at
      )
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching organizations with reps:', error);
    throw error;
  }

  return data || [];
};

export const insertOrganization = async (organization: OrganizationInsert): Promise<Organization> => {
  const { data, error } = await supabase
    .from('organizations')
    .insert(organization)
    .select()
    .single();

  if (error) {
    console.error('Error inserting organization:', error);
    throw error;
  }

  return data;
};

export const updateOrganization = async (id: string, updates: Partial<Organization>): Promise<Organization> => {
  const { data, error } = await supabase
    .from('organizations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating organization:', error);
    throw error;
  }

  return data;
};

export const deleteOrganization = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('organizations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting organization:', error);
    throw error;
  }
};

export const getOrganizationByCode = async (orgCode: string): Promise<Organization | null> => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('org_code', orgCode)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching organization by code:', error);
    throw error;
  }

  return data;
};