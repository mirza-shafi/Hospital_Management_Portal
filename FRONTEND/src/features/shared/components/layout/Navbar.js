import React, { useState, useEffect } from 'react';
import '../../../../components/styles/Navbar.css';
import logo from '../../../../assets/healingwave.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCapsules, faContactBook, faHome, faInfoCircle, faTint, faBars, faTimes, faPhone, faUserMd, faUserInjured } from '@fortawesome/free-solid-svg-icons';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

const NavbarComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className="site-header">
      {/* Top utility bar */}
      <div className="topbar">
        <div className="topbar-inner">
          <a className="topbar-emergency" href="tel:+8801234567890">
            <FontAwesomeIcon icon={faPhone} />
            <span>Emergency: <strong>+880 1234-567890</strong></span>
          </a>
          <div className="topbar-actions">
            <button className="topbar-link" onClick={() => navigate('/doctor-login')}>
              <FontAwesomeIcon icon={faUserMd} /> Doctor Login
            </button>
            <button className="topbar-link" onClick={() => navigate('/patient-login')}>
              <FontAwesomeIcon icon={faUserInjured} /> Patient Login
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="HealingWave" className="brand-logo" />
            <span className="brand-text">
              HealingWave
              <small className="brand-tagline">Health Services</small>
            </span>
          </Link>

          <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            <div className="nav-links">
              <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
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
              <button className="nav-cta" onClick={() => navigate('/patient/appointment')}>
                Book Appointment
              </button>
            </div>
          </div>

          <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default NavbarComponent;
