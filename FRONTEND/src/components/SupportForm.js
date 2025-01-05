import React, { useState } from 'react';
import axios from 'axios';
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
    } catch (error) {
      setStatus('Error submitting your request. Please try again.');
      setIsError(true);
    }
  };

  return (
    <div className="support-form-wrapper">
      <div className="support-form-container">
        <div className="support-form-title-container">
          <h1 className="support-form-title">Support Portal</h1>
        </div>
        <form onSubmit={handleSubmit} className="support-form">
          <div className="support-form-field">
            <label className="support-form-label">Name</label>
            <div className="support-form-control">
              <input
                className="support-form-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="support-form-field">
            <label className="support-form-label">Email</label>
            <div className="support-form-control">
              <input
                className="support-form-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="support-form-field">
            <label className="support-form-label">Phone</label>
            <div className="support-form-control">
              <input
                className="support-form-input"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="support-form-field">
            <label className="support-form-label">Message</label>
            <div className="support-form-control">
              <textarea
                className="support-form-textarea"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>
          <div className="support-form-field">
            <div className="support-form-control">
              <button className="support-form-button">Submit</button>
            </div>
          </div>
          {status && (
            <p className={`support-form-status ${isError ? 'error' : 'success'}`}>
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SupportForm;
