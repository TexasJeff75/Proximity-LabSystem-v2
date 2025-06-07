import React, { useState } from 'react';
import { XIcon, UploadIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { importTestMethodsAndPanels, ImportResult } from '../utils/dataImporter';

interface TestMethodImporterProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const TestMethodImporter: React.FC<TestMethodImporterProps> = ({ onClose, onSuccess }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const result = await importTestMethodsAndPanels(text);
      setImportResult(result);
      
      if (result.success) {
        // Auto-close after successful import
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        testMethodsCount: 0,
        testPanelsCount: 0
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Import Test Methods & Panels</h3>
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
              Upload Tab-Separated File
            </label>
            <input
              type="file"
              accept=".txt,.tsv,.csv"
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
              Expected format: Organization Code, Test Method Code, Test Method Name, Panel Code, Panel Name (tab-separated)
            </p>
          </div>
          
          {isImporting && (
            <div className="flex items-center space-x-2 text-blue-600">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Importing test methods and panels...</span>
            </div>
          )}
          
          {importResult && (
            <div className={`p-4 rounded-lg ${importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start space-x-2">
                {importResult.success ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertCircleIcon className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${importResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {importResult.message}
                  </p>
                  
                  {importResult.success && (
                    <div className="mt-2 text-sm text-green-700">
                      <p>• Test Methods: {importResult.testMethodsCount}</p>
                      <p>• Test Panels: {importResult.testPanelsCount}</p>
                    </div>
                  )}
                  
                  {importResult.errors && importResult.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-yellow-800">Warnings:</p>
                      <ul className="text-xs text-yellow-700 mt-1 ml-4 list-disc max-h-32 overflow-y-auto">
                        {importResult.errors.slice(0, 10).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                        {importResult.errors.length > 10 && (
                          <li>... and {importResult.errors.length - 10} more warnings</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Import Instructions:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• File should contain tab-separated values</li>
              <li>• First row should be headers (will be skipped)</li>
              <li>• Organization codes must match existing organizations</li>
              <li>• Test methods will be created with enhanced metadata</li>
              <li>• Panels will be automatically associated with test methods</li>
              <li>• Duplicate test methods will be updated (upsert)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};