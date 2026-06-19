import React, { useState, useEffect } from 'react';
import '../../../../components/styles/Navbar.css';
import logo from '../../../../assets/healingwave.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCapsules, faContactBook, faHome, faInfoCircle, faTint, faBars, faTimes, faUserMd, faUserInjured, faUserNurse } from '@fortawesome/free-solid-svg-icons';
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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className="site-header">
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
              <NavLink to="/doctors" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faUserMd} /> <span>Doctors</span>
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
              <button className="nav-link-btn" onClick={() => navigate('/doctor-login')}>
                <FontAwesomeIcon icon={faUserNurse} /> <span>Doctor</span>
              </button>
              <button className="nav-link-btn" onClick={() => navigate('/patient-login')}>
                <FontAwesomeIcon icon={faUserInjured} /> <span>Patient</span>
              </button>
              <button className="nav-cta" onClick={() => navigate('/doctors')}>
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
