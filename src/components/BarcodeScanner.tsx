import React, { useState, useRef, useEffect } from 'react';
import { ScanIcon, XIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import { parseBarcodeAction } from '../utils/barcodeGenerator';
import { getProtocolStepByBarcode } from '../services/protocolStepService';
import { getBatchByNumber } from '../services/batchService';
import { startWorkflowStep, stopWorkflowStep } from '../services/workflowService';

interface BarcodeScannerProps {
  onClose: () => void;
  onScanSuccess?: (result: ScanResult) => void;
}

interface ScanResult {
  barcode: string;
  action: 'START' | 'STOP' | 'BATCH' | 'UNKNOWN';
  stepName?: string;
  batchNumber?: string;
  success: boolean;
  message: string;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onClose, onScanSuccess }) => {
  const [manualInput, setManualInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const processScan = async (barcode: string): Promise<ScanResult> => {
    try {
      setScanning(true);
      setError(null);

      const parsed = parseBarcodeAction(barcode);
      
      if (parsed.action === 'UNKNOWN') {
        return {
          barcode,
          action: 'UNKNOWN',
          success: false,
          message: 'Invalid barcode format'
        };
      }

      if (parsed.action === 'BATCH') {
        // Handle batch barcode scan
        const batch = await getBatchByNumber(parsed.batchNumber!);
        if (!batch) {
          return {
            barcode,
            action: 'BATCH',
            batchNumber: parsed.batchNumber,
            success: false,
            message: `Batch ${parsed.batchNumber} not found`
          };
        }

        return {
          barcode,
          action: 'BATCH',
          batchNumber: parsed.batchNumber,
          success: true,
          message: `Batch ${parsed.batchNumber} loaded successfully`
        };
      }

      if (parsed.action === 'START' || parsed.action === 'STOP') {
        // Handle workflow step barcode scan
        const protocolStep = await getProtocolStepByBarcode(barcode);
        if (!protocolStep) {
          return {
            barcode,
            action: parsed.action,
            stepName: parsed.stepName,
            batchNumber: parsed.batchNumber,
            success: false,
            message: 'Protocol step not found for this barcode'
          };
        }

        // Verify batch exists
        if (parsed.batchNumber) {
          const batch = await getBatchByNumber(parsed.batchNumber);
          if (!batch) {
            return {
              barcode,
              action: parsed.action,
              stepName: parsed.stepName,
              batchNumber: parsed.batchNumber,
              success: false,
              message: `Batch ${parsed.batchNumber} not found`
            };
          }

          // Execute workflow action
          const currentUser = 'Lab Technician'; // In a real app, get from auth context
          
          if (parsed.action === 'START') {
            await startWorkflowStep(batch.id, protocolStep.id, currentUser);
            return {
              barcode,
              action: 'START',
              stepName: protocolStep.step_name,
              batchNumber: parsed.batchNumber,
              success: true,
              message: `Started ${protocolStep.step_name} for batch ${parsed.batchNumber}`
            };
          } else {
            await stopWorkflowStep(batch.id, protocolStep.id, currentUser);
            return {
              barcode,
              action: 'STOP',
              stepName: protocolStep.step_name,
              batchNumber: parsed.batchNumber,
              success: true,
              message: `Completed ${protocolStep.step_name} for batch ${parsed.batchNumber}`
            };
          }
        }
      }

      return {
        barcode,
        action: parsed.action,
        stepName: parsed.stepName,
        batchNumber: parsed.batchNumber,
        success: false,
        message: 'Unable to process barcode'
      };

    } catch (err) {
      console.error('Error processing barcode scan:', err);
      return {
        barcode,
        action: 'UNKNOWN',
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error occurred'
      };
    } finally {
      setScanning(false);
    }
  };

  const handleManualScan = async () => {
    if (!manualInput.trim()) {
      setError('Please enter a barcode');
      return;
    }

    const result = await processScan(manualInput.trim());
    setLastScan(result);
    
    if (result.success) {
      setManualInput('');
      onScanSuccess?.(result);
    } else {
      setError(result.message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualScan();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <ScanIcon className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">Barcode Scanner</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Manual Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scan or Enter Barcode
            </label>
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter barcode manually or scan"
                disabled={scanning}
              />
              <button
                onClick={handleManualScan}
                disabled={scanning || !manualInput.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {scanning ? 'Processing...' : 'Scan'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Focus on this field and scan with a barcode scanner, or type manually
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start space-x-2">
              <AlertCircleIcon className="h-5 w-5 text-red-400 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Last Scan Result */}
          {lastScan && (
            <div className={`border rounded-md p-3 ${
              lastScan.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start space-x-2">
                {lastScan.success ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertCircleIcon className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    lastScan.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {lastScan.message}
                  </p>
                  <div className="mt-1 text-xs text-gray-600">
                    <p><strong>Barcode:</strong> {lastScan.barcode}</p>
                    <p><strong>Action:</strong> {lastScan.action}</p>
                    {lastScan.stepName && <p><strong>Step:</strong> {lastScan.stepName}</p>}
                    {lastScan.batchNumber && <p><strong>Batch:</strong> {lastScan.batchNumber}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Barcode Types:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Batch Barcodes:</strong> Load a specific batch for processing</li>
              <li>• <strong>Start Barcodes:</strong> Begin a protocol step</li>
              <li>• <strong>Stop Barcodes:</strong> Complete a protocol step</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};