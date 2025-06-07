import React, { useState, Component } from 'react';
import { FileTextIcon, EditIcon, CopyIcon, PlusIcon, SearchIcon, ClipboardListIcon, UsersIcon, LockIcon, ShieldIcon, TrashIcon, AlertCircleIcon, LightbulbIcon, FilterIcon, XIcon, CheckIcon, CodeIcon, UploadIcon, DatabaseIcon } from 'lucide-react';
import { developmentLog } from '../utils/mockData';
import { importTestMethodsAndPanels, ImportResult } from '../utils/dataImporter';

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

// Mock feature requests data
const featureRequests = [{
  id: 'FR001',
  title: 'Batch Sample Processing',
  description: 'Allow processing multiple samples at once with a single click',
  status: 'Completed',
  priority: 'High',
  votes: 42,
  requestDate: '2023-12-05',
  requester: 'Sarah Johnson',
  department: 'Lab Operations',
  comments: 3
}, {
  id: 'FR002',
  title: 'Advanced Search Filters',
  description: 'Add more granular search filters for finding specific samples',
  status: 'In Progress',
  priority: 'Medium',
  votes: 28,
  requestDate: '2024-01-03',
  requester: 'Michael Chen',
  department: 'Data Analysis',
  comments: 5
}, {
  id: 'FR003',
  title: 'Email Notifications for Results',
  description: 'Send automatic email notifications when test results are ready',
  status: 'Pending',
  priority: 'High',
  votes: 37,
  requestDate: '2024-01-08',
  requester: 'Emily Rodriguez',
  department: 'Client Relations',
  comments: 2
}, {
  id: 'FR004',
  title: 'Dark Mode Interface',
  description: 'Add a dark mode option for the entire application',
  status: 'Rejected',
  priority: 'Low',
  votes: 15,
  requestDate: '2023-11-20',
  requester: 'David Wilson',
  department: 'IT',
  comments: 4
}, {
  id: 'FR005',
  title: 'Custom Dashboard Widgets',
  description: 'Allow users to customize their dashboard with drag-and-drop widgets',
  status: 'Pending',
  priority: 'Medium',
  votes: 31,
  requestDate: '2024-01-12',
  requester: 'Jennifer Adams',
  department: 'Management',
  comments: 1
}, {
  id: 'FR006',
  title: 'Mobile Application',
  description: 'Create a mobile app version for on-the-go access',
  status: 'In Progress',
  priority: 'High',
  votes: 53,
  requestDate: '2023-12-15',
  requester: 'Robert Brown',
  department: 'Field Operations',
  comments: 7
}, {
  id: 'FR007',
  title: 'Integration with EHR Systems',
  description: 'Create APIs for seamless integration with electronic health record systems',
  status: 'Pending',
  priority: 'High',
  votes: 48,
  requestDate: '2024-01-05',
  requester: 'Lisa Thompson',
  department: 'IT',
  comments: 6
}, {
  id: 'FR008',
  title: 'Automated Quality Control Reports',
  description: 'Generate QC reports automatically based on test results',
  status: 'Completed',
  priority: 'Medium',
  votes: 24,
  requestDate: '2023-11-30',
  requester: 'James Miller',
  department: 'Quality Assurance',
  comments: 2
}, {
  id: 'FR009',
  title: 'Inventory Management System',
  description: 'Add inventory tracking for lab supplies and reagents',
  status: 'In Progress',
  priority: 'Medium',
  votes: 33,
  requestDate: '2023-12-20',
  requester: 'Maria Garcia',
  department: 'Logistics',
  comments: 4
}, {
  id: 'FR010',
  title: 'Multi-language Support',
  description: 'Add support for multiple languages in the user interface',
  status: 'Rejected',
  priority: 'Low',
  votes: 12,
  requestDate: '2023-11-10',
  requester: 'Alex Rodriguez',
  department: 'International Relations',
  comments: 3
}];

