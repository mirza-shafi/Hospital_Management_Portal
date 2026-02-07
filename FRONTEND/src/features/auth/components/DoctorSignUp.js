import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../../components/styles/Login.css';

const DoctorSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    specialty: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { firstName, lastName, email, mobileNumber, specialty, password, confirmPassword } = formData;

  const onChange = e => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !mobileNumber || !specialty || !password || !confirmPassword) {
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
      const res = await axios.post(
        '/api/doctors/dregister',
        { firstName, lastName, email, mobileNumber, specialty, password }
      );
      
      if (res.data) {
        Swal.fire({
          title: 'Success!',
          text: 'Registration successful! Please login.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#00d1b2' // Bulma primary color
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/doctor-login');
          }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Helmet>
        <title>Doctor Registration</title>
      </Helmet>

      <div className="login-container signup-container">
        <Link to="/" className="back-home">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>
        <div className="login-header">
          <i className="fas fa-user-md"></i>
          <h1>Doctor Registration</h1>
          <p>Join our healthcare network</p>
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
              placeholder="doctor@hospital.com"
              required
            />
          </div>

          <div className="input-row">
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

            <div className="input-group">
              <label>Specialty</label>
              <input
                type="text"
                name="specialty"
                value={specialty}
                onChange={onChange}
                placeholder="Cardiology"
                required
              />
            </div>
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

          <button type="submit" className="login-btn doctor-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="login-footer">
          <p>Already have an account? <a href="/doctor-login">Sign in</a></p>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignUp;
