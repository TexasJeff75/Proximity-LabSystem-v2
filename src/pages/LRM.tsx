import React, { useState } from 'react';
import { BuildingIcon, UserIcon, ChevronDownIcon, ChevronUpIcon, ClockIcon, FileTextIcon, CheckCircleIcon, AlertCircleIcon, PlusIcon, SearchIcon, FilterIcon, ArrowRightIcon, CalendarIcon, PencilIcon, TrashIcon, DownloadIcon, UploadIcon, LinkIcon, PieChartIcon, BarChartIcon, LockIcon, UsersIcon, ShieldIcon, EyeIcon, ClipboardIcon, HeartHandshakeIcon, DollarSignIcon, PhoneIcon, MailIcon, MapPinIcon, TrendingUpIcon, AlertTriangleIcon, XIcon, ArrowDownIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// Mock data for organizations (extended from existing data)
const organizations = [{
  id: 'ORG001',
  name: 'Metro Health System',
  type: 'Hospital Network',
  status: 'Active',
  phone: '(555) 123-4567',
  email: 'admin@metrohealth.com',
  address: '123 Medical Center Dr, City, ST 12345',
  locationCount: 5,
  providerCount: 23,
  patientCount: 1247,
  staffCount: 45,
  joinDate: '2023-01-15',
  salesStage: 'Customer',
  revenue: '$450,000',
  contractStatus: 'Active',
  contractRenewal: '2024-12-31',
  accountManager: 'Sarah Johnson',
  lastInteraction: '2024-01-10'
}, {
  id: 'ORG002',
  name: 'Community Care Clinics',
  type: 'Clinic Chain',
  status: 'Active',
  phone: '(555) 234-5678',
  email: 'info@communitycare.com',
  address: '456 Health Ave, City, ST 12345',
  locationCount: 12,
  providerCount: 67,
  patientCount: 3421,
  staffCount: 89,
  joinDate: '2023-03-22',
  salesStage: 'Customer',
  revenue: '$320,000',
  contractStatus: 'Renewal Pending',
  contractRenewal: '2024-02-28',
  accountManager: 'Michael Chen',
  lastInteraction: '2024-01-12'
}, {
  id: 'ORG003',
  name: 'Regional Medical Group',
  type: 'Medical Practice',
  status: 'Active',
  phone: '(555) 345-6789',
  email: 'contact@regionalmed.com',
  address: '789 Wellness Blvd, City, ST 12345',
  locationCount: 3,
  providerCount: 15,
  patientCount: 892,
  staffCount: 28,
  joinDate: '2023-06-10',
  salesStage: 'Customer',
  revenue: '$175,000',
  contractStatus: 'Active',
  contractRenewal: '2024-06-30',
  accountManager: 'Jennifer Adams',
  lastInteraction: '2024-01-05'
}, {
  id: 'ORG004',
  name: 'Eastside Medical Center',
  type: 'Hospital',
  status: 'Prospect',
  phone: '(555) 456-7890',
  email: 'info@eastsidemed.com',
  address: '321 Hospital Way, City, ST 12345',
  locationCount: 1,
  providerCount: 0,
  patientCount: 0,
  staffCount: 0,
  joinDate: null,
  salesStage: 'Negotiation',
  revenue: '$0',
  contractStatus: 'Draft',
  contractRenewal: null,
  accountManager: 'David Wilson',
  lastInteraction: '2024-01-08'
}, {
  id: 'ORG005',
  name: 'Wellness Family Practice',
  type: 'Medical Practice',
  status: 'Prospect',
  phone: '(555) 567-8901',
  email: 'contact@wellnessfp.com',
  address: '567 Family Dr, City, ST 12345',
  locationCount: 2,
  providerCount: 0,
  patientCount: 0,
  staffCount: 0,
  joinDate: null,
  salesStage: 'Proposal',
  revenue: '$0',
  contractStatus: 'Pending',
  contractRenewal: null,
  accountManager: 'Lisa Thompson',
  lastInteraction: '2024-01-14'
}];
// Mock contracts data
const contracts = [{
  id: 'CONT001',
  orgId: 'ORG001',
  orgName: 'Metro Health System',
  type: 'Service Agreement',
  startDate: '2023-01-15',
  endDate: '2024-12-31',
  value: '$450,000',
  status: 'Active',
  autoRenew: true,
  renewalPeriod: '1 year',
  renewalReminder: '90 days',
  signedBy: 'Robert Johnson',
  signedDate: '2023-01-10',
  documents: [{
    name: 'MSA_MetroHealth_2023.pdf',
    size: '2.4 MB',
    uploaded: '2023-01-10'
  }, {
    name: 'ServiceSchedule_Labs_2023.pdf',
    size: '1.1 MB',
    uploaded: '2023-01-10'
  }]
}, {
  id: 'CONT002',
  orgId: 'ORG002',
  orgName: 'Community Care Clinics',
  type: 'Service Agreement',
  startDate: '2023-03-22',
  endDate: '2024-02-28',
  value: '$320,000',
  status: 'Renewal Pending',
  autoRenew: false,
  renewalPeriod: null,
  renewalReminder: '60 days',
  signedBy: 'Maria Garcia',
  signedDate: '2023-03-15',
  documents: [{
    name: 'MSA_CommunityCare_2023.pdf',
    size: '2.2 MB',
    uploaded: '2023-03-15'
  }, {
    name: 'ServiceSchedule_Labs_2023.pdf',
    size: '1.0 MB',
    uploaded: '2023-03-15'
  }]
}, {
  id: 'CONT003',
  orgId: 'ORG003',
  orgName: 'Regional Medical Group',
  type: 'Service Agreement',
  startDate: '2023-06-10',
  endDate: '2024-06-30',
  value: '$175,000',
  status: 'Active',
  autoRenew: true,
  renewalPeriod: '1 year',
  renewalReminder: '90 days',
  signedBy: 'David Miller',
  signedDate: '2023-06-05',
  documents: [{
    name: 'MSA_RegionalMedical_2023.pdf',
    size: '2.1 MB',
    uploaded: '2023-06-05'
  }]
}, {
  id: 'CONT004',
  orgId: 'ORG004',
  orgName: 'Eastside Medical Center',
  type: 'Service Agreement',
  startDate: null,
  endDate: null,
  value: '$200,000',
  status: 'Draft',
  autoRenew: true,
  renewalPeriod: '1 year',
  renewalReminder: '90 days',
  signedBy: null,
  signedDate: null,
  documents: [{
    name: 'MSA_Eastside_Draft_v2.pdf',
    size: '1.9 MB',
    uploaded: '2024-01-05'
  }]
}, {
  id: 'CONT005',
  orgId: 'ORG005',
  orgName: 'Wellness Family Practice',
  type: 'Service Agreement',
  startDate: null,
  endDate: null,
  value: '$120,000',
  status: 'Pending',
  autoRenew: true,
  renewalPeriod: '1 year',
  renewalReminder: '60 days',
  signedBy: null,
  signedDate: null,
  documents: [{
    name: 'MSA_WellnessFP_Proposal.pdf',
    size: '1.8 MB',
    uploaded: '2024-01-12'
  }]
}];
// Mock forms data
const forms = [{
  id: 'FORM001',
  orgId: 'ORG001',
  orgName: 'Metro Health System',
  name: 'Equipment Requirements',
  type: 'Requirements',
  status: 'Completed',
  sentDate: '2023-12-10',
  completedDate: '2023-12-15',
  respondent: 'Robert Johnson',
  responseRate: '100%',
  trackingLink: 'https://forms.labsystem.com/f/eq-req-metro',
  questions: 12,
  submissions: 1
}, {
  id: 'FORM002',
  orgId: 'ORG001',
  orgName: 'Metro Health System',
  name: 'Monthly Satisfaction Survey',
  type: 'Satisfaction',
  status: 'Completed',
  sentDate: '2024-01-05',
  completedDate: '2024-01-08',
  respondent: 'Multiple',
  responseRate: '85%',
  trackingLink: 'https://forms.labsystem.com/f/sat-metro-jan',
  questions: 10,
  submissions: 17
}, {
  id: 'FORM003',
  orgId: 'ORG002',
  orgName: 'Community Care Clinics',
  name: 'Contract Renewal Survey',
  type: 'Contract',
  status: 'Pending',
  sentDate: '2024-01-10',
  completedDate: null,
  respondent: null,
  responseRate: '0%',
  trackingLink: 'https://forms.labsystem.com/f/cont-renew-cc',
  questions: 15,
  submissions: 0
}, {
  id: 'FORM004',
  orgId: 'ORG003',
  orgName: 'Regional Medical Group',
  name: 'Service Feedback',
  type: 'Feedback',
  status: 'Completed',
  sentDate: '2023-12-20',
  completedDate: '2023-12-28',
  respondent: 'Multiple',
  responseRate: '90%',
  trackingLink: 'https://forms.labsystem.com/f/feedback-rmg',
  questions: 8,
  submissions: 9
}, {
  id: 'FORM005',
  orgId: 'ORG004',
  orgName: 'Eastside Medical Center',
  name: 'Initial Requirements',
  type: 'Requirements',
  status: 'Draft',
  sentDate: null,
  completedDate: null,
  respondent: null,
  responseRate: '0%',
  trackingLink: null,
  questions: 20,
  submissions: 0
}];
// Mock interaction timeline data
const interactions = [{
  id: 'INT001',
  orgId: 'ORG001',
  type: 'Meeting',
  date: '2024-01-10',
  user: 'Sarah Johnson',
  title: 'Quarterly Business Review',
  description: 'Discussed service performance and upcoming needs',
  participants: ['Robert Johnson', 'Maria Lee', 'Sarah Johnson'],
  documents: ['QBR_Q4_2023_Metro.pdf'],
  followUps: ['Schedule equipment maintenance', 'Send volume projection form']
}, {
  id: 'INT002',
  orgId: 'ORG001',
  type: 'Email',
  date: '2024-01-08',
  user: 'Sarah Johnson',
  title: 'QBR Agenda Confirmation',
  description: 'Confirmed agenda items for quarterly business review',
  participants: ['Robert Johnson', 'Sarah Johnson'],
  documents: [],
  followUps: []
}, {
  id: 'INT003',
  orgId: 'ORG001',
  type: 'Form Submission',
  date: '2024-01-08',
  user: 'System',
  title: 'Monthly Satisfaction Survey Completed',
  description: 'Monthly satisfaction survey completed with 85% satisfaction rate',
  participants: [],
  documents: ['Survey_Results_Jan2024.pdf'],
  followUps: ['Address feedback on result delivery times']
}, {
  id: 'INT004',
  orgId: 'ORG002',
  type: 'Call',
  date: '2024-01-12',
  user: 'Michael Chen',
  title: 'Contract Renewal Discussion',
  description: 'Called to discuss upcoming contract renewal and service adjustments',
  participants: ['Maria Garcia', 'Michael Chen'],
  documents: [],
  followUps: ['Send updated pricing sheet', 'Schedule follow-up meeting']
}, {
  id: 'INT005',
  orgId: 'ORG002',
  type: 'Form Sent',
  date: '2024-01-10',
  user: 'Michael Chen',
  title: 'Contract Renewal Survey Sent',
  description: 'Sent survey to gather requirements for contract renewal',
  participants: ['Maria Garcia'],
  documents: [],
  followUps: ['Follow up if no response by 01/17']
}, {
  id: 'INT006',
  orgId: 'ORG003',
  type: 'Meeting',
  date: '2024-01-05',
  user: 'Jennifer Adams',
  title: 'Service Review Meeting',
  description: 'Monthly service review with operations team',
  participants: ['David Miller', 'Susan White', 'Jennifer Adams'],
  documents: ['Service_Review_Jan2024.pdf'],
  followUps: ['Update SOP for specimen handling']
}, {
  id: 'INT007',
  orgId: 'ORG004',
  type: 'Meeting',
  date: '2024-01-08',
  user: 'David Wilson',
  title: 'Sales Presentation',
  description: 'Presented service offerings and proposal',
  participants: ['James Parker', 'Emily Rodriguez', 'David Wilson'],
  documents: ['Proposal_Eastside_v1.pdf', 'Service_Catalog_2024.pdf'],
  followUps: ['Send equipment specifications', 'Schedule lab tour']
}, {
  id: 'INT008',
  orgId: 'ORG005',
  type: 'Email',
  date: '2024-01-14',
  user: 'Lisa Thompson',
  title: 'Proposal Follow-up',
  description: 'Sent follow-up email with additional information requested during presentation',
  participants: ['William Brown', 'Lisa Thompson'],
  documents: ['Additional_Info_WellnessFP.pdf'],
  followUps: ['Call to confirm receipt on 01/16']
}];
// Mock roles and permissions data
const roles = [{
  id: 'ROLE001',
  name: 'Administrator',
  description: 'Full system access with all permissions',
  userCount: 5,
  permissions: {
    lrm: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      admin: true
    },
    contracts: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      sign: true
    },
    forms: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      send: true
    },
    organizations: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      manage: true
    }
  }
}, {
  id: 'ROLE002',
  name: 'Account Manager',
  description: 'Manage client relationships and interactions',
  userCount: 8,
  permissions: {
    lrm: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      admin: false
    },
    contracts: {
      view: true,
      create: true,
      edit: false,
      delete: false,
      sign: false
    },
    forms: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      send: true
    },
    organizations: {
      view: true,
      create: false,
      edit: true,
      delete: false,
      manage: true
    }
  }
}, {
  id: 'ROLE003',
  name: 'Sales Representative',
  description: 'Manage sales pipeline and prospects',
  userCount: 12,
  permissions: {
    lrm: {
      view: true,
      create: true,
      edit: false,
      delete: false,
      admin: false
    },
    contracts: {
      view: true,
      create: true,
      edit: false,
      delete: false,
      sign: false
    },
    forms: {
      view: true,
      create: true,
      edit: false,
      delete: false,
      send: true
    },
    organizations: {
      view: true,
      create: true,
      edit: false,
      delete: false,
      manage: false
    }
  }
}, {
  id: 'ROLE004',
  name: 'Contracts Manager',
  description: 'Manage and oversee all contract activities',
  userCount: 3,
  permissions: {
    lrm: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      admin: false
    },
    contracts: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      sign: true
    },
    forms: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      send: false
    },
    organizations: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      manage: false
    }
  }
}, {
  id: 'ROLE005',
  name: 'Viewer',
  description: 'Read-only access to system data',
  userCount: 15,
  permissions: {
    lrm: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      admin: false
    },
    contracts: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      sign: false
    },
    forms: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      send: false
    },
    organizations: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      manage: false
    }
  }
}];
// Mock audit logs
const auditLogs = [{
  id: 'LOG001',
  timestamp: '2024-01-15 09:23:45',
  user: 'admin@labsystem.com',
  action: 'Create',
  resource: 'Contract',
  resourceId: 'CONT005',
  details: 'Created new contract for Wellness Family Practice',
  ipAddress: '192.168.1.45'
}, {
  id: 'LOG002',
  timestamp: '2024-01-15 10:12:33',
  user: 'sarah.johnson@labsystem.com',
  action: 'Update',
  resource: 'Organization',
  resourceId: 'ORG001',
  details: 'Updated contact information for Metro Health System',
  ipAddress: '192.168.1.23'
}, {
  id: 'LOG003',
  timestamp: '2024-01-14 15:45:12',
  user: 'michael.chen@labsystem.com',
  action: 'Send',
  resource: 'Form',
  resourceId: 'FORM003',
  details: 'Sent Contract Renewal Survey to Community Care Clinics',
  ipAddress: '192.168.1.78'
}, {
  id: 'LOG004',
  timestamp: '2024-01-14 11:23:09',
  user: 'david.wilson@labsystem.com',
  action: 'Create',
  resource: 'Interaction',
  resourceId: 'INT007',
  details: 'Logged sales presentation meeting with Eastside Medical Center',
  ipAddress: '192.168.1.92'
}, {
  id: 'LOG005',
  timestamp: '2024-01-13 14:56:22',
  user: 'admin@labsystem.com',
  action: 'Permission',
  resource: 'Role',
  resourceId: 'ROLE003',
  details: 'Modified permissions for Sales Representative role',
  ipAddress: '192.168.1.45'
}];
export function LRM() {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showNewInteractionModal, setShowNewInteractionModal] = useState(false);
  const [showNewContractModal, setShowNewContractModal] = useState(false);
  const [showNewFormModal, setShowNewFormModal] = useState(false);
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  // Filter organizations based on search and status
  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) || org.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || org.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  // Get organization by ID
  const getOrganization = (id: string) => {
    return organizations.find(org => org.id === id) || null;
  };
  // Get interactions for an organization
  const getOrgInteractions = (orgId: string) => {
    return interactions.filter(interaction => interaction.orgId === orgId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  // Get contracts for an organization
  const getOrgContracts = (orgId: string) => {
    return contracts.filter(contract => contract.orgId === orgId);
  };
  // Get forms for an organization
  const getOrgForms = (orgId: string) => {
    return forms.filter(form => form.orgId === orgId);
  };
  // Status color helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Prospect':
        return 'bg-blue-100 text-blue-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Draft':
        return 'bg-purple-100 text-purple-800';
      case 'Renewal Pending':
        return 'bg-orange-100 text-orange-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  // Interaction type icon helper
  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'Meeting':
        return <UsersIcon className="h-5 w-5" />;
      case 'Call':
        return <PhoneIcon className="h-5 w-5" />;
      case 'Email':
        return <MailIcon className="h-5 w-5" />;
      case 'Form Sent':
        return <FileTextIcon className="h-5 w-5" />;
      case 'Form Submission':
        return <ClipboardIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };
  // Organization Detail View
  const OrganizationDetail = ({
    orgId
  }: {
    orgId: string;
  }) => {
    const org = getOrganization(orgId);
    const [detailTab, setDetailTab] = useState('dashboard'); // Changed default tab to dashboard
    if (!org) return <div className="p-8 text-center text-gray-500">
          Organization not found
        </div>;
    return <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Organization Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BuildingIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{org.name}</h1>
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <span>{org.id}</span>
                  <span>•</span>
                  <span>{org.type}</span>
                  <span>•</span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(org.status)}`}>
                    {org.status}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <button onClick={() => setSelectedOrg(null)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        {/* Organization Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            {[{
            key: 'dashboard',
            label: 'Dashboard'
          }, {
            key: 'overview',
            label: 'Overview'
          }, {
            key: 'timeline',
            label: 'Timeline'
          }, {
            key: 'contracts',
            label: 'Contracts'
          }, {
            key: 'forms',
            label: 'Forms'
          }].map(tab => <button key={tab.key} onClick={() => setDetailTab(tab.key)} className={`py-4 px-4 font-medium text-sm border-b-2 transition-colors ${detailTab === tab.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {tab.label}
              </button>)}
          </nav>
        </div>
        {/* Tab Content */}
        <div className="p-6">
          {detailTab === 'dashboard' && <OrganizationDashboard orgId={orgId} />}
          {detailTab === 'overview' && <div className="space-y-8">
              {/* Key Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{org.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MailIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{org.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{org.address}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Relationship Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Account Manager:</span>
                      <span className="text-gray-900 font-medium">
                        {org.accountManager}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sales Stage:</span>
                      <span className="text-gray-900 font-medium">
                        {org.salesStage}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Annual Revenue:</span>
                      <span className="text-gray-900 font-medium">
                        {org.revenue}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Join Date:</span>
                      <span className="text-gray-900 font-medium">
                        {org.joinDate || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Contract Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contract Status:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(org.contractStatus)}`}>
                        {org.contractStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Renewal Date:</span>
                      <span className="text-gray-900 font-medium">
                        {org.contractRenewal || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Interaction:</span>
                      <span className="text-gray-900 font-medium">
                        {org.lastInteraction}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Organization Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-3xl font-bold text-gray-900">
                    {org.locationCount}
                  </p>
                  <p className="text-sm text-gray-500">Locations</p>
                </div>
                <div className="text-center p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-3xl font-bold text-gray-900">
                    {org.providerCount}
                  </p>
                  <p className="text-sm text-gray-500">Providers</p>
                </div>
                <div className="text-center p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-3xl font-bold text-gray-900">
                    {org.patientCount}
                  </p>
                  <p className="text-sm text-gray-500">Patients</p>
                </div>
                <div className="text-center p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-3xl font-bold text-gray-900">
                    {org.staffCount}
                  </p>
                  <p className="text-sm text-gray-500">Staff</p>
                </div>
              </div>
              {/* Recent Interactions */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Interactions
                  </h2>
                  <button onClick={() => setShowNewInteractionModal(true)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    + Add Interaction
                  </button>
                </div>
                <div className="space-y-4">
                  {getOrgInteractions(orgId).slice(0, 3).map(interaction => <div key={interaction.id} className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              {getInteractionIcon(interaction.type)}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {interaction.title}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {interaction.date} • {interaction.user}
                              </p>
                            </div>
                          </div>
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            {interaction.type}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-gray-600">
                          {interaction.description}
                        </p>
                      </div>)}
                </div>
              </div>
            </div>}
          {detailTab === 'timeline' && <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Interaction Timeline
                </h2>
                <button onClick={() => setShowNewInteractionModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2">
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Interaction</span>
                </button>
              </div>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                {/* Timeline Events */}
                <div className="space-y-8 relative">
                  {getOrgInteractions(orgId).map((interaction, index) => <div key={interaction.id} className="relative pl-12">
                      {/* Timeline Dot */}
                      <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-blue-500' : 'bg-white border-2 border-gray-200'}`}>
                        <div className="text-white">
                          {getInteractionIcon(interaction.type)}
                        </div>
                      </div>
                      {/* Timeline Content */}
                      <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-base font-semibold text-gray-900">
                              {interaction.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {interaction.date} • {interaction.type} •{' '}
                              {interaction.user}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {interaction.description}
                        </p>
                        {/* Participants */}
                        {interaction.participants.length > 0 && <div className="mb-4">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                              Participants
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {interaction.participants.map((participant, i) => <span key={i} className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                    {participant}
                                  </span>)}
                            </div>
                          </div>}
                        {/* Documents */}
                        {interaction.documents.length > 0 && <div className="mb-4">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                              Documents
                            </h4>
                            <div className="space-y-2">
                              {interaction.documents.map((doc, i) => <div key={i} className="flex items-center space-x-2 text-sm">
                                  <FileTextIcon className="h-4 w-4 text-gray-400" />
                                  <span className="text-blue-600 hover:underline cursor-pointer">
                                    {doc}
                                  </span>
                                </div>)}
                            </div>
                          </div>}
                        {/* Follow-ups */}
                        {interaction.followUps.length > 0 && <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                              Follow-ups
                            </h4>
                            <div className="space-y-2">
                              {interaction.followUps.map((item, i) => <div key={i} className="flex items-center space-x-2 text-sm">
                                  <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"></div>
                                  <span className="text-gray-700">{item}</span>
                                </div>)}
                            </div>
                          </div>}
                      </div>
                    </div>)}
                </div>
              </div>
            </div>}
          {detailTab === 'contracts' && <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Contract Management
                </h2>
                <button onClick={() => setShowNewContractModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2">
                  <PlusIcon className="h-4 w-4" />
                  <span>New Contract</span>
                </button>
              </div>
              <div className="space-y-6">
                {getOrgContracts(orgId).map(contract => <div key={contract.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {contract.type}
                          </h3>
                          <p className="text-sm text-gray-500">{contract.id}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(contract.status)}`}>
                          {contract.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                            Contract Details
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Value:</span>
                              <span className="text-gray-900 font-medium">
                                {contract.value}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Start Date:</span>
                              <span className="text-gray-900">
                                {contract.startDate || 'Not started'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">End Date:</span>
                              <span className="text-gray-900">
                                {contract.endDate || 'Not set'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Auto-Renew:</span>
                              <span className="text-gray-900">
                                {contract.autoRenew ? 'Yes' : 'No'}
                              </span>
                            </div>
                            {contract.renewalPeriod && <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                  Renewal Period:
                                </span>
                                <span className="text-gray-900">
                                  {contract.renewalPeriod}
                                </span>
                              </div>}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                            Signature Information
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Signed By:</span>
                              <span className="text-gray-900">
                                {contract.signedBy || 'Not signed'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">
                                Signed Date:
                              </span>
                              <span className="text-gray-900">
                                {contract.signedDate || 'Not signed'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">
                                Renewal Reminder:
                              </span>
                              <span className="text-gray-900">
                                {contract.renewalReminder}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Documents */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                          Documents
                        </h4>
                        <div className="space-y-2 mb-4">
                          {contract.documents.map((doc, i) => <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileTextIcon className="h-5 w-5 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {doc.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {doc.size} • Uploaded {doc.uploaded}
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50">
                                  <DownloadIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>)}
                        </div>
                        <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg text-sm flex items-center justify-center space-x-2 hover:bg-gray-50">
                          <UploadIcon className="h-4 w-4" />
                          <span>Upload Document</span>
                        </button>
                      </div>
                      {/* Contract Actions */}
                      <div className="mt-6 flex space-x-3">
                        {contract.status !== 'Active' && <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700">
                            Request E-Signature
                          </button>}
                        <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50">
                          View Contract
                        </button>
                        <button className="bg-white border border-gray-300 text-gray-700 p-2 rounded-lg text-sm hover:bg-gray-50">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>}
          {detailTab === 'forms' && <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Forms & Submissions
                </h2>
                <button onClick={() => setShowNewFormModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2">
                  <PlusIcon className="h-4 w-4" />
                  <span>Create Form</span>
                </button>
              </div>
              <div className="space-y-6">
                {getOrgForms(orgId).map(form => <div key={form.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {form.name}
                          </h3>
                          <div className="flex items-center space-x-3">
                            <p className="text-sm text-gray-500">{form.id}</p>
                            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                              {form.type}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(form.status)}`}>
                          {form.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                            Form Details
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Sent Date:</span>
                              <span className="text-gray-900">
                                {form.sentDate || 'Not sent'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">
                                Completed Date:
                              </span>
                              <span className="text-gray-900">
                                {form.completedDate || 'Not completed'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Questions:</span>
                              <span className="text-gray-900">
                                {form.questions}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Respondent:</span>
                              <span className="text-gray-900">
                                {form.respondent || 'None'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                            Response Analytics
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">
                                Response Rate:
                              </span>
                              <span className="text-gray-900 font-medium">
                                {form.responseRate}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">
                                Submissions:
                              </span>
                              <span className="text-gray-900">
                                {form.submissions}
                              </span>
                            </div>
                            {form.trackingLink && <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                  Tracking Link:
                                </span>
                                <a href="#" className="text-blue-600 hover:underline flex items-center">
                                  <LinkIcon className="h-3 w-3 mr-1" />
                                  Link
                                </a>
                              </div>}
                          </div>
                        </div>
                      </div>
                      {/* Form Actions */}
                      <div className="flex space-x-3">
                        {form.status === 'Completed' ? <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center space-x-2">
                            <BarChartIcon className="h-4 w-4" />
                            <span>View Responses</span>
                          </button> : form.status === 'Draft' ? <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700">
                            Edit Form
                          </button> : form.status === 'Pending' ? <button className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-yellow-700 flex items-center justify-center space-x-2">
                            <LinkIcon className="h-4 w-4" />
                            <span>Send Reminder</span>
                          </button> : null}
                        <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50">
                          View Form
                        </button>
                        <button className="bg-white border border-gray-300 text-gray-700 p-2 rounded-lg text-sm hover:bg-gray-50">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>}
        </div>
      </div>;
  };
  // New component for the organization dashboard
  const OrganizationDashboard = ({
    orgId
  }: {
    orgId: string;
  }) => {
    const org = getOrganization(orgId);
    const [timeRange, setTimeRange] = useState('30d');
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    // Mock data for the dashboard
    const dashboardData = {
      kpis: {
        totalSamples: 4328,
        completionRate: 94.7,
        averageTAT: 17.3,
        rejectionRate: 2.1,
        totalSamplesTrend: '+12.4%',
        completionRateTrend: '+1.2%',
        averageTATTrend: '-0.8h',
        rejectionRateTrend: '-0.3%'
      },
      volumeTrend: [{
        date: '2023-12-15',
        samples: 132,
        anomaly: false
      }, {
        date: '2023-12-16',
        samples: 141,
        anomaly: false
      }, {
        date: '2023-12-17',
        samples: 125,
        anomaly: false
      }, {
        date: '2023-12-18',
        samples: 156,
        anomaly: false
      }, {
        date: '2023-12-19',
        samples: 138,
        anomaly: false
      }, {
        date: '2023-12-20',
        samples: 148,
        anomaly: false
      }, {
        date: '2023-12-21',
        samples: 152,
        anomaly: false
      }, {
        date: '2023-12-22',
        samples: 142,
        anomaly: false
      }, {
        date: '2023-12-23',
        samples: 130,
        anomaly: false
      }, {
        date: '2023-12-24',
        samples: 94,
        anomaly: true
      }, {
        date: '2023-12-25',
        samples: 85,
        anomaly: true
      }, {
        date: '2023-12-26',
        samples: 132,
        anomaly: false
      }, {
        date: '2023-12-27',
        samples: 140,
        anomaly: false
      }, {
        date: '2023-12-28',
        samples: 145,
        anomaly: false
      }, {
        date: '2023-12-29',
        samples: 156,
        anomaly: false
      }, {
        date: '2023-12-30',
        samples: 159,
        anomaly: false
      }, {
        date: '2023-12-31',
        samples: 151,
        anomaly: false
      }, {
        date: '2024-01-01',
        samples: 88,
        anomaly: true
      }, {
        date: '2024-01-02',
        samples: 162,
        anomaly: false
      }, {
        date: '2024-01-03',
        samples: 164,
        anomaly: false
      }, {
        date: '2024-01-04',
        samples: 159,
        anomaly: false
      }, {
        date: '2024-01-05',
        samples: 168,
        anomaly: false
      }, {
        date: '2024-01-06',
        samples: 142,
        anomaly: false
      }, {
        date: '2024-01-07',
        samples: 139,
        anomaly: false
      }, {
        date: '2024-01-08',
        samples: 158,
        anomaly: false
      }, {
        date: '2024-01-09',
        samples: 165,
        anomaly: false
      }, {
        date: '2024-01-10',
        samples: 169,
        anomaly: false
      }, {
        date: '2024-01-11',
        samples: 172,
        anomaly: false
      }, {
        date: '2024-01-12',
        samples: 179,
        anomaly: false
      }, {
        date: '2024-01-13',
        samples: 145,
        anomaly: false
      }, {
        date: '2024-01-14',
        samples: 137,
        anomaly: false
      }, {
        date: '2024-01-15',
        samples: 176,
        anomaly: false
      }],
      testTypes: [{
        name: 'Complete Blood Count',
        value: 1842
      }, {
        name: 'Lipid Panel',
        value: 945
      }, {
        name: 'Liver Function',
        value: 723
      }, {
        name: 'Thyroid Panel',
        value: 512
      }, {
        name: 'Urinalysis',
        value: 306
      }],
      locationPerformance: [{
        location: 'Main Campus',
        samples: 2156,
        completionRate: 96.2,
        averageTAT: 15.8,
        rejectionRate: 1.8
      }, {
        location: 'North Branch',
        samples: 1247,
        completionRate: 93.5,
        averageTAT: 18.2,
        rejectionRate: 2.3
      }, {
        location: 'Downtown Clinic',
        samples: 925,
        completionRate: 94.1,
        averageTAT: 19.7,
        rejectionRate: 2.7
      }],
      insights: [{
        type: 'positive',
        text: 'Sample volume increased by 12.4% compared to previous period'
      }, {
        type: 'positive',
        text: 'Completion rate improved by 1.2 percentage points'
      }, {
        type: 'positive',
        text: 'Average turnaround time decreased by 0.8 hours'
      }, {
        type: 'neutral',
        text: 'CBC samples make up 42.6% of all samples processed'
      }, {
        type: 'warning',
        text: 'North Branch location has 2.3% higher rejection rate than Main Campus'
      }, {
        type: 'warning',
        text: 'Significant sample volume drops detected on holidays (Dec 24-25, Jan 1)'
      }]
    };
    // Function to get trend icon and color
    const getTrendIndicator = (trend: string) => {
      if (trend.startsWith('+')) {
        return {
          icon: <TrendingUpIcon className="h-4 w-4" />,
          color: 'text-green-500'
        };
      } else if (trend.startsWith('-')) {
        // For TAT, negative is good (less time)
        if (trend.includes('h')) {
          return {
            icon: <TrendingUpIcon className="h-4 w-4" />,
            color: 'text-green-500'
          };
        }
        return {
          icon: <ArrowDownIcon className="h-4 w-4" />,
          color: 'text-red-500'
        };
      }
      return {
        icon: null,
        color: 'text-gray-500'
      };
    };
    // Get colors for the insights
    const getInsightColor = (type: string) => {
      switch (type) {
        case 'positive':
          return 'bg-green-50 text-green-700 border-green-200';
        case 'warning':
          return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        case 'negative':
          return 'bg-red-50 text-red-700 border-red-200';
        default:
          return 'bg-blue-50 text-blue-700 border-blue-200';
      }
    };
    // Get icons for the insights
    const getInsightIcon = (type: string) => {
      switch (type) {
        case 'positive':
          return <TrendingUpIcon className="h-5 w-5 text-green-500" />;
        case 'warning':
          return <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />;
        case 'negative':
          return <AlertCircleIcon className="h-5 w-5 text-red-500" />;
        default:
          return <PieChartIcon className="h-5 w-5 text-blue-500" />;
      }
    };
    // Custom tooltip for the volume chart
    const CustomTooltip = ({
      active,
      payload,
      label
    }: any) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return <div className="bg-white p-3 shadow-md rounded-lg border border-gray-200">
            <p className="font-medium text-gray-900">
              {new Date(data.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Samples:</span> {data.samples}
            </p>
            {data.anomaly && <p className="text-xs text-yellow-600 font-medium mt-1">
                Anomaly detected
              </p>}
          </div>;
      }
      return null;
    };
    return <div className="space-y-8">
        {/* Header with actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Lab Performance Dashboard
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-1">
              {['7d', '30d', '90d', 'YTD'].map(range => <button key={range} onClick={() => setTimeRange(range)} className={`px-3 py-1 text-sm rounded-md transition-colors ${timeRange === range ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  {range}
                </button>)}
            </div>
            <button onClick={() => setIsReportModalOpen(true)} className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
              <CalendarIcon className="h-4 w-4" />
              <span>Schedule Report</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <DownloadIcon className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
        {/* Main KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Total Samples
              </h3>
              <div className={`flex items-center ${getTrendIndicator(dashboardData.kpis.totalSamplesTrend).color}`}>
                {getTrendIndicator(dashboardData.kpis.totalSamplesTrend).icon}
                <span className="ml-1 text-xs font-medium">
                  {dashboardData.kpis.totalSamplesTrend}
                </span>
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-gray-900">
                {dashboardData.kpis.totalSamples.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 mb-1">samples</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">Last 30 days</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Completion Rate
              </h3>
              <div className={`flex items-center ${getTrendIndicator(dashboardData.kpis.completionRateTrend).color}`}>
                {getTrendIndicator(dashboardData.kpis.completionRateTrend).icon}
                <span className="ml-1 text-xs font-medium">
                  {dashboardData.kpis.completionRateTrend}
                </span>
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-gray-900">
                {dashboardData.kpis.completionRate}%
              </span>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{
              width: `${dashboardData.kpis.completionRate}%`
            }}></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Average TAT</h3>
              <div className={`flex items-center ${getTrendIndicator(dashboardData.kpis.averageTATTrend).color}`}>
                {getTrendIndicator(dashboardData.kpis.averageTATTrend).icon}
                <span className="ml-1 text-xs font-medium">
                  {dashboardData.kpis.averageTATTrend}
                </span>
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-gray-900">
                {dashboardData.kpis.averageTAT}
              </span>
              <span className="text-sm text-gray-500 mb-1">hours</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              From receipt to result
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Rejection Rate
              </h3>
              <div className={`flex items-center ${getTrendIndicator(dashboardData.kpis.rejectionRateTrend).color}`}>
                {getTrendIndicator(dashboardData.kpis.rejectionRateTrend).icon}
                <span className="ml-1 text-xs font-medium">
                  {dashboardData.kpis.rejectionRateTrend}
                </span>
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-gray-900">
                {dashboardData.kpis.rejectionRate}%
              </span>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-red-500 h-1.5 rounded-full" style={{
              width: `${dashboardData.kpis.rejectionRate * 10}%`
            }}></div>
            </div>
          </div>
        </div>
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sample Volume Trend Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-base font-medium text-gray-900 mb-4">
              Sample Volume Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.volumeTrend} margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={date => new Date(date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                })} tick={{
                  fontSize: 12
                }} tickMargin={10} tickCount={7} />
                  <YAxis tick={{
                  fontSize: 12
                }} tickMargin={10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="samples" stroke="#3b82f6" strokeWidth={2} dot={props => {
                  const {
                    cx,
                    cy,
                    payload
                  } = props;
                  if (payload.anomaly) {
                    return <circle cx={cx} cy={cy} r={5} fill="#fef3c7" stroke="#f59e0b" strokeWidth={2} />;
                  }
                  return <circle cx={cx} cy={cy} r={3} fill="#3b82f6" />;
                }} activeDot={{
                  r: 6
                }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-100 border-2 border-yellow-400 mr-1"></div>
                <span>Anomaly detected</span>
              </div>
              <span>Last {timeRange}</span>
            </div>
          </div>
          {/* Test Type Distribution Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-base font-medium text-gray-900 mb-4">
              Test Type Distribution
            </h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dashboardData.testTypes} cx="50%" cy="50%" labelLine={false} innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name">
                    {dashboardData.testTypes.map((entry, index) => <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][index % 5]} />)}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} samples`, 'Volume']} labelFormatter={name => name} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" formatter={(value, entry, index) => <span className="text-xs text-gray-700">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Location Performance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-900">
              Location Performance Comparison
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Samples
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. TAT (hours)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rejection Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData.locationPerformance.map((location, index) => <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <MapPinIcon className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {location.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {location.samples.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 mr-2">
                          {location.completionRate}%
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{
                        width: `${location.completionRate}%`
                      }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {location.averageTAT}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 mr-2">
                          {location.rejectionRate}%
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-red-500 h-1.5 rounded-full" style={{
                        width: `${location.rejectionRate * 10}%`
                      }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
        {/* Insights Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-medium text-gray-900">
              Automated Insights
            </h3>
            <span className="text-xs text-gray-500">
              Last updated: Today, 9:45 AM
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.insights.map((insight, index) => <div key={index} className={`p-4 rounded-lg border flex items-start space-x-3 ${getInsightColor(insight.type)}`}>
                <div className="flex-shrink-0">
                  {getInsightIcon(insight.type)}
                </div>
                <p className="text-sm">{insight.text}</p>
              </div>)}
          </div>
        </div>
        {/* Report Scheduling Modal */}
        {isReportModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Schedule Report
                  </h3>
                  <button onClick={() => setIsReportModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Name
                  </label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Monthly Lab Performance Report" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option selected>Monthly</option>
                    <option>Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipients
                  </label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="email@example.com, email2@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Format
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input type="radio" name="format" className="h-4 w-4 text-blue-600" checked />
                      <span className="ml-2 text-sm text-gray-700">PDF</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="format" className="h-4 w-4 text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">Excel</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="format" className="h-4 w-4 text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">CSV</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Schedule Report
                </button>
              </div>
            </div>
          </div>}
      </div>;
  };
  // RBAC Management Section
  const RBACManagement = () => {
    return <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Role-Based Access Control
            </h2>
            <p className="text-gray-600">Manage user roles and permissions</p>
          </div>
          <button onClick={() => setShowNewRoleModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <PlusIcon className="h-4 w-4" />
            <span>Create Role</span>
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roles.map(role => <div key={role.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {role.name}
                    </h3>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {role.userCount} users
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Permissions
                </h4>
                <div className="space-y-4">
                  {Object.entries(role.permissions).map(([module, perms]) => <div key={module} className="border border-gray-100 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                        <h5 className="text-sm font-medium text-gray-700 capitalize">
                          {module}
                        </h5>
                      </div>
                      <div className="p-4 grid grid-cols-2 gap-2">
                        {Object.entries(perms).map(([perm, enabled]) => <div key={perm} className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className="text-sm text-gray-700 capitalize">
                              {perm}
                            </span>
                          </div>)}
                      </div>
                    </div>)}
                </div>
                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50">
                    Edit Role
                  </button>
                  <button className="bg-white border border-gray-300 text-gray-700 p-2 rounded-lg text-sm hover:bg-gray-50">
                    <UsersIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>)}
        </div>
        {/* Audit Logs */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Security Audit Logs
            </h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Export Logs
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {auditLogs.map(log => <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${log.action === 'Create' ? 'bg-green-100 text-green-800' : log.action === 'Update' ? 'bg-blue-100 text-blue-800' : log.action === 'Delete' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.resource} ({log.resourceId})
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {log.details}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.ipAddress}
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>;
  };
  return <div className="p-6 w-full bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Laboratory Relationship Management
            </h1>
            <p className="text-gray-600">
              Manage organization relationships, contracts, and interactions
            </p>
          </div>
        </div>
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <nav className="flex">
            {[{
            key: 'dashboard',
            label: 'Organizations',
            icon: BuildingIcon
          }, {
            key: 'contracts',
            label: 'Contracts',
            icon: FileTextIcon
          }, {
            key: 'forms',
            label: 'Forms',
            icon: ClipboardIcon
          }].map(tab => {
            const Icon = tab.icon;
            return <button key={tab.key} onClick={() => setSelectedTab(tab.key)} className={`flex-1 flex items-center justify-center space-x-3 py-6 px-4 font-medium text-sm transition-all duration-200 ${selectedTab === tab.key ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>;
          })}
          </nav>
        </div>
      </div>
      {/* Dashboard / Organizations Tab */}
      {selectedTab === 'dashboard' && !selectedOrg && <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Organizations
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {organizations.length}
                  </p>
                </div>
                <div className="p-4 bg-blue-100 rounded-full">
                  <BuildingIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                  <span className="text-green-600 font-medium">
                    {organizations.filter(o => o.status === 'Active').length}{' '}
                    Active
                  </span>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">
                    {organizations.filter(o => o.status === 'Prospect').length}{' '}
                    Prospects
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Active Contracts
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {contracts.filter(c => c.status === 'Active').length}
                  </p>
                </div>
                <div className="p-4 bg-green-100 rounded-full">
                  <FileTextIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                  <span className="text-orange-600 font-medium">
                    {contracts.filter(c => c.status === 'Renewal Pending').length}{' '}
                    Pending Renewal
                  </span>
                </div>
                <div>
                  <span className="text-purple-600 font-medium">
                    {contracts.filter(c => c.status === 'Draft' || c.status === 'Pending').length}{' '}
                    In Progress
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Pending Forms
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {forms.filter(f => f.status === 'Pending').length}
                  </p>
                </div>
                <div className="p-4 bg-yellow-100 rounded-full">
                  <ClipboardIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                  <span className="text-green-600 font-medium">
                    {forms.filter(f => f.status === 'Completed').length}{' '}
                    Completed
                  </span>
                </div>
                <div>
                  <span className="text-purple-600 font-medium">
                    {forms.filter(f => f.status === 'Draft').length} Drafts
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Recent Interactions
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {interactions.filter(i => new Date(i.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                  </p>
                </div>
                <div className="p-4 bg-purple-100 rounded-full">
                  <HeartHandshakeIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-600 font-medium">Last 7 days</span>
                </div>
                <div>
                  <button className="text-blue-600 hover:underline">
                    View All
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Organization Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Organizations
              </h2>
              <div className="flex space-x-4">
                <div className="relative">
                  <SearchIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input type="text" placeholder="Search organizations..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Prospect">Prospect</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <button className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200">
                  <FilterIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Manager
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contract
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Interaction
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrganizations.map(org => <tr key={org.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrg(org.id)}>
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
                              {org.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {org.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(org.status)}`}>
                          {org.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {org.accountManager}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(org.contractStatus)}`}>
                          {org.contractStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {org.revenue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {org.lastInteraction}
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>}
      {/* Selected Organization Detail View */}
      {selectedTab === 'dashboard' && selectedOrg && <OrganizationDetail orgId={selectedOrg} />}
      {/* Contracts Tab */}
      {selectedTab === 'contracts' && <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Contract Management
              </h2>
              <div className="flex space-x-4">
                <div className="relative">
                  <SearchIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input type="text" placeholder="Search contracts..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Renewal Pending">Renewal Pending</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                </select>
                <button onClick={() => setShowNewContractModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
                  <PlusIcon className="h-4 w-4" />
                  <span>New Contract</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contract
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contracts.map(contract => <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <FileTextIcon className="h-5 w-5 text-green-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {contract.type}
                            </div>
                            <div className="text-sm text-gray-500">
                              {contract.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.orgName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {contract.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contract.status)}`}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.startDate || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.endDate || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Edit
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
          {/* Contract Renewal Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Contract Renewal Timeline
              </h2>
              <div className="flex space-x-4">
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200">
                  Next 30 Days
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200">
                  Next 90 Days
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200">
                  All
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {contracts.filter(c => c.endDate && new Date(c.endDate) > new Date()).sort((a, b) => new Date(a.endDate || '').getTime() - new Date(b.endDate || '').getTime()).slice(0, 3).map(contract => <div key={contract.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center mr-4">
                      <span className="text-sm font-bold text-gray-900">
                        {new Date(contract.endDate || '').toLocaleDateString(undefined, {
                  month: 'short'
                })}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {new Date(contract.endDate || '').getDate()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {contract.orgName}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contract.status)}`}>
                          {contract.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {contract.type} • {contract.value}
                      </p>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">
                          {contract.endDate && new Date() > new Date(new Date(contract.endDate).getTime() - 90 * 24 * 60 * 60 * 1000) ? `Renewal in ${Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000))} days` : `Expires on ${contract.endDate}`}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                        Start Renewal
                      </button>
                    </div>
                  </div>)}
            </div>
          </div>
        </div>}
      {/* Forms Tab */}
      {selectedTab === 'forms' && <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Form Management
              </h2>
              <div className="flex space-x-4">
                <div className="relative">
                  <SearchIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input type="text" placeholder="Search forms..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="All">All Status</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
                <button onClick={() => setShowNewFormModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
                  <PlusIcon className="h-4 w-4" />
                  <span>Create Form</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Form
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sent Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Response Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {forms.map(form => <tr key={form.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <ClipboardIcon className="h-5 w-5 text-purple-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {form.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {form.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.orgName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                          {form.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(form.status)}`}>
                          {form.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.sentDate || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {form.responseRate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {form.status === 'Completed' ? <button className="text-green-600 hover:text-green-900 mr-4">
                            Results
                          </button> : form.status === 'Pending' ? <button className="text-blue-600 hover:text-blue-900 mr-4">
                            Send Reminder
                          </button> : null}
                        <button className="text-gray-600 hover:text-gray-900">
                          View
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
          {/* Form Templates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Form Templates
              </h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
                <PlusIcon className="h-4 w-4" />
                <span>Create Template</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[{
            name: 'Customer Satisfaction Survey',
            description: 'Standard CSAT survey with NPS scoring',
            questions: 10,
            category: 'Satisfaction',
            lastUsed: '2024-01-10'
          }, {
            name: 'Service Requirements Questionnaire',
            description: 'Gather detailed service requirements from new clients',
            questions: 15,
            category: 'Requirements',
            lastUsed: '2024-01-05'
          }, {
            name: 'Contract Renewal Survey',
            description: 'Pre-renewal feedback and requirements gathering',
            questions: 12,
            category: 'Contract',
            lastUsed: '2024-01-12'
          }].map((template, i) => <div key={i} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {template.name}
                      </h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 mt-1 inline-block">
                        {template.category}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {template.questions} questions
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {template.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Last used: {template.lastUsed}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Use Template
                    </button>
                  </div>
                </div>)}
            </div>
          </div>
        </div>}
      {/* RBAC Tab */}
      {selectedTab === 'rbac' && <RBACManagement />}
      {/* Modals would be implemented here */}
      {/* For brevity, I'm omitting the actual modal implementations */}
    </div>;
}