const tests = [{
  id: 'T001',
  name: 'Complete Blood Count',
  category: 'Hematology',
  price: '$45.00',
  turnaroundTime: '2-4 hours',
  status: 'Active'
}, {
  id: 'T002',
  name: 'Lipid Panel',
  category: 'Chemistry',
  price: '$65.00',
  turnaroundTime: '4-6 hours',
  status: 'Active'
}, {
  id: 'T003',
  name: 'Liver Function Test',
  category: 'Chemistry',
  price: '$55.00',
  turnaroundTime: '4-6 hours',
  status: 'Active'
}, {
  id: 'T004',
  name: 'Thyroid Panel',
  category: 'Endocrinology',
  price: '$85.00',
  turnaroundTime: '6-8 hours',
  status: 'Active'
}, {
  id: 'T005',
  name: 'Urinalysis',
  category: 'Microbiology',
  price: '$25.00',
  turnaroundTime: '1-2 hours',
  status: 'Active'
}, {
  id: 'T006',
  name: 'Blood Culture',
  category: 'Microbiology',
  price: '$75.00',
  turnaroundTime: '24-48 hours',
  status: 'Inactive'
}];

// RBAC Management Component
const RBACManagement = () => {
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
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

export function Settings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('tests');
  // Simulate admin role check (in a real app, this would check against user session/auth)
  const [isAdmin, setIsAdmin] = useState(true);
  // Feature requests state
  const [featureSearchTerm, setFeatureSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showNewFeatureModal, setShowNewFeatureModal] = useState(false);
  const [newFeature, setNewFeature] = useState({
    title: '',
    description: '',
    priority: 'Medium'
  });

  // Development log state
  const [devLogSearchTerm, setDevLogSearchTerm] = useState('');
  const [devLogTypeFilter, setDevLogTypeFilter] = useState('All');
  const [devLogStatusFilter, setDevLogStatusFilter] = useState('All');

  // Data import state
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) || test.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || test.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  // Filter feature requests
  const filteredFeatures = featureRequests.filter(feature => {
    const matchesSearch = feature.title.toLowerCase().includes(featureSearchTerm.toLowerCase()) || feature.description.toLowerCase().includes(featureSearchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || feature.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || feature.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Filter development log
  const filteredDevLog = developmentLog.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(devLogSearchTerm.toLowerCase()) || 
                         entry.description.toLowerCase().includes(devLogSearchTerm.toLowerCase());
    const matchesType = devLogTypeFilter === 'All' || entry.type === devLogTypeFilter;
    const matchesStatus = devLogStatusFilter === 'All' || entry.status === devLogStatusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const categories = ['All', ...Array.from(new Set(tests.map(test => test.category)))];
  
  // Get color for feature status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Implemented':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
      case 'Planned':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'On Hold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  // Get color for feature priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-orange-100 text-orange-800';
      case 'Low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get color for development log type
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Feature':
        return 'bg-blue-100 text-blue-800';
      case 'Structural Change':
        return 'bg-purple-100 text-purple-800';
      case 'Database Migration':
        return 'bg-green-100 text-green-800';
      case 'UI Enhancement':
        return 'bg-orange-100 text-orange-800';
      case 'Bug Fix':
        return 'bg-red-100 text-red-800';
      case 'Security Update':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle new feature submission
  const handleFeatureSubmit = () => {
    // In a real app, this would add the feature to the database
    console.log('New feature request:', newFeature);
    setShowNewFeatureModal(false);
    setNewFeature({
      title: '',
      description: '',
      priority: 'Medium'
    });
  };

  // Handle file import
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.tsv')) {
      setImportStatus('error');
      setImportResult({
        success: false,
        message: 'Please select a .txt or .tsv file',
        testMethodsCount: 0,
        testPanelsCount: 0
      });
      return;
    }

    setImportStatus('importing');
    setImportResult(null);

    try {
      const fileContent = await file.text();
      const result = await importTestMethodsAndPanels(fileContent);
      
      setImportResult(result);
      setImportStatus(result.success ? 'success' : 'error');
      
      // Clear the file input
      event.target.value = '';
    } catch (error) {
      setImportStatus('error');
      setImportResult({
        success: false,
        message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        testMethodsCount: 0,
        testPanelsCount: 0
      });
    }
  };

  // Admin access denied view
  const AdminAccessDenied = () => <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
      <AlertCircleIcon className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
      <p className="text-red-600 mb-4">
        You do not have administrator privileges required to access this
        section.
      </p>
      <p className="text-sm text-red-500">
        Please contact your system administrator for access.
      </p>
    </div>;
  return <div className="p-6 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">
          Manage system settings and configurations
        </p>
      </div>
      {/* Tab Navigation */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button onClick={() => setActiveTab('tests')} className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === 'tests' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Test Management
          </button>
          <button onClick={() => setActiveTab('data-import')} className={`py-4 px-1 font-medium text-sm border-b-2 flex items-center ${activeTab === 'data-import' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            <DatabaseIcon className="h-4 w-4 mr-2" />
            Data Import
          </button>
          <button onClick={() => setActiveTab('features')} className={`py-4 px-1 font-medium text-sm border-b-2 flex items-center ${activeTab === 'features' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            <LightbulbIcon className="h-4 w-4 mr-2" />
            Feature Requests
          </button>
          <button onClick={() => setActiveTab('development')} className={`py-4 px-1 font-medium text-sm border-b-2 flex items-center ${activeTab === 'development' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            <CodeIcon className="h-4 w-4 mr-2" />
            Development Log
          </button>
          <button onClick={() => setActiveTab('rbac')} className={`py-4 px-1 font-medium text-sm border-b-2 flex items-center ${activeTab === 'rbac' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            <LockIcon className="h-4 w-4 mr-2" />
            Access Control
            {isAdmin && <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                Admin
              </span>}
          </button>
        </nav>
      </div>
      {activeTab === 'tests' && <div className="mb-12 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Test Management
              </h2>
              <p className="text-gray-600">
                Manage laboratory tests and procedures
              </p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
              <PlusIcon className="h-4 w-4" />
              <span>Add Test</span>
            </button>
          </div>
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <SearchIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input type="text" placeholder="Search tests by name or ID..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              {categories.map(category => <option key={category} value={category}>
                  {category}
                </option>)}
            </select>
          </div>
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Turnaround Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTests.map(test => <tr key={test.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <ClipboardListIcon className="h-5 w-5 text-green-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {test.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {test.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {test.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {test.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {test.turnaroundTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${test.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {test.status}
                        </span>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>}

      {/* Data Import Tab */}
      {activeTab === 'data-import' && <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Data Import
              </h2>
              <p className="text-gray-600">
                Import test methods and panels from external data sources
              </p>
            </div>
          </div>

          {/* Test Methods and Panels Import */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <DatabaseIcon className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Test Methods & Panels Import
                </h3>
                <p className="text-sm text-gray-600">
                  Import test methods and their associated panels from a tab-separated file
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept=".txt,.tsv"
                    onChange={handleFileImport}
                    disabled={importStatus === 'importing'}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-medium
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {importStatus === 'importing' && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <svg className="animate-spin h-5 w-5\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                        <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm">Importing...</span>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Expected format: Tab-separated file with columns: Organization Code, Test Method Code, Test Method Name, Panel Code, Panel Name
                </p>
              </div>

              {/* Import Status */}
              {importResult && (
                <div className={`p-4 rounded-lg border ${
                  importResult.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start">
                    {importResult.success ? (
                      <CheckIcon className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                    ) : (
                      <AlertCircleIcon className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        importResult.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {importResult.message}
                      </p>
                      
                      {importResult.success && (
                        <div className="mt-2 text-sm text-green-700">
                          <p>• Test Methods: {importResult.testMethodsCount}</p>
                          <p>• Test Panels: {importResult.testPanelsCount}</p>
                        </div>
                      )}

                      {importResult.errors && importResult.errors.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-yellow-800 mb-2">
                            Warnings ({importResult.errors.length}):
                          </p>
                          <div className="max-h-32 overflow-y-auto">
                            {importResult.errors.slice(0, 5).map((error, index) => (
                              <p key={index} className="text-xs text-yellow-700">
                                • {error}
                              </p>
                            ))}
                            {importResult.errors.length > 5 && (
                              <p className="text-xs text-yellow-600 mt-1">
                                ... and {importResult.errors.length - 5} more warnings
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* File Format Example */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Expected File Format Example:
                </h4>
                <pre className="text-xs text-gray-700 overflow-x-auto">
{`Organization Code	Test Method Code	Test Method Name	Panel Code	Panel Name
AMMO	PCR Testing	PCR Testing	HPV	Human Papillomavirus (HPV)
AMMO	PCR Testing	PCR Testing	UTI	UTI
AMMO	AMA Confirmation	AMA Confirmation	FCONFM	Full Confirmation - Specimen Type Urine`}
                </pre>
              </div>
            </div>
          </div>
        </div>}

      {/* Feature Requests Tab */}
      {activeTab === 'features' && <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Feature Requests
              </h2>
              <p className="text-gray-600">
                Submit and track feature requests for the system
              </p>
            </div>
            <button onClick={() => setShowNewFeatureModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
              <PlusIcon className="h-4 w-4" />
              <span>New Feature Request</span>
            </button>
          </div>
          {/* Filters and Search */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1">
              <SearchIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input type="text" placeholder="Search feature requests..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={featureSearchTerm} onChange={e => setFeatureSearchTerm(e.target.value)} />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200">
              <FilterIcon className="h-5 w-5" />
            </button>
          </div>
          {/* Feature Requests Table */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feature
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Votes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFeatures.map(feature => <tr key={feature.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <LightbulbIcon className="h-5 w-5 text-purple-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {feature.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {feature.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {feature.description}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Requested by: {feature.requester}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(feature.status)}`}>
                          {feature.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(feature.priority)}`}>
                          {feature.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-1">
                          <button className="text-gray-400 hover:text-blue-600">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <span className="font-medium">{feature.votes}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {feature.requestDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Comment
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
              {filteredFeatures.length === 0 && <div className="text-center py-8 text-gray-500">
                  No feature requests match the current filters
                </div>}
            </div>
          </div>
        </div>}

      {/* Development Log Tab */}
      {activeTab === 'development' && <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Development Log
              </h2>
              <p className="text-gray-600">
                Track development progress, features, and system changes
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {filteredDevLog.length} of {developmentLog.length} entries
              </span>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1">
              <SearchIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search development log..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={devLogSearchTerm} 
                onChange={e => setDevLogSearchTerm(e.target.value)} 
              />
            </div>
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={devLogTypeFilter} 
              onChange={e => setDevLogTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Feature">Feature</option>
              <option value="Structural Change">Structural Change</option>
              <option value="Database Migration">Database Migration</option>
              <option value="UI Enhancement">UI Enhancement</option>
              <option value="Bug Fix">Bug Fix</option>
              <option value="Security Update">Security Update</option>
            </select>
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={devLogStatusFilter} 
              onChange={e => setDevLogStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Implemented">Implemented</option>
              <option value="In Progress">In Progress</option>
              <option value="Planned">Planned</option>
              <option value="On Hold">On Hold</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Development Log Table */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDevLog.map(entry => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <CodeIcon className="h-5 w-5 text-indigo-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {entry.title}
                            </div>
                            <div className="text-sm text-gray-500 max-w-md">
                              {entry.description}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {entry.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(entry.type)}`}>
                          {entry.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(entry.status)}`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(entry.priority)}`}>
                          {entry.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{entry.date}</div>
                        {entry.implementedDate && entry.implementedDate !== entry.date && (
                          <div className="text-xs text-gray-500">
                            Implemented: {entry.implementedDate}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.assignee || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          View Details
                        </button>
                        {entry.relatedFiles && entry.relatedFiles.length > 0 && (
                          <button className="text-green-600 hover:text-green-900">
                            Files ({entry.relatedFiles.length})
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredDevLog.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No development log entries match the current filters
                </div>
              )}
            </div>
          </div>
        </div>}

      {/* RBAC Tab with Admin Check */}
      {activeTab === 'rbac' && <div>{isAdmin ? <RBACManagement /> : <AdminAccessDenied />}</div>}
      {/* New Feature Request Modal */}
      {showNewFeatureModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  New Feature Request
                </h3>
                <button onClick={() => setShowNewFeatureModal(false)} className="text-gray-400 hover:text-gray-500">
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feature Title
                </label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter feature title" value={newFeature.title} onChange={e => setNewFeature({
              ...newFeature,
              title: e.target.value
            })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describe the feature request in detail" rows={4} value={newFeature.description} onChange={e => setNewFeature({
              ...newFeature,
              description: e.target.value
            })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={newFeature.priority} onChange={e => setNewFeature({
              ...newFeature,
              priority: e.target.value
            })}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button onClick={() => setShowNewFeatureModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleFeatureSubmit} disabled={!newFeature.title || !newFeature.description} className={`px-4 py-2 rounded-md ${!newFeature.title || !newFeature.description ? 'bg-blue-300 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                Submit Request
              </button>
            </div>
          </div>
        </div>}
      {/* Admin Role Toggle (for demo purposes only) */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <ShieldIcon className="h-5 w-5 text-gray-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                Demo Mode: Admin Role Toggle
              </h3>
              <p className="text-xs text-gray-500">
                This toggle is for demonstration purposes only
              </p>
            </div>
          </div>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} />
              <div className={`block w-14 h-8 rounded-full ${isAdmin ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${isAdmin ? 'transform translate-x-6' : ''}`}></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              {isAdmin ? 'Administrator' : 'Standard User'}
            </span>
          </label>
        </div>
      </div>
    </div>;
}