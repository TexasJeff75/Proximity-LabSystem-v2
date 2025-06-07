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

        {/* Responsive Test Methods Grid */}
        <div className="responsive-grid-container">
          {filteredTestMethods.map(method => (
            <div key={method.id} className="responsive-grid-item">
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
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(method.category)}`}>
                        {method.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(method.status || 'Active')}`}>
                        {method.status || 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">{getOrganizationName(method.organization_id)}</p>
                <p className="text-gray-600 text-sm">
                  {method.description}
                </p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <UsersIcon className="h-4 w-4 mr-1" />
                    Max Batch Size:
                  </span>
                  <span className="font-medium text-gray-900">{method.max_batch_size || 24} samples</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Processing Time:
                  </span>
                  <span className="font-medium text-gray-900">{method.processing_time || 'Not specified'}</span>
                </div>

                {method.required_equipment && method.required_equipment.length > 0 && (
                  <div className="text-sm">
                    <span className="text-gray-500 block mb-1">Required Equipment:</span>
                    <div className="flex flex-wrap gap-1">
                      {method.required_equipment.map((equipment, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {equipment}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {method.protocols && method.protocols.length > 0 && (
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
                )}

                {method.regulatory_requirements && method.regulatory_requirements.length > 0 && (
                  <div className="text-sm">
                    <span className="text-gray-500 block mb-1">Regulatory Requirements:</span>
                    <div className="flex flex-wrap gap-1">
                      {method.regulatory_requirements.map((req, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {method.quality_controls && method.quality_controls.length > 0 && (
                  <div className="text-sm">
                    <span className="text-gray-500 block mb-1">Quality Controls:</span>
                    <div className="flex flex-wrap gap-1">
                      {method.quality_controls.map((qc, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                          {qc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {method.test_panels && method.test_panels.length > 0 && (
                  <div className="text-sm">
                    <span className="text-gray-500 block mb-1">Test Panels ({method.test_panels.length}):</span>
                    <div className="flex flex-wrap gap-1">
                      {method.test_panels.slice(0, 3).map((panel, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded">
                          {panel.panel_code}: {panel.name}
                        </span>
                      ))}
                      {method.test_panels.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          +{method.test_panels.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-4 border-t">
                <button
                  onClick={() => handleEdit(method)}
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

      <style jsx>{`
        .responsive-grid-container {
          display: grid;
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          transition: all 0.3s ease;
          
          /* Desktop: 3 columns */
          grid-template-columns: repeat(3, 1fr);
        }

        .responsive-grid-item {
          background: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          height: fit-content;
        }

        .responsive-grid-item:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transform: translateY(-1px);
        }

        /* Tablet: 2 columns */
        @media (min-width: 768px) and (max-width: 1024px) {
          .responsive-grid-container {
            grid-template-columns: repeat(2, 1fr);
            padding: 0 16px;
          }
        }

        /* Mobile: 1 column */
        @media (max-width: 767px) {
          .responsive-grid-container {
            grid-template-columns: 1fr;
            padding: 0 12px;
            gap: 16px;
          }
          
          .responsive-grid-item {
            padding: 12px;
          }
        }

        /* Ensure equal height within rows */
        .responsive-grid-container {
          align-items: start;
        }

        /* Center the grid container */
        .responsive-grid-container {
          width: 100%;
          box-sizing: border-box;
        }

        /* Smooth transitions for layout changes */
        @media (prefers-reduced-motion: no-preference) {
          .responsive-grid-container,
          .responsive-grid-item {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
        }

        /* Additional responsive adjustments */
        @media (max-width: 640px) {
          .responsive-grid-container {
            gap: 12px;
            padding: 0 8px;
          }
        }

        @media (min-width: 1400px) {
          .responsive-grid-container {
            max-width: 1400px;
          }
        }
      `}</style>
    </>
  );
};