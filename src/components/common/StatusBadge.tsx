import React from 'react';
import { getStatusColor } from '../../utils/formatters';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)} ${className}`}>
      {status}
    </span>
  );
};