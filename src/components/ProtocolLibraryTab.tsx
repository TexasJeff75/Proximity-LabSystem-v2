import React from 'react';
import { PlusIcon, EditIcon, CopyIcon, FileTextIcon } from 'lucide-react';

const availableProtocols = [
  {
    id: 'P001',
    name: 'Complete Blood Count Protocol',
    description: 'Automated CBC analysis with differential',
    testTypes: ['Complete Blood Count'],
    duration: '20 min',
    robotCompatibility: ['OT2-001', 'OT2-002', 'FLEX-001'],
    protocolType: 'testing',
    plateFormat: '384-well',
    sampleCapacity: 24
  },
  {
    id: 'P002',
    name: 'Lipid Analysis Protocol',
    description: 'Comprehensive lipid panel processing',
    testTypes: ['Lipid Panel'],
    duration: '25 min',
    robotCompatibility: ['OT2-002', 'FLEX-001'],
    protocolType: 'testing',
    plateFormat: '384-well',
    sampleCapacity: 36
  },
  {
    id: 'P003',
    name: 'DNA Extraction Protocol',
    description: 'Automated DNA extraction from blood samples',
    testTypes: ['DNA Extraction', 'Blood Analysis'],
    duration: '45 min',
    robotCompatibility: ['OT2-001', 'OT2-002'],
    protocolType: 'extraction',
    plateFormat: '96-well',
    sampleCapacity: 24
  },
  {
    id: 'P004',
    name: 'PCR Setup Protocol',
    description: 'Automated PCR reaction setup with master mix',
    testTypes: ['PCR', 'DNA Amplification'],
    duration: '30 min',
    robotCompatibility: ['OT2-002'],
    protocolType: 'pcr',
    plateFormat: '96-well',
    sampleCapacity: 96
  },
  {
    id: 'P005',
    name: 'ELISA Plate Setup',
    description: 'Automated ELISA plate preparation and sample loading',
    testTypes: ['ELISA', 'Immunoassay'],
    duration: '60 min',
    robotCompatibility: ['OT2-001', 'OT2-002', 'FLEX-001'],
    protocolType: 'immunoassay',
    plateFormat: '96-well',
    sampleCapacity: 96
  },
  {
    id: 'P006',
    name: 'Serial Dilution Protocol',
    description: 'Automated serial dilutions for standard curves',
    testTypes: ['Dilution Series', 'Standard Curve'],
    duration: '25 min',
    robotCompatibility: ['OT2-001', 'OT2-002'],
    protocolType: 'dilution',
    plateFormat: '48-well',
    sampleCapacity: 48
  }
];

export const ProtocolLibraryTab: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Protocol Library
          </h2>
          <p className="text-gray-600">
            Design, manage, and assign protocols for automated testing
          </p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-blue-700 shadow-sm transition-all duration-200">
          <PlusIcon className="h-5 w-5" />
          <span className="font-medium">Design New Protocol</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {availableProtocols.map(protocol => (
          <div key={protocol.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <FileTextIcon className="h-7 w-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {protocol.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500">{protocol.id}</p>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">
                      {protocol.plateFormat}
                    </span>
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 font-medium">
                {protocol.duration}
              </span>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {protocol.description}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <span className="text-sm font-semibold text-gray-700 mb-2 block">
                  Compatible Test Types:
                </span>
                <div className="flex flex-wrap gap-2">
                  {protocol.testTypes.map(testType => (
                    <span key={testType} className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                      {testType}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-sm font-semibold text-gray-700 mb-2 block">
                  Robot Compatibility:
                </span>
                <div className="flex flex-wrap gap-2">
                  {protocol.robotCompatibility.map(robot => (
                    <span key={robot} className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium">
                      {robot}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Sample Capacity:</span>
                  <span className="font-medium text-gray-900 ml-2">{protocol.sampleCapacity}</span>
                </div>
                <div>
                  <span className="text-gray-500">Protocol Type:</span>
                  <span className="font-medium text-gray-900 ml-2 capitalize">{protocol.protocolType}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all duration-200">
                View Details
              </button>
              <button className="bg-gray-100 text-gray-700 py-3 px-4 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2">
                <EditIcon className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button className="bg-gray-100 text-gray-700 py-3 px-4 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all duration-200">
                <CopyIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};