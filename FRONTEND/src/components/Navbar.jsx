import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
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

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src={logo} alt="HealingWave Logo" className="logo-image" />
                    <span className="logo-text">HealingWave</span>
                </Link>

                <div className="nav-links">
                    <NavLink to="/" className={({ isActive }) => 
                        `nav-link ${isActive ? 'active' : ''}`
                    }>
                        <i className="fas fa-home"></i>
                        Home
                    </NavLink>

                    <div className="dropdown">
                        <NavLink to="/blood-bank" className={({ isActive }) => 
                            `nav-link ${isActive ? 'active' : ''}`
                        }>
                            <i className="fas fa-tint"></i>
                            Blood Bank
                        </NavLink>
                        <div className="dropdown-content">
                            <Link to="/blood-donor" className="dropdown-item">
                                <i className="fas fa-user-plus"></i>
                                Donor Registration
                            </Link>
                            <Link to="/blood-request" className="dropdown-item">
                                <i className="fas fa-hand-holding-medical"></i>
                                Request Blood
                            </Link>
                        </div>
                    </div>

                    <NavLink to="/pharmacy" className={({ isActive }) => 
                        `nav-link ${isActive ? 'active' : ''}`
                    }>
                        <i className="fas fa-pills"></i>
                        Pharmacy
                    </NavLink>

                    <NavLink to="/support" className={({ isActive }) => 
                        `nav-link ${isActive ? 'active' : ''}`
                    }>
                        <i className="fas fa-headset"></i>
                        Support
                    </NavLink>

                    <NavLink to="/about" className={({ isActive }) => 
                        `nav-link ${isActive ? 'active' : ''}`
                    }>
                        <i className="fas fa-info-circle"></i>
                        About
                    </NavLink>

                    <div className="time-display">
                        <i className="far fa-clock"></i>
                        {currentTime.toLocaleTimeString()}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 