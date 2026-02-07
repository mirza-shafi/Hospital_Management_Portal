import React, { useState } from 'react';
import api from '../../../core/api/config';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

import '../../../components/styles/AdminLogin.css';
import healingWaveImage from '../../../assets/healingwave.png'; 
import { storage } from '../../../utils/storage';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      console.log('Attempting login with username:', username);
      const res = await api.post('/admin/login', { username, password });
      console.log('Login successful:', res.data);
      storage.setItem('adminToken', res.data.token);
      setError('');
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Invalid username or password.');
    }
  };

  return (
    <div className="admin-login-body">
      <Helmet>
        <title>Admin Login Page</title>
      </Helmet>
      <div className="admin-login-main-container">
        <Link to="/" className="back-home-link">
          <FaArrowLeft className="nav-icon" /> Back to Home
        </Link>
        <div className="admin-login-image">
          <img src={healingWaveImage} alt="Healing Wave" />
        </div>
        <div className="admin-login-form-container">
          <h1 className="admin-login-title">Admin Access</h1>
          <p className="admin-login-subtitle">Secure access for hospital administrators</p>
          <div className="field">
            <div className="control">
              <input
                type="text"
                placeholder="Admin Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="admin-login-input"
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-login-input"
              />
            </div>
          </div>
          <button onClick={handleLogin} className="admin-login-button">
            <i className="fas fa-shield-alt" style={{ marginRight: '10px' }}></i>
            Login Securely
          </button>
          {error && <p className="admin-login-error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
