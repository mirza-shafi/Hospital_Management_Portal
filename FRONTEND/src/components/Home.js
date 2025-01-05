import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import './styles/Home.css';
import dnpImg from '../assets/dnp.jpg';
import DoctorLogin from './DoctorLogin';
import PatientLogin from './PatientLogin';
import Chatbot from './Chatbot';
import NewsTicker from './NewsTicker';
import { Helmet } from 'react-helmet';

const Home = () => {
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showChatbox, setShowChatbox] = useState(false);

  const handleCloseDoctorModal = () => setShowDoctorModal(false);
  const handleShowDoctorModal = () => setShowDoctorModal(true);

  const handleClosePatientModal = () => setShowPatientModal(false);
  const handleShowPatientModal = () => setShowPatientModal(true);

  const toggleChatbox = () => setShowChatbox(!showChatbox);

  return (
    <div className="home-page">
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <NewsTicker />

      <div className="home-container">
        <div className="columns is-vcentered">
          <div className="column is-half welcome-section">
            <h1 className="welcome-message">Welcome to HealingWave Health Service</h1>
            <p className="hospital-quotation">
              "Providing the best medical care with compassion and excellence."
            </p>
            <div className="login-options">
              <button
                className="login-button doctor-button"
                onClick={handleShowDoctorModal}
              >
                <span className="icon is-small">
                  <i className="fas fa-user-md"></i>
                </span>
                <span>Doctor Login</span>
              </button>
              <button
                className="login-button patient-button"
                onClick={handleShowPatientModal}
              >
                <span className="icon is-small">
                  <i className="fas fa-user-injured"></i>
                </span>
                <span>Patient Login</span>
              </button>
            </div>
          </div>
          <div className="column is-half">
            <img src={dnpImg} alt="Healingwave" className="home-image" />
          </div>
        </div>
      </div>

      {showDoctorModal && (
        <div className="modal is-active doctor-modal">
          <div className="modal-background" onClick={handleCloseDoctorModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Doctor Portal</p>
              <button className="modal-close" aria-label="close" onClick={handleCloseDoctorModal}></button>
            </header>
            <section className="modal-card-body">
              <DoctorLogin onClose={handleCloseDoctorModal} />
            </section>
          </div>
        </div>
      )}

      {showPatientModal && (
        <div className="modal is-active patient-modal">
          <div className="modal-background" onClick={handleClosePatientModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Patient Portal</p>
              <button className="modal-close" aria-label="close" onClick={handleClosePatientModal}></button>
            </header>
            <section className="modal-card-body">
              <PatientLogin onClose={handleClosePatientModal} />
            </section>
          </div>
        </div>
      )}

      <div className="chatbot-icon" onClick={toggleChatbox}>
        <i className="fas fa-robot"></i>
      </div>

      {showChatbox && (
        <div className="chatbox">
          <header className="chatbox-header">
            <p className="chatbox-title">Chat with Us</p>
            <button className="chatbox-close" aria-label="close" onClick={toggleChatbox}></button>
          </header>
          <section className="chatbox-body">
            <Chatbot />
          </section>
        </div>
      )}
    </div>
  );
};

export default Home;
