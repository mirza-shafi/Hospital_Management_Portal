import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import './styles/BloodRecipient.css';
import axios from 'axios';
import successSoundFile from '../assets/success.mp3';
import errorSoundFile from '../assets/error.mp3';
import { Helmet } from 'react-helmet';
const successSound = new Audio(successSoundFile);
const errorSound = new Audio(errorSoundFile);

const BloodRecipient = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    phoneNumber: '',
    bloodNeeded: '',
    totalBagsNeeded: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/bloodrecipient', formData);
      setMessage(response.data.message);
      setError('');
      playSound(successSound); 
    } catch (error) {
      setMessage('');
      setError(error.response?.data?.message || 'An error occurred.');
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
    <section className="blood-recipient-page">
      <div className="container">
      <Helmet>
                   <title>Blood Recipient Page</title>
                </Helmet>
        <div className="blood-recipient-form-container">
          <form className="blood-recipient-form" onSubmit={handleSubmit}>
            <h1 className="blood-recipient-form-title">Blood Recipient Form</h1>
            {message && (
              <div className="notification is-success blood-recipient-notification">
                <div className="icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="message">{message}</div>
                <button className="delete" onClick={() => setMessage('')}></button>
              </div>
            )}
            {error && (
              <div className="notification is-danger blood-recipient-notification">
                <div className="icon">
                  <i className="fas fa-exclamation-circle"></i>
                </div>
                <div className="message">{error}</div>
                <button className="delete" onClick={() => setError('')}></button>
              </div>
            )}
            <div className="field blood-recipient-field">
              <label className="label">First Name</label>
              <div className="control">
                <input
                  className="input blood-recipient-input"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="field blood-recipient-field">
              <label className="label">Last Name</label>
              <div className="control">
                <input
                  className="input blood-recipient-input"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="field blood-recipient-field">
              <label className="label">Gender</label>
              <div className="control">
                <div className="select blood-recipient-select">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="field blood-recipient-field">
              <label className="label">Email</label>
              <div className="control">
                <input
                  className="input blood-recipient-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="field blood-recipient-field">
              <label className="label">Phone Number</label>
              <div className="control">
                <input
                  className="input blood-recipient-input"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="field blood-recipient-field">
              <label className="label">Blood Needed</label>
              <div className="control">
                <div className="select blood-recipient-select">
                  <select
                    name="bloodNeeded"
                    value={formData.bloodNeeded}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select Blood Group</option>
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
            <div className="field blood-recipient-field">
              <label className="label">Total Bags Needed</label>
              <div className="control">
                <input
                  className="input blood-recipient-input"
                  type="number"
                  name="totalBagsNeeded"
                  value={formData.totalBagsNeeded}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>
            </div>
            <div className="field blood-recipient-field">
              <div className="control">
                <button className="button is-primary blood-recipient-button" type="submit">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BloodRecipient;
