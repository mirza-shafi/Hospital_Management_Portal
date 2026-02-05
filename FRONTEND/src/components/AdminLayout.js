import React, { useState, useRef, useEffect } from 'react';
import api from '../api/config';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaThLarge, FaCalendarAlt, FaUserInjured, FaChartBar, FaClinicMedical, 
  FaTint, FaCapsules, FaUserMd, FaNotesMedical, FaTools, FaRegCommentDots, FaCog, 
  FaSearch, FaBell, FaChevronDown, FaSignOutAlt, FaUserCog, FaExclamationTriangle
} from 'react-icons/fa';

const AdminLayout = ({ children, title = "Consultation", subtitle = "View and Manage Your Consultations" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminProfile, setAdminProfile] = useState({ name: 'HealingWave Admin', email: 'admin@healingwave.com' });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await api.get('/admin/profile');
        if (res.data) setAdminProfile(res.data);
      } catch (e) { console.log("Profile fetch failed, using defaults") }
    };
    fetchAdmin();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <FaThLarge />, path: '/admin-dashboard' },
    { name: 'Appointment', icon: <FaCalendarAlt />, path: '/admin/appointment-manage' },
    { name: 'Patient', icon: <FaUserInjured />, path: '/admin/patient-manage' },
    { name: 'Report', icon: <FaChartBar />, path: '/admin/reports' }, 
    { name: 'Clinic', icon: <FaClinicMedical />, path: '/admin/clinic-manage' },
    { name: 'Blood Bank', icon: <FaTint />, path: '/admin/blood-manage' },
    { name: 'Pharmacy', icon: <FaCapsules />, path: '/admin/pharmacy-manage' },
    { name: 'Doctors', icon: <FaUserMd />, path: '/admin/doctor-manage' },
    { name: 'Consultation', icon: <FaNotesMedical />, path: '/admin/consultation-manage' },
    { name: 'Equipment', icon: <FaTools />, path: '/admin/equipment-manage' },
  ];

  const bottomItems = [
     { name: 'Feedback', icon: <FaRegCommentDots />, path: '/feedback' },
     { name: 'Help Center', icon: <FaRegCommentDots />, path: '/help' },
     { name: 'Settings', icon: <FaCog />, path: '/settings' }, 
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar (same as before) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                +
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                HealingWave
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
                System Oversight
            </div>
             <div className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 cursor-pointer">
                 <span className="text-gray-300">📊</span> Analytics
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
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-20">
            <div>
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <p className="text-xs text-gray-500">{subtitle}</p>
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

                {/* Profile Section with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <div 
                    className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer group"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                      <img 
                          src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full border border-gray-200 object-cover group-hover:border-blue-300 transition-all"
                      />
                      <div className="hidden md:block text-left">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{adminProfile.name}</p>
                          <p className="text-xs text-gray-500">{adminProfile.email}</p>
                      </div>
                      <FaChevronDown className={`text-gray-400 text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Admin Account</p>
                      </div>
                      <Link 
                        to="/settings" 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaUserCog className="text-gray-400 group-hover:text-blue-600" />
                        Settings
                      </Link>
                      <button 
                        onClick={() => { setShowLogoutConfirm(true); setIsDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FaSignOutAlt className="text-red-400" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
            </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 bg-white">
            {children}
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)}></div>
            <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Out?</h3>
              <p className="text-sm text-gray-500 mb-8">Are you sure you want to end your session? You will need to login again to access the dashboard.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLayout;
