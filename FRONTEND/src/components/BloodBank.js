import React from 'react';
import './styles/BloodBank.css'; 
import { Link } from 'react-router-dom';
import bloodbankImage from '../assets/bloodbank.png';
import blooddonorImage from '../assets/blooddonor.png';
import bloodrecipientImage from '../assets/bloodrecipient.png';
import bloodavailImage from '../assets/bloodavail.png';
import bloodgroupImage from '../assets/bloodgroup.png';
import { Helmet } from 'react-helmet';

const BloodBank = () => {
  return (
    <section className="bloodbank-page">
      <h1 className="bloodbank-page-title">Welcome to the Blood Bank</h1>
      <div className="bloodbank-image-container">
      <Helmet>
                   <title>Blood Bank Page</title>
                </Helmet>
        <img src={bloodbankImage} alt="Blood Bank" className="bloodbank-main-image" />
      </div>
      <p className="bloodbank-page-subtitle">
        Discover essential information about blood donation, recipients, availability, and group compatibility.
      </p>
      <div className="columns is-multiline is-centered">
        <div className="column is-one-quarter">
          <Link to="/blood-donor" className="bloodbank-card-link">
            <div className="card bloodbank-card">
              <div className="card-image bloodbank-card-image">
                <figure className="image">
                  <img src={blooddonorImage} alt="Blood Donor" />
                </figure>
              </div>
              <div className="card-content bloodbank-card-content">
                <p className="card-title">Blood Donor</p>
                <p className="card-subtitle">Information about donating blood.</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="column is-one-quarter">
          <Link to="/blood-recipient" className="bloodbank-card-link">
            <div className="card bloodbank-card">
              <div className="card-image bloodbank-card-image">
                <figure className="image">
                  <img src={bloodrecipientImage} alt="Blood Recipient" />
                </figure>
              </div>
              <div className="card-content bloodbank-card-content">
                <p className="card-title">Blood Recipient</p>
                <p className="card-subtitle">Information for those needing blood.</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="column is-one-quarter">
          <Link to="/blood-availability" className="bloodbank-card-link">
            <div className="card bloodbank-card">
              <div className="card-image bloodbank-card-image">
                <figure className="image">
                  <img src={bloodavailImage} alt="Blood Availability" />
                </figure>
              </div>
              <div className="card-content bloodbank-card-content">
                <p className="card-title">Blood Availability</p>
                <p className="card-subtitle">Check available blood types.</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="column is-one-quarter">
          <Link to="/blood-group" className="bloodbank-card-link">
            <div className="card bloodbank-card">
              <div className="card-image bloodbank-card-image">
                <figure className="image">
                  <img src={bloodgroupImage} alt="Blood Group Information" />
                </figure>
              </div>
              <div className="card-content bloodbank-card-content">
                <p className="card-title">Blood Group Info</p>
                <p className="card-subtitle">Details about blood group compatibility.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BloodBank;
