import { supabase } from './supabaseClient';
import { Database } from '../types/supabase';

export type Location = Database['public']['Tables']['locations']['Row'];
export type LocationInsert = Database['public']['Tables']['locations']['Insert'];

// Extended location type that includes organization data
export interface LocationWithOrganization extends Location {
  organizations?: {
    id: string;
    org_code: string;
    name: string;
  } | null;
}

export const fetchLocations = async (): Promise<Location[]> => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('location_name', { ascending: true });

  if (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }

  return data || [];
};

export const fetchLocationsWithOrganizations = async (): Promise<LocationWithOrganization[]> => {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      organizations (
        id,
        org_code,
        name
      )
    `)
    .order('location_name', { ascending: true });

  if (error) {
    console.error('Error fetching locations with organizations:', error);
    throw error;
  }

  return data || [];
};

export const fetchLocationsByOrganization = async (organizationId: string): Promise<Location[]> => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('organization_id', organizationId)
    .order('location_name', { ascending: true });

  if (error) {
    console.error('Error fetching locations by organization:', error);
    throw error;
  }

  return data || [];
};

export const insertLocation = async (location: LocationInsert): Promise<Location> => {
  const { data, error } = await supabase
    .from('locations')
    .insert(location)
    .select()
    .single();

  if (error) {
    console.error('Error inserting location:', error);
    throw error;
  }

  return data;
};

export const updateLocation = async (id: string, updates: Partial<Location>): Promise<Location> => {
  const { data, error } = await supabase
    .from('locations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating location:', error);
    throw error;
  }

  return data;
};

export const deleteLocation = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('locations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting location:', error);
    throw error;
  }
};