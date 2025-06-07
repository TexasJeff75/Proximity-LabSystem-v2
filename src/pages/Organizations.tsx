import React, { useState, useEffect } from 'react';
import { SearchIcon, PlusIcon, BuildingIcon, MapPinIcon, UserIcon, StethoscopeIcon, PhoneIcon, MailIcon, EditIcon, TrashIcon, UsersIcon, RefreshCwIcon } from 'lucide-react';
import { fetchOrganizations, Organization } from '../services/organizationService';

// Keep existing mock data for locations, providers, and staff
// These will be used until we implement those tables in Supabase
const locations = [{
  id: 'LOC001',
  name: 'Metro Health Downtown',
  orgId: 'ORG001',
  address: '123 Medical Center Dr',
  city: 'Downtown',
  type: 'Main Hospital',
  status: 'Active'
}, {
  id: 'LOC002',
  name: 'Metro Health North',
  orgId: 'ORG001',
  address: '456 North Ave',
  city: 'Northside',
  type: 'Satellite Clinic',
  status: 'Active'
}, {
  id: 'LOC003',
  name: 'Community Care Central',
  orgId: 'ORG002',
  address: '789 Central St',
  city: 'Central',
  type: 'Primary Clinic',
  status: 'Active'
}, {
  id: 'LOC004',
  name: 'Community Care West',
  orgId: 'ORG002',
  address: '321 West Blvd',
  city: 'Westside',
  type: 'Urgent Care',
  status: 'Active'
}, {
  id: 'LOC005',
  name: 'Regional Med Main',
  orgId: 'ORG003',
  address: '654 Main St',
  city: 'Midtown',
  type: 'Medical Office',
  status: 'Active'
}];

const providers = [{
  id: 'PROV001',
  name: 'Dr. Sarah Johnson',
  orgId: 'ORG001',
  specialty: 'Internal Medicine',
  phone: '(555) 111-2222',
  email: 'sjohnson@metrohealth.com',
  status: 'Active'
}, {
  id: 'PROV002',
  name: 'Dr. Michael Chen',
  orgId: 'ORG001',
  specialty: 'Cardiology',
  phone: '(555) 111-3333',
  email: 'mchen@metrohealth.com',
  status: 'Active'
}, {
  id: 'PROV003',
  name: 'Dr. Emily Rodriguez',
  orgId: 'ORG002',
  specialty: 'Family Medicine',
  phone: '(555) 222-4444',
  email: 'erodriguez@communitycare.com',
  status: 'Active'
}, {
  id: 'PROV004',
  name: 'Dr. David Kim',
  orgId: 'ORG002',
  specialty: 'Pediatrics',
  phone: '(555) 222-5555',
  email: 'dkim@communitycare.com',
  status: 'Active'
}, {
  id: 'PROV005',
  name: 'Dr. Lisa Thompson',
  orgId: 'ORG003',
  specialty: 'Dermatology',
  phone: '(555) 333-6666',
  email: 'lthompson@regionalmed.com',
  status: 'Active'
}];

const staff = [{
  id: 'STAFF001',
  name: 'Jennifer Adams',
  orgId: 'ORG001',
  role: 'Lab Technician',
  department: 'Laboratory',
  phone: '(555) 111-7777',
  email: 'jadams@metrohealth.com',
  status: 'Active'
}, {
  id: 'STAFF002',
  name: 'Robert Wilson',
  orgId: 'ORG001',
  role: 'Nurse Manager',
  department: 'Nursing',
  phone: '(555) 111-8888',
  email: 'rwilson@metrohealth.com',
  status: 'Active'
}, {
  id: 'STAFF003',
  name: 'Maria Garcia',
  orgId: 'ORG002',
  role: 'Medical Assistant',
  department: 'Clinical',
  phone: '(555) 222-9999',
  email: 'mgarcia@communitycare.com',
  status: 'Active'
}, {
  id: 'STAFF004',
  name: 'James Miller',
  orgId: 'ORG003',
  role: 'Lab Coordinator',
  department: 'Laboratory',
  phone: '(555) 333-0000',
  email: 'jmiller@regionalmed.com',
  status: 'Active'
}];

