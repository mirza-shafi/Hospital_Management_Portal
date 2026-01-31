import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import './styles/Login.css';

const PatientSignUp = () => {
  const navigate = useNavigate();
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { firstName, lastName, email, sex, dateOfBirth, mobileNumber, password, confirmPassword } = formData;

  const onChange = e => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !sex || !dateOfBirth || !mobileNumber || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/patients/pregister', formData);
      alert('Registration successful! Please login.');
      navigate('/patient-login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Helmet>
        <title>Patient Registration</title>
      </Helmet>

      <div className="login-container signup-container">
        <Link to="/" className="back-home">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>
        <div className="login-header">
          <i className="fas fa-user-injured"></i>
          <h1>Patient Registration</h1>
          <p>Join our healthcare community</p>
        </div>

        <form onSubmit={onSubmit} className="login-form">
          <div className="input-row">
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={onChange}
                placeholder="John"
                required
              />
            </div>

            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={onChange}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="patient@email.com"
              required
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Gender</label>
              <select name="sex" value={sex} onChange={onChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={dateOfBirth}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              value={mobileNumber}
              onChange={onChange}
              placeholder="+880 1XXX-XXXXXX"
              required
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Password</label>
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="Minimum 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="login-btn patient-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="login-footer">
          <p>Already have an account? <a href="/patient-login">Sign in</a></p>
        </div>
      </div>
    </div>
  );
};

export default PatientSignUp;
