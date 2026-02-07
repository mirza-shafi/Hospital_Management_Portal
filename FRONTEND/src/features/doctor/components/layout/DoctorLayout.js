import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDoctorTheme } from '../../context/DoctorThemeContext';
import { storage } from '../../../../utils/storage';
import logo from '../../../../assets/healingwave.png';
import {
  FaThLarge, FaCalendarAlt, FaUserInjured, FaClipboardList, 
  FaFileMedical, FaUserMd, FaSignOutAlt, FaTimes, FaBars, 
  FaMoon, FaSun, FaSearch, FaBell, FaChevronDown, FaCog,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

const DoctorLayout = ({ children, title = "Doctor Panel", subtitle = "Manage your patients and appointments" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSidebarCollapsed, toggleSidebar, theme, toggleTheme, sidebarWidth, setSidebarWidth } = useDoctorTheme();
  const [isResizing, setIsResizing] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState({ firstName: 'Doctor', lastName: '', email: '' });
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
    const fetchDoctor = async () => {
        try {
            const email = storage.getItem('doctorEmail');
            if (email) {
                const res = await axios.get(`/api/doctors/ddetails/email/${email}`);
                setDoctorProfile(res.data);
            }
        } catch (e) { console.log("Profile fetch failed") }
    };
    fetchDoctor();
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
    storage.removeItem('doctorToken');
    storage.removeItem('doctorEmail');
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <FaThLarge />, path: '/doctor-account' },
    { name: 'Appointments', icon: <FaCalendarAlt />, path: '/doctor/appointments' },
    { name: 'My Patients', icon: <FaUserInjured />, path: '/doctor/patients' },
    { name: 'Prescriptions', icon: <FaFileMedical />, path: '/doctor/prescriptions' },
    { name: 'Add Prescription', icon: <FaClipboardList />, path: '/doctor/add-prescription' },
  ];

  const getImageUrl = (path) => {
      if (!path) return 'https://ui-avatars.com/api/?name=Doctor&background=random';
      if (path.startsWith('http') || path.startsWith('data:')) return path;
      return path; 
  };

  return (
    <div className={`${theme === 'dark' ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} flex h-screen font-sans transition-colors duration-300 ${isResizing ? 'cursor-col-resize select-none' : ''}`}>
      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        style={{ width: isSidebarCollapsed ? '70px' : `${sidebarWidth}px` }}
        className={`relative flex flex-col h-full ${theme === 'dark' ? 'bg-[#18181b] border-[#27272a]' : 'bg-[#ffffff] border-gray-200'} shadow-xl transition-all duration-300 ease-in-out z-50 border-r`}
      >
        {/* Resize Handle */}
        <div
            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors opacity-0 hover:opacity-100 z-50"
            onMouseDown={startResizing}
        />

        {/* Sidebar Header - Compact with Floating Toggle */}
        <div className={`p-6 pb-2 flex items-center justify-between ${isSidebarCollapsed ? 'px-4' : 'px-6'}`}>
             <div className="flex items-center gap-3 overflow-hidden">
                <img src={logo} alt="HealingWave" className="w-8 h-8 rounded-lg object-contain shrink-0" />
             </div>
             
             {/* Floating Toggle Button (Visible on edge when expanded) */}
             {!isSidebarCollapsed && (
                <button 
                    onClick={toggleSidebar}
                    className={`w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-[#27272a] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all absolute -right-3.5 top-8 ${theme === 'dark' ? 'bg-[#18181b] border-[#27272a]' : 'bg-[#ffffff] border-gray-200'} border shadow-lg z-50 flex items-center justify-center group`}
                    title="Collapse Sidebar"
                >
                    <FaChevronLeft className="text-[10px] group-hover:-translate-x-0.5 transition-transform" />
                </button>
             )}
        </div>

        {/* Toggle Button for Collapsed State */}
        {isSidebarCollapsed && (
            <div className="px-4 mb-4 mt-2">
                <button 
                    onClick={toggleSidebar}
                    className="w-full flex justify-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 transition-all hover:bg-blue-100 dark:hover:bg-blue-900/40"
                    title="Expand Sidebar"
                >
                    <FaChevronRight className="text-xs" />
                </button>
            </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto py-4 px-2 space-y-1 custom-scrollbar ${theme === 'dark' ? 'bg-[#18181b]' : 'bg-[#ffffff]'}`}>
            {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                            ${isActive 
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#27272a] hover:text-gray-900 dark:hover:text-gray-100'
                            }
                            ${isSidebarCollapsed ? 'justify-center' : ''}
                        `}
                        title={isSidebarCollapsed ? item.name : ''}
                    >
                        <span className={`text-lg shrink-0`}>{item.icon}</span>
                        {!isSidebarCollapsed && (
                            <span className="font-medium truncate text-sm animate-fade-in">{item.name}</span>
                        )}
                        
                        {isSidebarCollapsed && (
                            <div className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                {item.name}
                            </div>
                        )}
                    </Link>
                );
            })}
        </nav>

        {/* Bottom Actions */}
        <div className={`p-2 border-t relative ${theme === 'dark' ? 'bg-[#18181b] border-[#27272a]' : 'bg-[#ffffff] border-gray-100'}`} ref={dropdownRef}>
             {/* Popup Menu (Opens to the Right) */}
              {isDropdownOpen && (
                <div className={`absolute left-full bottom-0 ml-3 w-64 ${theme === 'dark' ? 'bg-[#121214] text-white' : 'bg-white text-gray-900'} rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-gray-100 dark:border-none overflow-hidden transform origin-left transition-all animate-in fade-in slide-in-from-left-2 z-[60]`}>
                    <div className="p-1.5 relative">
                        {showLogoutConfirm && (
                            <div className={`absolute inset-0 z-[70] flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-[#121214]/95' : 'bg-white/95'}`}>
                                <p className={`text-sm font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Are you sure you want to sign out?</p>
                                <div className="flex gap-2 w-full">
                                    <button 
                                        onClick={() => setShowLogoutConfirm(false)}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${theme === 'dark' ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-100'}`}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleLogout}
                                        className="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-lg shadow-red-600/20"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className={`px-4 py-3 rounded-xl mb-1.5 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50/50'}`}>
                            <p className={`font-bold truncate text-sm leading-none mb-1 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{doctorProfile.firstName} {doctorProfile.lastName || 'Md.'}</p>
                            <p className="text-[11px] font-medium text-gray-500 truncate tracking-tight">{doctorProfile.email}</p>
                        </div>
                        
                        <div className="space-y-0.5">
                            <Link 
                                to="/doctor-profile"
                                onClick={() => setIsDropdownOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${theme === 'dark' ? 'text-gray-400 hover:bg-blue-900/20 hover:text-blue-400' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-white/5 group-hover:bg-blue-900/40' : 'bg-gray-100 group-hover:bg-blue-100'}`}>
                                    <FaUserMd className="text-sm" />
                                </div>
                                <span className="text-sm font-medium">Profile Settings</span>
                            </Link>

                            <button 
                                onClick={toggleTheme}
                                className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-left ${theme === 'dark' ? 'text-gray-400 hover:bg-yellow-900/20 hover:text-yellow-600' : 'text-gray-600 hover:bg-yellow-50 hover:text-yellow-600'}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-white/5 group-hover:bg-yellow-900/40' : 'bg-gray-100 group-hover:bg-yellow-100'}`}>
                                    {theme === 'dark' ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
                                </div>
                                <span className="text-sm font-medium">{theme === 'dark' ? 'Light Appearance' : 'Dark Appearance'}</span>
                            </button>
                        </div>

                        <div className={`my-1.5 h-px mx-2 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}></div>

                        <button 
                            onClick={() => setShowLogoutConfirm(true)}
                            className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-left ${theme === 'dark' ? 'text-red-500 hover:bg-red-900/10' : 'text-red-500 hover:bg-red-50'}`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-red-900/20 group-hover:bg-red-900/40' : 'bg-red-50 group-hover:bg-red-100'}`}>
                                <FaSignOutAlt className="text-sm" />
                            </div>
                            <span className="text-sm font-semibold">Sign Out</span>
                        </button>
                    </div>
                </div>
             )}

             <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all w-full border-none outline-none group
                    ${isSidebarCollapsed ? 'justify-center' : ''}
                    ${isDropdownOpen ? 'bg-gray-50 dark:bg-white/5' : ''}
                `}
             >
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 shrink-0 overflow-hidden">
                    {doctorProfile?.profilePicture ? (
                        <img 
                            src={getImageUrl(doctorProfile.profilePicture)} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-sm">{(doctorProfile.firstName?.[0] || 'D')}{(doctorProfile.lastName?.[0] || 'O')}</span>
                    )}
                </div>
                {!isSidebarCollapsed && (
                    <div className="flex-1 text-left overflow-hidden">
                         <p className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {doctorProfile.firstName} {doctorProfile.lastName || 'Md.'}
                         </p>
                         <p className="text-[10px] font-semibold text-blue-500/80 dark:text-blue-400/80 uppercase tracking-wider">Doctor</p>
                    </div>
                )}
                {!isSidebarCollapsed && (
                    <FaChevronDown className={`text-gray-400 text-[10px] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-blue-500' : 'group-hover:text-gray-600'}`} />
                )}
             </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-black relative">
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
            <div className={`max-w-7xl mx-auto transition-all duration-300`}>
                {children}
            </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorLayout;
