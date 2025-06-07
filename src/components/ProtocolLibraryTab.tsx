import React, { useState, useEffect } from 'react';
import { PlusIcon, EditIcon, CopyIcon, FileTextIcon, AlertCircleIcon, SaveIcon, XIcon, TrashIcon } from 'lucide-react';
import { fetchProtocolsWithTestMethods, ProtocolWithTestMethods, insertProtocol, updateProtocol, deleteProtocol, ProtocolInsert } from '../services/protocolService';

interface EditingProtocol extends ProtocolWithTestMethods {
  isEditing?: boolean;
  isNew?: boolean;
}

export const ProtocolLibraryTab: React.FC = () => {
  const [protocols, setProtocols] = useState<EditingProtocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewProtocolModal, setShowNewProtocolModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadProtocols();
  }, []);

  const loadProtocols = async () => {
    try {
      setLoading(true);
      const data = await fetchProtocolsWithTestMethods();
      setProtocols(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load protocols');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    const newProtocol: EditingProtocol = {
      id: `new-${Date.now()}`,
      name: '',
      description: '',
      duration: '',
      robot_compatibility: [],
      protocol_type: '',
      plate_format: '',
      sample_capacity: null,
      created_at: null,
      updated_at: null,
      test_methods: [],
      isEditing: true,
      isNew: true
    };
    setProtocols([newProtocol, ...protocols]);
    setEditingId(newProtocol.id);
  };

  const handleEdit = (protocolId: string) => {
    setProtocols(protocols.map(protocol => 
      protocol.id === protocolId 
        ? { ...protocol, isEditing: true }
        : { ...protocol, isEditing: false }
    ));
    setEditingId(protocolId);
  };

  const handleCancel = (protocolId: string) => {
    if (protocols.find(protocol => protocol.id === protocolId)?.isNew) {
      // Remove new protocol if cancelled
      setProtocols(protocols.filter(protocol => protocol.id !== protocolId));
    } else {
      // Reset editing state
      setProtocols(protocols.map(protocol => 
        protocol.id === protocolId 
          ? { ...protocol, isEditing: false }
          : protocol
      ));
    }
    setEditingId(null);
  };

  const handleSave = async (protocolId: string) => {
    const protocol = protocols.find(p => p.id === protocolId);
    if (!protocol) return;

    // Validate required fields
    if (!protocol.name.trim()) {
      setError('Protocol name is required');
      return;
    }

    try {
      setSaving(protocolId);
      setError(null);

      if (protocol.isNew) {
        // Create new protocol
        const protocolData: ProtocolInsert = {
          name: protocol.name.trim(),
          description: protocol.description?.trim() || null,
          duration: protocol.duration?.trim() || null,
          robot_compatibility: protocol.robot_compatibility || [],
          protocol_type: protocol.protocol_type?.trim() || null,
          plate_format: protocol.plate_format?.trim() || null,
          sample_capacity: protocol.sample_capacity
        };

        const newProtocol = await insertProtocol(protocolData);
        
        // Replace the temporary protocol with the real one
        setProtocols(protocols.map(p => 
          p.id === protocolId 
            ? { ...newProtocol, test_methods: [], isEditing: false }
            : p
        ));
      } else {
        // Update existing protocol
        const updates = {
          name: protocol.name.trim(),
          description: protocol.description?.trim() || null,
          duration: protocol.duration?.trim() || null,
          robot_compatibility: protocol.robot_compatibility || [],
          protocol_type: protocol.protocol_type?.trim() || null,
          plate_format: protocol.plate_format?.trim() || null,
          sample_capacity: protocol.sample_capacity
        };

        const updatedProtocol = await updateProtocol(protocol.id, updates);
        
        setProtocols(protocols.map(p => 
          p.id === protocolId 
            ? { ...updatedProtocol, test_methods: protocol.test_methods, isEditing: false }
            : p
        ));
      }
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save protocol');
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (protocolId: string) => {
    const protocol = protocols.find(p => p.id === protocolId);
    if (!protocol) return;

    if (!confirm(`Are you sure you want to delete "${protocol.name}"?`)) return;

    try {
      setSaving(protocolId);
      await deleteProtocol(protocolId);
      setProtocols(protocols.filter(p => p.id !== protocolId));
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete protocol');
    } finally {
      setSaving(null);
    }
  };

  const handleFieldChange = (protocolId: string, field: keyof ProtocolWithTestMethods, value: any) => {
    setProtocols(protocols.map(protocol => 
      protocol.id === protocolId 
        ? { ...protocol, [field]: value }
        : protocol
    ));
  };

  const handleRobotCompatibilityChange = (protocolId: string, value: string) => {
    const robotList = value.split(',').map(robot => robot.trim()).filter(Boolean);
    handleFieldChange(protocolId, 'robot_compatibility', robotList);
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
          onClick={loadProtocols}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

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
        <button 
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-blue-700 shadow-sm transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5" />
          <span className="font-medium">Design New Protocol</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {protocols.map(protocol => (
          <div key={protocol.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {protocol.isEditing ? (
              // Editing Mode
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Protocol Name *
                  </label>
                  <input
                    type="text"
                    value={protocol.name}
                    onChange={(e) => handleFieldChange(protocol.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter protocol name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={protocol.description || ''}
                    onChange={(e) => handleFieldChange(protocol.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter protocol description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={protocol.duration || ''}
                      onChange={(e) => handleFieldChange(protocol.id, 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 30 min"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sample Capacity
                    </label>
                    <input
                      type="number"
                      value={protocol.sample_capacity || ''}
                      onChange={(e) => handleFieldChange(protocol.id, 'sample_capacity', parseInt(e.target.value) || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 96"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Protocol Type
                    </label>
                    <select
                      value={protocol.protocol_type || ''}
                      onChange={(e) => handleFieldChange(protocol.id, 'protocol_type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select type</option>
                      <option value="testing">Testing</option>
                      <option value="extraction">Extraction</option>
                      <option value="pcr">PCR</option>
                      <option value="immunoassay">Immunoassay</option>
                      <option value="dilution">Dilution</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plate Format
                    </label>
                    <select
                      value={protocol.plate_format || ''}
                      onChange={(e) => handleFieldChange(protocol.id, 'plate_format', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select format</option>
                      <option value="96-well">96-well</option>
                      <option value="384-well">384-well</option>
                      <option value="48-well">48-well</option>
                      <option value="24-well">24-well</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Robot Compatibility
                  </label>
                  <input
                    type="text"
                    value={protocol.robot_compatibility?.join(', ') || ''}
                    onChange={(e) => handleRobotCompatibilityChange(protocol.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., OT2-001, OT2-002, FLEX-001"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple robots with commas</p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleSave(protocol.id)}
                    disabled={saving === protocol.id}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-1"
                  >
                    <SaveIcon className="h-4 w-4" />
                    <span>{saving === protocol.id ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={() => handleCancel(protocol.id)}
                    disabled={saving === protocol.id}
                    className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              // Display Mode
              <>
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
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">
                          {protocol.plate_format || 'No format'}
                        </span>
                        {protocol.duration && (
                          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 font-medium">
                            {protocol.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {protocol.description && (
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {protocol.description}
                  </p>
                )}

                <div className="space-y-4 mb-6">
                  {protocol.robot_compatibility && protocol.robot_compatibility.length > 0 && (
                    <div>
                      <span className="text-sm font-semibold text-gray-700 mb-2 block">
                        Robot Compatibility:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {protocol.robot_compatibility.map(robot => (
                          <span key={robot} className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium">
                            {robot}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {protocol.test_methods && protocol.test_methods.length > 0 && (
                    <div>
                      <span className="text-sm font-semibold text-gray-700 mb-2 block">
                        Associated Test Methods:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {protocol.test_methods.map(testMethod => (
                          <span key={testMethod.id} className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                            {testMethod.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {protocol.sample_capacity && (
                      <div>
                        <span className="text-gray-500">Sample Capacity:</span>
                        <span className="font-medium text-gray-900 ml-2">{protocol.sample_capacity}</span>
                      </div>
                    )}
                    {protocol.protocol_type && (
                      <div>
                        <span className="text-gray-500">Protocol Type:</span>
                        <span className="font-medium text-gray-900 ml-2 capitalize">{protocol.protocol_type}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleEdit(protocol.id)}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all duration-200"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleEdit(protocol.id)}
                    className="bg-gray-100 text-gray-700 py-3 px-4 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2"
                  >
                    <EditIcon className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(protocol.id)}
                    disabled={saving === protocol.id}
                    className="bg-red-100 text-red-700 py-3 px-4 rounded-xl text-sm font-medium hover:bg-red-200 transition-all duration-200 disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {protocols.length === 0 && (
        <div className="text-center py-12">
          <FileTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No protocols found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by designing your first protocol.
          </p>
        </div>
      )}
    </div>
  );
};