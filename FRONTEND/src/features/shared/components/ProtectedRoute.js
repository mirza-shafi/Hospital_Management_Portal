import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { storage } from '../../../utils/storage';

const ProtectedRoute = ({ type }) => {
  const adminToken = storage.getItem('adminToken');
  const doctorToken = storage.getItem('doctorToken');
  const patientToken = storage.getItem('patientToken');

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
