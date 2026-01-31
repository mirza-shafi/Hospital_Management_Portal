import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './styles/SupportForm.css'; 

const SupportForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/support/submit', formData);
      setStatus('Your support request has been successfully submitted!');
      setIsError(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setStatus('Error submitting your request. Please try again.');
      setIsError(true);
    }
  };

  return (
    <div className="support-form-wrapper">
      <Helmet>
        <title>Support Portal - HealingWave</title>
      </Helmet>

      <div className="back-link-container">
        <Link to="/" className="support-back-home">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>
      </div>

      <div className="support-form-container">
        <div className="support-form-title-container">
          <h1 className="support-form-title">Support Portal</h1>
          <p className="support-form-subtitle">How can we help you today?</p>
        </div>

        <form onSubmit={handleSubmit} className="support-form">
          <div className="support-input-row">
            <div className="support-form-field">
              <label className="support-form-label">Name</label>
              <input
                className="support-form-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>
            <div className="support-form-field">
              <label className="support-form-label">Email</label>
              <input
                className="support-form-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          <div className="support-form-field">
            <label className="support-form-label">Phone Number</label>
            <input
              className="support-form-input"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+880 1XXX-XXXXXX"
              required
            />
          </div>

          <div className="support-form-field">
            <label className="support-form-label">Message</label>
            <textarea
              className="support-form-textarea"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe your issue or question in detail..."
              required
            ></textarea>
          </div>

          <button className="support-form-button">
            <i className="fas fa-paper-plane" style={{ marginRight: '10px' }}></i>
            Submit Request
          </button>

          {status && (
            <div className={`support-form-status ${isError ? 'error' : 'success'}`}>
              <i className={`fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}`} style={{ marginRight: '8px' }}></i>
              {status}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SupportForm;
