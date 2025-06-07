import React, { useState, useEffect } from 'react';
import { XIcon, PlusIcon, EditIcon, SaveIcon, TrashIcon, MapPinIcon } from 'lucide-react';
import { fetchLocationsByOrganization, insertLocation, updateLocation, deleteLocation, Location, LocationInsert } from '../services/locationService';

interface LocationsModalProps {
  organizationId: string;
  organizationName: string;
  onClose: () => void;
}

interface EditingLocation extends Location {
  isEditing?: boolean;
  isNew?: boolean;
}

export const LocationsModal: React.FC<LocationsModalProps> = ({
  organizationId,
  organizationName,
  onClose
}) => {
  const [locations, setLocations] = useState<EditingLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLocations();
  }, [organizationId]);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const data = await fetchLocationsByOrganization(organizationId);
      setLocations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    const newLocation: EditingLocation = {
      id: `new-${Date.now()}`,
      organization_id: organizationId,
      location_code: '',
      location_name: '',
      street: null,
      city: null,
      state: null,
      zip: null,
      phone: null,
      fax: null,
      created_at: null,
      updated_at: null,
      isEditing: true,
      isNew: true
    };
    setLocations([newLocation, ...locations]);
  };

  const handleEdit = (locationId: string) => {
    setLocations(locations.map(loc => 
      loc.id === locationId 
        ? { ...loc, isEditing: true }
        : { ...loc, isEditing: false }
    ));
  };

  const handleCancel = (locationId: string) => {
    if (locations.find(loc => loc.id === locationId)?.isNew) {
      // Remove new location if cancelled
      setLocations(locations.filter(loc => loc.id !== locationId));
    } else {
      // Reset editing state
      setLocations(locations.map(loc => 
        loc.id === locationId 
          ? { ...loc, isEditing: false }
          : loc
      ));
    }
  };

  const handleSave = async (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    if (!location) return;

    // Validate required fields
    if (!location.location_code.trim() || !location.location_name.trim()) {
      setError('Location code and name are required');
      return;
    }

    try {
      setSaving(locationId);
      setError(null);

      if (location.isNew) {
        // Create new location
        const locationData: LocationInsert = {
          organization_id: organizationId,
          location_code: location.location_code.trim(),
          location_name: location.location_name.trim(),
          street: location.street?.trim() || null,
          city: location.city?.trim() || null,
          state: location.state?.trim() || null,
          zip: location.zip?.trim() || null,
          phone: location.phone?.trim() || null,
          fax: location.fax?.trim() || null
        };

        const newLocation = await insertLocation(locationData);
        
        // Replace the temporary location with the real one
        setLocations(locations.map(loc => 
          loc.id === locationId 
            ? { ...newLocation, isEditing: false }
            : loc
        ));
      } else {
        // Update existing location
        const updates = {
          location_code: location.location_code.trim(),
          location_name: location.location_name.trim(),
          street: location.street?.trim() || null,
          city: location.city?.trim() || null,
          state: location.state?.trim() || null,
          zip: location.zip?.trim() || null,
          phone: location.phone?.trim() || null,
          fax: location.fax?.trim() || null
        };

        const updatedLocation = await updateLocation(location.id, updates);
        
        setLocations(locations.map(loc => 
          loc.id === locationId 
            ? { ...updatedLocation, isEditing: false }
            : loc
        ));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save location');
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (locationId: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
      setSaving(locationId);
      await deleteLocation(locationId);
      setLocations(locations.filter(loc => loc.id !== locationId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete location');
    } finally {
      setSaving(null);
    }
  };

  const handleFieldChange = (locationId: string, field: keyof Location, value: string) => {
    setLocations(locations.map(loc => 
      loc.id === locationId 
        ? { ...loc, [field]: value }
        : loc
    ));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <MapPinIcon className="h-6 w-6 text-blue-600 mr-2" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Locations</h3>
              <p className="text-sm text-gray-500">{organizationName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Location</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Street
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ZIP
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fax
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {locations.map((location) => (
                  <tr key={location.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {location.isEditing ? (
                        <input
                          type="text"
                          value={location.location_code}
                          onChange={(e) => handleFieldChange(location.id, 'location_code', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Location code"
                          required
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          {location.location_code}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {location.isEditing ? (
                        <input
                          type="text"
                          value={location.location_name}
                          onChange={(e) => handleFieldChange(location.id, 'location_name', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Location name"
                          required
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          {location.location_name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {location.isEditing ? (
                        <input
                          type="text"
                          value={location.street || ''}
                          onChange={(e) => handleFieldChange(location.id, 'street', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Street address"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          {location.street || '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {location.isEditing ? (
                        <input
                          type="text"
                          value={location.city || ''}
                          onChange={(e) => handleFieldChange(location.id, 'city', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="City"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          {location.city || '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {location.isEditing ? (
                        <input
                          type="text"
                          value={location.state || ''}
                          onChange={(e) => handleFieldChange(location.id, 'state', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="State"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          {location.state || '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {location.isEditing ? (
                        <input
                          type="text"
                          value={location.zip || ''}
                          onChange={(e) => handleFieldChange(location.id, 'zip', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="ZIP code"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          {location.zip || '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {location.isEditing ? (
                        <input
                          type="text"
                          value={location.phone || ''}
                          onChange={(e) => handleFieldChange(location.id, 'phone', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Phone number"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          {location.phone || '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {location.isEditing ? (
                        <input
                          type="text"
                          value={location.fax || ''}
                          onChange={(e) => handleFieldChange(location.id, 'fax', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Fax number"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          {location.fax || '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        {location.isEditing ? (
                          <>
                            <button
                              onClick={() => handleSave(location.id)}
                              disabled={saving === location.id}
                              className="bg-green-600 text-white p-1 rounded hover:bg-green-700 disabled:opacity-50"
                              title="Save"
                            >
                              <SaveIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCancel(location.id)}
                              disabled={saving === location.id}
                              className="bg-gray-100 text-gray-700 p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                              title="Cancel"
                            >
                              <XIcon className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(location.id)}
                              className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
                              title="Edit"
                            >
                              <EditIcon className="h-4 w-4" />
                            </button>
                            {!location.isNew && (
                              <button
                                onClick={() => handleDelete(location.id)}
                                disabled={saving === location.id}
                                className="bg-red-100 text-red-700 p-1 rounded hover:bg-red-200 disabled:opacity-50"
                                title="Delete"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {locations.length === 0 && (
              <div className="text-center py-12">
                <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No locations found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new location.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};