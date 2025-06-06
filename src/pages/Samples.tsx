import React, { useState, useEffect } from 'react';
import { SearchIcon, PlusIcon, TestTubeIcon, BuildingIcon, StethoscopeIcon, XIcon, UserIcon, PhoneIcon, MailIcon, MapPinIcon, CreditCardIcon, ActivityIcon, ClipboardIcon, UsersIcon, HeartHandshakeIcon, CalendarIcon, GraduationCapIcon, ClockIcon, BookIcon } from 'lucide-react';
import { fetchOrders, Order } from '../services/orderService';
import { OrderImporter } from '../components/OrderImporter';

// Keep the existing mock data for patient details, organization details, and provider details
// These will be used until we implement those tables in Supabase
const organizationDetailsData = {
  // ... existing organization details data
};

const providerDetailsData = {
  // ... existing provider details data
};

interface PatientDetails {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    county: string;
  };
  contact: {
    homePhone: string;
    cellPhone: string;
    workPhone: string;
    email: string;
  };
  ssn: string;
  maritalStatus: string;
  demographics: {
    race: string;
    ethnicity: string;
  };
  insurance: {
    planName: string;
    priority: string;
    policyNumber: string;
    groupNumber: string;
    relationship: string;
  };
  organization: {
    name: string;
    location: string;
    provider: string;
    network: string;
    group: string;
  };
  account: {
    lastNumber: string;
    lastOrderDate: string;
  };
}

// Mock patient details data
const patientDetailsData: Record<string, PatientDetails> = {
  // ... existing patient details data
};

