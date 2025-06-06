import React from 'react';
import { getPriorityColor } from '../../utils/formatters';

interface PriorityBadgeProps {
  priority: string;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(priority)} ${className}`}>
      {priority}
    </span>
  );
};