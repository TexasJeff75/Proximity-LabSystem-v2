import React, { useState, useEffect } from 'react';
import { LayersIcon, FileTextIcon, SettingsIcon, TestTubeIcon, PlayIcon, RefreshCwIcon, PlusIcon, SearchIcon, FilterIcon, EditIcon, SaveIcon, XIcon, ClockIcon, AlertTriangleIcon, TrendingUpIcon } from 'lucide-react';
import { ProtocolLibraryTab } from '../components/ProtocolLibraryTab';
import { TestMethodConfigurationTab } from '../components/TestMethodConfigurationTab';
import { fetchOrders, Order } from '../services/orderService';

interface BatchOrder extends Order {
  isSelected?: boolean;
  batchId?: string;
  priority: 'High' | 'Normal' | 'Urgent' | 'Low';
}

interface Batch {
  id: string;
  name: string;
  testMethod: string;
  organization: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  orderCount: number;
  createdAt: string;
  estimatedCompletion?: string;
  progress?: number;
}

const mockBatches: Batch[] = [
  {
    id: 'B001',
    name: 'CBC Batch #1',
    testMethod: 'Complete Blood Count',
    organization: 'Metro Health System',
    status: 'Processing',
    orderCount: 24,
    createdAt: '2024-01-15T09:00:00',
    estimatedCompletion: '2024-01-15T11:30:00',
    progress: 65
  },
  {
    id: 'B002',
    name: 'Lipid Panel Batch #3',
    testMethod: 'Lipid Panel',
    organization: 'Community Care Clinics',
    status: 'Pending',
    orderCount: 18,
    createdAt: '2024-01-15T10:15:00'
  },
  {
    id: 'B003',
    name: 'Urinalysis Batch #2',
    testMethod: 'Urinalysis',
    organization: 'Regional Medical Group',
    status: 'Completed',
    orderCount: 32,
    createdAt: '2024-01-15T08:00:00'
  }
];

export function BatchProcessing() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [orders, setOrders] = useState<BatchOrder[]>([]);
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [testMethodFilter, setTestMethodFilter] = useState('All');

  const tabs = [
    { key: 'pipeline', label: 'Batch Pipeline', icon: LayersIcon },
    { key: 'protocols', label: 'Protocol Library', icon: FileTextIcon },
    { key: 'test-methods', label: 'Test Method Configuration', icon: SettingsIcon }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      // Add priority field and filter for batch processing
      const batchOrders: BatchOrder[] = data
        .filter(order => order.status !== 'Final')
        .map(order => ({
          ...order,
          priority: Math.random() > 0.7 ? 'High' : Math.random() > 0.5 ? 'Urgent' : Math.random() > 0.3 ? 'Normal' : 'Low'
        }));
      setOrders(batchOrders);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.accession_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || order.priority === priorityFilter;
    const matchesTestMethod = testMethodFilter === 'All' || order.test_method === testMethodFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTestMethod;
  });

  // Calculate statistics
  const stats = {
    total: filteredOrders.length,
    pending: filteredOrders.filter(o => o.status === 'Pending' || o.status === 'Pending Received').length,
    processing: filteredOrders.filter(o => o.status === 'In Progress').length,
    urgent: filteredOrders.filter(o => o.priority === 'Urgent').length,
    high: filteredOrders.filter(o => o.priority === 'High').length
  };

  const handleOrderSelection = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'Pending Received':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Normal':
        return 'bg-gray-100 text-gray-800';
      case 'Low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniqueValues = (key: keyof BatchOrder) => {
    return Array.from(new Set(orders.map(order => order[key]))).sort();
  };

  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <LayersIcon className="h-8 w-8 text-blue-600 mr-3" />
              Batch Processing Pipeline
            </h1>
            <p className="text-gray-600">
              Manage sample queues, batch formation, protocol assignment, and automated processing
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={loadOrders}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50"
            >
              <RefreshCwIcon className="h-4 w-4" />
              <span>Refresh Queue</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
              <PlayIcon className="h-4 w-4" />
              <span>Start Next Batch</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
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
      </div>

      {/* Pipeline Tab */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Samples</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <TestTubeIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Processing</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
                </div>
                <PlayIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Urgent</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.urgent}</p>
                </div>
                <AlertTriangleIcon className="h-8 w-8 text-red-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.high}</p>
                </div>
                <TrendingUpIcon className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sample Queue */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold text-gray-900">Sample Queue</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {filteredOrders.length} samples
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {/* Process selected */}}
                      disabled={selectedOrders.size === 0}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Process Selected
                    </button>
                    <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                      Create Batch
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                  <div className="relative">
                    <SearchIcon className="h-4 w-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search samples..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Status</option>
                    {getUniqueValues('status').map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Priorities</option>
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                  
                  <select
                    value={testMethodFilter}
                    onChange={(e) => setTestMethodFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Test Methods</option>
                    {getUniqueValues('test_method').map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-3 py-2 text-left">
                        <input
                          type="checkbox"
                          checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Accession ID
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Test Method
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Organization
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Collection Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className={`hover:bg-gray-50 ${selectedOrders.has(order.id) ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={selectedOrders.has(order.id)}
                            onChange={() => handleOrderSelection(order.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-3 py-2 text-sm font-medium text-gray-900">
                          {order.accession_id}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {order.patient_name}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {order.test_method}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {order.organization}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(order.priority)}`}>
                            {order.priority}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {new Date(order.collection_date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredOrders.length === 0 && (
                  <div className="text-center py-8">
                    <TestTubeIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No samples found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search terms or filters.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Active Batches */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Active Batches</h2>
              </div>
              <div className="p-4 space-y-4">
                {batches.map((batch) => (
                  <div key={batch.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{batch.name}</h3>
                        <p className="text-xs text-gray-500">{batch.testMethod}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(batch.status)}`}>
                        {batch.status}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      <p>{batch.organization}</p>
                      <p>{batch.orderCount} samples</p>
                    </div>

                    {batch.status === 'Processing' && batch.progress && (
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{batch.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${batch.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Created: {new Date(batch.createdAt).toLocaleTimeString()}</span>
                      {batch.estimatedCompletion && (
                        <span>ETA: {new Date(batch.estimatedCompletion).toLocaleTimeString()}</span>
                      )}
                    </div>
                  </div>
                ))}

                {batches.length === 0 && (
                  <div className="text-center py-8">
                    <LayersIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No active batches</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'protocols' && <ProtocolLibraryTab />}

      {activeTab === 'test-methods' && <TestMethodConfigurationTab />}
    </div>
  );
}