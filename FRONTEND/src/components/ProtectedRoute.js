import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ type }) => {
  const adminToken = localStorage.getItem('adminToken');
  const doctorToken = localStorage.getItem('doctorToken');
  const patientToken = localStorage.getItem('patientToken');

  if (type === 'admin' && !adminToken) {
    return <Navigate to="/admin-login" replace />;
  }

  if (type === 'doctor' && !doctorToken) {
    return <Navigate to="/doctor-login" replace />;
  }

  if (type === 'patient' && !patientToken) {
    return <Navigate to="/patient-login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
