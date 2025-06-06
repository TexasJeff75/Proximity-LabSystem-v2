/**
 * Utility functions for formatting data
 */

/**
 * Format a timestamp to a human-readable date
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

/**
 * Format a timestamp to a human-readable time
 * @param date Date to format
 * @returns Formatted time string
 */
export const formatTime = (date: string | Date): string => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format a timestamp to a human-readable date and time
 * @param date Date to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: string | Date): string => {
  if (!date) return '';
  return new Date(date).toLocaleString();
};

/**
 * Get color class for status
 * @param status Status string
 * @returns Tailwind CSS class string for the status
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Ready':
    case 'Active':
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Running':
    case 'In Progress':
      return 'bg-blue-100 text-blue-800';
    case 'Maintenance':
    case 'Pending':
    case 'Pending Received':
      return 'bg-yellow-100 text-yellow-800';
    case 'Error':
    case 'Rejected':
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    case 'Draft':
    case 'Prelim':
    case 'Prelim (Review)':
    case 'Final (Review)':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get color class for priority
 * @param priority Priority string
 * @returns Tailwind CSS class string for the priority
 */
export const getPriorityColor = (priority: string): string => {
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

/**
 * Format a timestamp relative to current time (e.g., "2 hours ago")
 * @param date Date to format
 * @returns Relative time string
 */
export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return '';
  
  const now = new Date();
  const messageDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  return formatDate(date);
};

/**
 * Truncate text to a specific length with ellipsis
 * @param text Text to truncate
 * @param length Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, length: number): string => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Format a name to title case
 * @param name Name to format
 * @returns Formatted name
 */
export const formatName = (name: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Clean patient name from raw data format
 * @param rawName Raw patient name (e.g., " DOE, JOHN")
 * @returns Cleaned name (e.g., "John Doe")
 */
export const cleanPatientName = (rawName: string): string => {
  if (!rawName) return '';
  
  // Remove leading/trailing spaces
  const trimmedName = rawName.trim();
  
  // Split by comma
  const parts = trimmedName.split(',');
  if (parts.length !== 2) return formatName(trimmedName);
  
  // Reverse last name, first name format
  const lastName = parts[0].trim();
  const firstName = parts[1].trim();
  
  return formatName(`${firstName} ${lastName}`);
};