import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import './styles/AdminLogin.css';
import healingWaveImage from '../assets/healingwave.png'; 

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('/api/admin/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      setError('');
      navigate('/admin-dashboard');
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="admin-login-body">
      <Helmet>
        <title>Admin Login Page</title>
      </Helmet>
      <div className="admin-login-main-container">
        <div className="admin-login-image">
          <img src={healingWaveImage} alt="Healing Wave" />
        </div>
        <div className="admin-login-form-container">
          <h1 className="admin-login-title">Admin Login</h1>
          <p className="admin-login-subtitle">Please enter your credentials to access the admin dashboard.</p>
          <div className="field">
            <div className="control">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input admin-login-input"
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input admin-login-input"
              />
            </div>
          </div>
          <button onClick={handleLogin} className="button admin-login-button">Login</button>
          {error && <p className="admin-login-error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
