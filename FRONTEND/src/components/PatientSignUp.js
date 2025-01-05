import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import healingwaveImage from '../assets/healingwave.png'; 
import './styles/PatientSignUp.css';
import { Helmet } from 'react-helmet';

const PatientSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    sex: '',
    dateOfBirth: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { firstName, lastName, email, sex, dateOfBirth, mobileNumber, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('/api/patients/pregister', formData);
      setMessage(res.data.message);
      setError('');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        sex: '',
        dateOfBirth: '',
        mobileNumber: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error(error);
      setMessage('');
      setError(error.response.data.message || 'Error registering patient');
    }
  };

  return (
    <div className="patient-signup-container">
      <Helmet>
        <title> Patient Registration Page</title>
      </Helmet>
      <div className="patient-signup-content">
        <div className="patient-signup-image">
          <img src={healingwaveImage} alt="Healing Wave" />
        </div>
        <div className="patient-signup-form">
          <h2>Patient Account Registration</h2>
          {message && <Alert variant="success" className="patient-alert patient-alert-success">{message}</Alert>}
          {error && <Alert variant="danger" className="patient-alert patient-alert-danger">{error}</Alert>}
          <p className="patient-signup-quotation">Thank you for registration</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="firstName">
              <Form.Control
                type="text"
                placeholder="First Name"
                name="firstName"
                value={firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Control
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="sex">
              <Form.Control
                as="select"
                name="sex"
                value={sex}
                onChange={handleChange}
                required
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="dateOfBirth">
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={dateOfBirth}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="mobileNumber">
              <Form.Control
                type="text"
                placeholder="Mobile Number"
                name="mobileNumber"
                value={mobileNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">
         Register
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PatientSignUp;
