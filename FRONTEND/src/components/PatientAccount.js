import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientProfile from './PatientProfile';
import 'bulma/css/bulma.min.css';
import './styles/PatientAccount.css'; 
import { FaSignOutAlt } from 'react-icons/fa'; 
import patientAccountImage from '../assets/patientaccount.png';
import { Helmet } from 'react-helmet';

const PatientAccount = () => {
  const [patient, setDoctor] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const email = localStorage.getItem('patientEmail'); 
        const res = await axios.get(`/api/patients/pdetails/email/${email}`);
        setDoctor(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPatientDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('patientEmail');
    window.location.href = '/'; 
  };

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="full-background">
      <Helmet>
        <title>Patient Account Page</title>
      </Helmet>
      <div className="patient-account-container">
        <div className="patient-greetings-container">
          <img src={patientAccountImage} alt="Patient Account" className="patient-account-image" />
          <div className="patient-greetings-box">
            <h2 className="title is-3">Welcome  {patient.firstName} {patient.lastName}</h2>
            <div className="buttons is-centered">
              <button onClick={() => setIsProfileModalOpen(true)} className="button is-warning is-rounded patient-edit-profile-button">
                Edit Your Profile
              </button>
              <button onClick={handleLogout} className="button is-danger is-rounded patient-logout-button">
                <span className="icon">
                  <FaSignOutAlt />
                </span>
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="patient-dashboard columns is-multiline is-centered">
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card">
              <span className="icon is-large">
                <i className="fas fa-user-md"></i>
              </span>
              <a href="/doctor-details" className="dashboard-card-link">Get Doctor Details</a>
              <p className="dashboard-card-subtext">Find information about doctors</p>
            </div>
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card">
              <span className="icon is-large">
                <i className="fas fa-file-medical"></i>
              </span>
              <a href="/view-prescription" className="dashboard-card-link">View Prescription</a>
              <p className="dashboard-card-subtext">View and manage your prescriptions</p>
            </div>
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card">
              <span className="icon is-large">
                <i className="fas fa-calendar-alt"></i>
              </span>
              <a href="/appointment-form" className="dashboard-card-link"> Take Appointment</a>
              <p className="dashboard-card-subtext">Take your appointments</p>
            </div>
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card">
              <span className="icon is-large">
                <i className="fas fa-calendar-alt"></i>
              </span>
              <a href="/view-appointment" className="dashboard-card-link"> View Appointment</a>
              <p className="dashboard-card-subtext">Manage your appointments</p>
            </div>
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card">
              <span className="icon is-large">
                <i className="fas fa-id-card"></i>
              </span>
              <a href="/health-card" className="dashboard-card-link">Health Card</a>
              <p className="dashboard-card-subtext">View your health card</p>
            </div>
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card">
              <span className="icon is-large">
                <i className="fas fa-bed"></i> 
              </span>
              <a href="/book-cabin" className="dashboard-card-link">Cabin</a>
              <p className="dashboard-card-subtext">Book a cabin online</p>
            </div>
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card">
              <span className="icon is-large">
                <i className="fas fa-warehouse"></i> 
              </span>
              <a href="/book-ward" className="dashboard-card-link">Ward</a>
              <p className="dashboard-card-subtext">View and update test services</p>
            </div>
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card">
              <span className="icon is-large">
                <i className="fas fa-receipt"></i> 
              </span>
              <a href="/admission-bill" className="dashboard-card-link">Admission Bill</a>
              <p className="dashboard-card-subtext">View Your Admission Bill Details</p>
            </div>
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card">
              <span className="icon is-large">
                <i className="fas fa-vial"></i> 
              </span>
              <a href="/test-bill" className="dashboard-card-link">Tests Bill</a>
              <p className="dashboard-card-subtext">View Your Test Bill Details</p>
            </div>
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card">
              <span className="icon is-large">
                <i className="fas fa-pills"></i> 
              </span>
              <a href="/medicine-bill" className="dashboard-card-link">Medicine Bill</a>
              <p className="dashboard-card-subtext">View Your Admission Bill Details</p>
            </div>
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card">
              <span className="icon is-large">
                <i className="fas fa-capsules"></i> 
              </span>
              <a href="/pharmacy" className="dashboard-card-link">Pharmacy</a>
              <p className="dashboard-card-subtext">Click to see available medicines </p>
            </div>
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet mb-4">
            <div className="box dashboard-card">
              <span className="icon is-large">
                <i className="fas fa-shopping-cart"></i> 
              </span>
              <a href="/buy-medicine" className="dashboard-card-link">Buy Medicine</a>
              <p className="dashboard-card-subtext">Click to buy medicines</p>
            </div>
          </div>
         
        </div>

        {isProfileModalOpen && <PatientProfile email={patient.email} onClose={() => setIsProfileModalOpen(false)} />}
      </div>
    </div>
  );
};

export default PatientAccount;
