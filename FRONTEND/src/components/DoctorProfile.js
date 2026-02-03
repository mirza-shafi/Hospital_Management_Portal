
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import './styles/DoctorProfile.css';
import { 
  FaCamera, FaTimes, FaUser, FaLock, FaBell, FaPalette, FaShieldAlt, 
  FaSignOutAlt, FaChevronRight, FaMoon, FaSun, FaDesktop 
} from 'react-icons/fa';

const DoctorProfile = ({ email, onClose }) => {
  const { theme, setTheme } = useTheme();
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
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const fileInputRef = useRef(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`/api/doctors/ddetails/email/${email}`);
        setFormData(res.data);
        setImagePreview(res.data.profilePicture);
        if (res.data.settings) setSettingsData(res.data.settings);
      } catch (err) { console.error(err); }
    };
    fetchDetails();
  }, [email]);

  // Handlers
  const handleToggle = async (section, key) => {
    let newSettings;
    if (section === 'notifications') {
       newSettings = { ...settingsData, notifications: { ...settingsData.notifications, [key]: !settingsData.notifications[key] } };
    } else {
       newSettings = { ...settingsData, [key]: !settingsData[key] };
    }
    setSettingsData(newSettings);
    try { await axios.put('/api/doctors/update-settings', { email, settings: newSettings }); } catch (e) {}
  };

  const handleLogoutClick = () => {
      setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('doctorToken');
    localStorage.removeItem('doctorEmail');
    window.location.href = '/';
  };

  const renderLogoutModal = () => (
      <div className="custom-confirm-overlay">
          <div className="custom-confirm-modal">
              <h3>Sign Out?</h3>
              <p>Are you sure you want to sign out?</p>
              <div className="confirm-actions">
                  <button className="cancel-btn" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                  <button className="confirm-btn red" onClick={confirmLogout}>Sign Out</button>
              </div>
          </div>
      </div>
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadPhoto = async () => {
    if (!profilePictureFile) return;
    const pictureData = new FormData();
    pictureData.append('profilePicture', profilePictureFile);

    try {
      const uploadRes = await axios.post(`/api/doctors/upload-profile-pic/${formData._id}`, pictureData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const pictureUrl = uploadRes.data.profilePicture;
      setFormData({ ...formData, profilePicture: pictureUrl });
      // Update preview with full URL from server response
      setImagePreview(getImageUrl(pictureUrl)); 
      setProfilePictureFile(null);
      setMessage('Photo updated!');
    } catch (error) {
      setError('Failed to upload photo.');
    }
  };

  const getImageUrl = (path) => {
      if (!path) return 'https://ui-avatars.com/api/?name=User&background=random';
      if (path.startsWith('http') || path.startsWith('data:')) return path;
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `http://localhost:1002${cleanPath}?t=${new Date().getTime()}`;
  };

  // Views
  const renderDashboard = () => (
    <div className="settings-dashboard-compact fade-in">
        
        {/* Profile Summary - Slim */}
        <div className="settings-group profile-group">
            <div className="profile-row">
                <img src={getImageUrl(imagePreview)} alt="Profile" className="profile-avatar-small" onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=User&background=random'} />
                <div className="profile-info-compact">
                    <h3>{formData.firstName} {formData.lastName}</h3>
                    <p>{formData.email}</p>
                </div>
            </div>
        </div>

        {/* Account Settings Group */}
        <div className="settings-group">
            <div className="group-title">Account</div>
            <div className="settings-row clickable" onClick={() => setView('edit-profile')}>
                <div className="row-left"><div className="icon-small blue"><FaUser /></div> <span>Edit Profile</span></div>
                <FaChevronRight className="chevron" />
            </div>
            <div className="divider"></div>
            <div className="settings-row clickable" onClick={() => setView('change-password')}>
                <div className="row-left"><div className="icon-small green"><FaLock /></div> <span>Change Password</span></div>
                <FaChevronRight className="chevron" />
            </div>
            <div className="divider"></div>
            <div className="settings-row">
                <div className="row-left"><div className="icon-small green"><FaShieldAlt /></div> <span>Two-Factor Authentication</span></div>
                <label className="switch-small">
                    <input type="checkbox" checked={settingsData.twoFactor} onChange={() => handleToggle('security', 'twoFactor')} />
                    <span className="slider-small round"></span>
                </label>
            </div>
        </div>

        {/* Preferences Group */}
        <div className="settings-group">
            <div className="group-title">Preferences</div>
            <div className="settings-row">
                <div className="row-left"><div className="icon-small purple"><FaPalette /></div> <span>Appearance</span></div>
                <div className="theme-toggle-compact">
                    <button className={`theme-btn-mini ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}><FaSun /></button>
                    <button className={`theme-btn-mini ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}><FaMoon /></button>
                </div>
            </div>
            <div className="divider"></div>
            <div className="settings-row">
                <div className="row-left"><div className="icon-small orange"><FaBell /></div> <span>Email Notifications</span></div>
                <label className="switch-small">
                    <input type="checkbox" checked={settingsData.notifications.email} onChange={() => handleToggle('notifications', 'email')} />
                    <span className="slider-small round"></span>
                </label>
            </div>
            <div className="divider"></div>
             <div className="settings-row">
                <div className="row-left"><div className="icon-small orange"><FaBell /></div> <span>SMS Notifications</span></div>
                <label className="switch-small">
                    <input type="checkbox" checked={settingsData.notifications.sms} onChange={() => handleToggle('notifications', 'sms')} />
                    <span className="slider-small round"></span>
                </label>
            </div>
        </div>

         {/* Danger Zone */}
         <div className="settings-group danger-group">
             <div className="settings-row clickable" onClick={handleLogoutClick}>
                <div className="row-left"><div className="icon-small red"><FaSignOutAlt /></div> <span className="text-red">Sign Out</span></div>
            </div>
            <div className="divider"></div>
             <div className="settings-row" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                <div className="row-left"><div className="icon-small red"><FaTimes /></div> <span className="text-red">Delete Account</span></div>
            </div>
        </div>

    </div>
  );

  // Edit Profile and Change Password Views (Reusing logic but simplified UI)
  const renderEditProfile = () => (
      <div className="sub-view fade-in">
          <div className="sub-header">
              <button onClick={() => setView('dashboard')} className="back-btn">← Back</button>
              <h2>Edit Profile</h2>
          </div>
          {/* ...Reuse form logic/JSX... */}
          <div className="profile-form-container">
             <div className="avatar-upload-section">
                <div className="avatar-preview-edit">
                    <img src={getImageUrl(imagePreview)} alt="Preview" onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=User&background=random'} />
                    <button type="button" onClick={() => fileInputRef.current.click()} className="camera-btn"><FaCamera /></button>
                </div>
                 <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} />
                 {profilePictureFile && <button onClick={handleUploadPhoto} className="upload-photo-btn">Confirm Photo Upload</button>}
             </div>
             <form onSubmit={async (e) => {
                 e.preventDefault();
                 try { await axios.put('/api/doctors/dupdate', { email, ...formData }); setMessage('Saved!'); } catch(e){ setError('Error'); }
             }}>
                 <div className="form-grid">
                    <div className="form-group"><label>First Name</label><input value={formData.firstName} onChange={(e)=>setFormData({...formData, firstName: e.target.value})} /></div>
                    <div className="form-group"><label>Last Name</label><input value={formData.lastName} onChange={(e)=>setFormData({...formData, lastName: e.target.value})} /></div>
                    <div className="form-group"><label>Age</label><input type="number" value={formData.age} onChange={(e)=>setFormData({...formData, age: e.target.value})} /></div>
                    <div className="form-group"><label>Blood Group</label><input value={formData.bloodGroup} onChange={(e)=>setFormData({...formData, bloodGroup: e.target.value})} /></div>
                    <div className="form-group"><label>Specialty</label><input value={formData.specialty} onChange={(e)=>setFormData({...formData, specialty: e.target.value})} /></div>
                    <div className="form-group"><label>Department</label><input value={formData.department} onChange={(e)=>setFormData({...formData, department: e.target.value})} /></div>
                    <div className="form-group"><label>Degrees</label><input value={formData.degrees} onChange={(e)=>setFormData({...formData, degrees: e.target.value})} /></div>
                    <div className="form-group"><label>Institute</label><input value={formData.institute} onChange={(e)=>setFormData({...formData, institute: e.target.value})} /></div>
                    <div className="form-group full-width"><label>Availability</label><input value={formData.availability} onChange={(e)=>setFormData({...formData, availability: e.target.value})} /></div>
                 </div>
                 <button type="submit" className="save-btn">Save Changes</button>
             </form>
             {message && <p className="success-msg">{message}</p>}
          </div>
      </div>
  );

   const renderChangePassword = () => (
      <div className="sub-view fade-in">
          <div className="sub-header">
              <button onClick={() => setView('dashboard')} className="back-btn">← Back</button>
              <h2>Change Password</h2>
          </div>
          <form onSubmit={async (e) => {
                 e.preventDefault();
                 if(passwordData.newPassword !== passwordData.confirmPassword) { setError('Mismatch'); return; }
                  try {
                        await axios.post('/api/doctors/change-password', { email, currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
                        setMessage("Password changed successfully.");
                        setError('');
                        setView('dashboard');
                    } catch (err) { setError("Failed"); }
             }}>
             <div className="form-group"><label>Current Password</label><input type="password" value={passwordData.currentPassword} onChange={(e)=>setPasswordData({...passwordData, currentPassword: e.target.value})} /></div>
             <div className="form-group"><label>New Password</label><input type="password" value={passwordData.newPassword} onChange={(e)=>setPasswordData({...passwordData, newPassword: e.target.value})} /></div>
             <div className="form-group"><label>Confirm Password</label><input type="password" value={passwordData.confirmPassword} onChange={(e)=>setPasswordData({...passwordData, confirmPassword: e.target.value})} /></div>
             <button type="submit" className="save-btn">Update Password</button>
          </form>
            {error && <p className="error-msg">{error}</p>}
      </div>
  );

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-backdrop" onClick={onClose}></div>
      <div className="profile-modal-container single-column">
        <div className="modal-header-bar">
            <h2>Settings</h2>
            <button className="profile-close-btn" onClick={onClose}><FaTimes /></button>
        </div>
        <div className="modal-scroll-content">
            {view === 'dashboard' && renderDashboard()}
            {view === 'edit-profile' && renderEditProfile()}
            {view === 'change-password' && renderChangePassword()}
        </div>
        {showLogoutConfirm && renderLogoutModal()}
      </div>
    </div>
  );
};
export default DoctorProfile;
