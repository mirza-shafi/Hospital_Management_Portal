import React from 'react';
import '../../../components/styles/BloodBank.css'; 
import { Link } from 'react-router-dom';
import bloodbankImage from '../../../assets/bloodbank.png';
import blooddonorImage from '../../../assets/blooddonor.png';
import bloodrecipientImage from '../../../assets/bloodrecipient.png';
import bloodavailImage from '../../../assets/bloodavail.png';
import bloodgroupImage from '../../../assets/bloodgroup.png';
import { Helmet } from 'react-helmet';

const BloodBank = () => {
  return (
    <div className="bloodbank-page">
      <Helmet>
        <title>Blood Bank - HealingWave</title>
      </Helmet>

      <div className="bloodbank-container">
        <Link to="/" className="back-home">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>

        <h1 className="bloodbank-page-title">Blood Bank Portal</h1>
        <p className="bloodbank-page-subtitle">
          Bridging the gap between donors and recipients. Every drop counts in saving a life.
        </p>

        <div className="bloodbank-grid">
          <Link to="/blood-donor" className="bloodbank-card-link">
            <div className="bloodbank-card">
              <div className="bloodbank-card-image">
                <img src={blooddonorImage} alt="Blood Donor" />
              </div>
              <div className="bloodbank-card-content">
                <p className="card-title">Donate Blood</p>
                <p className="card-subtitle">Register yourself as a hero and save lives.</p>
              </div>
            </div>
          </Link>

          <Link to="/blood-recipient" className="bloodbank-card-link">
            <div className="bloodbank-card">
              <div className="bloodbank-card-image">
                <img src={bloodrecipientImage} alt="Blood Recipient" />
              </div>
              <div className="bloodbank-card-content">
                <p className="card-title">Find Blood</p>
                <p className="card-subtitle">Request blood for patients in need.</p>
              </div>
            </div>
          </Link>

          <Link to="/blood-availability" className="bloodbank-card-link">
            <div className="bloodbank-card">
              <div className="bloodbank-card-image">
                <img src={bloodavailImage} alt="Blood Availability" />
              </div>
              <div className="bloodbank-card-content">
                <p className="card-title">Availability</p>
                <p className="card-subtitle">Real-time check of available blood units.</p>
              </div>
            </div>
          </Link>

          <Link to="/blood-group" className="bloodbank-card-link">
            <div className="bloodbank-card">
              <div className="bloodbank-card-image">
                <img src={bloodgroupImage} alt="Blood Group Information" />
              </div>
              <div className="bloodbank-card-content">
                <p className="card-title">Compatibility</p>
                <p className="card-subtitle">Understand blood group compatibility.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};


export default BloodBank;