export function Organizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('organizations');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrganizations = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    org.org_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         location.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrg = selectedOrg === 'All' || location.orgId === selectedOrg;
    return matchesSearch && matchesOrg;
  });

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         provider.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrg = selectedOrg === 'All' || provider.orgId === selectedOrg;
    return matchesSearch && matchesOrg;
  });

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         member.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrg = selectedOrg === 'All' || member.orgId === selectedOrg;
    return matchesSearch && matchesOrg;
  });

  const getOrgName = (orgId: string) => {
    return organizations.find(org => org.id === orgId)?.name || 'Unknown';
  };

  // Paginate data
  const paginateData = <T extends any>(items: T[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const getTotalPages = (totalItems: number) => Math.ceil(totalItems / itemsPerPage);

  // Update filtered data with pagination
  const paginatedLocations = paginateData(filteredLocations);
  const paginatedProviders = paginateData(filteredProviders);
  const paginatedStaff = paginateData(filteredStaff);

  // Pagination controls component
  const PaginationControls = ({ totalItems }: { totalItems: number }) => {
    const totalPages = getTotalPages(totalItems);
    return (
      <div className="flex justify-between items-center p-4 border-t">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
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
              Manage organizations, locations, providers, and staff
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
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
              <PlusIcon className="h-4 w-4" />
              <span>
                Add {selectedTab === 'organizations' ? 'Organization' : 
                     selectedTab === 'locations' ? 'Location' : 
                     selectedTab === 'providers' ? 'Provider' : 'Staff Member'}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'organizations', label: 'Organizations', icon: BuildingIcon },
              { key: 'locations', label: 'Locations', icon: MapPinIcon },
              { key: 'providers', label: 'Providers', icon: StethoscopeIcon },
              { key: 'staff', label: 'Staff', icon: UsersIcon }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.key
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

        {/* Search and Filters */}
        <div className="flex space-x-4 mt-6">
          <div className="relative flex-1">
            <SearchIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${selectedTab}...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {selectedTab !== 'organizations' && (
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
            >
              <option value="All">All Organizations</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Organizations Tab */}
      {selectedTab === 'organizations' && (
        <div className="bg-white rounded-lg shadow-sm border">
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
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrganizations.map(org => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <BuildingIcon className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {org.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {org.org_code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {org.medical_director || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {org.clia || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {org.street && (
                          <div>{org.street}</div>
                        )}
                        {(org.city || org.state || org.zip) && (
                          <div className="text-gray-500">
                            {[org.city, org.state, org.zip].filter(Boolean).join(', ')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {org.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <PhoneIcon className="h-4 w-4" />
                            <span>{org.phone}</span>
                          </div>
                        )}
                        {org.fax && (
                          <div className="text-sm text-gray-600">
                            Fax: {org.fax}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-1">
                          <EditIcon className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                        <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrganizations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No organizations match the current filters
              </div>
            )}
          </div>
        </div>
      )}

      {/* Locations Tab */}
      {selectedTab === 'locations' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedLocations.map(location => (
                  <tr key={location.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <MapPinIcon className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {location.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {location.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getOrgName(location.orgId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {location.address}
                      </div>
                      <div className="text-sm text-gray-500">
                        {location.city}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                        {location.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(location.status)}`}>
                        {location.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLocations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No locations match the current filters
              </div>
            ) : (
              <PaginationControls totalItems={filteredLocations.length} />
            )}
          </div>
        </div>
      )}

      {/* Providers Tab */}
      {selectedTab === 'providers' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedProviders.map(provider => (
                  <tr key={provider.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <StethoscopeIcon className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {provider.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {provider.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getOrgName(provider.orgId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                        {provider.specialty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {provider.phone}
                      </div>
                      <div className="text-sm text-gray-500">
                        {provider.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(provider.status)}`}>
                        {provider.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProviders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No providers match the current filters
              </div>
            ) : (
              <PaginationControls totalItems={filteredProviders.length} />
            )}
          </div>
        </div>
      )}

      {/* Staff Tab */}
      {selectedTab === 'staff' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedStaff.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getOrgName(member.orgId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {member.phone}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStaff.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No staff members match the current filters
              </div>
            ) : (
              <PaginationControls totalItems={filteredStaff.length} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}