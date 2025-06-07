import React, { useState } from 'react';
import { PlayIcon, PauseIcon, RefreshCwIcon, AlertCircleIcon, CheckCircleIcon, ClockIcon, SettingsIcon, UploadIcon, DownloadIcon, CpuIcon, ThermometerIcon, DropletIcon, ScanIcon, PrinterIcon } from 'lucide-react';
import { BarcodeScanner } from '../components/BarcodeScanner';
import { BarcodeGenerator } from '../components/BarcodeGenerator';
import { WorkflowTracker } from '../components/WorkflowTracker';

const robots = [{
  id: 'OT2-001',
  name: 'Opentrons OT-2 Alpha',
  status: 'Ready',
  currentProtocol: null,
  lastCalibration: '2024-01-14',
  pipettes: ['P20 Single', 'P300 Multi'],
  temperature: '22°C'
}, {
  id: 'OT2-002',
  name: 'Opentrons OT-2 Beta',
  status: 'Running',
  currentProtocol: 'PCR Setup Protocol',
  progress: 65,
  estimatedTime: '12 min remaining',
  lastCalibration: '2024-01-15',
  pipettes: ['P1000 Single', 'P300 Multi'],
  temperature: '23°C'
}, {
  id: 'FLEX-001',
  name: 'Opentrons Flex Gamma',
  status: 'Maintenance',
  currentProtocol: null,
  lastCalibration: '2024-01-10',
  pipettes: ['Flex 1-Channel 1000μL', 'Flex 8-Channel 50μL'],
  temperature: '21°C'
}];

const protocols = [{
  id: 'P001',
  name: 'DNA Extraction Protocol',
  description: 'Automated DNA extraction from blood samples',
  duration: '45 min',
  samples: 24,
  status: 'Active',
  lastRun: '2024-01-15'
}, {
  id: 'P002',
  name: 'PCR Setup Protocol',
  description: 'Automated PCR reaction setup with master mix',
  duration: '30 min',
  samples: 96,
  status: 'Running',
  lastRun: '2024-01-15'
}, {
  id: 'P003',
  name: 'ELISA Plate Setup',
  description: 'Automated ELISA plate preparation and sample loading',
  duration: '60 min',
  samples: 96,
  status: 'Active',
  lastRun: '2024-01-14'
}, {
  id: 'P004',
  name: 'Serial Dilution Protocol',
  description: 'Automated serial dilutions for standard curves',
  duration: '25 min',
  samples: 48,
  status: 'Draft',
  lastRun: '2024-01-12'
}];

const runHistory = [{
  id: 'R001',
  protocol: 'DNA Extraction Protocol',
  robot: 'OT2-001',
  startTime: '2024-01-15 09:30',
  duration: '43 min',
  status: 'Completed',
  samples: 24
}, {
  id: 'R002',
  protocol: 'PCR Setup Protocol',
  robot: 'OT2-002',
  startTime: '2024-01-15 11:15',
  duration: 'In Progress',
  status: 'Running',
  samples: 96
}, {
  id: 'R003',
  protocol: 'ELISA Plate Setup',
  robot: 'OT2-001',
  startTime: '2024-01-14 14:20',
  duration: '58 min',
  status: 'Completed',
  samples: 96
}, {
  id: 'R004',
  protocol: 'Serial Dilution Protocol',
  robot: 'FLEX-001',
  startTime: '2024-01-14 10:45',
  duration: '23 min',
  status: 'Completed',
  samples: 48
}];

