import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import './styles/Login.css';

const DoctorLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const onChange = e => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/doctors/dlogin`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/doctor-account');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Helmet>
        <title>Doctor Login</title>
      </Helmet>

      <div className="login-container">
        <Link to="/" className="back-home">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>
        <div className="login-header">
          <i className="fas fa-user-md"></i>
          <h1>Doctor Login</h1>
          <p>Access your medical dashboard</p>
        </div>

        <form onSubmit={onSubmit} className="login-form">
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

          <div className="input-group">
            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Enter password"
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

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="login-btn doctor-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <a href="/doctor-signup">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
