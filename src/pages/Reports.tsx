import React, { useState } from 'react';
import { SearchIcon, DownloadIcon, FileTextIcon, CalendarIcon } from 'lucide-react';
const reports = [{
  id: 'R001',
  title: 'Daily Lab Summary',
  type: 'Summary',
  date: '2024-01-15',
  status: 'Generated',
  size: '2.3 MB'
}, {
  id: 'R002',
  title: 'Patient Test Results - John Doe',
  type: 'Patient',
  date: '2024-01-15',
  status: 'Generated',
  size: '1.1 MB'
}, {
  id: 'R003',
  title: 'Quality Control Report',
  type: 'QC',
  date: '2024-01-14',
  status: 'Generated',
  size: '3.2 MB'
}, {
  id: 'R004',
  title: 'Monthly Statistics',
  type: 'Statistics',
  date: '2024-01-14',
  status: 'Pending',
  size: '-'
}, {
  id: 'R005',
  title: 'Equipment Maintenance Log',
  type: 'Maintenance',
  date: '2024-01-13',
  status: 'Generated',
  size: '1.8 MB'
}];
export function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) || report.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || report.type === typeFilter;
    return matchesSearch && matchesType;
  });
  const types = ['All', ...Array.from(new Set(reports.map(report => report.type)))];
  return <div className="p-6 w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Reports & Analytics
            </h1>
            <p className="text-gray-600">
              Generate and manage laboratory reports
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <FileTextIcon className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
        </div>
        <div className="flex space-x-4 mb-4">
          <div className="relative flex-1">
            <SearchIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Search reports by title or ID..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            {types.map(type => <option key={type} value={type}>
                {type}
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
                  Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map(report => <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <FileTextIcon className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {report.title}
                        </div>
                        <div className="text-sm text-gray-500">{report.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {report.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${report.status === 'Generated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {report.status === 'Generated' && <>
                        <button className="text-blue-600 hover:text-blue-900 mr-3 flex items-center">
                          <DownloadIcon className="h-4 w-4 mr-1" />
                          Download
                        </button>
                        <button className="text-green-600 hover:text-green-900 mr-3">
                          View
                        </button>
                      </>}
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