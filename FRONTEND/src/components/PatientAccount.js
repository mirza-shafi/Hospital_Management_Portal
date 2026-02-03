import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import PatientProfile from './PatientProfile';
import 'bulma/css/bulma.min.css';
import './styles/PatientAccount.css';
import { FaSignOutAlt, FaTimes, FaCog, FaChevronUp } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const PatientAccount = () => {
  const [patient, setPatient] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState(0);

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
        const email = localStorage.getItem('patientEmail');
        if (!email) {
          window.location.href = '/patient-login';
          return;
        }

        const res = await axios.get(`/api/patients/pdetails/email/${email}`);
        setPatient(res.data);

        // Fetch appointments count (placeholder - adjust API endpoint as needed)
        try {
          const appointmentRes = await axios.get(`/api/appointments/count/${email}`);
          setTotalAppointments(appointmentRes.data.count || 0);
        } catch (err) {
          console.log('Appointments endpoint not available yet');
          setTotalAppointments(0);
        }

        // Fetch upcoming appointments (placeholder)
        try {
          const upcomingRes = await axios.get(`/api/appointments/upcoming?patientEmail=${email}`);
          setUpcomingAppointments(upcomingRes.data || []);
        } catch (err) {
          console.log('Upcoming appointments endpoint not available yet');
          setUpcomingAppointments([]);
        }

        // Fetch prescriptions count (placeholder)
        try {
          const prescriptionRes = await axios.get(`/api/prescriptions/count?patientEmail=${email}`);
          setRecentPrescriptions(prescriptionRes.data.count || 0);
        } catch (err) {
          console.log('Prescriptions endpoint not available yet');
          setRecentPrescriptions(0);
        }

      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };

    fetchPatientDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('patientToken');
    localStorage.removeItem('patientEmail');
    window.location.href = '/';
  };

  const closeModal = () => setActiveModal(null);

  const getImageUrl = (path) => {
    if (!path) return 'https://ui-avatars.com/api/?name=Patient&background=random';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `http://localhost:1002${cleanPath}?t=${new Date().getTime()}`;
  };

  if (!patient) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="full-background">
      <Helmet>
        <title>Patient Account Page</title>
      </Helmet>
      <div className="patient-account-container">
        
        {/* Simple Header */}
        <div className="patient-greetings-container simple-header">
          <h2 className="title is-3 greeting-text">Welcome, {patient.name || 'Patient'}</h2>
          <p className="subtitle is-6">Manage your health records and appointments</p>
        </div>

        {/* Dashboard Stats Cards */}
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
            <div className="dashboard-card-link">Upcoming Appointments</div>
            <p className="dashboard-card-subtext">{upcomingAppointments.length} Scheduled</p>
          </div>
          
          <div className="dashboard-card prescriptions-card" onClick={() => setActiveModal('prescriptionsInfo')}>
            <span className="icon">
              <i className="fas fa-file-medical"></i>
            </span>
            <div className="dashboard-card-link">My Prescriptions</div>
            <p className="dashboard-card-subtext">{recentPrescriptions} Records</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="actions-grid fade-in">
          <div className="dashboard-card" onClick={() => window.location.href = '/patient/appointment'}>
            <span className="icon">
              <i className="fas fa-calendar-plus"></i>
            </span>
            <div className="dashboard-card-link">Book Appointment</div>
            <p className="dashboard-card-subtext">Schedule a new appointment</p>
          </div>
          
          <div className="dashboard-card" onClick={() => window.location.href = '/view-prescription'}>
            <span className="icon">
              <i className="fas fa-prescription"></i>
            </span>
            <div className="dashboard-card-link">View Prescriptions</div>
            <p className="dashboard-card-subtext">Access your medical prescriptions</p>
          </div>
          
          <div className="dashboard-card" onClick={() => window.location.href = '/patient/healthcard'}>
            <span className="icon">
              <i className="fas fa-id-card"></i>
            </span>
            <div className="dashboard-card-link">Health Card</div>
            <p className="dashboard-card-subtext">View your health card details</p>
          </div>
          
          <div className="dashboard-card" onClick={() => window.location.href = '/patient/bookcabin'}>
            <span className="icon">
              <i className="fas fa-bed"></i>
            </span>
            <div className="dashboard-card-link">Book Cabin</div>
            <p className="dashboard-card-subtext">Reserve a hospital cabin</p>
          </div>

          <div className="dashboard-card" onClick={() => window.location.href = '/patient/bookward'}>
            <span className="icon">
              <i className="fas fa-warehouse"></i>
            </span>
            <div className="dashboard-card-link">Book Ward</div>
            <p className="dashboard-card-subtext">Reserve a hospital ward</p>
          </div>

          <div className="dashboard-card" onClick={() => window.location.href = '/patient/pharmacy'}>
            <span className="icon">
              <i className="fas fa-capsules"></i>
            </span>
            <div className="dashboard-card-link">Pharmacy</div>
            <p className="dashboard-card-subtext">Browse and purchase medicines</p>
          </div>

          <div className="dashboard-card" onClick={() => window.location.href = '/patient/testbills'}>
            <span className="icon">
              <i className="fas fa-vial"></i>
            </span>
            <div className="dashboard-card-link">Test Bills</div>
            <p className="dashboard-card-subtext">View your test billing details</p>
          </div>
        </div>

        {/* Mini Profile Widget (Bottom Left) */}
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

        {/* Logout Confirmation Modal */}
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

        {/* Profile Modal */}
        {activeModal === 'profile' && <PatientProfile email={patient.email} onClose={closeModal} />}

        {/* Appointments Info Modal */}
        {activeModal === 'appointmentsInfo' && (
          <div className="chart-modal" onClick={closeModal}>
            <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="chart-modal-title">Total Appointments</h3>
              <p className="chart-modal-subtitle">Overview of your appointment history</p>
              <div className="info-content">
                <p>You have <strong>{totalAppointments}</strong> total appointments in your records.</p>
                <p>To book a new appointment, click on "Book Appointment" card.</p>
              </div>
              <button className="chart-modal-close" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* Upcoming Appointments Modal */}
        {activeModal === 'upcomingAppointments' && (
          <div className="chart-modal" onClick={closeModal}>
            <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="chart-modal-title">Upcoming Appointments</h2>
              <p className="chart-modal-subtitle">Your scheduled appointments</p>
              <div className="appointments-container">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <div className="appointment-card" key={appointment._id}>
                      <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {appointment.timeSlot}</p>
                      <p><strong>Doctor:</strong> {appointment.doctorName}</p>
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

        {/* Prescriptions Info Modal */}
        {activeModal === 'prescriptionsInfo' && (
          <div className="chart-modal" onClick={closeModal}>
            <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="chart-modal-title">My Prescriptions</h3>
              <p className="chart-modal-subtitle">Your medical prescription records</p>
              <div className="info-content">
                <p>You have <strong>{recentPrescriptions}</strong> prescription records.</p>
                <p>To view all prescriptions, click on "View Prescriptions" card.</p>
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
