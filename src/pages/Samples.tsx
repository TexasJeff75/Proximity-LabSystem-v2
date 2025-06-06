import React, { useState, useEffect } from 'react';
import { SearchIcon, PlusIcon, TestTubeIcon, BuildingIcon, StethoscopeIcon, XIcon, UserIcon, PhoneIcon, MailIcon, MapPinIcon, CreditCardIcon, ActivityIcon, ClipboardIcon, UsersIcon, HeartHandshakeIcon, CalendarIcon, GraduationCapIcon, ClockIcon, BookIcon } from 'lucide-react';
import { Sample, PatientDetails } from '../types';
import { SearchInput, StatusBadge, PriorityBadge, Pagination, EmptyState } from '../components/common';
import { patientDetailsData } from '../utils/mockData';
import { fetchOrders } from '../services/orderService';

// Patient Details Panel Component
const PatientDetailsPanel: React.FC<{
  patientId: string;
  onBack: () => void;
}> = ({ patientId, onBack }) => {
  const patient = patientDetailsData[patientId];
  if (!patient) return null;

  const sections = [
    {
      title: 'Personal Information',
      icon: UserIcon,
      content: [
        { label: 'Patient ID', value: patient.id },
        { label: 'Name', value: `${patient.firstName} ${patient.lastName}` },
        { label: 'Gender', value: patient.gender },
        { label: 'Date of Birth', value: patient.dateOfBirth },
        { label: 'SSN', value: patient.ssn },
        { label: 'Marital Status', value: patient.maritalStatus }
      ]
    },
    {
      title: 'Demographics',
      icon: ActivityIcon,
      content: [
        { label: 'Race', value: patient.demographics.race },
        { label: 'Ethnicity', value: patient.demographics.ethnicity }
      ]
    },
    {
      title: 'Contact Information',
      icon: PhoneIcon,
      content: [
        { label: 'Home Phone', value: patient.contact.homePhone },
        { label: 'Cell Phone', value: patient.contact.cellPhone },
        { label: 'Work Phone', value: patient.contact.workPhone },
        { label: 'Email', value: patient.contact.email }
      ]
    },
    {
      title: 'Address',
      icon: MapPinIcon,
      content: [
        { label: 'Street', value: patient.address.street },
        { label: 'City', value: patient.address.city },
        { label: 'State', value: patient.address.state },
        { label: 'ZIP', value: patient.address.zip },
        { label: 'County', value: patient.address.county }
      ]
    },
    {
      title: 'Insurance',
      icon: CreditCardIcon,
      content: [
        { label: 'Plan Name', value: patient.insurance.planName },
        { label: 'Priority', value: patient.insurance.priority },
        { label: 'Policy #', value: patient.insurance.policyNumber },
        { label: 'Group #', value: patient.insurance.groupNumber },
        { label: 'Relationship', value: patient.insurance.relationship }
      ]
    },
    {
      title: 'Organization Details',
      icon: BuildingIcon,
      content: [
        { label: 'Organization', value: patient.organization.name },
        { label: 'Location', value: patient.organization.location },
        { label: 'Provider', value: patient.organization.provider },
        { label: 'Network', value: patient.organization.network },
        { label: 'Group', value: patient.organization.group }
      ]
    },
    {
      title: 'Account Information',
      icon: ClipboardIcon,
      content: [
        { label: 'Last Acc#', value: patient.account.lastNumber },
        { label: 'Last Order Date', value: patient.account.lastOrderDate }
      ]
    }
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 overflow-y-auto z-50">
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold text-gray-900">Patient Details</h2>
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="p-6 space-y-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="space-y-4">
              <div className="flex items-center space-x-2">
                <Icon className="h-5 w-5 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-900">{section.title}</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {section.content.map((item) => (
                  <div key={item.label} className="grid grid-cols-2 gap-2">
                    <span className="text-sm text-gray-500">{item.label}:</span>
                    <span className="text-sm font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Organization Details Panel Component
const OrganizationDetailsPanel: React.FC<{
  orgId: string;
  onBack: () => void;
}> = ({ orgId, onBack }) => {
  // This would be fetched from the API in a real implementation
  const organizationDetailsData: Record<string, any> = {
    ORG001: {
      id: 'ORG001',
      name: 'Metro Health System',
      type: 'Hospital Network',
      status: 'Active',
      address: '123 Medical Center Dr, City, ST 12345',
      phone: '(555) 123-4567',
      email: 'admin@metrohealth.com',
      website: 'www.metrohealthsystem.org',
      salesRep: 'Jennifer Adams',
      salesRepEmail: 'jennifer.adams@labsystem.com',
      salesRepPhone: '(555) 987-6543',
      accountManager: 'Sarah Johnson',
      contractStatus: 'Active',
      contractRenewal: '2024-12-31',
      locationCount: 5,
      providerCount: 23,
      patientCount: 1247,
      staffCount: 45,
      joinDate: '2023-01-15',
      lastInteraction: '2024-01-10',
      billingContact: 'Robert Wilson',
      billingEmail: 'billing@metrohealth.com',
      billingPhone: '(555) 123-4568'
    },
    // Add other organizations as needed
  };

  const org = organizationDetailsData[orgId];
  if (!org) return null;

  const sections = [
    {
      title: 'Organization Information',
      icon: BuildingIcon,
      content: [
        { label: 'Organization ID', value: org.id },
        { label: 'Name', value: org.name },
        { label: 'Type', value: org.type },
        { label: 'Status', value: org.status },
        { label: 'Join Date', value: org.joinDate }
      ]
    },
    {
      title: 'Contact Information',
      icon: PhoneIcon,
      content: [
        { label: 'Phone', value: org.phone },
        { label: 'Email', value: org.email },
        { label: 'Website', value: org.website },
        { label: 'Address', value: org.address }
      ]
    },
    {
      title: 'Account Management',
      icon: HeartHandshakeIcon,
      content: [
        { label: 'Sales Rep', value: org.salesRep },
        { label: 'Sales Rep Email', value: org.salesRepEmail },
        { label: 'Sales Rep Phone', value: org.salesRepPhone },
        { label: 'Account Manager', value: org.accountManager }
      ]
    },
    {
      title: 'Contract Information',
      icon: ClipboardIcon,
      content: [
        { label: 'Contract Status', value: org.contractStatus },
        { label: 'Renewal Date', value: org.contractRenewal },
        { label: 'Last Interaction', value: org.lastInteraction }
      ]
    },
    {
      title: 'Billing Information',
      icon: CreditCardIcon,
      content: [
        { label: 'Billing Contact', value: org.billingContact },
        { label: 'Billing Email', value: org.billingEmail },
        { label: 'Billing Phone', value: org.billingPhone }
      ]
    },
    {
      title: 'Demographics',
      icon: UsersIcon,
      content: [
        { label: 'Locations', value: org.locationCount.toString() },
        { label: 'Providers', value: org.providerCount.toString() },
        { label: 'Patients', value: org.patientCount.toString() },
        { label: 'Staff', value: org.staffCount.toString() }
      ]
    }
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 overflow-y-auto z-50">
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Organization Details</h2>
            <span className={`mt-1 inline-block px-2 py-1 text-xs rounded-full ${org.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {org.status}
            </span>
          </div>
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="p-6 space-y-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="space-y-4">
              <div className="flex items-center space-x-2">
                <Icon className="h-5 w-5 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-900">{section.title}</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {section.content.map((item) => (
                  <div key={item.label} className="grid grid-cols-2 gap-2">
                    <span className="text-sm text-gray-500">{item.label}:</span>
                    <span className="text-sm font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
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
    </div>
  );
};

// Provider Details Panel Component
const ProviderDetailsPanel: React.FC<{
  providerId: string;
  onBack: () => void;
}> = ({ providerId, onBack }) => {
  // This would be fetched from the API in a real implementation
  const providerDetailsData: Record<string, any> = {
    PROV001: {
      id: 'PROV001',
      name: 'Dr. Sarah Johnson',
      title: 'MD',
      specialty: 'Internal Medicine',
      organizationId: 'ORG001',
      organizationName: 'Metro Health System',
      primaryLocation: 'Metro Health Downtown',
      status: 'Active',
      npi: '1234567890',
      licenseNumber: 'MD12345',
      licenseState: 'CA',
      phone: '(555) 111-2222',
      email: 'sjohnson@metrohealth.com',
      address: '123 Medical Center Dr, Suite 200, City, ST 12345',
      education: [
        { degree: 'MD', institution: 'Stanford University School of Medicine', year: '2010' },
        { degree: 'Residency', institution: 'UCSF Medical Center', year: '2014' },
        { degree: 'BS', institution: 'UCLA', year: '2006' }
      ],
      certifications: ['American Board of Internal Medicine', 'Advanced Cardiac Life Support'],
      languages: ['English', 'Spanish'],
      acceptingNewPatients: true,
      insuranceAccepted: ['Blue Cross', 'Aetna', 'Medicare', 'United Healthcare'],
      appointmentTypes: ['In-person', 'Telehealth'],
      officeHours: 'Mon-Fri: 8:00 AM - 5:00 PM',
      patientCount: 342,
      avgRating: 4.8,
      reviewCount: 76,
      lastOrderDate: '2024-01-15',
      orderCount: 128
    },
    // Add other providers as needed
  };

  const provider = providerDetailsData[providerId];
  if (!provider) return null;

  const sections = [
    {
      title: 'Provider Information',
      icon: StethoscopeIcon,
      content: [
        { label: 'Provider ID', value: provider.id },
        { label: 'Name', value: provider.name },
        { label: 'Title', value: provider.title },
        { label: 'Specialty', value: provider.specialty },
        { label: 'Status', value: provider.status },
        { label: 'NPI Number', value: provider.npi },
        { label: 'License', value: `${provider.licenseNumber} (${provider.licenseState})` }
      ]
    },
    {
      title: 'Contact Information',
      icon: PhoneIcon,
      content: [
        { label: 'Phone', value: provider.phone },
        { label: 'Email', value: provider.email },
        { label: 'Address', value: provider.address }
      ]
    },
    {
      title: 'Organization',
      icon: BuildingIcon,
      content: [
        { label: 'Organization', value: provider.organizationName },
        { label: 'Primary Location', value: provider.primaryLocation }
      ]
    },
    {
      title: 'Education & Qualifications',
      icon: GraduationCapIcon,
      content: provider.education.map((edu: any, index: number) => ({
        label: edu.degree,
        value: `${edu.institution} (${edu.year})`
      }))
    },
    {
      title: 'Practice Information',
      icon: ClockIcon,
      content: [
        { label: 'Accepting New Patients', value: provider.acceptingNewPatients ? 'Yes' : 'No' },
        { label: 'Office Hours', value: provider.officeHours },
        { label: 'Languages', value: provider.languages.join(', ') },
        { label: 'Appointment Types', value: provider.appointmentTypes.join(', ') }
      ]
    },
    {
      title: 'Certifications',
      icon: BookIcon,
      content: provider.certifications.map((cert: string, index: number) => ({
        label: `Certification ${index + 1}`,
        value: cert
      }))
    },
    {
      title: 'Patient Statistics',
      icon: ActivityIcon,
      content: [
        { label: 'Patient Count', value: provider.patientCount.toString() },
        { label: 'Rating', value: `${provider.avgRating}/5 (${provider.reviewCount} reviews)` },
        { label: 'Last Order Date', value: provider.lastOrderDate },
        { label: 'Order Count', value: provider.orderCount.toString() }
      ]
    }
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 overflow-y-auto z-50">
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Provider Details</h2>
            <div className="flex items-center mt-1">
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${provider.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {provider.status}
              </span>
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                {provider.specialty}
              </span>
            </div>
          </div>
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="p-6 space-y-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="space-y-4">
              <div className="flex items-center space-x-2">
                <Icon className="h-5 w-5 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-900">{section.title}</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {section.content.map((item: any, index: number) => (
                  <div key={`${item.label}-${index}`} className="grid grid-cols-2 gap-2">
                    <span className="text-sm text-gray-500">{item.label}:</span>
                    <span className="text-sm font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
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
    </div>
  );
};

export function Samples() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orgFilter, setOrgFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const itemsPerPage = 10;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const orders = await fetchOrders();
        setSamples(orders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredSamples = samples.filter(sample => {
    const matchesSearch = sample.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sample.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || sample.status === statusFilter;
    const matchesOrg = orgFilter === 'All' || sample.organizationId === orgFilter;
    return matchesSearch && matchesStatus && matchesOrg;
  });

  // Get unique organizations for the filter
  const organizations = Array.from(
    new Set(samples.map(s => ({ id: s.organizationId, name: s.organizationName })))
  );

  // Get unique statuses for the filter
  const statuses = Array.from(new Set(samples.map(s => s.status)));

  // Paginate data
  const paginatedSamples = filteredSamples.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 w-full relative">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600">Track and manage laboratory orders across organizations</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <PlusIcon className="h-4 w-4" />
            <span>Add Order</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search orders by ID or patient name..."
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value)}
          >
            <option value="All">All Organizations</option>
            {organizations.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
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
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Collection Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedSamples.map(sample => (
                  <tr key={sample.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <TestTubeIcon className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{sample.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        <button
                          onClick={() => setSelectedPatient(sample.patientId)}
                          className="hover:text-blue-600 cursor-pointer"
                        >
                          {sample.patientName}
                        </button>
                      </div>
                      <div className="text-sm text-gray-500">{sample.patientId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BuildingIcon className="h-4 w-4 text-blue-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            <button
                              onClick={() => setSelectedOrg(sample.organizationId)}
                              className="hover:text-blue-600 cursor-pointer"
                            >
                              {sample.organizationName}
                            </button>
                          </div>
                          <div className="text-sm text-gray-500">{sample.organizationId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StethoscopeIcon className="h-4 w-4 text-green-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            <button
                              onClick={() => setSelectedProvider(sample.providerId)}
                              className="hover:text-blue-600 cursor-pointer"
                            >
                              {sample.providerName}
                            </button>
                          </div>
                          <div className="text-sm text-gray-500">{sample.providerId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sample.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                        {sample.test}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sample.collectionDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PriorityBadge priority={sample.priority} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={sample.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredSamples.length === 0 && (
              <EmptyState message="No orders match the current filters" />
            )}
          </div>
          
          {filteredSamples.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredSamples.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}

      {selectedPatient && (
        <PatientDetailsPanel
          patientId={selectedPatient}
          onBack={() => setSelectedPatient(null)}
        />
      )}
      
      {selectedOrg && (
        <OrganizationDetailsPanel
          orgId={selectedOrg}
          onBack={() => setSelectedOrg(null)}
        />
      )}
      
      {selectedProvider && (
        <ProviderDetailsPanel
          providerId={selectedProvider}
          onBack={() => setSelectedProvider(null)}
        />
      )}
    </div>
  );
}