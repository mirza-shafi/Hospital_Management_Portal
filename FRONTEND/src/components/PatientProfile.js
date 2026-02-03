import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './styles/PatientProfile.css';
import { 
  FaCamera, FaTimes, FaUser, FaLock, FaBell, FaPalette, FaShieldAlt, 
  FaSignOutAlt, FaChevronRight, FaSun, FaMoon, FaHeartbeat, FaFileMedical, FaCheckCircle, FaArrowLeft
} from 'react-icons/fa';

// Placeholder hook for theme if not available in this context
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    if (document.body.classList.contains('dark')) setTheme('dark');
  }, []);
  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    if (newTheme === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  };
  return { theme, setTheme: toggleTheme };
};

const PatientProfile = ({ email, onClose }) => {
  const { theme, setTheme } = useTheme();
  const [view, setView] = useState('dashboard'); 
  const [showSuccess, setShowSuccess] = useState(false); // New state for popup
  
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    age: '',
    sex: '',
    mobileNumber: '',
    dateOfBirth: '',
    difficulty: '',
    beendignosed: '',
    condition: '',
    weight: '',
    bloodPressure: '',
    bloodSugar: '',
    lastCheckup: ''
  });

  const [settingsData, setSettingsData] = useState({
    notifications: { email: true, sms: true, promotions: false }
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const res = await axios.get(`/api/patients/pdetails/email/${email}`);
        setFormData(res.data);
        if (res.data.profilePicture) {
            const isAbsolute = res.data.profilePicture.startsWith('http');
            setImagePreview(isAbsolute ? res.data.profilePicture : `${axios.defaults.baseURL || 'http://localhost:1002'}${res.data.profilePicture}`);
        } else {
            setImagePreview('https://ui-avatars.com/api/?name=' + (res.data.name || 'User') + '&background=random');
        }
      } catch (error) {
        console.error(error);
        setError('Failed to fetch patient details.');
      }
    };

    fetchPatientDetails();
  }, [email]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create local preview
    setImagePreview(URL.createObjectURL(file));

    // Upload immediately
    const uploadData = new FormData();
    uploadData.append('profilePicture', file);
    uploadData.append('email', email);

    try {
        const res = await axios.post('/api/patients/upload-profile-picture', uploadData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        // Update processed URL from server
        const isAbsolute = res.data.profilePicture.startsWith('http');
        setImagePreview(isAbsolute ? res.data.profilePicture : `${axios.defaults.baseURL || 'http://localhost:1002'}${res.data.profilePicture}`);
        setMessage('Profile picture updated!');
        setTimeout(() => setMessage(''), 3000);
    } catch (err) {
        console.error(err);
        setError('Failed to upload image');
    }
  };

  const handleToggle = (section, key) => {
    if (section === 'notifications') {
       setSettingsData({ ...settingsData, notifications: { ...settingsData.notifications, [key]: !settingsData.notifications[key] } });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/patients/pupdate', { email, ...formData });
      
      // Show Custom Popup
      setShowSuccess(true);
      setError('');

      // Auto hide after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        // Optional: switch back to dashboard or reload 
        // window.location.reload(); 
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Theme Sync
  const toggleTheme = async (newTheme) => {
    setTheme(newTheme);
    try {
      await axios.put('/api/patients/update-theme', { email, theme: newTheme });
    } catch (e) { console.error('Failed to sync theme', e); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/patients/change-password', { email, ...passwordData });
      setMessage('Password changed successfully');
      setError('');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('/api/patients/delete-account', { data: { email, password: deletePassword } });
      // Logout logic
      localStorage.removeItem('patientToken');
      localStorage.removeItem('patientEmail');
      window.location.href = '/patient-login'; // Or home
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account');
    }
  };

  // Views
  const renderChangePassword = () => (
      <div className="sub-view fade-in">
          <div className="sub-header compact-header">
              <button onClick={() => setView('dashboard')} className="back-btn"><FaArrowLeft /> Back</button>
              <h2>Change Password</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="compact-form">
            <div className="settings-group compact-form-section">
                <div className="form-grid compact-grid" style={{gridTemplateColumns: '1fr'}}>
                    <div className="form-group"><label>Current Password</label><input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} /></div>
                    <div className="form-group"><label>New Password</label><input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} /></div>
                </div>
            </div>
            <button type="submit" className="save-btn compact-btn">Update Password</button>
          </form>
          {message && <p className="success-msg">{message}</p>}
          {error && <p className="error-msg" style={{textAlign: 'center', color: 'red'}}>{error}</p>}
      </div>
  );

  const renderDashboard = () => (
    <div className="settings-dashboard-compact fade-in">
        
        {/* Profile Summary */}
        <div className="settings-group profile-group">
            <div className="profile-row">
                <div className="profile-avatar-wrapper" style={{position: 'relative', cursor: 'pointer'}} onClick={() => fileInputRef.current.click()}>
                    <img src={imagePreview} alt="Profile" className="profile-avatar-small" />
                    <div className="avatar-overlay">
                        <FaCamera />
                    </div>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    style={{display: 'none'}} 
                    accept="image/*"
                />
                <div className="profile-info-compact">
                    <h3>{formData.name}</h3>
                    <p>{email}</p>
                </div>
            </div>
        </div>

        {/* Account Settings Group */}
        <div className="settings-group">
            <div className="group-title">Account & Health</div>
            <div className="settings-row clickable" onClick={() => setView('edit-profile')}>
                <div className="row-left"><div className="icon-small blue"><FaUser /></div> <span>Edit Profile & Health Data</span></div>
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
                    <input type="checkbox" />
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
                    <button className={`theme-btn-mini ${theme === 'light' ? 'active' : ''}`} onClick={() => toggleTheme('light')}><FaSun /></button>
                    <button className={`theme-btn-mini ${theme === 'dark' ? 'active' : ''}`} onClick={() => toggleTheme('dark')}><FaMoon /></button>
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
        </div>

         {/* Danger Zone */}
         <div className="settings-group danger-group">
             <div className="settings-row clickable" onClick={() => {
                 localStorage.removeItem('patientToken');
                 localStorage.removeItem('patientEmail');
                 window.location.href = '/patient-login';
             }}>
                <div className="row-left"><div className="icon-small red"><FaSignOutAlt /></div> <span className="text-red">Sign Out</span></div>
            </div>
            <div className="divider"></div>
            <div className="settings-row clickable" onClick={() => setShowDeleteConfirm(true)}>
                <div className="row-left"><div className="icon-small red"><FaTimes /></div> <span className="text-red">Delete Account</span></div>
                <FaChevronRight className="chevron" />
            </div>
        </div>

    </div>
  );

  const renderEditProfile = () => (
      <div className="sub-view fade-in">
          <div className="sub-header compact-header">
              <button onClick={() => setView('dashboard')} className="back-btn"><FaArrowLeft /> Back</button>
              <h2>Edit Profile & Health</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="compact-form">
             <div className="settings-group compact-form-section">
                 <div className="group-title">Personal Information</div>
                 <div className="form-grid compact-grid">
                    <div className="form-group full-width"><label>Full Name</label><input name="name" value={formData.name} onChange={handleChange} /></div>
                    <div className="form-group"><label>Age</label><input type="number" name="age" value={formData.age} onChange={handleChange} /></div>
                    <div className="form-group"><label>Blood Group</label>
                        <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="A+">A+</option> <option value="A-">A-</option> 
                            <option value="B+">B+</option> <option value="B-">B-</option>
                            <option value="AB+">AB+</option> <option value="AB-">AB-</option>
                            <option value="O+">O+</option> <option value="O-">O-</option>
                        </select>
                    </div>
                 </div>
             </div>

             <div className="settings-group compact-form-section">
                 <div className="group-title">Health Metrics</div>
                 <div className="form-grid compact-grid">
                    <div className="form-group"><label>Weight (kg)</label><input name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 70 kg" /></div>
                    <div className="form-group"><label>Blood Pressure</label><input name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} placeholder="e.g. 120/80" /></div>
                    <div className="form-group"><label>Blood Sugar</label><input name="bloodSugar" value={formData.bloodSugar} onChange={handleChange} placeholder="e.g. 95 mg/dL" /></div>
                    <div className="form-group"><label>Last Checkup</label><input type="date" name="lastCheckup" value={formData.lastCheckup ? new Date(formData.lastCheckup).toISOString().split('T')[0] : ''} onChange={handleChange} /></div>
                 </div>
             </div>

             <div className="settings-group compact-form-section">
                 <div className="group-title">Medical Details</div>
                 <div className="form-grid compact-grid">
                    <div className="form-group full-width"><label>Current Condition</label><input name="condition" value={formData.condition} onChange={handleChange} placeholder="Describe condition" /></div>
                    <div className="form-group"><label>Diagnosed With</label><input name="beendignosed" value={formData.beendignosed} onChange={handleChange} /></div>
                    <div className="form-group"><label>Difficulty</label><input name="difficulty" value={formData.difficulty} onChange={handleChange} /></div>
                 </div>
             </div>

             <button type="submit" className="save-btn compact-btn">Save Changes</button>
          </form>
          {message && <p className="success-msg">{message}</p>}
          {error && <p className="error-msg" style={{color: 'red', textAlign: 'center'}}>{error}</p>}
      </div>
  );

  /* Custom Success Modal */
  const renderSuccessModal = () => (
    <div className="success-popup-overlay">
      <div className="success-popup-card">
        <div className="success-icon-wrapper">
           <FaCheckCircle />
        </div>
        <h3>Success!</h3>
        <p>Your profile has been updated successfully.</p>
      </div>
    </div>
  );

  /* Custom Delete Confirm Modal */
  const renderDeleteConfirm = () => (
      <div className="custom-confirm-overlay">
          <div className="custom-confirm-modal">
             <h3>Delete Account?</h3>
             <p>This action is irreversible. Enter password to confirm.</p>
             <input 
                type="password" 
                placeholder="Current Password" 
                className="input" 
                style={{marginBottom: '15px'}} 
                value={deletePassword} 
                onChange={(e) => setDeletePassword(e.target.value)}
             />
             <div className="confirm-actions">
                 <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                 <button className="confirm-btn red" onClick={handleDeleteAccount}>Delete</button>
             </div>
             {error && <p style={{color: 'red', fontSize: '0.8rem', marginTop: '10px'}}>{error}</p>}
          </div>
      </div>
  );

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-backdrop" onClick={onClose}></div>
      <div className="profile-modal-container single-column">
        {showSuccess && renderSuccessModal()} 
        {showDeleteConfirm && renderDeleteConfirm()}
        <div className="modal-header-bar">
            <h2>Settings</h2>
            <button className="profile-close-btn" onClick={onClose}><FaTimes /></button>
        </div>
        <div className="modal-scroll-content">
            {view === 'dashboard' && renderDashboard()}
            {view === 'edit-profile' && renderEditProfile()}
            {view === 'change-password' && renderChangePassword()}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
