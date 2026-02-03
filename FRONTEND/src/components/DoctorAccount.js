

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import DoctorProfile from './DoctorProfile';
import 'bulma/css/bulma.min.css';
import './styles/DoctorAccount.css';
import { FaSignOutAlt, FaTimes, FaCog, FaChevronUp } from 'react-icons/fa';
import AppointmentsChart from './AppointmentsChart';
import PatientsChart from './PatientsChart';
import { Helmet } from 'react-helmet';

// Import sub-components for modal integration
import PrescriptionForm from './PrescriptionForm';
import AppointmentDetails from './AppointmentDetails';
import PatientDetails from './PatientDetails';
import ViewPrescription from './ViewPrescription';

const DoctorAccount = () => {
  const [doctor, setDoctor] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // Unified modal state
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);

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
    const fetchDoctorDetails = async () => {
      try {
        const email = localStorage.getItem('doctorEmail');
        if (!email) {
           window.location.href = '/doctor-login';
           return;
        }

        const res = await axios.get(`/api/doctors/ddetails/email/${email}`);
        setDoctor(res.data);

        const appointmentRes = await axios.get(`/api/appointments/count/${email}`);
        setTotalAppointments(appointmentRes.data.count);

        const patientRes = await axios.get(`/api/prescriptions/count-patients?doctorEmail=${email}`);
        setTotalPatients(patientRes.data.count);

        const todayAppointmentsRes = await axios.get(`/api/appointments/today-appointments?doctorEmail=${email}`);
        setTodayAppointments(todayAppointmentsRes.data);

      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };

    fetchDoctorDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('doctorToken');
    localStorage.removeItem('doctorEmail');
    window.location.href = '/';
  };

  const closeModal = () => setActiveModal(null);

  const getImageUrl = (path) => {
    if (!path) return 'https://ui-avatars.com/api/?name=User&background=random';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `http://localhost:1002${cleanPath}?t=${new Date().getTime()}`;
  };

  if (!doctor) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="full-background">
       <Helmet>
        <title>Doctor Account Page</title>
      </Helmet>
      <div className="doctor-account-container">
        
        {/* Simple Header */}
        <div className="doctor-greetings-container simple-header">
           <h2 className="title is-3 greeting-text">Welcome, Dr. {doctor.firstName}</h2>
           <p className="subtitle is-6">Manage your patients and appointments efficiently</p>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="stats-grid fade-in">
          <div className="dashboard-card total-appointments-card" onClick={() => setActiveModal('appointmentsChart')}>
            <span className="icon">
              <i className="fas fa-calendar-check"></i>
            </span>
            <div className="dashboard-card-link">Total Appointments</div>
            <p className="dashboard-card-subtext">{totalAppointments} Appointments</p>
          </div>

          <div className="dashboard-card total-patients-card" onClick={() => setActiveModal('patientsChart')}>
            <span className="icon">
              <i className="fas fa-user-injured"></i>
            </span>
            <div className="dashboard-card-link">Total Patients</div>
            <p className="dashboard-card-subtext">{totalPatients} Patients</p>
          </div>
          
          <div className="dashboard-card today-appointment-card" onClick={() => setActiveModal('todayAppointments')}>
            <span className="icon">
              <i className="fas fa-calendar-day"></i>
            </span>
            <div className="dashboard-card-link">Today's Appointments</div>
            <p className="dashboard-card-subtext">{todayAppointments.length} Appointments</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="actions-grid fade-in">
          <div className="dashboard-card" onClick={() => setActiveModal('addPrescription')}>
            <span className="icon">
              <i className="fas fa-prescription"></i>
            </span>
            <div className="dashboard-card-link">Add Prescription</div>
            <p className="dashboard-card-subtext">Create new prescriptions for patients</p>
          </div>
          
          <div className="dashboard-card" onClick={() => setActiveModal('appointmentDetails')}>
            <span className="icon">
              <i className="fas fa-calendar-alt"></i>
            </span>
            <div className="dashboard-card-link">Appointments</div>
            <p className="dashboard-card-subtext">Manage upcoming schedules</p>
          </div>
          
          <div className="dashboard-card" onClick={() => setActiveModal('patientDetails')}>
            <span className="icon">
              <i className="fas fa-user-injured"></i>
            </span>
            <div className="dashboard-card-link">Patient Records</div>
            <p className="dashboard-card-subtext">View and manage medical histories</p>
          </div>
          
          <div className="dashboard-card" onClick={() => setActiveModal('viewPrescriptions')}>
            <span className="icon">
              <i className="fas fa-file-medical"></i>
            </span>
            <div className="dashboard-card-link">Prescriptions</div>
            <p className="dashboard-card-subtext">Review recent medical orders</p>
          </div>
        </div>

        {/* --- WIDGETS & MODALS --- */}

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
                    src={getImageUrl(doctor.profilePicture)} 
                    alt="Profile" 
                    className="mini-profile-img" 
                    onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=User&background=random'}
                />
                <div className="mini-profile-info">
                    <span className="mini-doctor-name">Dr. {doctor.lastName}</span>
                    <span className="mini-doctor-role">Doctor</span>
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
        {activeModal === 'profile' && <DoctorProfile email={doctor.email} onClose={closeModal} />}

        {/* Appointments Chart Modal */}
        {activeModal === 'appointmentsChart' && (
          <div className="chart-modal" onClick={closeModal}>
            <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="chart-modal-title">Total Appointments Chart</h3>
              <p className="chart-modal-subtitle">Overview of your scheduled appointments.</p>
              <div className="appointment-chart-container">
                <AppointmentsChart totalAppointments={totalAppointments} />
              </div>
              <button className="chart-modal-close" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* Patients Chart Modal */}
        {activeModal === 'patientsChart' && (
          <div className="chart-modal" onClick={closeModal}>
            <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="chart-modal-title">Total Patients Chart</h3>
              <p className="chart-modal-subtitle">Overview of your patient demographics.</p>
              <div className="chart-container">
                <PatientsChart totalPatients={totalPatients} />
              </div>
              <button className="chart-modal-close" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* Today's Appointments Modal */}
        {activeModal === 'todayAppointments' && (
          <div className="chart-modal" onClick={closeModal}>
            <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="chart-modal-title">Today's Appointments</h2>
              <p className="chart-modal-subtitle">List of appointments scheduled for today.</p>
              <div className="appointments-container">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((appointment) => (
                    <div className="appointment-card" key={appointment._id}>
                      <p><strong>Time:</strong> {appointment.timeSlot}</p>
                      <p><strong>Patient:</strong> {appointment.patientName}</p>
                      <p><strong>Email:</strong> {appointment.patientEmail}</p>
                    </div>
                  ))
                ) : (
                  <p className="has-text-centered has-text-grey">No appointments for today.</p>
                )}
              </div>
              <button className="chart-modal-close" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* --- FULLSCREEN MODALS FOR SUB-PAGES --- */}

        {activeModal === 'addPrescription' && (
          <div className="fullscreen-modal">
            <div className="fullscreen-modal-content-wrapper prescription-wrapper">
              <button className="close-modal-btn" onClick={closeModal}>
                <FaTimes />
              </button>
              <PrescriptionForm />
            </div>
          </div>
        )}

        {activeModal === 'appointmentDetails' && (
          <div className="fullscreen-modal">
             <div className="fullscreen-modal-content-wrapper appointment-table-wrapper">
              <button className="close-modal-btn" onClick={closeModal}>
                <FaTimes />
              </button>
              <AppointmentDetails />
            </div>
          </div>
        )}

        {activeModal === 'patientDetails' && (
          <div className="fullscreen-modal">
            <div className="fullscreen-modal-content-wrapper patient-details-wrapper">
              <button className="close-modal-btn" onClick={closeModal}>
                <FaTimes />
              </button>
              <PatientDetails />
            </div>
          </div>
        )}

        {activeModal === 'viewPrescriptions' && (
          <div className="fullscreen-modal">
            <div className="fullscreen-modal-content-wrapper view-prescription-wrapper">
              <button className="close-modal-btn" onClick={closeModal}>
                <FaTimes />
              </button>
              <ViewPrescription />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DoctorAccount;
