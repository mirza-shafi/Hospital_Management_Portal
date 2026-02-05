import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaThLarge, FaCalendarAlt, FaUserInjured, FaChartBar, FaClinicMedical, 
  FaUserMd, FaNotesMedical, FaRegCommentDots, FaCog, FaSearch, FaBell, FaChevronDown
} from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Overview');

  const menuItems = [
    { name: 'Dashboard', icon: <FaThLarge />, path: '/admin-dashboard' },
    { name: 'Appointment', icon: <FaCalendarAlt />, path: '/appointments' },
    { name: 'Patient', icon: <FaUserInjured />, path: '/admin-manage-users' },
    { name: 'Report', icon: <FaChartBar />, path: '/reports' }, // Placeholder
    { name: 'Clinic', icon: <FaClinicMedical />, path: '/clinic' }, // Placeholder
    { name: 'Staff', icon: <FaUserMd />, path: '/staff' }, // Placeholder
    { name: 'Consultation', icon: <FaNotesMedical />, path: '/consultation' }, // Placeholder
  ];

  const bottomItems = [
     { name: 'Feedback', icon: <FaRegCommentDots />, path: '/feedback' },
     { name: 'Help Center', icon: <FaRegCommentDots />, path: '/help' },
     { name: 'Settings', icon: <FaCog />, path: '/settings' }, // Placeholder
  ];

  const adminName = "Dr. Clara Redfield"; // Mock
  const adminEmail = "clara.redfield@gmail.com"; // Mock

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                +
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                Medicare
            </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                location.pathname === item.path || (location.pathname === '/' && item.name === 'Dashboard')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}

            <div className="mt-8 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Favorite
            </div>
            {/* Mock favorites */}
            <div className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 cursor-pointer">
                 <span className="text-gray-300">📁</span> VIP Patient
            </div>
             <div className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 cursor-pointer">
                 <span className="text-gray-300">📁</span> Equipment
            </div>
        </nav>
        
        <div className="p-4 border-t border-gray-100 space-y-1">
             {bottomItems.map((item) => (
                <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 rounded-lg transition-colors"
                >
                <span className="text-lg">{item.icon}</span>
                {item.name}
                </Link>
             ))}
             
             {/* Unlock Premium Banner */}
             <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">👑</div>
                    <p className="font-semibold text-sm text-gray-900">Unlock Premium</p>
                </div>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">Get advanced tools and exclusive access for a better experience.</p>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm">
                    Select Plan &gt;
                </button>
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
            <div>
                <h2 className="text-lg font-bold text-gray-900">Consultation</h2>
                <p className="text-xs text-gray-500">View and Manage Your Consultations</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative w-64">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaSearch />
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-600 placeholder-gray-400"
                    />
                </div>
                
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
                    <FaBell />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                    <img 
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                    />
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-gray-900">{adminName}</p>
                        <p className="text-xs text-gray-500">{adminEmail}</p>
                    </div>
                    <FaChevronDown className="text-gray-400 text-xs" />
                </div>
            </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 bg-white">
            {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
