import React from 'react';
import { UsersIcon, TestTubeIcon, ClockIcon, CheckCircleIcon, AlertTriangleIcon, TrendingUpIcon, CpuIcon, ThermometerIcon, DropletIcon } from 'lucide-react';
const stats = [{
  label: 'Total Patients',
  value: '1,247',
  icon: UsersIcon,
  color: 'blue'
}, {
  label: 'Pending Samples',
  value: '89',
  icon: TestTubeIcon,
  color: 'yellow'
}, {
  label: 'Tests in Progress',
  value: '156',
  icon: ClockIcon,
  color: 'orange'
}, {
  label: 'Completed Today',
  value: '342',
  icon: CheckCircleIcon,
  color: 'green'
}];
const recentSamples = [{
  id: 'S001',
  patient: 'John Doe',
  test: 'Complete Blood Count',
  status: 'In Progress',
  priority: 'High'
}, {
  id: 'S002',
  patient: 'Jane Smith',
  test: 'Lipid Panel',
  status: 'Completed',
  priority: 'Normal'
}, {
  id: 'S003',
  patient: 'Mike Johnson',
  test: 'Liver Function',
  status: 'Pending',
  priority: 'Urgent'
}, {
  id: 'S004',
  patient: 'Sarah Wilson',
  test: 'Thyroid Panel',
  status: 'In Progress',
  priority: 'Normal'
}];
const equipment = [{
  id: 'OT2-001',
  name: 'Opentrons OT-2 Alpha',
  status: 'Available',
  capacity: 8,
  currentLoad: 0,
  nextAvailable: 'Now'
}, {
  id: 'OT2-002',
  name: 'Opentrons OT-2 Beta',
  status: 'Running',
  capacity: 6,
  currentLoad: 6,
  nextAvailable: '10:30'
}, {
  id: 'FLEX-001',
  name: 'Opentrons Flex Gamma',
  status: 'Available',
  capacity: 12,
  currentLoad: 0,
  nextAvailable: 'Now'
}];
export function Dashboard() {
  const getEquipmentStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Running':
        return 'bg-blue-100 text-blue-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div className="p-6 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Laboratory Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of laboratory operations and current status
        </p>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(stat => {
        const Icon = stat.icon;
        return <div key={stat.label} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>;
      })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Samples */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Samples
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentSamples.map(sample => <div key={sample.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {sample.id}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${sample.priority === 'Urgent' ? 'bg-red-100 text-red-800' : sample.priority === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                        {sample.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{sample.patient}</p>
                    <p className="text-sm text-gray-500">{sample.test}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${sample.status === 'Completed' ? 'bg-green-100 text-green-800' : sample.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {sample.status}
                    </span>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
        {/* Alerts & Notifications */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Alerts & Notifications
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
                <AlertTriangleIcon className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">
                    Critical Result Alert
                  </p>
                  <p className="text-sm text-red-700">
                    Patient John Doe - Glucose level critically high
                  </p>
                  <p className="text-xs text-red-600 mt-1">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                <ClockIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">
                    Equipment Maintenance Due
                  </p>
                  <p className="text-sm text-yellow-700">
                    Hematology Analyzer requires calibration
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <TrendingUpIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Daily Target Achieved
                  </p>
                  <p className="text-sm text-blue-700">
                    Processed 300+ samples today
                  </p>
                  <p className="text-xs text-blue-600 mt-1">30 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Equipment Status Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Equipment Status
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {equipment.map(robot => <div key={robot.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CpuIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {robot.name}
                    </h3>
                    <p className="text-sm text-gray-500">{robot.id}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${getEquipmentStatusColor(robot.status)}`}>
                  {robot.status}
                </span>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Capacity
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {robot.currentLoad}/{robot.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className={`h-2 rounded-full transition-all duration-500 ${robot.currentLoad === 0 ? 'bg-green-500' : robot.currentLoad === robot.capacity ? 'bg-red-500' : 'bg-blue-500'}`} style={{
                width: `${robot.currentLoad / robot.capacity * 100}%`
              }}></div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Next Available:</span>
                  <span className="font-medium text-gray-900">
                    {robot.nextAvailable}
                  </span>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
}