export function Automation() {
  const [selectedTab, setSelectedTab] = useState('robots');
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showBarcodeGenerator, setShowBarcodeGenerator] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return 'bg-green-100 text-green-800';
      case 'Running':
        return 'bg-blue-100 text-blue-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Error':
        return 'bg-red-100 text-red-800';
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ready':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'Running':
        return <PlayIcon className="h-4 w-4" />;
      case 'Maintenance':
        return <AlertCircleIcon className="h-4 w-4" />;
      case 'Error':
        return <AlertCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleScanSuccess = (result: any) => {
    setScanResult(result);
    // Auto-close scanner after successful scan
    setTimeout(() => {
      setShowBarcodeScanner(false);
    }, 2000);
  };

  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Laboratory Automation
            </h1>
            <p className="text-gray-600">
              Manage Opentrons robots, protocols, and automated workflows
            </p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowBarcodeScanner(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
            >
              <ScanIcon className="h-4 w-4" />
              <span>Scan Barcode</span>
            </button>
            <button 
              onClick={() => setShowBarcodeGenerator(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700"
            >
              <PrinterIcon className="h-4 w-4" />
              <span>Generate Barcodes</span>
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
              <UploadIcon className="h-4 w-4" />
              <span>Upload Protocol</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
              <PlayIcon className="h-4 w-4" />
              <span>Start Run</span>
            </button>
          </div>
        </div>

        {/* Recent Scan Result */}
        {scanResult && (
          <div className={`mb-4 p-3 rounded-lg border ${
            scanResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {scanResult.success ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircleIcon className="h-5 w-5 text-red-500" />
              )}
              <p className={`text-sm font-medium ${
                scanResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                Last Scan: {scanResult.message}
              </p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'robots', label: 'Robots', icon: CpuIcon },
              { key: 'protocols', label: 'Protocols', icon: ClockIcon },
              { key: 'workflow', label: 'Workflow Tracking', icon: RefreshCwIcon },
              { key: 'history', label: 'Run History', icon: RefreshCwIcon }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Robots Tab */}
      {selectedTab === 'robots' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {robots.map(robot => (
            <div key={robot.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CpuIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {robot.name}
                    </h3>
                    <p className="text-sm text-gray-500">{robot.id}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full ${getStatusColor(robot.status)}`}>
                  {getStatusIcon(robot.status)}
                  <span>{robot.status}</span>
                </span>
              </div>

              {robot.status === 'Running' && robot.currentProtocol && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-blue-900">
                      {robot.currentProtocol}
                    </span>
                    <span className="text-sm text-blue-700">
                      {robot.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${robot.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    {robot.estimatedTime}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Temperature:</span>
                  <div className="flex items-center space-x-1">
                    <ThermometerIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{robot.temperature}</span>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-gray-500">Pipettes:</span>
                  <div className="mt-1 space-y-1">
                    {robot.pipettes.map((pipette, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <DropletIcon className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-700 text-xs">{pipette}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last Calibration:</span>
                  <span className="text-gray-900">{robot.lastCalibration}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex space-x-2">
                {robot.status === 'Running' ? (
                  <>
                    <button className="flex-1 bg-yellow-100 text-yellow-800 py-2 px-3 rounded-lg text-sm font-medium hover:bg-yellow-200 flex items-center justify-center space-x-1">
                      <PauseIcon className="h-4 w-4" />
                      <span>Pause</span>
                    </button>
                    <button className="flex-1 bg-red-100 text-red-800 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-200 flex items-center justify-center space-x-1">
                      <div className="h-4 w-4" />
                      <span>Stop</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center space-x-1">
                      <PlayIcon className="h-4 w-4" />
                      <span>Start</span>
                    </button>
                    <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200">
                      <SettingsIcon className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Protocols Tab */}
      {selectedTab === 'protocols' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Protocol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Samples
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Run
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {protocols.map(protocol => (
                  <tr key={protocol.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {protocol.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {protocol.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {protocol.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {protocol.samples}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(protocol.status)}`}>
                        {protocol.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {protocol.lastRun}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Run
                      </button>
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        Edit
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <DownloadIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Workflow Tracking Tab */}
      {selectedTab === 'workflow' && (
        <WorkflowTracker />
      )}

      {/* Run History Tab */}
      {selectedTab === 'history' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Run ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Protocol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Robot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Samples
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {runHistory.map(run => (
                  <tr key={run.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {run.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {run.protocol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {run.robot}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {run.startTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {run.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(run.status)}`}>
                        {run.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {run.samples}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        View Log
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Export
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <BarcodeScanner
          onClose={() => setShowBarcodeScanner(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}

      {/* Barcode Generator Modal */}
      {showBarcodeGenerator && (
        <BarcodeGenerator
          onClose={() => setShowBarcodeGenerator(false)}
        />
      )}
    </div>
  );
}