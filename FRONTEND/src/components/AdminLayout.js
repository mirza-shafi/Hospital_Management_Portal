import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="admin-layout-wrapper">
      <Outlet />
    </div>
  );
};

export default AdminLayout;
