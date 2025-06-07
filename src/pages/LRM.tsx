import React, { useState, useEffect } from 'react';
import { SearchIcon, PlusIcon, BuildingIcon, MapPinIcon, UserIcon, StethoscopeIcon, PhoneIcon, MailIcon, EditIcon, TrashIcon, UsersIcon, RefreshCwIcon, XIcon, SaveIcon, HeartHandshakeIcon, CalendarIcon, DollarSignIcon, FileTextIcon, TrendingUpIcon, AlertCircleIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';
import { fetchOrganizationsWithReps, OrganizationWithReps } from '../services/organizationService';
import { fetchLocationsWithOrganizations, LocationWithOrganization } from '../services/locationService';

// Mock data for interactions, contracts, and other LRM-specific data
const interactions = [
  {
    id: 'INT001',
    orgId: 'ORG001',
    type: 'Sales Call',
    date: '2024-01-15',
    contact: 'Dr. Sarah Johnson',
    notes: 'Discussed new testing protocols and pricing',
    outcome: 'Follow-up scheduled',
    nextAction: 'Send proposal',
    nextActionDate: '2024-01-20'
  },
  {
    id: 'INT002',
    orgId: 'ORG002',
    type: 'Contract Review',
    date: '2024-01-12',
    contact: 'Maria Garcia',
    notes: 'Reviewed contract renewal terms',
    outcome: 'Contract approved',
    nextAction: 'Schedule signing',
    nextActionDate: '2024-01-25'
  },
  {
    id: 'INT003',
    orgId: 'ORG003',
    type: 'Support Call',
    date: '2024-01-10',
    contact: 'James Miller',
    notes: 'Resolved billing inquiry',
    outcome: 'Issue resolved',
    nextAction: 'None',
    nextActionDate: null
  }
];

const contracts = [
  {
    id: 'CONT001',
    orgId: 'ORG001',
    type: 'Service Agreement',
    status: 'Active',
    startDate: '2023-01-15',
    endDate: '2024-12-31',
    value: '$125,000',
    renewalDate: '2024-10-01'
  },
  {
    id: 'CONT002',
    orgId: 'ORG002',
    type: 'Master Service Agreement',
    status: 'Renewal Pending',
    startDate: '2023-03-22',
    endDate: '2024-02-28',
    value: '$89,500',
    renewalDate: '2024-01-28'
  },
  {
    id: 'CONT003',
    orgId: 'ORG003',
    type: 'Testing Services Contract',
    status: 'Active',
    startDate: '2023-06-10',
    endDate: '2024-06-30',
    value: '$67,200',
    renewalDate: '2024-04-30'
  }
];

export function LRM() {
  const [organizations, setOrganizations] = useState<OrganizationWithReps[]>([]);
  const [locations, setLocations] = useState<LocationWithOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('organizations');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<OrganizationWithReps | null>(null);
  const [showNewInteractionModal, setShowNewInteractionModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [orgsData, locationsData] = await Promise.all([
        fetchOrganizationsWithReps(),
        fetchLocationsWithOrganizations()
      ]);
      setOrganizations(orgsData);
      setLocations(locationsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.org_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (org.medical_director && org.medical_director.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (org.org_reps?.sales_rep && org.org_reps.sales_rep.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (org.org_reps?.account_manager && org.org_reps.account_manager.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (org.org_reps?.sales_executive && org.org_reps.sales_executive.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredLocations = locations.filter(location =>
    location.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.location_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (location.organizations?.name && location.organizations.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (location.organizations?.org_code && location.organizations.org_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (location.city && location.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (location.state && location.state.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredInteractions = interactions.filter(interaction => {
    const matchesSearch = interaction.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interaction.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interaction.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredContracts = contracts.filter(contract => {
    const org = organizations.find(o => o.id === contract.orgId);
    const matchesSearch = org?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.status.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination
  const getCurrentData = () => {
    switch (selectedTab) {
      case 'organizations':
        return filteredOrganizations;
      case 'locations':
        return filteredLocations;
      case 'interactions':
        return filteredInteractions;
      case 'contracts':
        return filteredContracts;
      default:
        return [];
    }
  };

  const currentData = getCurrentData();
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const currentOrganizations = selectedTab === 'organizations' ? currentData.slice(startIndex, endIndex) as OrganizationWithReps[] : [];
  const currentLocations = selectedTab === 'locations' ? currentData.slice(startIndex, endIndex) as LocationWithOrganization[] : [];
  const currentInteractions = selectedTab === 'interactions' ? currentData.slice(startIndex, endIndex) : [];
  const currentContracts = selectedTab === 'contracts' ? currentData.slice(startIndex, endIndex) : [];

  const getOrgName = (orgId: string) => {
    return organizations.find(org => org.id === orgId)?.name || 'Unknown Organization';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Renewal Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInteractionTypeColor = (type: string) => {
    switch (type) {
      case 'Sales Call':
        return 'bg-blue-100 text-blue-800';
      case 'Contract Review':
        return 'bg-purple-100 text-purple-800';
      case 'Support Call':
        return 'bg-green-100 text-green-800';
      case 'Meeting':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <p className="text-red-800">Error: {error}</p>
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
    <div className="p-6 w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <HeartHandshakeIcon className="h-8 w-8 text-blue-600 mr-3" />
              Laboratory Relationship Management
            </h1>
            <p className="text-gray-600">
              Manage client relationships, interactions, and contracts
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowNewInteractionModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4" />
              <span>New Interaction</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'organizations', label: 'Organizations', icon: BuildingIcon },
              { key: 'locations', label: 'Locations', icon: MapPinIcon },
              { key: 'interactions', label: 'Interactions', icon: UserIcon },
              { key: 'contracts', label: 'Contracts', icon: FileTextIcon }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setSelectedTab(tab.key);
                    setCurrentPage(1);
                  }}
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

        {/* Search */}
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
        </div>
      </div>

      {/* Organizations Tab */}
      {selectedTab === 'organizations' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Client Organizations</h2>
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
                    Lab Director
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CLIA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales Rep
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Manager
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales Executive
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
                          <div className="text-sm font-medium text-gray-900">
                            {org.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Code: {org.org_code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {org.medical_director || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {org.city && org.state ? `${org.city}, ${org.state}` : '-'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {org.street || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {org.phone || '-'}
                      </div>
                      {org.fax && (
                        <div className="text-sm text-gray-500">
                          Fax: {org.fax}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {org.clia || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {org.org_reps?.sales_rep || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {org.org_reps?.account_manager || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {org.org_reps?.sales_executive || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrg(org)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View Details
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        New Interaction
                      </button>
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
                    ? 'No organizations available.' 
                    : 'Try adjusting your search terms.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Locations Tab */}
      {selectedTab === 'locations' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Organization Locations</h2>
              <span className="text-sm text-gray-500">
                {filteredLocations.length} of {locations.length} locations
              </span>
            </div>
          </div>
          
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
                    City, State
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ZIP
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
                {currentLocations.map(location => (
                  <tr key={location.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <MapPinIcon className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {location.location_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Code: {location.location_code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {location.organizations?.name || '-'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {location.organizations?.org_code || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate" title={location.street || ''}>
                        {location.street || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {location.city && location.state ? `${location.city}, ${location.state}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {location.zip || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {location.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {location.fax || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Edit
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Empty State */}
            {filteredLocations.length === 0 && (
              <div className="text-center py-12">
                <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No locations found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {locations.length === 0 
                    ? 'No locations available.' 
                    : 'Try adjusting your search terms.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactions Tab */}
      {selectedTab === 'interactions' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Client Interactions</h2>
              <span className="text-sm text-gray-500">
                {filteredInteractions.length} interactions
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentInteractions.map(interaction => (
                  <tr key={interaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(interaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getOrgName(interaction.orgId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getInteractionTypeColor(interaction.type)}`}>
                        {interaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {interaction.contact}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate" title={interaction.notes}>
                        {interaction.notes}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{interaction.nextAction}</div>
                      {interaction.nextActionDate && (
                        <div className="text-sm text-gray-500">
                          Due: {new Date(interaction.nextActionDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Edit
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Follow Up
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Empty State */}
            {filteredInteractions.length === 0 && (
              <div className="text-center py-12">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No interactions found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search terms or create a new interaction.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contracts Tab */}
      {selectedTab === 'contracts' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Client Contracts</h2>
              <span className="text-sm text-gray-500">
                {filteredContracts.length} contracts
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
                    Contract Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Renewal Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentContracts.map(contract => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getOrgName(contract.orgId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contract.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {contract.value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(contract.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(contract.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(contract.renewalDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Renew
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Empty State */}
            {filteredContracts.length === 0 && (
              <div className="text-center py-12">
                <FileTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No contracts found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search terms.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6">
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
                <span className="font-medium">{Math.min(endIndex, currentData.length)}</span> of{' '}
                <span className="font-medium">{currentData.length}</span> results
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

      {/* Organization Details Modal */}
      {selectedOrg && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Organization Details</h3>
              <button
                onClick={() => setSelectedOrg(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Information */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <BuildingIcon className="h-4 w-4 mr-2" />
                    Organization Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium">{selectedOrg.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Code:</span>
                      <span className="font-medium">{selectedOrg.org_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Lab Director:</span>
                      <span className="font-medium">{selectedOrg.medical_director || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">CLIA:</span>
                      <span className="font-medium">{selectedOrg.clia || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Contact Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-medium">{selectedOrg.phone || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fax:</span>
                      <span className="font-medium">{selectedOrg.fax || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    Address
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Street:</span>
                      <span className="font-medium">{selectedOrg.street || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">City:</span>
                      <span className="font-medium">{selectedOrg.city || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">State:</span>
                      <span className="font-medium">{selectedOrg.state || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ZIP:</span>
                      <span className="font-medium">{selectedOrg.zip || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales Team and Activity */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    Sales Team
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sales Rep:</span>
                      <span className="font-medium">{selectedOrg.org_reps?.sales_rep || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Account Manager:</span>
                      <span className="font-medium">{selectedOrg.org_reps?.account_manager || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sales Executive:</span>
                      <span className="font-medium">{selectedOrg.org_reps?.sales_executive || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Recent Activity
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Created:</span>
                      <span className="font-medium">
                        {selectedOrg.created_at ? new Date(selectedOrg.created_at).toLocaleDateString() : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Updated:</span>
                      <span className="font-medium">
                        {selectedOrg.updated_at ? new Date(selectedOrg.updated_at).toLocaleDateString() : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}