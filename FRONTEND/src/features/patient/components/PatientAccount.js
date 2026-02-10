import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import PatientProfile from './PatientProfile';
import 'bulma/css/bulma.min.css';
import '../../../components/styles/PatientAccount.css';
import { FaSignOutAlt, FaTimes, FaCog, FaChevronUp, FaHeartbeat, FaTint, FaWeight, FaPhoneAlt, FaBell, FaCalendarAlt, FaVideo, FaPrescriptionBottle } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { storage } from '../../../utils/storage';

const PatientAccount = () => {
  const [patient, setPatient] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Health metrics
  const [healthMetrics, setHealthMetrics] = useState({
    bloodPressure: '--',
    bloodSugar: '--',
    weight: '--',
    lastCheckup: '--'
  });

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'tip', message: 'Welcome to your new dashboard! Complete your profile.', time: 'Just now' }
  ]);

  // Close profile menu when clicking outside
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const email = storage.getItem('patientEmail');
        if (!email) {
          window.location.href = '/patient-login';
          return;
        }

        const res = await axios.get(`/api/patients/pdetails/email/${email}`);
        setPatient(res.data);
        
        // Update health metrics from backend data
        if (res.data) {
          setHealthMetrics({
            bloodPressure: res.data.bloodPressure || '--',
            bloodSugar: res.data.bloodSugar || '--',
            weight: res.data.weight || '--',
            lastCheckup: formatDate(res.data.lastCheckup) || 'Not recorded'
          });
        }

        // Fetch total appointments count
        try {
          const appointmentRes = await axios.get(`/api/appointments/count/patient/${email}`);
          setTotalAppointments(appointmentRes.data.count || 0);
        } catch (err) {
          console.error('Error fetching total appointments:', err);
        }

        // Fetch upcoming appointments
        try {
          // Use the specific upcoming endpoint
          const upcomingRes = await axios.get(`/api/appointments/upcoming/patient/${email}`);
          setUpcomingAppointments(upcomingRes.data || []);
        } catch (err) {
          console.error('Error fetching upcoming appointments:', err);
        }

        // Fetch prescriptions count
        try {
          // Using existing prescription route if available, otherwise mock or count from endpoint
          const prescriptionRes = await axios.get(`/api/prescriptions/count?patientEmail=${email}`);
          setRecentPrescriptions(prescriptionRes.data.count || 0);
        } catch (err) {
          // Fallback if specific count endpoint doesn't exist, try fetching all
          try {
             const allPrescriptions = await axios.get(`/api/prescriptions/patient/${email}`);
             setRecentPrescriptions(allPrescriptions.data ? allPrescriptions.data.length : 0);
          } catch (e) {
             console.log('Prescriptions endpoint issue', e);
          }
        }

        // Fetch notifications
        try {
          const notifRes = await axios.get(`/api/notifications/${email}`);
          if (notifRes.data && notifRes.data.length > 0) {
            // Transform to match UI expectation if needed
            const formattedNotifs = notifRes.data.map(n => ({
              id: n._id,
              type: n.type,
              message: n.message,
              time: formatTimeAgo(n.createdAt),
              icon: n.icon
            }));
            setNotifications(formattedNotifs);
          }
        } catch (err) {
          console.log('No notifications found');
        }

      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };

    fetchPatientDetails();
  }, [refreshTrigger]);
  
  // Helper to format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const handleLogout = () => {
    storage.removeItem('patientToken');
    storage.removeItem('patientEmail');
    window.location.href = '/';
  };

  const closeModal = () => setActiveModal(null);

  const getImageUrl = (path) => {
    if (!path) return 'https://ui-avatars.com/api/?name=Patient&background=random';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:1002';
    return `${apiUrl}${cleanPath}?t=${new Date().getTime()}`;
  };

  const getNextAppointment = () => {
    if (upcomingAppointments.length === 0) return null;
    return upcomingAppointments[0];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!patient) {
    return <div className="loading">Loading...</div>;
  }

  const nextAppointment = getNextAppointment();

  return (
    <div className="full-background">
      <Helmet>
        <title>Patient Dashboard - {patient.name}</title>
      </Helmet>
      <div className="patient-account-container">
        
        {/* Header with Welcome */}
        <div className="patient-greetings-container simple-header">
          <h2 className="title is-3 greeting-text">Welcome back, {patient.name?.split(' ')[0] || 'Patient'}! 👋</h2>
          
        </div>

        {/* Health Overview Section */}
        <div className="health-overview-section fade-in">
          <h3 className="section-title">Health Overview</h3>
          <div className="health-metrics-grid">
            <div className="metric-card">
              <div className="metric-icon bp-icon">
                <FaHeartbeat />
              </div>
              <div className="metric-info">
                <span className="metric-label">Blood Pressure</span>
                <span className="metric-value">{healthMetrics.bloodPressure}</span>
                <span className="metric-status normal">Normal</span>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon sugar-icon">
                <FaTint />
              </div>
              <div className="metric-info">
                <span className="metric-label">Blood Sugar</span>
                <span className="metric-value">{healthMetrics.bloodSugar}</span>
                <span className="metric-status normal">Normal</span>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon weight-icon">
                <FaWeight />
              </div>
              <div className="metric-info">
                <span className="metric-label">Weight</span>
                <span className="metric-value">{healthMetrics.weight}</span>
                <span className="metric-status">Healthy</span>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon checkup-icon">
                <FaCalendarAlt />
              </div>
              <div className="metric-info">
                <span className="metric-label">Last Checkup</span>
                <span className="metric-value">{healthMetrics.lastCheckup}</span>
                <span className="metric-status">Recent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Appointment Highlight */}
        {nextAppointment && (
          <div className="next-appointment-highlight fade-in">
            <div className="appointment-header">
              <h3 className="section-title">Next Appointment</h3>
              <span className="appointment-badge">{formatDate(nextAppointment.date)}</span>
            </div>
            <div className="appointment-content">
              <div className="doctor-info">
                <div className="doctor-avatar">
                  {nextAppointment.doctorName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="doctor-details">
                  <h4>{nextAppointment.doctorName}</h4>
                  <p>{nextAppointment.specialization}</p>
                </div>
              </div>
              <div className="appointment-time">
                <FaCalendarAlt /> {nextAppointment.timeSlot}
                {nextAppointment.type === 'Video' && <span className="video-badge"><FaVideo /> Video Call</span>}
              </div>
              <div className="appointment-actions">
                <button className="btn-reschedule">Reschedule</button>
                {nextAppointment.type === 'Video' && <button className="btn-join">Join Call</button>}
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Cards */}
        <div className="stats-grid fade-in">
          <div className="dashboard-card total-appointments-card" onClick={() => setActiveModal('appointmentsInfo')}>
            <span className="icon">
              <i className="fas fa-calendar-check"></i>
            </span>
            <div className="dashboard-card-link">Total Appointments</div>
            <p className="dashboard-card-subtext">{totalAppointments} Appointments</p>
          </div>

          <div className="dashboard-card upcoming-appointments-card" onClick={() => setActiveModal('upcomingAppointments')}>
            <span className="icon">
              <i className="fas fa-calendar-day"></i>
            </span>
            <div className="dashboard-card-link">Upcoming</div>
            <p className="dashboard-card-subtext">{upcomingAppointments.length} Scheduled</p>
          </div>
          
          <div className="dashboard-card prescriptions-card" onClick={() => setActiveModal('prescriptionsInfo')}>
            <span className="icon">
              <i className="fas fa-file-medical"></i>
            </span>
            <div className="dashboard-card-link">Prescriptions</div>
            <p className="dashboard-card-subtext">{recentPrescriptions} Active</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section fade-in">
          <h3 className="section-title">Quick Actions</h3>
          <div className="actions-grid">
            <div className="dashboard-card action-card" onClick={() => window.location.href = '/patient/appointment'}>
              <span className="icon">
                <i className="fas fa-calendar-plus"></i>
              </span>
              <div className="dashboard-card-link">Book Appointment</div>
              <p className="dashboard-card-subtext">Schedule with a doctor</p>
            </div>
            
            <div className="dashboard-card action-card" onClick={() => window.location.href = '/view-prescription'}>
              <span className="icon">
                <i className="fas fa-prescription"></i>
              </span>
              <div className="dashboard-card-link">My Prescriptions</div>
              <p className="dashboard-card-subtext">View & download</p>
            </div>
            
            <div className="dashboard-card action-card" onClick={() => window.location.href = '/patient/pharmacy'}>
              <span className="icon">
                <i className="fas fa-capsules"></i>
              </span>
              <div className="dashboard-card-link">Order Medicine</div>
              <p className="dashboard-card-subtext">From pharmacy</p>
            </div>
            
            <div className="dashboard-card action-card" onClick={() => window.location.href = '/patient/healthcard'}>
              <span className="icon">
                <i className="fas fa-id-card"></i>
              </span>
              <div className="dashboard-card-link">Health Card</div>
              <p className="dashboard-card-subtext">Digital ID card</p>
            </div>

            <div className="dashboard-card action-card" onClick={() => window.location.href = '/patient/testbills'}>
              <span className="icon">
                <i className="fas fa-file-invoice-dollar"></i>
              </span>
              <div className="dashboard-card-link">Bills & Payments</div>
              <p className="dashboard-card-subtext">View billing history</p>
            </div>

            <div className="dashboard-card action-card emergency-card" onClick={() => setActiveModal('emergency')}>
              <span className="icon">
                <FaPhoneAlt />
              </span>
              <div className="dashboard-card-link">Emergency</div>
              <p className="dashboard-card-subtext">24/7 helpline</p>
            </div>
          </div>
        </div>

        {/* Notifications & Tips */}
        <div className="notifications-section fade-in">
          <h3 className="section-title"><FaBell /> Notifications & Health Tips</h3>
          <div className="notifications-list">
            {notifications.map(notif => (
              <div key={notif.id} className={`notification-item ${notif.type}`}>
                <div className="notif-icon">
                  {notif.type === 'reminder' && <FaPrescriptionBottle />}
                  {notif.type === 'appointment' && <FaCalendarAlt />}
                  {notif.type === 'tip' && <FaHeartbeat />}
                </div>
                <div className="notif-content">
                  <p>{notif.message}</p>
                  <span className="notif-time">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Profile Widget */}
        <div className="mini-profile-widget" ref={menuRef}>
          {showProfileMenu && (
            <div className="profile-menu-popup">
              <div className="menu-item" onClick={() => { setActiveModal('profile'); setShowProfileMenu(false); }}>
                <FaCog className="menu-icon" /> Settings
              </div>
              <div className="menu-item logout" onClick={() => { setActiveModal('logoutConfirmation'); setShowProfileMenu(false); }}>
                <FaSignOutAlt className="menu-icon" /> Logout
              </div>
            </div>
          )}
          <div className="profile-bar" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <img 
              src={getImageUrl(patient.profilePicture)} 
              alt="Profile" 
              className="mini-profile-img" 
              onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=Patient&background=random'}
            />
            <div className="mini-profile-info">
              <span className="mini-patient-name">{patient.name || 'Patient'}</span>
              <span className="mini-patient-role">Patient</span>
            </div>
            <FaChevronUp className={`mini-toggle-icon ${showProfileMenu ? 'open' : ''}`} />
          </div>
        </div>

        {/* Modals */}
        {activeModal === 'logoutConfirmation' && (
          <div className="chart-modal" onClick={closeModal}>
            <div className="chart-modal-content logout-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="chart-modal-title">Confirm Logout</h3>
              <p className="chart-modal-subtitle">Are you sure you want to logout?</p>
              <div className="logout-actions">
                <button className="button is-danger is-rounded" onClick={handleLogout}>Yes, Logout</button>
                <button className="button is-light is-rounded" onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {activeModal === 'profile' && <PatientProfile email={patient.email} onClose={closeModal} onProfileUpdate={() => setRefreshTrigger(prev => prev + 1)} />}

        {activeModal === 'emergency' && (
          <div className="chart-modal" onClick={closeModal}>
            <div className="chart-modal-content emergency-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="chart-modal-title">Emergency Contacts</h3>
              <div className="emergency-contacts">
                <div className="emergency-item">
                  <FaPhoneAlt className="emergency-icon" />
                  <div>
                    <h4>Ambulance</h4>
                    <a href="tel:102" className="emergency-number">102</a>
                  </div>
                </div>
                <div className="emergency-item">
                  <FaPhoneAlt className="emergency-icon" />
                  <div>
                    <h4>Hospital Emergency</h4>
                    <a href="tel:+1234567890" className="emergency-number">+123-456-7890</a>
                  </div>
                </div>
                <div className="emergency-item">
                  <FaPhoneAlt className="emergency-icon" />
                  <div>
                    <h4>24/7 Helpline</h4>
                    <a href="tel:+1234567891" className="emergency-number">+123-456-7891</a>
                  </div>
                </div>
              </div>
              <button className="chart-modal-close" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {activeModal === 'upcomingAppointments' && (
          <div className="chart-modal" onClick={closeModal}>
            <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="chart-modal-title">Upcoming Appointments</h2>
              <p className="chart-modal-subtitle">Your scheduled appointments</p>
              <div className="appointments-container">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <div className="appointment-card" key={appointment._id}>
                      <p><strong>Doctor:</strong> {appointment.doctorName}</p>
                      <p><strong>Specialization:</strong> {appointment.specialization}</p>
                      <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
                      <p><strong>Time:</strong> {appointment.timeSlot}</p>
                      <p><strong>Type:</strong> {appointment.type}</p>
                    </div>
                  ))
                ) : (
                  <p className="has-text-centered has-text-grey">No upcoming appointments.</p>
                )}
              </div>
              <button className="chart-modal-close" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PatientAccount;
