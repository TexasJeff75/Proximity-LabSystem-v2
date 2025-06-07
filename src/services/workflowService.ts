import { supabase } from './supabaseClient';
import { Database } from '../types/supabase';

type WorkflowExecution = Database['public']['Tables']['workflow_executions']['Row'];
type WorkflowExecutionInsert = Database['public']['Tables']['workflow_executions']['Insert'];

// Extended workflow execution type that includes related data
export interface WorkflowExecutionWithDetails extends WorkflowExecution {
  protocol_steps?: {
    id: string;
    step_name: string;
    step_order: number;
    description: string | null;
    estimated_duration: string | null;
    start_barcode: string;
    stop_barcode: string;
  } | null;
  batches?: {
    id: string;
    batch_number: string;
    test_method_id: string;
    protocol_id: string;
  } | null;
}

const fetchWorkflowExecutions = async (): Promise<WorkflowExecution[]> => {
  const { data, error } = await supabase
    .from('workflow_executions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching workflow executions:', error);
    throw error;
  }

  return data || [];
};

const fetchWorkflowExecutionsWithDetails = async (): Promise<WorkflowExecutionWithDetails[]> => {
  const { data, error } = await supabase
    .from('workflow_executions')
    .select(`
      *,
      protocol_steps (
        id,
        step_name,
        step_order,
        description,
        estimated_duration,
        start_barcode,
        stop_barcode
      ),
      batches (
        id,
        batch_number,
        test_method_id,
        protocol_id
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching workflow executions with details:', error);
    throw error;
  }

  return data || [];
};

export const fetchWorkflowExecutionsByBatch = async (batchId: string): Promise<WorkflowExecutionWithDetails[]> => {
  const { data, error } = await supabase
    .from('workflow_executions')
    .select(`
      *,
      protocol_steps (
        id,
        step_name,
        step_order,
        description,
        estimated_duration,
        start_barcode,
        stop_barcode
      )
    `)
    .eq('batch_id', batchId)
    .order('protocol_steps.step_order', { ascending: true });

  if (error) {
    console.error('Error fetching workflow executions by batch:', error);
    throw error;
  }

  return data || [];
};

const insertWorkflowExecution = async (execution: WorkflowExecutionInsert): Promise<WorkflowExecution> => {
  const { data, error } = await supabase
    .from('workflow_executions')
    .insert(execution)
    .select()
    .single();

  if (error) {
    console.error('Error inserting workflow execution:', error);
    throw error;
  }

  return data;
};

const updateWorkflowExecution = async (id: string, updates: Partial<WorkflowExecution>): Promise<WorkflowExecution> => {
  const { data, error } = await supabase
    .from('workflow_executions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating workflow execution:', error);
    throw error;
  }

  return data;
};

const deleteWorkflowExecution = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('workflow_executions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting workflow execution:', error);
    throw error;
  }
};

export const startWorkflowStep = async (
  batchId: string, 
  protocolStepId: string, 
  startedBy: string
): Promise<WorkflowExecution> => {
  // Check if execution already exists
  const { data: existing } = await supabase
    .from('workflow_executions')
    .select('*')
    .eq('batch_id', batchId)
    .eq('protocol_step_id', protocolStepId)
    .single();

  if (existing) {
    // Update existing execution
    return updateWorkflowExecution(existing.id, {
      status: 'In Progress',
      started_at: new Date().toISOString(),
      started_by
    });
  } else {
    // Create new execution
    return insertWorkflowExecution({
      batch_id: batchId,
      protocol_step_id: protocolStepId,
      status: 'In Progress',
      started_at: new Date().toISOString(),
      started_by
    });
  }
};

export const stopWorkflowStep = async (
  batchId: string, 
  protocolStepId: string, 
  completedBy: string,
  notes?: string
): Promise<WorkflowExecution> => {
  // Find the execution
  const { data: execution } = await supabase
    .from('workflow_executions')
    .select('*')
    .eq('batch_id', batchId)
    .eq('protocol_step_id', protocolStepId)
    .single();

  if (!execution) {
    throw new Error('Workflow execution not found');
  }

  return updateWorkflowExecution(execution.id, {
    status: 'Completed',
    completed_at: new Date().toISOString(),
    completed_by,
    notes
  });
};

const createWorkflowExecutionsForBatch = async (
  batchId: string, 
  protocolSteps: Array<{ id: string; step_order: number }>
): Promise<void> => {
  const executions = protocolSteps.map(step => ({
    batch_id: batchId,
    protocol_step_id: step.id,
    status: 'Pending' as const
  }));

  const { error } = await supabase
    .from('workflow_executions')
    .insert(executions);

  if (error) {
    console.error('Error creating workflow executions for batch:', error);
    throw error;
  }
};