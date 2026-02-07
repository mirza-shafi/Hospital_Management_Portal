import React from 'react';
import '../../../../components/styles/Home.css'; // Reusing the established footer styles

const Footer = () => {
  return (
    <footer className="modern-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">HealingWave</h3>
          <p className="footer-description">
            Providing world-class healthcare services with compassion and excellence. 
            Your health is our priority.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/about">About Us</a></li>
            <li><a href="/blood-bank">Blood Bank</a></li>
            <li><a href="/pharmacy">Pharmacy</a></li>
            <li><a href="/support">Support</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Services</h4>
          <ul className="footer-links">
            <li><a href="#">Emergency Care</a></li>
            <li><a href="#">Surgery</a></li>
            <li><a href="#">Laboratory</a></li>
            <li><a href="#">Radiology</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Contact Info</h4>
          <ul className="footer-contact">
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <span>123 Medical Center, Dhaka, Bangladesh</span>
            </li>
            <li>
              <i className="fas fa-phone"></i>
              <span>+880 1234-567890</span>
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              <span>info@healingwave.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 HealingWave Health Service. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
