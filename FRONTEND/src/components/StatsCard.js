import React from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';

const StatsCard = ({ title, value, type = 'default', icon }) => {
  // Safe consumption of Admin Context, or fallback to props/defaults
  let theme = 'light';
  try {
     const context = useAdminTheme();
     if (context) theme = context.theme;
  } catch (e) {
     // Not in Admin Context, ignore
  }
  
  // Styles based on type
  const styles = {
    default: { border: 'border-l-4 border-gray-800' },
    success: { border: 'border-l-4 border-emerald-500' },
    warning: { border: 'border-l-4 border-yellow-500' }, // Mild
    info: { border: 'border-l-4 border-blue-500' }, // Stable
    critical: { border: 'border-l-4 border-red-500' }, // Critical
  };

  const selectedStyle = styles[type] || styles.default;
  
  const bgClass = theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100';
  const textClass = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const subTextClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const iconBg = theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-100';

  return (
    <div className={`stat-card ${bgClass} rounded-xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border flex items-center justify-between ${selectedStyle.border}`}>
      <div>
        <h3 className={`text-3xl font-bold ${textClass} mb-1`}>{value}</h3>
        <p className={`text-sm ${subTextClass} font-medium`}>{title}</p>
      </div>
      
      {icon && (
        <div className={`w-10 h-10 rounded-lg ${iconBg} border flex items-center justify-center text-gray-400`}>
          {icon}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
