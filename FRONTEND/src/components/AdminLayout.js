import React, { useState, useRef, useEffect, useCallback } from 'react';
import api from '../api/config';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminTheme } from '../context/AdminThemeContext';
import { 
  FaThLarge, FaCalendarAlt, FaUserInjured, FaChartBar, FaClinicMedical, 
  FaTint, FaCapsules, FaUserMd, FaNotesMedical, FaTools, FaRegCommentDots, FaCog, 
  FaSearch, FaBell, FaChevronDown, FaSignOutAlt, FaUserCog, FaExclamationTriangle
} from 'react-icons/fa';

const AdminLayout = ({ children, title = "Consultation", subtitle = "View and Manage Your Consultations" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSidebarCollapsed, toggleSidebar, theme, sidebarWidth, setSidebarWidth } = useAdminTheme();
  const [isResizing, setIsResizing] = useState(false);
  const [adminProfile, setAdminProfile] = useState({ name: 'HealingWave Admin', email: 'admin@healingwave.com' });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  const startResizing = useCallback((mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX;
        if (newWidth > 180 && newWidth < 480) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing, setSidebarWidth]
  );

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

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
    navigate('/');
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
    <div className={`${theme === 'dark' ? 'dark bg-pure-dark text-gray-100' : 'bg-gray-50 text-gray-900'} flex h-screen font-sans transition-colors duration-300 ${isResizing ? 'cursor-col-resize select-none' : ''}`}>
      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        style={{ width: isSidebarCollapsed ? '80px' : `${sidebarWidth}px` }}
        className={`${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} border-r flex flex-col fixed h-full z-30 ${!isResizing ? 'transition-all duration-300' : ''}`}
      >
        {/* Resize Handle */}
        {!isSidebarCollapsed && (
          <div 
            onMouseDown={startResizing}
            className={`absolute right-0 top-0 w-1.5 h-full cursor-col-resize hover:bg-blue-500/30 transition-colors z-40 ${isResizing ? 'bg-blue-500/50' : ''}`}
          />
        )}

        <div className={`p-6 pb-2 flex items-center justify-between ${isSidebarCollapsed ? 'px-4' : 'px-6'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="min-w-[32px] w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    +
                </div>
                {!isSidebarCollapsed && (
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-400 whitespace-nowrap">
                        HealingWave
                    </h1>
                )}
            </div>
            {!isSidebarCollapsed && (
                <button 
                    onClick={toggleSidebar}
                    className={`p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-600 transition-all absolute -right-3 top-6 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} border shadow-sm z-50`}
                    title="Collapse Sidebar"
                >
                    <FaChevronDown className="rotate-90 text-xs" />
                </button>
            )}
        </div>

        {isSidebarCollapsed && (
            <div className="px-4 mb-4">
                <button 
                    onClick={toggleSidebar}
                    className="w-full flex justify-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 transition-all"
                >
                    <FaChevronDown className="-rotate-90" />
                </button>
            </div>
        )}

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname === item.path || (location.pathname === '/' && item.name === 'Dashboard')
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-901 dark:hover:text-gray-100'
              } ${isSidebarCollapsed ? 'justify-center' : ''}`}
              title={isSidebarCollapsed ? item.name : ''}
            >
              <span className="text-lg">{item.icon}</span>
              {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
            </Link>
          ))}

            {!isSidebarCollapsed && (
                <div className="mt-8 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    System Oversight
                </div>
            )}
             <div className={`flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                 <span className={`${isSidebarCollapsed ? '' : 'text-gray-300'}`}>📊</span> 
                 {!isSidebarCollapsed && "Analytics"}
            </div>
        </nav>
        
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-zinc-800' : 'border-gray-100'} space-y-1`}>
             {bottomItems.map((item) => (
                <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-all ${isSidebarCollapsed ? 'justify-center' : ''}`}
                title={isSidebarCollapsed ? item.name : ''}
                >
                <span className="text-lg">{item.icon}</span>
                {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                </Link>
             ))}
        </div>
      </aside>

      {/* Main Content */}
      <main 
        style={{ marginLeft: isSidebarCollapsed ? '80px' : `${sidebarWidth}px` }}
        className={`flex-1 flex flex-col min-w-0 overflow-hidden ${!isResizing ? 'transition-all duration-300' : ''}`}
      >
        {/* Top Header */}
        <header className={`${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} border-b h-16 flex items-center justify-between px-8 sticky top-0 z-20 transition-all`}>
            <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative w-64 hidden lg:block">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaSearch />
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 text-gray-600 dark:text-gray-300 placeholder-gray-400"
                    />
                </div>
                
                <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
                    <FaBell />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                </button>

                {/* Profile Section with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <div 
                    className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-zinc-800 cursor-pointer group"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                      <img 
                          src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full border border-gray-200 dark:border-zinc-700 object-cover group-hover:border-blue-300 transition-all"
                      />
                      <div className="hidden lg:block text-left">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors whitespace-nowrap">{adminProfile.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-32">{adminProfile.email}</p>
                      </div>
                      <FaChevronDown className={`text-gray-400 text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                      <div className="px-4 py-2 border-b border-gray-50 dark:border-zinc-800 mb-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Admin Account</p>
                      </div>
                      <Link 
                        to="/settings" 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaUserCog className="text-gray-400 group-hover:text-blue-600" />
                        Settings
                      </Link>
                      <button 
                        onClick={() => { setShowLogoutConfirm(true); setIsDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
        <div className={`flex-1 overflow-auto p-8 transition-colors duration-300 ${theme === 'dark' ? 'bg-pure-dark' : 'bg-white'}`}>
            <div className="max-w-[1600px] mx-auto">
                {children}
            </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)}></div>
            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center border border-gray-100 dark:border-zinc-800">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Sign Out?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Are you sure you want to end your session? You will need to login again to access the dashboard.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 dark:shadow-none transition-all"
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
