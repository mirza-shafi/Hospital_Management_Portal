import React, { useState, useEffect } from 'react';
import '../../../../components/styles/Navbar.css';
import logo from '../../../../assets/healingwave.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCapsules, faContactBook, faHome, faInfoCircle, faTint, faMoon, faSun, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../../../contexts/ThemeContext';
import { Link, NavLink, useLocation } from 'react-router-dom';

const NavbarComponent = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    const handleScroll = () => {
        setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
        clearInterval(timer);
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${theme}`}>
      <div className="navbar-container">
        
        {/* Logo Section */}
        <Link className="navbar-brand" to="/admin-login">
          <img src={logo} alt="HealingWave" className="brand-logo" />
          <span className="brand-text">HealingWave</span>
        </Link>

        {/* Desktop Menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
           <div className="nav-links">
              <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faHome} /> <span>Home</span>
              </NavLink>
              <NavLink to="/blood-bank" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faTint} /> <span>Blood Bank</span>
              </NavLink>
              <NavLink to="/pharmacy" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faCapsules} /> <span>Pharmacy</span>
              </NavLink>
              <NavLink to="/support" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faContactBook} /> <span>Support</span>
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faInfoCircle} /> <span>About</span>
              </NavLink>
           </div>

           <div className="nav-actions">
              <div className="time-badge">
                 {currentTime}
              </div>
              <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
                <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
              </button>
           </div>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
           <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>

      </div>
    </nav>
  );
};

export default NavbarComponent;
