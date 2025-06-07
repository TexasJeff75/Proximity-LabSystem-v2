import React, { useState, useEffect } from 'react';
import { XIcon, SaveIcon, AlertCircleIcon, TrashIcon, PlusIcon, EditIcon } from 'lucide-react';
import { TestMethodWithPanels, updateTestMethod } from '../services/testMethodService';
import { fetchOrganizations, Organization } from '../services/organizationService';
import { TestPanel, insertTestPanel, updateTestPanel, deleteTestPanel } from '../services/testPanelService';

interface TestMethodEditSlideOutProps {
  testMethod: TestMethodWithPanels;
  onSave: (updatedMethod: TestMethodWithPanels) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
}

interface EditingPanel extends TestPanel {
  isEditing?: boolean;
  isNew?: boolean;
}

export const TestMethodEditSlideOut: React.FC<TestMethodEditSlideOutProps> = ({
  testMethod,
  onSave,
  onClose,
  onDelete
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

  // Panel management state
  const [panels, setPanels] = useState<EditingPanel[]>(testMethod.test_panels || []);
  const [newPanelData, setNewPanelData] = useState({
    name: '',
    panel_code: '',
    description: ''
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

  // Panel management functions
  const handlePanelFieldChange = (panelId: string, field: keyof TestPanel, value: string) => {
    setPanels(prev => prev.map(panel => 
      panel.id === panelId 
        ? { ...panel, [field]: value }
        : panel
    ));
  };

  const handleNewPanelDataChange = (field: keyof typeof newPanelData, value: string) => {
    setNewPanelData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddPanel = () => {
    // Validate new panel data
    if (!newPanelData.name.trim() || !newPanelData.panel_code.trim()) {
      setError('Panel name and code are required');
      return;
    }

    // Check for duplicate panel codes
    const existingCodes = panels.map(p => p.panel_code.toLowerCase());
    if (existingCodes.includes(newPanelData.panel_code.toLowerCase())) {
      setError('Panel code already exists');
      return;
    }

    const newPanel: EditingPanel = {
      id: `new-${Date.now()}`,
      test_method_id: testMethod.id,
      name: newPanelData.name.trim(),
      panel_code: newPanelData.panel_code.trim(),
      description: newPanelData.description.trim() || null,
      created_at: null,
      updated_at: null,
      isEditing: false,
      isNew: true
    };

    setPanels(prev => [...prev, newPanel]);
    setNewPanelData({ name: '', panel_code: '', description: '' });
    setError(null);
  };

  const handleEditPanel = (panelId: string) => {
    setPanels(prev => prev.map(panel => 
      panel.id === panelId 
        ? { ...panel, isEditing: true }
        : { ...panel, isEditing: false }
    ));
  };

  const handleCancelEditPanel = (panelId: string) => {
    if (panels.find(panel => panel.id === panelId)?.isNew) {
      // Remove new panel if cancelled
      setPanels(prev => prev.filter(panel => panel.id !== panelId));
    } else {
      // Reset editing state for existing panels
      setPanels(prev => prev.map(panel => 
        panel.id === panelId 
          ? { ...panel, isEditing: false }
          : panel
      ));
    }
  };

  const handleDeletePanel = (panelId: string) => {
    setPanels(prev => prev.filter(panel => panel.id !== panelId));
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

      // Update test method
      const updatedMethod = await updateTestMethod(testMethod.id, updates);

      // Handle panel operations
      const originalPanels = testMethod.test_panels || [];
      const currentPanels = panels;

      // Identify new panels (those with temporary IDs)
      const newPanels = currentPanels.filter(panel => panel.isNew);
      
      // Identify updated panels (existing panels that have changed)
      const updatedPanels = currentPanels.filter(panel => {
        if (panel.isNew) return false;
        const original = originalPanels.find(op => op.id === panel.id);
        if (!original) return false;
        return original.name !== panel.name || 
               original.panel_code !== panel.panel_code || 
               original.description !== panel.description;
      });

      // Identify deleted panels (original panels not in current panels)
      const deletedPanels = originalPanels.filter(original => 
        !currentPanels.some(current => current.id === original.id)
      );

      // Perform panel operations
      const panelOperations = [];

      // Insert new panels
      for (const panel of newPanels) {
        panelOperations.push(
          insertTestPanel({
            test_method_id: testMethod.id,
            name: panel.name,
            panel_code: panel.panel_code,
            description: panel.description
          })
        );
      }

      // Update existing panels
      for (const panel of updatedPanels) {
        panelOperations.push(
          updateTestPanel(panel.id, {
            name: panel.name,
            panel_code: panel.panel_code,
            description: panel.description
          })
        );
      }

      // Delete removed panels
      for (const panel of deletedPanels) {
        panelOperations.push(deleteTestPanel(panel.id));
      }

      // Wait for all panel operations to complete
      await Promise.all(panelOperations);

      // Fetch updated panels for the response
      const finalPanels = await Promise.all(
        currentPanels
          .filter(panel => !panel.isNew)
          .map(async panel => {
            if (updatedPanels.some(up => up.id === panel.id)) {
              return updateTestPanel(panel.id, {
                name: panel.name,
                panel_code: panel.panel_code,
                description: panel.description
              });
            }
            return panel;
          })
      );

      // Add newly created panels
      for (const panel of newPanels) {
        const createdPanel = await insertTestPanel({
          test_method_id: testMethod.id,
          name: panel.name,
          panel_code: panel.panel_code,
          description: panel.description
        });
        finalPanels.push(createdPanel);
      }

      // Create updated method with refreshed panels
      const updatedMethodWithPanels: TestMethodWithPanels = {
        ...updatedMethod,
        test_panels: finalPanels.filter(Boolean) as TestPanel[]
      };

      onSave(updatedMethodWithPanels);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save test method');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${testMethod.name}"?\n\nThis will permanently delete the test method and all associated panels. This action cannot be undone.`
    );
    
    if (confirmed) {
      onDelete(testMethod.id);
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

              {/* Panel Management */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Test Panels</h3>
                
                {/* Existing Panels */}
                <div className="space-y-3 mb-4">
                  {panels.map((panel) => (
                    <div key={panel.id} className="border border-gray-200 rounded-lg p-3">
                      {panel.isEditing ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Panel Name
                              </label>
                              <input
                                type="text"
                                value={panel.name}
                                onChange={(e) => handlePanelFieldChange(panel.id, 'name', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Panel name"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Panel Code
                              </label>
                              <input
                                type="text"
                                value={panel.panel_code}
                                onChange={(e) => handlePanelFieldChange(panel.id, 'panel_code', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Panel code"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              value={panel.description || ''}
                              onChange={(e) => handlePanelFieldChange(panel.id, 'description', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Panel description"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleCancelEditPanel(panel.id)}
                              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm text-gray-900">{panel.name}</span>
                              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                                {panel.panel_code}
                              </span>
                            </div>
                            {panel.description && (
                              <p className="text-xs text-gray-500 mt-1">{panel.description}</p>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEditPanel(panel.id)}
                              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit panel"
                            >
                              <EditIcon className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeletePanel(panel.id)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Delete panel"
                            >
                              <TrashIcon className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New Panel */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Panel</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Panel Name *
                        </label>
                        <input
                          type="text"
                          value={newPanelData.name}
                          onChange={(e) => handleNewPanelDataChange('name', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter panel name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Panel Code *
                        </label>
                        <input
                          type="text"
                          value={newPanelData.panel_code}
                          onChange={(e) => handleNewPanelDataChange('panel_code', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter panel code"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={newPanelData.description}
                        onChange={(e) => handleNewPanelDataChange('description', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter panel description"
                      />
                    </div>
                    <button
                      onClick={handleAddPanel}
                      disabled={!newPanelData.name.trim() || !newPanelData.panel_code.trim()}
                      className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <PlusIcon className="h-3 w-3" />
                      <span>Add Panel</span>
                    </button>
                  </div>
                </div>

                {panels.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No panels configured. Add panels to organize test components.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <TrashIcon className="h-4 w-4" />
                <span>Delete</span>
              </button>
              
              <div className="flex space-x-3">
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
    </div>
  );
};