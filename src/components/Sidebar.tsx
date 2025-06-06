import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UsersIcon, TestTubeIcon, ClipboardListIcon, FileTextIcon, FlaskConicalIcon, CpuIcon, LayersIcon, BuildingIcon, SettingsIcon, HeartHandshakeIcon, LogOutIcon, ChevronDownIcon, BellIcon } from 'lucide-react';
import { useMessaging } from './MessagingContext';
// Simulated user data - in a real app, this would come from authentication context
const currentUser = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@labsystem.com',
  role: 'Administrator',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};
const menuItems = [{
  path: '/',
  label: 'Dashboard',
  icon: HomeIcon
}, {
  path: '/organizations',
  label: 'Organizations',
  icon: BuildingIcon
}, {
  path: '/samples',
  label: 'Orders',
  icon: TestTubeIcon
}, {
  path: '/batch-processing',
  label: 'Batch Processing',
  icon: LayersIcon
}, {
  path: '/automation',
  label: 'Automation',
  icon: CpuIcon
}, {
  path: '/lrm',
  label: 'LRM',
  icon: HeartHandshakeIcon
}, {
  path: '/reports',
  label: 'Reports',
  icon: FileTextIcon
}, {
  path: '/settings',
  label: 'Settings',
  icon: SettingsIcon
}];
export function Sidebar() {
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const {
    isOpen,
    setIsOpen,
    unreadCount
  } = useMessaging();
  // Get role color based on role name
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrator':
        return 'bg-blue-100 text-blue-800';
      case 'Account Manager':
        return 'bg-green-100 text-green-800';
      case 'Sales Representative':
        return 'bg-purple-100 text-purple-800';
      case 'Contracts Manager':
        return 'bg-yellow-100 text-yellow-800';
      case 'Viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div className="w-64 bg-white shadow-lg flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <FlaskConicalIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">LabSystem</h1>
        </div>
      </div>
      <nav className="mt-6 flex-1 overflow-y-auto">
        {menuItems.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return <Link key={item.path} to={item.path} className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>;
      })}
      </nav>
      {/* User Profile Section */}
      <div className="mt-auto border-t border-gray-200">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>}
            </button>
          </div>
          <div className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded-lg" onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <div className="flex items-center">
              {currentUser.avatar ? <img src={currentUser.avatar} alt={currentUser.name} className="h-10 w-10 rounded-full object-cover border border-gray-200" /> : <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  {currentUser.name.charAt(0)}
                </div>}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser.name}
                </p>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(currentUser.role)}`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </div>
            <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${userMenuOpen ? 'transform rotate-180' : ''}`} />
          </div>
          {userMenuOpen && <div className="mt-2 py-2 bg-white rounded-md shadow-lg border border-gray-200">
              <div className="px-4 py-2 text-xs text-gray-500">
                {currentUser.email}
              </div>
              <div className="border-t border-gray-100"></div>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <UsersIcon className="h-4 w-4 mr-2 text-gray-500" />
                Profile Settings
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <LogOutIcon className="h-4 w-4 mr-2 text-gray-500" />
                Sign out
              </a>
            </div>}
        </div>
      </div>
    </div>;
}