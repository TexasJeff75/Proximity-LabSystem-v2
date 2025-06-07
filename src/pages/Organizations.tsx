import React, { useState, useEffect } from 'react';
import { SearchIcon, PlusIcon, BuildingIcon, MapPinIcon, UserIcon, StethoscopeIcon, PhoneIcon, MailIcon, EditIcon, TrashIcon, UsersIcon, RefreshCwIcon, XIcon, SaveIcon } from 'lucide-react';
import { fetchOrganizations, Organization, updateOrganization } from '../services/organizationService';

interface EditingOrganization extends Organization {
  isEditing?: boolean;
}

export function Organizations() {
  const [organizations, setOrganizations] = useState<EditingOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Organization>>({});
  const [saving, setSaving] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const data = await fetchOrganizations();
      setOrganizations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrganizations = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    org.org_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (org.medical_director && org.medical_director.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (org.clia && org.clia.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination for organizations
  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrganizations = filteredOrganizations.slice(startIndex, endIndex);

  const handleEdit = (org: Organization) => {
    setEditingId(org.id);
    setEditForm({
      name: org.name,
      medical_director: org.medical_director || '',
      clia: org.clia || '',
      street: org.street || '',
      city: org.city || '',
      state: org.state || '',
      zip: org.zip || '',
      phone: org.phone || '',
      fax: org.fax || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (orgId: string) => {
    try {
      setSaving(true);
      await updateOrganization(orgId, editForm);
      
      // Update the local state
      setOrganizations(prev => prev.map(org => 
        org.id === orgId 
          ? { ...org, ...editForm, updated_at: new Date().toISOString() }
          : org
      ));
      
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update organization');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Organization, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value || null
    }));
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
        <p className="text-red-800">Error: {error}</p>
        <button 
          onClick={loadOrganizations}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Organization Management
            </h1>
            <p className="text-gray-600">
              Manage organizations and their information
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={loadOrganizations}
              disabled={loading}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
              <PlusIcon className="h-4 w-4" />
              <span>Add Organization</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex space-x-4 mt-6">
          <div className="relative flex-1">
            <SearchIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search organizations by name, code, medical director, or CLIA..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Organizations</h2>
            <span className="text-sm text-gray-500">
              {filteredOrganizations.length} of {organizations.length} organizations
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medical Director
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CLIA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Street
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zip
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fax
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrganizations.map(org => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <BuildingIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        {editingId === org.id ? (
                          <input
                            type="text"
                            value={editForm.name || ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1 w-full"
                            placeholder="Organization name"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">
                            {org.name}
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          Code: {org.org_code}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === org.id ? (
                      <input
                        type="text"
                        value={editForm.medical_director || ''}
                        onChange={(e) => handleInputChange('medical_director', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="Medical director"
                      />
                    ) : (
                      org.medical_director || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === org.id ? (
                      <input
                        type="text"
                        value={editForm.clia || ''}
                        onChange={(e) => handleInputChange('clia', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="CLIA"
                      />
                    ) : (
                      org.clia || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === org.id ? (
                      <input
                        type="text"
                        value={editForm.street || ''}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="Street address"
                      />
                    ) : (
                      org.street || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === org.id ? (
                      <input
                        type="text"
                        value={editForm.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="City"
                      />
                    ) : (
                      org.city || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === org.id ? (
                      <input
                        type="text"
                        value={editForm.state || ''}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="State"
                      />
                    ) : (
                      org.state || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === org.id ? (
                      <input
                        type="text"
                        value={editForm.zip || ''}
                        onChange={(e) => handleInputChange('zip', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="ZIP code"
                      />
                    ) : (
                      org.zip || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === org.id ? (
                      <input
                        type="text"
                        value={editForm.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="Phone number"
                      />
                    ) : (
                      org.phone || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === org.id ? (
                      <input
                        type="text"
                        value={editForm.fax || ''}
                        onChange={(e) => handleInputChange('fax', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="Fax number"
                      />
                    ) : (
                      org.fax || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {editingId === org.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(org.id)}
                            disabled={saving}
                            className="bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center space-x-1 disabled:opacity-50"
                          >
                            <SaveIcon className="h-4 w-4" />
                            <span>{saving ? 'Saving...' : 'Save'}</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={saving}
                            className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
                          >
                            <XIcon className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(org)}
                            className="bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-1"
                          >
                            <EditIcon className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button className="bg-red-100 text-red-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-200">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty State */}
          {filteredOrganizations.length === 0 && (
            <div className="text-center py-12">
              <BuildingIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No organizations found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {organizations.length === 0 
                  ? 'Get started by adding your first organization.' 
                  : 'Try adjusting your search terms.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredOrganizations.length)}</span> of{' '}
                  <span className="font-medium">{filteredOrganizations.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Previous
                  </button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}