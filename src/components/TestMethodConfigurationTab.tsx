import React, { useState, useEffect } from 'react';
import { PlusIcon, EditIcon, SaveIcon, XIcon, SettingsIcon, TestTubeIcon, ClockIcon, UsersIcon, AlertCircleIcon, UploadIcon } from 'lucide-react';
import { fetchTestMethodsWithPanels, TestMethodWithPanels, updateTestMethod, deleteTestMethod } from '../services/testMethodService';
import { fetchOrganizations, Organization } from '../services/organizationService';
import { TestMethodEditSlideOut } from './TestMethodEditSlideOut';

interface TestMethodConfigurationTabProps {
  onImportClick: () => void;
}

export const TestMethodConfigurationTab: React.FC<TestMethodConfigurationTabProps> = ({ onImportClick }) => {
  const [testMethods, setTestMethods] = useState<TestMethodWithPanels[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMethod, setEditingMethod] = useState<TestMethodWithPanels | null>(null);
  const [showNewMethodModal, setShowNewMethodModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<string>('All');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [testMethodsData, organizationsData] = await Promise.all([
        fetchTestMethodsWithPanels(),
        fetchOrganizations()
      ]);
      setTestMethods(testMethodsData);
      setOrganizations(organizationsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filteredTestMethods = selectedOrganization === 'All' 
    ? testMethods 
    : testMethods.filter(tm => tm.organization_id === selectedOrganization);

  const getOrganizationName = (organizationId: string) => {
    return organizations.find(org => org.id === organizationId)?.name || 'Unknown Organization';
  };

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
      case 'Molecular':
        return 'bg-purple-100 text-purple-800';
      case 'Toxicology':
        return 'bg-orange-100 text-orange-800';
      case 'Hematology':
        return 'bg-red-100 text-red-800';
      case 'Chemistry':
        return 'bg-blue-100 text-blue-800';
      case 'Microbiology':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (method: TestMethodWithPanels) => {
    setEditingMethod(method);
  };

  const handleSaveMethod = (updatedMethod: TestMethodWithPanels) => {
    setTestMethods(prev => prev.map(tm => 
      tm.id === updatedMethod.id ? updatedMethod : tm
    ));
    setEditingMethod(null);
  };

  const handleCloseEdit = () => {
    setEditingMethod(null);
  };

  const handleDeleteMethod = async (id: string) => {
    try {
      await deleteTestMethod(id);
      setTestMethods(prev => prev.filter(tm => tm.id !== id));
      setEditingMethod(null); // Close the slide-out after deletion
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete test method');
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
        <button 
          onClick={loadData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
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
          <div className="flex space-x-3">
            <select
              value={selectedOrganization}
              onChange={(e) => setSelectedOrganization(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Organizations</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
            <button
              onClick={onImportClick}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
            >
              <UploadIcon className="h-4 w-4" />
              <span>Import Test Methods</span>
            </button>
            <button
              onClick={() => setShowNewMethodModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4" />
              <span>New Test Method</span>
            </button>
          </div>
        </div>

        {/* Test Methods Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max Batch Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processing Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Panels
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTestMethods.map(method => (
                <tr key={method.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <TestTubeIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {method.name}
                        </div>
                        {method.description && (
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {method.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getOrganizationName(method.organization_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(method.category)}`}>
                      {method.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <UsersIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {method.max_batch_size || 24} samples
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {method.processing_time || 'Not specified'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(method.status || 'Active')}`}>
                      {method.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {method.test_panels && method.test_panels.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {method.test_panels.slice(0, 2).map((panel, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded">
                            {panel.panel_code}
                          </span>
                        ))}
                        {method.test_panels.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            +{method.test_panels.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No panels</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(method)}
                        className="bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
                      >
                        <EditIcon className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                      <button className="bg-gray-100 text-gray-700 py-1 px-2 rounded text-sm hover:bg-gray-200">
                        <SettingsIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredTestMethods.length === 0 && (
            <div className="text-center py-12">
              <TestTubeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No test methods found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {selectedOrganization === 'All' 
                  ? 'Get started by importing test method data or creating your first test method configuration.'
                  : 'No test methods found for the selected organization.'
                }
              </p>
            </div>
          )}
        </div>

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
                  <li>Test panel management</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Slide-out Editor */}
      {editingMethod && (
        <TestMethodEditSlideOut
          testMethod={editingMethod}
          onSave={handleSaveMethod}
          onClose={handleCloseEdit}
          onDelete={handleDeleteMethod}
        />
      )}
    </>
  );
};