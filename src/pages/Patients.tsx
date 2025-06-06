import React, { useState } from 'react';
import { SearchIcon, PlusIcon, UserIcon, BuildingIcon } from 'lucide-react';
const patients = [{
  id: 'P001',
  name: 'John Doe',
  age: 45,
  gender: 'Male',
  phone: '(555) 123-4567',
  lastVisit: '2024-01-15',
  organizationId: 'ORG001',
  organizationName: 'Metro Health System',
  providerId: 'PROV001',
  providerName: 'Dr. Sarah Johnson'
}, {
  id: 'P002',
  name: 'Jane Smith',
  age: 32,
  gender: 'Female',
  phone: '(555) 234-5678',
  lastVisit: '2024-01-14',
  organizationId: 'ORG002',
  organizationName: 'Community Care Clinics',
  providerId: 'PROV003',
  providerName: 'Dr. Emily Rodriguez'
}, {
  id: 'P003',
  name: 'Mike Johnson',
  age: 58,
  gender: 'Male',
  phone: '(555) 345-6789',
  lastVisit: '2024-01-13',
  organizationId: 'ORG001',
  organizationName: 'Metro Health System',
  providerId: 'PROV002',
  providerName: 'Dr. Michael Chen'
}, {
  id: 'P004',
  name: 'Sarah Wilson',
  age: 29,
  gender: 'Female',
  phone: '(555) 456-7890',
  lastVisit: '2024-01-12',
  organizationId: 'ORG003',
  organizationName: 'Regional Medical Group',
  providerId: 'PROV005',
  providerName: 'Dr. Lisa Thompson'
}, {
  id: 'P005',
  name: 'Robert Brown',
  age: 67,
  gender: 'Male',
  phone: '(555) 567-8901',
  lastVisit: '2024-01-11',
  organizationId: 'ORG002',
  organizationName: 'Community Care Clinics',
  providerId: 'PROV004',
  providerName: 'Dr. David Kim'
}];
export function Patients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orgFilter, setOrgFilter] = useState('All');
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrg = orgFilter === 'All' || patient.organizationId === orgFilter;
    return matchesSearch && matchesOrg;
  });
  const organizations = Array.from(new Set(patients.map(p => ({
    id: p.organizationId,
    name: p.organizationName
  }))));
  return <div className="p-6 w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Patient Management
            </h1>
            <p className="text-gray-600">
              Manage patient records and information across organizations
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <PlusIcon className="h-4 w-4" />
            <span>Add Patient</span>
          </button>
        </div>
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <SearchIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Search patients by name or ID..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={orgFilter} onChange={e => setOrgFilter(e.target.value)}>
            <option value="All">All Organizations</option>
            {organizations.map(org => <option key={org.id} value={org.id}>
                {org.name}
              </option>)}
          </select>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
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
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map(patient => <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BuildingIcon className="h-4 w-4 text-blue-600 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {patient.organizationName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient.organizationId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {patient.providerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {patient.providerId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.lastVisit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      View
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-3">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}