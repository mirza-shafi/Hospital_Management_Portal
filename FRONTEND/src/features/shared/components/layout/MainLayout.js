import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavbarComponent from './Navbar';

const MainLayout = () => {
  const location = useLocation();
  // Hide navbar for doctor-account AND all patient pages
  const hideNavbar = location.pathname === '/doctor-account' || location.pathname.startsWith('/patient');

  return (
    <>
      {!hideNavbar && <NavbarComponent />}
      <Outlet />
    </>
  );
};

export default MainLayout;
