import { supabase } from './supabaseClient';
import { Database } from '../types/supabase';

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];

export const fetchOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('collection_date', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }

  return data || [];
};

export const insertOrder = async (order: OrderInsert): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();

  if (error) {
    console.error('Error inserting order:', error);
    throw error;
  }

  return data;
};

export const insertBulkOrders = async (orders: OrderInsert[]): Promise<void> => {
  const { error } = await supabase
    .from('orders')
    .upsert(orders, { onConflict: 'accession_id' });

  if (error) {
    console.error('Error inserting bulk orders:', error);
    throw error;
  }
};

export const updateOrder = async (id: string, updates: Partial<Order>): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating order:', error);
    throw error;
  }

  return data;
};

export const deleteOrder = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};