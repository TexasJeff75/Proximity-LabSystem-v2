import React, { useState, useEffect } from 'react';
import { PlayIcon, StopCircleIcon, ClockIcon, CheckCircleIcon, AlertCircleIcon, UserIcon, CalendarIcon } from 'lucide-react';
import { BatchWithDetails, fetchBatchesWithDetails } from '../services/batchService';
import { WorkflowExecutionWithDetails, fetchWorkflowExecutionsByBatch } from '../services/workflowService';

interface WorkflowTrackerProps {
  selectedBatchId?: string;
}

export const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({ selectedBatchId }) => {
  const [batches, setBatches] = useState<BatchWithDetails[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<BatchWithDetails | null>(null);
  const [workflowExecutions, setWorkflowExecutions] = useState<WorkflowExecutionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    if (selectedBatchId) {
      const batch = batches.find(b => b.id === selectedBatchId);
      if (batch) {
        setSelectedBatch(batch);
        loadWorkflowExecutions(selectedBatchId);
      }
    }
  }, [selectedBatchId, batches]);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const data = await fetchBatchesWithDetails();
      setBatches(data);
      
      // Auto-select first batch if none selected
      if (!selectedBatch && data.length > 0) {
        setSelectedBatch(data[0]);
        loadWorkflowExecutions(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  const loadWorkflowExecutions = async (batchId: string) => {
    try {
      const executions = await fetchWorkflowExecutionsByBatch(batchId);
      setWorkflowExecutions(executions);
    } catch (err) {
      console.error('Failed to load workflow executions:', err);
    }
  };

  const handleBatchSelect = (batch: BatchWithDetails) => {
    setSelectedBatch(batch);
    loadWorkflowExecutions(batch.id);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'In Progress':
        return <PlayIcon className="h-5 w-5 text-blue-500" />;
      case 'Failed':
        return <AlertCircleIcon className="h-5 w-5 text-red-500" />;
      case 'Pending':
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Pending':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDuration = (startTime: string | null, endTime: string | null): string => {
    if (!startTime) return '-';
    
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}m`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex items-center">
          <AlertCircleIcon className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Batch Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Active Batches</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch) => (
            <div
              key={batch.id}
              onClick={() => handleBatchSelect(batch)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedBatch?.id === batch.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{batch.batch_number}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(batch.status)}`}>
                  {batch.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                {batch.test_methods?.name || 'Unknown Test Method'}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {batch.protocols?.name || 'Unknown Protocol'}
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {batch.created_at ? new Date(batch.created_at).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          ))}
        </div>

        {batches.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>No active batches found</p>
          </div>
        )}
      </div>

      {/* Workflow Steps */}
      {selectedBatch && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Workflow Progress - {selectedBatch.batch_number}
            </h3>
            <div className="text-sm text-gray-600">
              {selectedBatch.sample_count} samples • {selectedBatch.protocols?.name}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {workflowExecutions.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {workflowExecutions.map((execution, index) => (
                  <div key={execution.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(execution.status)}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            Step {execution.protocol_steps?.step_order}: {execution.protocol_steps?.step_name}
                          </h4>
                          {execution.protocol_steps?.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {execution.protocol_steps.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(execution.status)}`}>
                          {execution.status}
                        </span>
                        {execution.protocol_steps?.estimated_duration && (
                          <p className="text-xs text-gray-500 mt-1">
                            Est. {execution.protocol_steps.estimated_duration}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Execution Details */}
                    {(execution.started_at || execution.completed_at) && (
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {execution.started_at && (
                          <div className="flex items-center text-gray-600">
                            <PlayIcon className="h-4 w-4 mr-2 text-green-500" />
                            <div>
                              <p className="font-medium">Started</p>
                              <p className="text-xs">
                                {new Date(execution.started_at).toLocaleString()}
                              </p>
                              {execution.started_by && (
                                <p className="text-xs text-gray-500">by {execution.started_by}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {execution.completed_at && (
                          <div className="flex items-center text-gray-600">
                            <StopCircleIcon className="h-4 w-4 mr-2 text-red-500" />
                            <div>
                              <p className="font-medium">Completed</p>
                              <p className="text-xs">
                                {new Date(execution.completed_at).toLocaleString()}
                              </p>
                              {execution.completed_by && (
                                <p className="text-xs text-gray-500">by {execution.completed_by}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {execution.started_at && (
                          <div className="flex items-center text-gray-600">
                            <ClockIcon className="h-4 w-4 mr-2 text-blue-500" />
                            <div>
                              <p className="font-medium">Duration</p>
                              <p className="text-xs">
                                {calculateDuration(execution.started_at, execution.completed_at)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {execution.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                        <p className="font-medium text-gray-700">Notes:</p>
                        <p className="text-gray-600">{execution.notes}</p>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            execution.status === 'Completed'
                              ? 'bg-green-500'
                              : execution.status === 'In Progress'
                              ? 'bg-blue-500'
                              : execution.status === 'Failed'
                              ? 'bg-red-500'
                              : 'bg-gray-300'
                          }`}
                          style={{
                            width: execution.status === 'Completed' 
                              ? '100%' 
                              : execution.status === 'In Progress' 
                              ? '50%' 
                              : '0%'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <ClockIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p>No workflow steps found for this batch</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};