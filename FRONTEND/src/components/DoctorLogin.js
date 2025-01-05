import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/DoctorLogin.css'; 
import ECGAnimation from './ECGAnimation';
import { FaSignInAlt } from 'react-icons/fa'; 
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

const DoctorLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check for existing session
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/doctor-account');
    }
  }, [navigate]);

  // Add this at the top of your component to verify environment variables
  useEffect(() => {
    console.log('Environment Variables:', {
      apiUrl: process.env.REACT_APP_API_URL,
      nodeEnv: process.env.NODE_ENV,
    });
  }, []);

  const { email, password } = formData;

  const validateForm = () => {
    if (!email || !password) {
      setError('All fields are required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const onChange = e => {
    setError(''); // Clear error when user types
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    // Debug log to verify form data
    console.log('Submitting form data:', formData);
    console.log('API URL:', process.env.REACT_APP_API_URL);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/doctors/dlogin`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );

      // Debug log for successful response
      console.log('Login response:', res.data);
      
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('doctorEmail', email);
        navigate('/doctor-account');
      } else {
        setError('Invalid response from server');
        console.error('Invalid response structure:', res.data);
      }
    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status === 404) {
        setError('Doctor account not found');
      } else if (err.code === 'ECONNREFUSED') {
        setError('Unable to connect to the server. Please check if the server is running.');
      } else {
        setError(`Login failed: ${err.message || 'Unknown error occurred'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Add a debug section in the UI (remove in production)
  const debugSection = process.env.NODE_ENV === 'development' && (
    <div style={{ margin: '20px', padding: '10px', border: '1px solid #ccc' }}>
      <h4>Debug Info:</h4>
      <p>API URL: {process.env.REACT_APP_API_URL}</p>
      <p>Environment: {process.env.NODE_ENV}</p>
    </div>
  );

  return (
    <div className="doctor-login-container">
      <Helmet>
        <title>Doctor Portal Page</title>
      </Helmet>
      {debugSection} {/* Add debug section in development */}
      <h2>Doctor Portal</h2>
      <p className="doctor-login-quote">
        "The art of medicine consists of amusing the patient while nature cures the disease." - Voltaire
      </p>
      <form className="doctor-login-form" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={onChange}
          required
          aria-label="Email address"
          aria-required="true"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
          required
          aria-label="Password"
          aria-required="true"
        />
        <button 
          type="submit" 
          className="doctor-login-button"
          disabled={loading}
          aria-label="Sign in"
        >
          {loading ? 'Signing in...' : <FaSignInAlt />}
        </button>
      </form>
      {error && (
        <p className="doctor-login-error-message" role="alert" aria-live="polite">
          {error}
        </p>
      )}
      {loading && <ECGAnimation />}
      <p className="doctor-login-signup-prompt">
        Don't have an account? <a href="/doctor-signup" className="doctor-login-signup-link">Create one here</a>
      </p>
    </div>
  );
};

export default DoctorLogin;
