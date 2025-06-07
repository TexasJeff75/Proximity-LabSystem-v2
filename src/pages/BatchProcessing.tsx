import React, { useState } from 'react';
import { LayersIcon, FileTextIcon, SettingsIcon, TestTubeIcon } from 'lucide-react';
import { ProtocolLibraryTab } from '../components/ProtocolLibraryTab';
import { TestMethodConfigurationTab } from '../components/TestMethodConfigurationTab';

export function BatchProcessing() {
  const [activeTab, setActiveTab] = useState('orders');

  const tabs = [
    { key: 'orders', label: 'Orders', icon: TestTubeIcon },
    { key: 'protocols', label: 'Protocol Library', icon: FileTextIcon },
    { key: 'test-methods', label: 'Test Method Configuration', icon: SettingsIcon }
  ];

  return (
    <div className="p-6 w-full">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <LayersIcon className="h-8 w-8 text-blue-600 mr-3" />
              Batch Processing
            </h1>
            <p className="text-gray-600">
              Manage bulk operations, protocols, and test method configurations
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
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

      {/* Tab Content */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Bulk Order Operations
            </h2>
            <p className="text-gray-600 mb-4">
              Group and process orders based on test methods and organization requirements.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Coming Soon:</strong> Bulk order processing functionality will allow you to:
              </p>
              <ul className="text-blue-700 text-sm mt-2 ml-4 list-disc">
                <li>Group orders by test method and organization</li>
                <li>Process batches with regulatory compliance</li>
                <li>Monitor batch job progress and status</li>
                <li>Handle errors and exceptions</li>
                <li>Export/import batch data</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'protocols' && <ProtocolLibraryTab />}

      {activeTab === 'test-methods' && <TestMethodConfigurationTab />}
    </div>
  );
}