import React, { useState } from 'react';
import { insertBulkOrders } from '../services/orderService';
import { parseCSVToOrders } from '../utils/csvParser';

export const OrderImporter: React.FC = () => {
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
      const orders = parseCSVToOrders(text);
      
      if (orders.length === 0) {
        throw new Error('No valid orders found in the CSV file');
      }
      
      await insertBulkOrders(orders);
      
      setImportStatus('success');
      setMessage(`Successfully imported ${orders.length} orders`);
    } catch (error) {
      console.error('Error importing orders:', error);
      setImportStatus('error');
      setMessage(`Error importing orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Import Orders</h2>
      
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
              hover:file:bg-blue-100"
          />
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
  );
};