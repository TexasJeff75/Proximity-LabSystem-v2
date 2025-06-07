import React, { useState, useEffect } from 'react';
import { XIcon, SaveIcon, AlertCircleIcon } from 'lucide-react';
import { TestMethodWithPanels, updateTestMethod } from '../services/testMethodService';
import { fetchOrganizations, Organization } from '../services/organizationService';

interface TestMethodEditSlideOutProps {
  testMethod: TestMethodWithPanels;
  onSave: (updatedMethod: TestMethodWithPanels) => void;
  onClose: () => void;
}

export const TestMethodEditSlideOut: React.FC<TestMethodEditSlideOutProps> = ({
  testMethod,
  onSave,
  onClose
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: testMethod.name,
    description: testMethod.description || '',
    category: testMethod.category,
    max_batch_size: testMethod.max_batch_size || 24,
    processing_time: testMethod.processing_time || '',
    status: testMethod.status || 'Active',
    required_equipment: testMethod.required_equipment?.join(', ') || '',
    protocols: testMethod.protocols?.join(', ') || '',
    regulatory_requirements: testMethod.regulatory_requirements?.join(', ') || '',
    quality_controls: testMethod.quality_controls?.join(', ') || ''
  });

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const data = await fetchOrganizations();
      setOrganizations(data);
    } catch (err) {
      console.error('Failed to load organizations:', err);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.name.trim() || !formData.category.trim()) {
        setError('Name and category are required');
        return;
      }

      // Convert comma-separated strings to arrays
      const updates = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        category: formData.category.trim(),
        max_batch_size: formData.max_batch_size,
        processing_time: formData.processing_time.trim() || null,
        status: formData.status as 'Active' | 'Inactive' | 'Draft',
        required_equipment: formData.required_equipment 
          ? formData.required_equipment.split(',').map(item => item.trim()).filter(Boolean)
          : [],
        protocols: formData.protocols 
          ? formData.protocols.split(',').map(item => item.trim()).filter(Boolean)
          : [],
        regulatory_requirements: formData.regulatory_requirements 
          ? formData.regulatory_requirements.split(',').map(item => item.trim()).filter(Boolean)
          : [],
        quality_controls: formData.quality_controls 
          ? formData.quality_controls.split(',').map(item => item.trim()).filter(Boolean)
          : []
      };

      const updatedMethod = await updateTestMethod(testMethod.id, updates);
      
      // Merge with existing test_panels data
      const updatedMethodWithPanels: TestMethodWithPanels = {
        ...updatedMethod,
        test_panels: testMethod.test_panels
      };

      onSave(updatedMethodWithPanels);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save test method');
    } finally {
      setLoading(false);
    }
  };

  const getOrganizationName = () => {
    return organizations.find(org => org.id === testMethod.organization_id)?.name || 'Unknown Organization';
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-hidden z-50">
      <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Edit Test Method</h2>
                <p className="text-sm text-gray-500">{getOrganizationName()}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 flex items-start space-x-2">
                <AlertCircleIcon className="h-5 w-5 text-red-400 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Test Method Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter test method name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter test method description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select category</option>
                        <option value="Molecular">Molecular</option>
                        <option value="Toxicology">Toxicology</option>
                        <option value="Hematology">Hematology</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Microbiology">Microbiology</option>
                        <option value="Specimen Testing">Specimen Testing</option>
                        <option value="General">General</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Processing Configuration */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Processing Configuration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Batch Size
                    </label>
                    <input
                      type="number"
                      value={formData.max_batch_size}
                      onChange={(e) => handleInputChange('max_batch_size', parseInt(e.target.value) || 24)}
                      min="1"
                      max="384"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Processing Time
                    </label>
                    <input
                      type="text"
                      value={formData.processing_time}
                      onChange={(e) => handleInputChange('processing_time', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 2-4 hours"
                    />
                  </div>
                </div>
              </div>

              {/* Equipment and Protocols */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Equipment and Protocols</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Required Equipment
                    </label>
                    <input
                      type="text"
                      value={formData.required_equipment}
                      onChange={(e) => handleInputChange('required_equipment', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter equipment names separated by commas"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple items with commas</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Protocols
                    </label>
                    <input
                      type="text"
                      value={formData.protocols}
                      onChange={(e) => handleInputChange('protocols', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter protocol names separated by commas"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple items with commas</p>
                  </div>
                </div>
              </div>

              {/* Compliance and Quality */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Compliance and Quality</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Regulatory Requirements
                    </label>
                    <input
                      type="text"
                      value={formData.regulatory_requirements}
                      onChange={(e) => handleInputChange('regulatory_requirements', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., CLIA, FDA, ISO 15189"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple items with commas</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quality Controls
                    </label>
                    <input
                      type="text"
                      value={formData.quality_controls}
                      onChange={(e) => handleInputChange('quality_controls', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Daily QC, Calibration Check"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple items with commas</p>
                  </div>
                </div>
              </div>

              {/* Test Panels Information */}
              {testMethod.test_panels && testMethod.test_panels.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Associated Test Panels</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-2">
                      {testMethod.test_panels.map((panel, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-white rounded border">
                          <div>
                            <span className="font-medium text-sm text-gray-900">{panel.name}</span>
                            <span className="text-xs text-gray-500 ml-2">({panel.panel_code})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Panel management will be available in a future update
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <SaveIcon className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};