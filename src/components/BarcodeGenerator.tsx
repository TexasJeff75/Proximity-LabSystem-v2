import React, { useState, useEffect, useRef } from 'react';
import { PrinterIcon, DownloadIcon, XIcon, RefreshCwIcon } from 'lucide-react';
import { generateBarcode, generateBarcodeDataURL, createPrintableBarcodeSheet } from '../utils/barcodeGenerator';
import { fetchProtocolsWithTestMethods, ProtocolWithTestMethods } from '../services/protocolService';
import { fetchProtocolStepsByProtocol } from '../services/protocolStepService';
import { generateBatchNumber } from '../services/batchService';

interface BarcodeGeneratorProps {
  onClose: () => void;
}

export const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({ onClose }) => {
  const [protocols, setProtocols] = useState<ProtocolWithTestMethods[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<string>('');
  const [batchNumber, setBatchNumber] = useState<string>('');
  const [generatedBarcodes, setGeneratedBarcodes] = useState<Array<{ text: string; label: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const barcodeRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});

  useEffect(() => {
    loadProtocols();
    generateNewBatchNumber();
  }, []);

  useEffect(() => {
    if (selectedProtocol && batchNumber) {
      generateBarcodes();
    }
  }, [selectedProtocol, batchNumber]);

  const loadProtocols = async () => {
    try {
      const data = await fetchProtocolsWithTestMethods();
      setProtocols(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load protocols');
    }
  };

  const generateNewBatchNumber = () => {
    setBatchNumber(generateBatchNumber());
  };

  const generateBarcodes = async () => {
    if (!selectedProtocol || !batchNumber) return;

    try {
      setLoading(true);
      setError(null);

      const protocolSteps = await fetchProtocolStepsByProtocol(selectedProtocol);
      const protocol = protocols.find(p => p.id === selectedProtocol);

      const barcodes: Array<{ text: string; label: string }> = [];

      // Add batch barcode
      barcodes.push({
        text: `BATCH_${batchNumber}`,
        label: `Batch ${batchNumber}`
      });

      // Add protocol step barcodes
      protocolSteps.forEach((step) => {
        barcodes.push({
          text: step.start_barcode,
          label: `Start ${step.step_name}`
        });
        barcodes.push({
          text: step.stop_barcode,
          label: `Stop ${step.step_name}`
        });
      });

      setGeneratedBarcodes(barcodes);

      // Generate visual barcodes after a short delay to ensure DOM is ready
      setTimeout(() => {
        barcodes.forEach((barcode, index) => {
          const elementId = `barcode-${index}`;
          try {
            generateBarcode(barcode.text, elementId, {
              width: 2,
              height: 60,
              fontSize: 10,
              margin: 5
            });
          } catch (err) {
            console.error(`Failed to generate barcode for ${barcode.text}:`, err);
          }
        });
      }, 100);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate barcodes');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (generatedBarcodes.length === 0) return;

    const protocol = protocols.find(p => p.id === selectedProtocol);
    const title = `${protocol?.name || 'Protocol'} - Batch ${batchNumber}`;
    
    const printableHTML = createPrintableBarcodeSheet(generatedBarcodes, title);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printableHTML);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    if (generatedBarcodes.length === 0) return;

    const protocol = protocols.find(p => p.id === selectedProtocol);
    const title = `${protocol?.name || 'Protocol'} - Batch ${batchNumber}`;
    
    const printableHTML = createPrintableBarcodeSheet(generatedBarcodes, title);
    
    const blob = new Blob([printableHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barcodes-${batchNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Barcode Generator</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Protocol
              </label>
              <select
                value={selectedProtocol}
                onChange={(e) => setSelectedProtocol(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a protocol</option>
                {protocols.map((protocol) => (
                  <option key={protocol.id} value={protocol.id}>
                    {protocol.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch Number
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter batch number"
                />
                <button
                  onClick={generateNewBatchNumber}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  title="Generate new batch number"
                >
                  <RefreshCwIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          {generatedBarcodes.length > 0 && (
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
              >
                <PrinterIcon className="h-4 w-4" />
                <span>Print Barcodes</span>
              </button>
              <button
                onClick={handleDownload}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
              >
                <DownloadIcon className="h-4 w-4" />
                <span>Download HTML</span>
              </button>
            </div>
          )}

          {/* Generated Barcodes Preview */}
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : generatedBarcodes.length > 0 ? (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Generated Barcodes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedBarcodes.map((barcode, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 text-center">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">{barcode.label}</h5>
                    <canvas
                      id={`barcode-${index}`}
                      ref={(el) => {
                        barcodeRefs.current[`barcode-${index}`] = el;
                      }}
                      className="mx-auto"
                    ></canvas>
                    <p className="text-xs text-gray-500 mt-2 font-mono break-all">
                      {barcode.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : selectedProtocol && batchNumber ? (
            <div className="text-center py-8 text-gray-500">
              <p>No barcodes generated. Please check the protocol configuration.</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Select a protocol and batch number to generate barcodes.</p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Instructions:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Select a protocol to generate workflow barcodes</li>
              <li>• Each protocol step gets a START and STOP barcode</li>
              <li>• The batch barcode identifies the sample batch</li>
              <li>• Print or download the barcode sheet for laboratory use</li>
              <li>• Scan barcodes during workflow execution to track progress</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};