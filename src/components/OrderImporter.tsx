import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import { insertBulkOrders } from '../services/orderService';
import { parseCSVToOrders } from '../utils/csvParser';

interface OrderImporterProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const OrderImporter: React.FC<OrderImporterProps> = ({ onClose, onSuccess }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus('idle');
    setMessage('');

    try {
      const text = await file.text();
      const parsedOrders = parseCSVToOrders(text);
      
      if (parsedOrders.length === 0) {
        throw new Error('No valid orders found in the CSV file');
      }
      
      // Deduplicate orders based on accession_id
      const orderMap = new Map();
      parsedOrders.forEach(order => {
        orderMap.set(order.accession_id, order);
      });
      
      const uniqueOrders = Array.from(orderMap.values());
      const duplicateCount = parsedOrders.length - uniqueOrders.length;
      
      await insertBulkOrders(uniqueOrders);
      
      setImportStatus('success');
      let successMessage = `Successfully imported ${uniqueOrders.length} orders`;
      if (duplicateCount > 0) {
        successMessage += ` (${duplicateCount} duplicate${duplicateCount > 1 ? 's' : ''} removed)`;
      }
      setMessage(successMessage);
      
      // Auto-close after successful import
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Error importing orders:', error);
      setImportStatus('error');
      setMessage(`Error importing orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Import Orders</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isImporting}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">
              CSV should include: accession_id, status, organization, location, provider, patient_name, request_date, collection_date, test_method, order_panels
            </p>
          </div>
          
          {isImporting && (
            <div className="flex items-center space-x-2 text-blue-600">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Importing orders...</span>
            </div>
          )}
          
          {importStatus === 'success' && (
            <div className="text-green-600 bg-green-50 p-3 rounded-lg">
              {message}
            </div>
          )}
          
          {importStatus === 'error' && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};