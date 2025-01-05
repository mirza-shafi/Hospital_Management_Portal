import React, { useState, useEffect } from 'react';
import './styles/Navbar.css';
import logo from '../assets/healingwave.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCapsules, faContactBook, faHome, faInfoCircle, faTint } from '@fortawesome/free-solid-svg-icons';

const NavbarComponent = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="navbar custom-navbar">
      <div className="navbar-brand">
        <a className="navbar-item" href="/admin-login">
          <img src={logo} alt="HealingWave Logo" className="navbar-logo" />
          <span className="navbar-title">HealingWave</span>
        </a>
      </div>
      <div className="navbar-menu">
        <div className="navbar-end">
          <a className="navbar-item" href="/">
            <FontAwesomeIcon icon={faHome} className="navbar-icon" /> Home
          </a>
          <a className="navbar-item" href="/blood-bank">
            <FontAwesomeIcon icon={faTint} className="navbar-icon" /> Blood Bank
          </a>
          <a className="navbar-item" href="/pharmacy">
            <FontAwesomeIcon icon={faCapsules} className="navbar-icon" /> Pharmacy
          </a>
          <a className="navbar-item" href="/support">
            <FontAwesomeIcon icon={faContactBook} className="navbar-icon" /> Support
          </a>
          <a className="navbar-item" href="/about">
            <FontAwesomeIcon icon={faInfoCircle} className="navbar-icon" /> About
          </a>
          
          
          <span className="navbar-item navbar-time">{currentTime}</span>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