export function Samples() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orgFilter, setOrgFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Extract unique organizations for the filter dropdown
  const organizations = Array.from(
    new Set(orders.map(order => order.organization))
  ).map(orgName => ({
    id: orgName,
    name: orgName
  }));

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.accession_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.patient_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesOrg = orgFilter === 'All' || order.organization === orgFilter;
    return matchesSearch && matchesStatus && matchesOrg;
  });

  // Paginate data
  const paginateData = <T extends any,>(items: T[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const getTotalPages = (totalItems: number) => Math.ceil(totalItems / itemsPerPage);
  
  // Update filtered data with pagination
  const paginatedOrders = paginateData(filteredOrders);

  // Pagination controls component
  const PaginationControls = ({
    totalItems
  }: {
    totalItems: number;
  }) => {
    const totalPages = getTotalPages(totalItems);
    return <div className="flex justify-between items-center p-4 border-t">
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
      </div>;
  };

  // Patient Details Panel Component
  const PatientDetailsPanel = ({
    patientId
  }: {
    patientId: string;
  }) => {
    const patient = patientDetailsData[patientId];
    if (!patient) return null;
    
    // ... existing PatientDetailsPanel implementation
    const sections = [{
      title: 'Personal Information',
      icon: UserIcon,
      content: [{
        label: 'Patient ID',
        value: patient.id
      }, {
        label: 'Name',
        value: `${patient.firstName} ${patient.lastName}`
      }, {
        label: 'Gender',
        value: patient.gender
      }, {
        label: 'Date of Birth',
        value: patient.dateOfBirth
      }, {
        label: 'SSN',
        value: patient.ssn
      }, {
        label: 'Marital Status',
        value: patient.maritalStatus
      }]
    }, {
      title: 'Demographics',
      icon: ActivityIcon,
      content: [{
        label: 'Race',
        value: patient.demographics.race
      }, {
        label: 'Ethnicity',
        value: patient.demographics.ethnicity
      }]
    }, {
      title: 'Contact Information',
      icon: PhoneIcon,
      content: [{
        label: 'Home Phone',
        value: patient.contact.homePhone
      }, {
        label: 'Cell Phone',
        value: patient.contact.cellPhone
      }, {
        label: 'Work Phone',
        value: patient.contact.workPhone
      }, {
        label: 'Email',
        value: patient.contact.email
      }]
    }, {
      title: 'Address',
      icon: MapPinIcon,
      content: [{
        label: 'Street',
        value: patient.address.street
      }, {
        label: 'City',
        value: patient.address.city
      }, {
        label: 'State',
        value: patient.address.state
      }, {
        label: 'ZIP',
        value: patient.address.zip
      }, {
        label: 'County',
        value: patient.address.county
      }]
    }, {
      title: 'Insurance',
      icon: CreditCardIcon,
      content: [{
        label: 'Plan Name',
        value: patient.insurance.planName
      }, {
        label: 'Priority',
        value: patient.insurance.priority
      }, {
        label: 'Policy #',
        value: patient.insurance.policyNumber
      }, {
        label: 'Group #',
        value: patient.insurance.groupNumber
      }, {
        label: 'Relationship',
        value: patient.insurance.relationship
      }]
    }, {
      title: 'Organization Details',
      icon: BuildingIcon,
      content: [{
        label: 'Organization',
        value: patient.organization.name
      }, {
        label: 'Location',
        value: patient.organization.location
      }, {
        label: 'Provider',
        value: patient.organization.provider
      }, {
        label: 'Network',
        value: patient.organization.network
      }, {
        label: 'Group',
        value: patient.organization.group
      }]
    }, {
      title: 'Account Information',
      icon: ClipboardIcon,
      content: [{
        label: 'Last Acc#',
        value: patient.account.lastNumber
      }, {
        label: 'Last Order Date',
        value: patient.account.lastOrderDate
      }]
    }];

    return <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 overflow-y-auto z-50">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Patient Details
            </h2>
            <button onClick={() => setSelectedPatient(null)} className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-8">
          {sections.map(section => {
          const Icon = section.icon;
          return <div key={section.title} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {section.content.map(item => <div key={item.label} className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-gray-500">
                        {item.label}:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.value}
                      </span>
                    </div>)}
                </div>
              </div>;
        })}
        </div>
      </div>;
  };

  // Organization Details Panel Component
  const OrganizationDetailsPanel = ({
    orgId
  }: {
    orgId: string;
  }) => {
    const org = organizationDetailsData[orgId];
    if (!org) return null;
    
    // ... existing OrganizationDetailsPanel implementation
    const sections = [{
      title: 'Organization Information',
      icon: BuildingIcon,
      content: [{
        label: 'Organization ID',
        value: org.id
      }, {
        label: 'Name',
        value: org.name
      }, {
        label: 'Type',
        value: org.type
      }, {
        label: 'Status',
        value: org.status
      }, {
        label: 'Join Date',
        value: org.joinDate
      }]
    }, {
      title: 'Contact Information',
      icon: PhoneIcon,
      content: [{
        label: 'Phone',
        value: org.phone
      }, {
        label: 'Email',
        value: org.email
      }, {
        label: 'Website',
        value: org.website
      }, {
        label: 'Address',
        value: org.address
      }]
    }, {
      title: 'Account Management',
      icon: HeartHandshakeIcon,
      content: [{
        label: 'Sales Rep',
        value: org.salesRep
      }, {
        label: 'Sales Rep Email',
        value: org.salesRepEmail
      }, {
        label: 'Sales Rep Phone',
        value: org.salesRepPhone
      }, {
        label: 'Account Manager',
        value: org.accountManager
      }]
    }, {
      title: 'Contract Information',
      icon: ClipboardIcon,
      content: [{
        label: 'Contract Status',
        value: org.contractStatus
      }, {
        label: 'Renewal Date',
        value: org.contractRenewal
      }, {
        label: 'Last Interaction',
        value: org.lastInteraction
      }]
    }, {
      title: 'Billing Information',
      icon: CreditCardIcon,
      content: [{
        label: 'Billing Contact',
        value: org.billingContact
      }, {
        label: 'Billing Email',
        value: org.billingEmail
      }, {
        label: 'Billing Phone',
        value: org.billingPhone
      }]
    }, {
      title: 'Demographics',
      icon: UsersIcon,
      content: [{
        label: 'Locations',
        value: org.locationCount.toString()
      }, {
        label: 'Providers',
        value: org.providerCount.toString()
      }, {
        label: 'Patients',
        value: org.patientCount.toString()
      }, {
        label: 'Staff',
        value: org.staffCount.toString()
      }]
    }];

    return <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 overflow-y-auto z-50">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Organization Details
              </h2>
              <span className={`mt-1 inline-block px-2 py-1 text-xs rounded-full ${org.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {org.status}
              </span>
            </div>
            <button onClick={() => setSelectedOrg(null)} className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-8">
          {sections.map(section => {
          const Icon = section.icon;
          return <div key={section.title} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {section.content.map(item => <div key={item.label} className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-gray-500">
                        {item.label}:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.value}
                      </span>
                    </div>)}
                </div>
              </div>;
        })}
          {/* Quick Actions */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <PhoneIcon className="h-4 w-4" />
                <span>Contact</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                <CalendarIcon className="h-4 w-4" />
                <span>Schedule</span>
              </button>
            </div>
          </div>
        </div>
      </div>;
  };

  // Provider Details Panel Component
  const ProviderDetailsPanel = ({
    providerId
  }: {
    providerId: string;
  }) => {
    const provider = providerDetailsData[providerId];
    if (!provider) return null;
    
    // ... existing ProviderDetailsPanel implementation
    const sections = [{
      title: 'Provider Information',
      icon: StethoscopeIcon,
      content: [{
        label: 'Provider ID',
        value: provider.id
      }, {
        label: 'Name',
        value: provider.name
      }, {
        label: 'Title',
        value: provider.title
      }, {
        label: 'Specialty',
        value: provider.specialty
      }, {
        label: 'Status',
        value: provider.status
      }, {
        label: 'NPI Number',
        value: provider.npi
      }, {
        label: 'License',
        value: `${provider.licenseNumber} (${provider.licenseState})`
      }]
    }, {
      title: 'Contact Information',
      icon: PhoneIcon,
      content: [{
        label: 'Phone',
        value: provider.phone
      }, {
        label: 'Email',
        value: provider.email
      }, {
        label: 'Address',
        value: provider.address
      }]
    }, {
      title: 'Organization',
      icon: BuildingIcon,
      content: [{
        label: 'Organization',
        value: provider.organizationName
      }, {
        label: 'Primary Location',
        value: provider.primaryLocation
      }]
    }, {
      title: 'Education & Qualifications',
      icon: GraduationCapIcon,
      content: provider.education.map((edu, index) => ({
        label: edu.degree,
        value: `${edu.institution} (${edu.year})`
      }))
    }, {
      title: 'Practice Information',
      icon: ClockIcon,
      content: [{
        label: 'Accepting New Patients',
        value: provider.acceptingNewPatients ? 'Yes' : 'No'
      }, {
        label: 'Office Hours',
        value: provider.officeHours
      }, {
        label: 'Languages',
        value: provider.languages.join(', ')
      }, {
        label: 'Appointment Types',
        value: provider.appointmentTypes.join(', ')
      }]
    }, {
      title: 'Certifications',
      icon: BookIcon,
      content: provider.certifications.map((cert, index) => ({
        label: `Certification ${index + 1}`,
        value: cert
      }))
    }, {
      title: 'Patient Statistics',
      icon: ActivityIcon,
      content: [{
        label: 'Patient Count',
        value: provider.patientCount.toString()
      }, {
        label: 'Rating',
        value: `${provider.avgRating}/5 (${provider.reviewCount} reviews)`
      }, {
        label: 'Last Order Date',
        value: provider.lastOrderDate
      }, {
        label: 'Order Count',
        value: provider.orderCount.toString()
      }]
    }];

    return <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 overflow-y-auto z-50">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Provider Details
              </h2>
              <div className="flex items-center mt-1">
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${provider.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {provider.status}
                </span>
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                  {provider.specialty}
                </span>
              </div>
            </div>
            <button onClick={() => setSelectedProvider(null)} className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-8">
          {sections.map(section => {
          const Icon = section.icon;
          return <div key={section.title} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {section.content.map((item, index) => <div key={`${item.label}-${index}`} className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-gray-500">
                        {item.label}:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {item.value}
                      </span>
                    </div>)}
                </div>
              </div>;
        })}
          {/* Quick Actions */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <PhoneIcon className="h-4 w-4" />
                <span>Contact</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                <CalendarIcon className="h-4 w-4" />
                <span>Schedule</span>
              </button>
            </div>
          </div>
        </div>
      </div>;
  };

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'final':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
      case 'prelim':
      case 'prelim (review)':
      case 'pending received':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return <div className="p-6 w-full relative">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order Management
            </h1>
            <p className="text-gray-600">
              Track and manage laboratory orders across organizations
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <PlusIcon className="h-4 w-4" />
            <span>Add Order</span>
          </button>
        </div>
        <div className="flex space-x-4 mb-4">
          <div className="relative flex-1">
            <SearchIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search orders by ID or patient name..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Final">Final</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            value={orgFilter} 
            onChange={e => setOrgFilter(e.target.value)}
          >
            <option value="All">All Organizations</option>
            {organizations.map(org => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Order Importer */}
      <OrderImporter />

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="flex justify-center mb-4">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Orders table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Panels
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Collection Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedOrders.map(order => (
                  <tr key={`${order.id}-${order.accession_id}-${order.order_panels}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <TestTubeIcon className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {order.accession_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        <button 
                          onClick={() => setSelectedPatient(order.patient_name)} 
                          className="hover:text-blue-600 cursor-pointer"
                        >
                          {order.patient_name}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BuildingIcon className="h-4 w-4 text-blue-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            <button 
                              onClick={() => setSelectedOrg(order.organization)} 
                              className="hover:text-blue-600 cursor-pointer"
                            >
                              {order.organization}
                            </button>
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StethoscopeIcon className="h-4 w-4 text-green-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            <button 
                              onClick={() => setSelectedProvider(order.provider)} 
                              className="hover:text-blue-600 cursor-pointer"
                            >
                              {order.provider}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.test_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                        {order.order_panels}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.collection_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Empty state */}
            {filteredOrders.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                {orders.length === 0 
                  ? "No orders found. Import orders using the form above." 
                  : "No orders match the current filters."}
              </div>
            )}
            
            {/* Pagination */}
            {filteredOrders.length > 0 && (
              <PaginationControls totalItems={filteredOrders.length} />
            )}
          </div>
        </div>
      )}

      {/* Detail panels */}
      {selectedPatient && <PatientDetailsPanel patientId={selectedPatient} />}
      {selectedOrg && <OrganizationDetailsPanel orgId={selectedOrg} />}
      {selectedProvider && <ProviderDetailsPanel providerId={selectedProvider} />}
    </div>;
}