import React, { useState, useEffect } from 'react';
import './styles/Navbar.css';
import logo from '../assets/healingwave.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCapsules, faContactBook, faHome, faInfoCircle, faTint, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation, Link } from 'react-router-dom';

const NavbarComponent = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const { theme, toggleTheme } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsActive(false);
  }, [location]);

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className="navbar custom-navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/admin-login">
          <img src={logo} alt="HealingWave Logo" className="navbar-logo" />
          <span className="navbar-title">HealingWave</span>
        </Link>

        <a 
          role="button" 
          className={`navbar-burger ${isActive ? 'is-active' : ''}`}
          aria-label="menu" 
          aria-expanded={isActive ? 'true' : 'false'}
          data-target="navbarBasicExample"
          onClick={toggleMenu}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
        <div className="navbar-end">
          <Link className="navbar-item" to="/">
            <FontAwesomeIcon icon={faHome} className="navbar-icon" /> Home
          </Link>
          <Link className="navbar-item" to="/blood-bank">
            <FontAwesomeIcon icon={faTint} className="navbar-icon" /> Blood Bank
          </Link>
          <Link className="navbar-item" to="/pharmacy">
            <FontAwesomeIcon icon={faCapsules} className="navbar-icon" /> Pharmacy
          </Link>
          <Link className="navbar-item" to="/support">
            <FontAwesomeIcon icon={faContactBook} className="navbar-icon" /> Support
          </Link>
          <Link className="navbar-item" to="/about">
            <FontAwesomeIcon icon={faInfoCircle} className="navbar-icon" /> About
          </Link>
          
          <button 
            className="navbar-item theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <FontAwesomeIcon 
              icon={theme === 'dark' ? faSun : faMoon} 
              className="navbar-icon" 
            />
          </button>
          
          <span className="navbar-item navbar-time">{currentTime}</span>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
