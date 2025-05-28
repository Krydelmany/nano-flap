import React from 'react';

const StatusBadge = ({ type, count }) => {
  const getConfig = () => {
    switch (type) {
      case 'states':
        return {
          label: 'Estados',
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          icon: 'M9 12l2 2 4-4'
        };
      case 'transitions':
        return {
          label: 'Transições',
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          icon: 'M13 7l5 5-5 5M6 7l5 5-5 5'
        };
      case 'alphabet':
        return {
          label: 'Símbolos',
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
          icon: 'M4 6h16M4 12h16M4 18h16'
        };
      default:
        return {
          label: 'Item',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          icon: 'M9 12l2 2 4-4'
        };
    }
  };

  const config = getConfig();

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
      </svg>
      {count} {config.label}
    </div>
  );
};

export default StatusBadge;