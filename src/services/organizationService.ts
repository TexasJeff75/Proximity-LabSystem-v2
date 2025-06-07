import { supabase } from './supabaseClient';
import { Database } from '../types/supabase';

export type Organization = Database['public']['Tables']['organizations']['Row'];
type OrganizationInsert = Database['public']['Tables']['organizations']['Insert'];
type OrgRep = Database['public']['Tables']['org_reps']['Row'];

// Extended organization type that includes org_reps data and counts
export interface OrganizationWithReps extends Organization {
  org_reps?: OrgRep | null;
  location_count?: number;
  contact_count?: number;
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

  // Get location counts for all organizations
  const { data: locationCounts, error: locationError } = await supabase
    .from('locations')
    .select('organization_id')
    .then(({ data, error }) => {
      if (error) throw error;
      
      // Count locations by organization_id
      const counts: Record<string, number> = {};
      data?.forEach(location => {
        counts[location.organization_id] = (counts[location.organization_id] || 0) + 1;
      });
      
      return { data: counts, error: null };
    });

  if (locationError) {
    console.error('Error fetching location counts:', locationError);
  }

  // Get contact counts for all organizations
  const { data: contactCounts, error: contactError } = await supabase
    .from('contacts')
    .select('organization_code')
    .then(({ data, error }) => {
      if (error) throw error;
      
      // Count contacts by organization_code
      const counts: Record<string, number> = {};
      data?.forEach(contact => {
        counts[contact.organization_code] = (counts[contact.organization_code] || 0) + 1;
      });
      
      return { data: counts, error: null };
    });

  if (contactError) {
    console.error('Error fetching contact counts:', contactError);
  }

  // Combine the data with counts
  const organizationsWithCounts = data?.map(org => ({
    ...org,
    location_count: locationCounts?.[org.id] || 0,
    contact_count: contactCounts?.[org.org_code] || 0
  })) || [];

  return organizationsWithCounts;
};

const insertOrganization = async (organization: OrganizationInsert): Promise<Organization> => {
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

const deleteOrganization = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('organizations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting organization:', error);
    throw error;
  }
};

const getOrganizationByCode = async (orgCode: string): Promise<Organization | null> => {
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