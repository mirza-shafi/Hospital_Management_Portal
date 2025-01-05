
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorProfile from './DoctorProfile';
import 'bulma/css/bulma.min.css';
import './styles/DoctorAccount.css';
import { FaSignOutAlt, FaTimes } from 'react-icons/fa';
import AppointmentsChart from './AppointmentsChart';
import PatientsChart from './PatientsChart';
import { Helmet } from 'react-helmet';

const DoctorAccount = () => {
  const [doctor, setDoctor] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isPatientsChartModalOpen, setIsPatientsChartModalOpen] = useState(false);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [isTodayAppointmentsModalOpen, setIsTodayAppointmentsModalOpen] = useState(false);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const email = localStorage.getItem('doctorEmail');
        const res = await axios.get(`/api/doctors/ddetails/email/${email}`);
        setDoctor(res.data);

        // Fetch total appointments
        const appointmentRes = await axios.get(`/api/appointments/count/${email}`);
        setTotalAppointments(appointmentRes.data.count);

        // Fetch total patients
        const patientRes = await axios.get(`/api/prescriptions/count-patients?doctorEmail=${email}`);
        setTotalPatients(patientRes.data.count);

        // Fetch today's appointments
        const todayAppointmentsRes = await axios.get(`/api/appointments/today-appointments?doctorEmail=${email}`);
        setTodayAppointments(todayAppointmentsRes.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchDoctorDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('doctorEmail');
    window.location.href = '/';
  };

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="full-background">
       <Helmet>
        <title>Doctor Account Page</title>
      </Helmet>
      <div className="doctor-account-container">
        <div className="doctor-greetings-container">
          <div className="doctor-profile-container">
            <img src={doctor.profilePicture || '../assets/default-profile.png'} alt="Doctor Profile" className="doctor-profile-image" />
          </div>
          <div className="doctor-greetings-box">
            <h2 className="title is-3">Welcome Dr. {doctor.firstName} {doctor.lastName}</h2>
            <div className="buttons-container">
              <button onClick={() => setIsProfileModalOpen(true)} className="button is-warning is-rounded doctor-edit-profile-button">
                Edit Your Profile
              </button>
              <button onClick={handleLogout} className="button is-danger is-rounded doctor-logout-button">
                <span className="icon">
                  <FaSignOutAlt />
                </span>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="doctor-dashboard columns is-multiline is-centered">
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card total-appointments-card" onClick={() => setIsChartModalOpen(true)}>
              <span className="icon is-large">
                <i className="fas fa-calendar-check"></i>
              </span>
              <div className="dashboard-card-link">Total Appointments</div>
              <p className="dashboard-card-subtext">{totalAppointments} Appointments</p>
            </div>
          </div>

          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card total-patients-card" onClick={() => setIsPatientsChartModalOpen(true)}>
              <span className="icon is-large">
                <i className="fas fa-user"></i>
              </span>
              <div className="dashboard-card-link">Total Patients</div>
              <p className="dashboard-card-subtext">{totalPatients} Patients</p>
            </div>
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card today-appointment-card" onClick={() => setIsTodayAppointmentsModalOpen(true)}>
              <span className="icon is-large">
                <i className="fas fa-calendar-day"></i>
              </span>
              <div className="dashboard-card-link">Today's Appointments</div>
              <p className="dashboard-card-subtext">{todayAppointments.length} Appointments</p>
            </div>
          </div>
        </div>

        <div className="doctor-dashboard columns is-multiline is-centered">
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card">
              <span className="icon is-large">
                <i className="fas fa-prescription"></i>
              </span>
              <a href="/add-prescription" className="dashboard-card-link">Add Prescription</a>
              <p className="dashboard-card-subtext">Quickly add new prescriptions</p>
            </div>
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card">
              <span className="icon is-large">
                <i className="fas fa-calendar-alt"></i>
              </span>
              <a href="/appointment-details" className="dashboard-card-link">Appointment Details</a>
              <p className="dashboard-card-subtext">View and manage appointments</p>
            </div>
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card">
              <span className="icon is-large">
                <i className="fas fa-user-injured"></i>
              </span>
              <a href="/patient-details" className="dashboard-card-link">Patient Details</a>
              <p className="dashboard-card-subtext">Access patient information</p>
            </div>
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card">
              <span className="icon is-large">
                <i className="fas fa-file-prescription"></i>
              </span>
              <a href="/patient-prescription" className="dashboard-card-link">Patient Prescription</a>
              <p className="dashboard-card-subtext">View and update prescriptions</p>
            </div>
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card">
              <span className="icon is-large">
                <i className="fas fa-flask"></i>
              </span>
              <a href="/test-service" className="dashboard-card-link">Tests and Services</a>
              <p className="dashboard-card-subtext">View and update test services</p>
            </div>
          </div>
        </div>

        {isProfileModalOpen && <DoctorProfile email={doctor.email} onClose={() => setIsProfileModalOpen(false)} />}
        {isChartModalOpen && (
          <div className="chart-modal" onClick={() => setIsChartModalOpen(false)}>
            <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="chart-modal-title">Total Appointments Chart</h3>
              <p className="chart-modal-subtitle">An overview of all scheduled appointments for better management.</p>
              <div className="appointment-chart-container">
                <AppointmentsChart totalAppointments={totalAppointments} />
              </div>
              <button className="chart-modal-close" onClick={() => setIsChartModalOpen(false)}>
                <FaTimes />
              </button>
            </div>
          </div>
        )}
        {isPatientsChartModalOpen && (
          <div className="chart-modal" onClick={() => setIsPatientsChartModalOpen(false)}>
            <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="chart-modal-title">Total Patients Chart</h3>
              <p className="chart-modal-subtitle">An overview of the total number of patients for better management.</p>
              <div className="chart-container">
                <PatientsChart totalPatients={totalPatients} />
              </div>
              <button className="chart-modal-close" onClick={() => setIsPatientsChartModalOpen(false)}>
                <FaTimes />
              </button>
            </div>
          </div>
        )}
        {isTodayAppointmentsModalOpen && (
          <div className="chart-modal" onClick={() => setIsTodayAppointmentsModalOpen(false)}>
            <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="chart-modal-title">Today's Appointments</h2>
              <p className="chart-modal-subtitle">Detailed list of appointments scheduled for today.</p>
              <div className="appointments-container">
                {todayAppointments.map((appointment) => (
                  <div className="appointment-card" key={appointment._id}>
                    <p><strong>Time:</strong> {appointment.timeSlot} am</p>
                    <p><strong>Patient:</strong> {appointment.patientName}</p>
                    <p><strong>Email:</strong> {appointment.patientEmail}</p>
                 
                    
                  </div>
                ))}
              </div>
              <button className="chart-modal-close" onClick={() => setIsTodayAppointmentsModalOpen(false)}>
                <FaTimes />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAccount;
