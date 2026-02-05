import React from 'react';

const StatsCard = ({ title, value, type = 'default', icon }) => {
  // Styles based on type
  const styles = {
    default: { border: 'border-l-4 border-gray-800' },
    success: { border: 'border-l-4 border-emerald-500' },
    warning: { border: 'border-l-4 border-yellow-500' }, // Mild
    info: { border: 'border-l-4 border-blue-500' }, // Stable
    critical: { border: 'border-l-4 border-red-500' }, // Critical
  };

  const selectedStyle = styles[type] || styles.default;

  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 dark:border-zinc-800 flex items-center justify-between ${selectedStyle.border}`}>
      <div>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{value}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
      </div>
      
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center text-gray-400">
          {icon}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
