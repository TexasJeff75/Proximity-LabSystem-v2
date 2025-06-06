import { supabase } from './supabaseClient';
import { RawOrderData, Sample } from '../types';
import { cleanPatientName } from '../utils/formatters';

/**
 * Fetch orders from Supabase
 * @returns Promise with array of orders
 */
export const fetchOrders = async (): Promise<Sample[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*');
    
    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
    
    // Transform the raw data into the Sample type
    return transformOrdersData(data as RawOrderData[]);
  } catch (error) {
    console.error('Error in fetchOrders:', error);
    throw error;
  }
};

/**
 * Fetch a single order by ID
 * @param id Order ID
 * @returns Promise with order details
 */
export const fetchOrderById = async (id: string): Promise<Sample | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('accession_id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
    
    if (!data) return null;
    
    // Transform the raw data into the Sample type
    const transformedOrders = transformOrdersData([data as RawOrderData]);
    return transformedOrders[0] || null;
  } catch (error) {
    console.error(`Error in fetchOrderById for ${id}:`, error);
    throw error;
  }
};

/**
 * Transform raw order data from Supabase into Sample objects
 * @param rawData Raw order data from Supabase
 * @returns Transformed Sample objects
 */
export const transformOrdersData = (rawData: RawOrderData[]): Sample[] => {
  return rawData.map(order => ({
    id: order.accession_id,
    patientName: cleanPatientName(order.patient_name),
    patientId: `P${order.accession_id.substring(1)}`, // Generate a patient ID based on accession ID
    type: determineSpecimenType(order.order_panels),
    test: order.test_method,
    collectionDate: order.collection_date,
    status: order.status,
    priority: determinePriority(order.status),
    organizationId: `ORG_${order.organization.replace(/\s+/g, '_')}`,
    organizationName: order.organization,
    providerId: `PROV_${order.provider.replace(/\s+/g, '_')}`,
    providerName: order.provider,
    requestDate: order.request_date,
    receivedDate: order.received_date || undefined,
    finalizedDate: order.finalized_date || undefined,
    testMethod: order.test_method,
    orderPanels: order.order_panels,
    location: order.location
  }));
};

/**
 * Determine the specimen type from order panels
 * @param orderPanels Order panels string
 * @returns Specimen type
 */
const determineSpecimenType = (orderPanels: string): string => {
  if (!orderPanels) return 'Unknown';
  
  if (orderPanels.toLowerCase().includes('urine')) {
    return 'Urine';
  } else if (orderPanels.toLowerCase().includes('blood')) {
    return 'Blood';
  } else if (orderPanels.toLowerCase().includes('saliva')) {
    return 'Saliva';
  } else if (orderPanels.toLowerCase().includes('swab')) {
    return 'Swab';
  }
  
  return 'Other';
};

/**
 * Determine priority based on status
 * @param status Order status
 * @returns Priority level
 */
const determinePriority = (status: string): string => {
  if (status === 'Rejected' || status === 'Cancelled') {
    return 'Low';
  } else if (status === 'Pending' || status === 'Pending Received') {
    return 'Normal';
  } else if (status === 'In Progress' || status === 'Prelim' || status === 'Prelim (Review)') {
    return 'High';
  } else if (status === 'Final (Review)') {
    return 'Normal';
  }
  
  return 'Normal';
};

/**
 * Create a new order
 * @param orderData Order data
 * @returns Promise with created order
 */
export const createOrder = async (orderData: Partial<RawOrderData>): Promise<RawOrderData> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }
    
    return data as RawOrderData;
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};

/**
 * Update an existing order
 * @param id Order ID
 * @param orderData Updated order data
 * @returns Promise with updated order
 */
export const updateOrder = async (id: string, orderData: Partial<RawOrderData>): Promise<RawOrderData> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update(orderData)
      .eq('accession_id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating order ${id}:`, error);
      throw error;
    }
    
    return data as RawOrderData;
  } catch (error) {
    console.error(`Error in updateOrder for ${id}:`, error);
    throw error;
  }
};