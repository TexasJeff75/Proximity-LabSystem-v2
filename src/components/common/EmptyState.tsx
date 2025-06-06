import React from 'react';

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon,
  className = ''
}) => {
  return (
    <div className={`text-center py-8 text-gray-500 ${className}`}>
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      {message}
    </div>
  );
};