import React, { useState } from 'react';
import { PlusIcon, EditIcon, SaveIcon, XIcon, SettingsIcon, TestTubeIcon, ClockIcon, UsersIcon } from 'lucide-react';

interface TestMethod {
  id: string;
  name: string;
  description: string;
  category: string;
  maxBatchSize: number;
  processingTime: string;
  requiredEquipment: string[];
  protocols: string[];
  status: 'Active' | 'Inactive' | 'Draft';
  regulatoryRequirements: string[];
  qualityControls: string[];
}

const mockTestMethods: TestMethod[] = [
  {
    id: 'TM001',
    name: 'Complete Blood Count (CBC)',
    description: 'Automated complete blood count analysis with differential',
    category: 'Hematology',
    maxBatchSize: 96,
    processingTime: '2-4 hours',
    requiredEquipment: ['Hematology Analyzer', 'OT2-001'],
    protocols: ['P001'],
    status: 'Active',
    regulatoryRequirements: ['CLIA', 'CAP'],
    qualityControls: ['Daily QC', 'Calibration Check']
  },
  {
    id: 'TM002',
    name: 'Lipid Panel',
    description: 'Comprehensive lipid analysis including cholesterol, triglycerides',
    category: 'Chemistry',
    maxBatchSize: 48,
    processingTime: '4-6 hours',
    requiredEquipment: ['Chemistry Analyzer', 'OT2-002'],
    protocols: ['P002'],
    status: 'Active',
    regulatoryRequirements: ['CLIA', 'FDA'],
    qualityControls: ['Bi-daily QC', 'Linearity Check']
  },
  {
    id: 'TM003',
    name: 'DNA Extraction',
    description: 'Automated DNA extraction from various sample types',
    category: 'Molecular',
    maxBatchSize: 24,
    processingTime: '45 minutes',
    requiredEquipment: ['DNA Extractor', 'OT2-001', 'OT2-002'],
    protocols: ['P003'],
    status: 'Active',
    regulatoryRequirements: ['CLIA', 'ISO 15189'],
    qualityControls: ['Extraction Control', 'Contamination Check']
  },
  {
    id: 'TM004',
    name: 'PCR Analysis',
    description: 'Real-time PCR for pathogen detection and quantification',
    category: 'Molecular',
    maxBatchSize: 96,
    processingTime: '2-3 hours',
    requiredEquipment: ['PCR Machine', 'OT2-002'],
    protocols: ['P004'],
    status: 'Draft',
    regulatoryRequirements: ['CLIA', 'FDA EUA'],
    qualityControls: ['Positive Control', 'Negative Control', 'Internal Control']
  }
];

export const TestMethodConfigurationTab: React.FC = () => {
  const [testMethods, setTestMethods] = useState<TestMethod[]>(mockTestMethods);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewMethodModal, setShowNewMethodModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Hematology':
        return 'bg-red-100 text-red-800';
      case 'Chemistry':
        return 'bg-blue-100 text-blue-800';
      case 'Molecular':
        return 'bg-purple-100 text-purple-800';
      case 'Microbiology':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Test Method Configuration
          </h2>
          <p className="text-gray-600">
            Configure test methods, batch sizes, and processing requirements
          </p>
        </div>
        <button
          onClick={() => setShowNewMethodModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          <span>New Test Method</span>
        </button>
      </div>

      {/* Test Methods Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {testMethods.map(method => (
          <div key={method.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TestTubeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {method.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">{method.id}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(method.category)}`}>
                      {method.category}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(method.status)}`}>
                {method.status}
              </span>
            </div>

            <p className="text-gray-600 mb-4 text-sm">
              {method.description}
            </p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  Max Batch Size:
                </span>
                <span className="font-medium text-gray-900">{method.maxBatchSize} samples</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Processing Time:
                </span>
                <span className="font-medium text-gray-900">{method.processingTime}</span>
              </div>

              <div className="text-sm">
                <span className="text-gray-500 block mb-1">Required Equipment:</span>
                <div className="flex flex-wrap gap-1">
                  {method.requiredEquipment.map((equipment, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {equipment}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm">
                <span className="text-gray-500 block mb-1">Protocols:</span>
                <div className="flex flex-wrap gap-1">
                  {method.protocols.map((protocol, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      {protocol}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm">
                <span className="text-gray-500 block mb-1">Regulatory Requirements:</span>
                <div className="flex flex-wrap gap-1">
                  {method.regulatoryRequirements.map((req, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm">
                <span className="text-gray-500 block mb-1">Quality Controls:</span>
                <div className="flex flex-wrap gap-1">
                  {method.qualityControls.map((qc, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                      {qc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-4 border-t">
              <button
                onClick={() => setEditingId(method.id)}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center space-x-1"
              >
                <EditIcon className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200">
                <SettingsIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {testMethods.length === 0 && (
        <div className="text-center py-12">
          <TestTubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No test methods configured</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first test method configuration.
          </p>
        </div>
      )}

      {/* New Test Method Modal Placeholder */}
      {showNewMethodModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">New Test Method</h3>
              <button
                onClick={() => setShowNewMethodModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Coming Soon:</strong> Test method configuration form will include:
              </p>
              <ul className="text-blue-700 text-sm mt-2 ml-4 list-disc">
                <li>Test method details and description</li>
                <li>Batch size and processing time configuration</li>
                <li>Equipment and protocol assignments</li>
                <li>Regulatory requirement mapping</li>
                <li>Quality control specifications</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};