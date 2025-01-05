import React, { useState } from 'react';
import axios from 'axios';
import 'bulma/css/bulma.min.css';
import './styles/BloodDonor.css';
import successSoundFile from '../assets/success.mp3';
import errorSoundFile from '../assets/error.mp3';
import { Helmet } from 'react-helmet';

const successSound = new Audio(successSoundFile);
const errorSound = new Audio(errorSoundFile);

const BloodDonor = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    phoneNumber: '',
    bloodGroup: '',
    donatedBefore: 'no',
    lastDonationDate: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/blooddonor', formData);
      setSuccessMessage(response.data.message);
      setErrorMessage('');
      playSound(successSound); 
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setSuccessMessage('');
      playSound(errorSound); 
    }
  };

  const playSound = (audio) => {
    audio.volume = 1.0; 
    audio.currentTime = 0; 
    audio.play().catch((e) => {
      console.error('Error playing sound:', e);
    });
  };

  return (
    <section className="blooddonor-page">
      <div className="container">
      <Helmet>
                   <title>Blood Donor Page</title>
                </Helmet>
        <div className="blooddonor-form-container">
          <form className="blooddonor-form" onSubmit={handleSubmit}>
            <h1 className="blooddonor-form-title">Blood Donor Registration</h1>
            {successMessage && (
              <div className="notification is-success">
                <div className="icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="message">
                  {successMessage}
                </div>
                <button className="delete" onClick={() => setSuccessMessage('')}></button>
              </div>
            )}
            {errorMessage && (
              <div className="notification is-danger">
                <div className="icon">
                  <i className="fas fa-exclamation-circle"></i>
                </div>
                <div className="message">
                  {errorMessage}
                </div>
                <button className="delete" onClick={() => setErrorMessage('')}></button>
              </div>
            )}
            <div className="field">
              <label className="label">First Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Last Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Gender</label>
              <div className="control">
                <div className="select">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Phone Number</label>
              <div className="control">
                <input
                  className="input"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Blood Group</label>
              <div className="control">
                <div className="select">
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Have You Donated Before?</label>
              <div className="control">
                <div className="select">
                  <select
                    name="donatedBefore"
                    value={formData.donatedBefore}
                    onChange={handleChange}
                    required
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>
            {formData.donatedBefore === 'yes' && (
              <div className="field">
                <label className="label">Last Donation Date</label>
                <div className="control">
                  <input
                    className="input"
                    type="date"
                    name="lastDonationDate"
                    value={formData.lastDonationDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
            <div className="field">
              <button className="button is-primary" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BloodDonor;
