import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavbarComponent from './Navbar';

const MainLayout = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/doctor-account';

  return (
    <>
      {!hideNavbar && <NavbarComponent />}
      <Outlet />
    </>
  );
};

export default MainLayout;
