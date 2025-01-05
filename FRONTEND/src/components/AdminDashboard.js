import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa'; 
import './styles/AdminDashboard.css';
import { Helmet } from 'react-helmet';


const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  return (
    <div className="admin-dashboard-body">
      <Helmet>
        <title>Admin Dashboard Page</title>
      </Helmet>
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-header">
          <h1 className="admin-dashboard-title">Admin Dashboard</h1>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
        <div className="admin-dashboard-links">
          <div className="card-box" onClick={() => navigate('/items')}>
            <h3>Manage Test and Services</h3>
            <p className="card-subtext">View and manage available tests and services.</p>
          </div>
          <div className="card-box" onClick={() => navigate('/add-medicine')}>
            <h3>Manage Medicine</h3>
            <p className="card-subtext">Add and update medicine records.</p>
          </div>
          <div className="card-box" onClick={() => navigate('/medicine-details')}>
            <h3>Medicine Details</h3>
            <p className="card-subtext">View detailed information on all medicines.</p>
          </div>
          <div className="card-box" onClick={() => navigate('/admin-manage-users')}>
            <h3>Manage Users</h3>
            <p className="card-subtext">Manage user accounts and permissions.</p>
          </div>
          <div className="card-box" onClick={() => navigate('/admin-support')}>
            <h3>Admin Support</h3>
            <p className="card-subtext">administrators to manage and resolve system issues efficiently.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
