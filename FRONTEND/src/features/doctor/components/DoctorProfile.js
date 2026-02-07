
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDoctorTheme } from '../context/DoctorThemeContext';
import '../../../components/styles/DoctorProfile.css';
import { storage } from '../../../utils/storage';
import {
  FaCamera, FaTimes, FaUser, FaLock, FaBell, FaPalette, FaShieldAlt, 
  FaSignOutAlt, FaChevronRight, FaMoon, FaSun, FaDesktop, FaUserMd 
} from 'react-icons/fa';

const DoctorProfile = ({ email, onClose }) => {
  const { theme, setTheme } = useDoctorTheme();
  const [view, setView] = useState('dashboard'); // dashboard, edit-profile, change-password
  const [formData, setFormData] = useState({});
  const [settingsData, setSettingsData] = useState({
    twoFactor: false,
    notifications: { email: true, sms: true, promotions: false }
  });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const fileInputRef = useRef(null);
  
  // Determine if we are in "Page Mode" or "Modal Mode"
  const isModal = !!onClose;
  const currentEmail = email || storage.getItem('doctorEmail');

  useEffect(() => {
    if (!currentEmail) return;
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`/api/doctors/ddetails/email/${currentEmail}`);
        setFormData(res.data);
        setImagePreview(res.data.profilePicture);
        if (res.data.settings) setSettingsData(res.data.settings);
      } catch (err) { console.error(err); }
    };
    fetchDetails();
  }, [currentEmail]);

  const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
      setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
      e.preventDefault();
      try {
          // Add logic to update profile via API
           await axios.put(`/api/doctors/update/${currentEmail}`, formData);
           setMessage("Profile updated successfully");
           setTimeout(() => setMessage(''), 3000);
           setView('dashboard');
      } catch (err) {
          setError("Failed to update profile");
          setTimeout(() => setError(''), 3000);
      }
  };

  const handleUpdatePassword = async (e) => {
      e.preventDefault();
      if (passwordData.newPassword !== passwordData.confirmPassword) {
          setError("Passwords do not match");
          return;
      }
      try {
           await axios.put(`/api/doctors/change-password/${currentEmail}`, passwordData);
           setMessage("Password changed successfully");
           setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
           setTimeout(() => setMessage(''), 3000);
           setView('dashboard');
      } catch (err) {
          setError("Failed to change password");
          setTimeout(() => setError(''), 3000);
      }
  };
  
    const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in py-2 w-full">
        {/* Profile Card Style Header */}
        <div className="bg-gray-100 dark:bg-[#111827] p-5 rounded-[24px] flex items-center gap-4 shadow-sm border border-gray-200 dark:border-none">
            <div className="w-16 h-16 rounded-full bg-[#0d9488] flex items-center justify-center text-white text-2xl font-bold shadow-inner shrink-0">
                {formData.firstName?.[0]}{formData.lastName?.[0]}
            </div>
            <div className="flex flex-col min-w-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight truncate">{formData.firstName} {formData.lastName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate">{currentEmail}</p>
            </div>
        </div>

        {/* ACCOUNT & MEDICAL Section */}
        <div className="space-y-3">
            <p className="px-4 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Account & Medical</p>
            <div className="bg-white dark:bg-[#111827] rounded-[24px] divide-y divide-gray-100 dark:divide-gray-700/30 overflow-hidden shadow-sm border border-gray-100 dark:border-none">
                <button onClick={() => setView('edit-profile')} className="w-full flex justify-between items-center px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <FaUser className="text-white text-sm" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-100">Edit Profile & Professional Data</span>
                    </div>
                    <FaChevronRight className="text-gray-400 dark:text-gray-500 text-xs group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button onClick={() => setView('change-password')} className="w-full flex justify-between items-center px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                            <FaLock className="text-white text-sm" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-100">Change Password</span>
                    </div>
                    <FaChevronRight className="text-gray-400 dark:text-gray-500 text-xs group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex justify-between items-center px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <FaShieldAlt className="text-white text-sm" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-100">Two-Factor Authentication</span>
                    </div>
                    <div 
                        onClick={() => setSettingsData(prev => ({ ...prev, twoFactor: !prev.twoFactor }))}
                        className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${settingsData.twoFactor ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${settingsData.twoFactor ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                </div>
            </div>
        </div>

        {/* PREFERENCES Section */}
        <div className="space-y-3">
            <p className="px-4 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Preferences</p>
            <div className="bg-white dark:bg-[#111827] rounded-[24px] divide-y divide-gray-100 dark:divide-gray-700/30 overflow-hidden shadow-sm border border-gray-100 dark:border-none">
                <div className="flex justify-between items-center px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <FaPalette className="text-white text-sm" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-100">Appearance</span>
                    </div>
                    <div className="bg-gray-100 dark:bg-[#0f172a] p-1 rounded-full flex gap-1 border border-gray-200 dark:border-none">
                        <button onClick={() => setTheme('light')} className={`p-1.5 rounded-full transition-colors ${theme === 'light' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}><FaSun size={12}/></button>
                        <button onClick={() => setTheme('dark')} className={`p-1.5 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}><FaMoon size={12}/></button>
                    </div>
                </div>

                <div className="flex justify-between items-center px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <FaBell className="text-white text-sm" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-100">Email Notifications</span>
                    </div>
                    <div 
                        onClick={() => setSettingsData(prev => ({ ...prev, notifications: { ...prev.notifications, email: !prev.notifications.email } }))}
                        className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${settingsData.notifications.email ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${settingsData.notifications.email ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                </div>
            </div>
        </div>

        {/* LOGOUT Section */}
        <div className="bg-white dark:bg-[#111827] rounded-[24px] divide-y divide-gray-100 dark:divide-gray-700/30 overflow-hidden shadow-sm relative border border-gray-100 dark:border-none">
            {showLogoutConfirm && (
                <div className="absolute inset-0 bg-white/95 dark:bg-[#111827]/95 z-20 flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in-95 duration-200">
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-4">Are you sure you want to sign out?</p>
                    <div className="flex gap-2 w-full">
                        <button 
                            onClick={() => setShowLogoutConfirm(false)}
                            className="flex-1 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => {
                                storage.removeItem('doctorToken');
                                storage.removeItem('doctorEmail');
                                window.location.href = '/';
                            }}
                            className="flex-1 py-3 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-lg shadow-red-600/20"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
            <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/5 transition-colors group text-left border-none outline-none"
            >
                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center shadow-lg shadow-red-500/5 border border-red-500/10 dark:border-none">
                    <FaSignOutAlt className="text-red-500 text-sm" />
                </div>
                <span className="text-sm font-bold text-red-500">Sign Out</span>
            </button>
            <button className="w-full flex justify-between items-center px-5 py-4 hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
                        <FaTimes className="text-white text-sm" />
                    </div>
                    <span className="text-sm font-bold text-red-500">Delete Account</span>
                </div>
                <FaChevronRight className="text-gray-500 text-xs" />
            </button>
        </div>
    </div>
  );

  const renderEditProfile = () => (
      <form onSubmit={handleUpdateProfile} className="space-y-6 animate-fade-in p-2">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50 dark:border-white/5">
               <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Edit Profile</h3>
               <button type="button" onClick={() => setView('dashboard')} className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 uppercase tracking-widest transition-colors">Cancel</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName || ''} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:!bg-[#18181b] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 font-medium" />
              </div>
              <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName || ''} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:!bg-[#18181b] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 font-medium" />
              </div>
              <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Phone</label>
                  <input type="text" name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:!bg-[#18181b] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 font-medium" />
              </div>
              <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Degree</label>
                  <input type="text" name="degree" value={formData.degree || ''} onChange={handleInputChange} className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:!bg-[#18181b] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 font-medium" />
              </div>
          </div>
          <div className="pt-8 flex justify-end gap-3 border-t border-gray-50 dark:border-white/5 mt-8">
              <button type="button" onClick={() => setView('dashboard')} className="px-6 py-2.5 text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all">Cancel</button>
              <button type="submit" className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95">Save Changes</button>
          </div>
      </form>
  );

  const renderChangePassword = () => (
      <form onSubmit={handleUpdatePassword} className="space-y-6 animate-fade-in p-2">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50 dark:border-white/5">
               <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Change Password</h3>
               <button type="button" onClick={() => setView('dashboard')} className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 uppercase tracking-widest transition-colors">Cancel</button>
          </div>
          <div className="space-y-4">
              <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Current Password</label>
                  <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:!bg-[#18181b] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 font-medium" />
              </div>
              <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">New Password</label>
                  <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:!bg-[#18181b] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 font-medium" />
              </div>
              <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Confirm New Password</label>
                  <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:!bg-[#18181b] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 font-medium" />
              </div>
          </div>
           <div className="pt-8 flex justify-end gap-3 border-t border-gray-50 dark:border-white/5 mt-8">
              <button type="button" onClick={() => setView('dashboard')} className="px-6 py-2.5 text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all">Cancel</button>
              <button type="submit" className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95">Update Password</button>
          </div>
      </form>
  );

  // Wrapper classes based on mode
  const containerClass = isModal ? "profile-modal-container single-column overflow-hidden" : "bg-white dark:!bg-[#121214] rounded-[32px] shadow-2xl border border-gray-100 dark:border-none p-4 md:p-6 max-w-2xl mx-auto transition-all animate-in fade-in zoom-in-95 duration-500";
  const headerClass = isModal ? "modal-header-bar" : "flex justify-between items-center mb-10 border-b border-gray-50 dark:border-none pb-6";

  const content = (
      <div className={`${containerClass} ${theme === 'dark' ? 'dark-mode bg-[#121214]' : ''}`}>
        <div className={headerClass}>
            <div className="flex items-center gap-3">
                 <FaUserMd className="text-2xl text-blue-600 dark:text-blue-400" />
                 <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Settings & Profile</h2>
            </div>
            {isModal && <button className="profile-close-btn" onClick={onClose}><FaTimes /></button>}
        </div>
        
        {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> {message}
            </div>
        )}
        {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span> {error}
            </div>
        )}

        <div className={isModal ? "modal-scroll-content" : ""}>
            {view === 'dashboard' && renderDashboard()}
            {view === 'edit-profile' && renderEditProfile()}
            {view === 'change-password' && renderChangePassword()}
        </div>
      </div>
  );

  if (isModal) {
      return (
        <div className="profile-modal-overlay">
          <div className="profile-modal-backdrop" onClick={onClose}></div>
          {content}
        </div>
      );
  }

  return content;
};
export default DoctorProfile;
