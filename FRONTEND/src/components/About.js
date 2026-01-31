import React from 'react';
import 'bulma/css/bulma.min.css';
import './styles/About.css';
import { Helmet } from 'react-helmet';
import Footer from './Footer';

function About() {
    return (
        <div className="about-page">
            <Helmet>
                <title>About Us - HealingWave</title>
            </Helmet>

            {/* Hero Section */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1 className="about-hero-title">About HealingWave</h1>
                    <p className="about-hero-subtitle">
                        Committed to Excellence in Healthcare Since 1999
                    </p>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="mission-vision-section">
                <div className="mission-vision-container">
                    <div className="mission-card">
                        <div className="card-icon">
                            <i className="fas fa-bullseye"></i>
                        </div>
                        <h2>Our Mission</h2>
                        <p>
                            To provide world-class healthcare services with compassion, 
                            innovation, and excellence. We are dedicated to improving the 
                            health and well-being of our community through comprehensive 
                            medical care and patient-centered approach.
                        </p>
                    </div>
                    <div className="mission-card">
                        <div className="card-icon">
                            <i className="fas fa-eye"></i>
                        </div>
                        <h2>Our Vision</h2>
                        <p>
                            To be the leading healthcare provider in Bangladesh, recognized 
                            for our commitment to quality, innovation, and patient satisfaction. 
                            We envision a healthier future where everyone has access to 
                            exceptional medical care.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="values-section">
                <h2 className="section-title">Our Core Values</h2>
                <div className="values-grid">
                    <div className="value-card">
                        <div className="value-icon">
                            <i className="fas fa-heart"></i>
                        </div>
                        <h3>Compassion</h3>
                        <p>We treat every patient with empathy, respect, and dignity</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon">
                            <i className="fas fa-award"></i>
                        </div>
                        <h3>Excellence</h3>
                        <p>We strive for the highest standards in medical care</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon">
                            <i className="fas fa-users"></i>
                        </div>
                        <h3>Teamwork</h3>
                        <p>We collaborate to deliver comprehensive healthcare</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon">
                            <i className="fas fa-lightbulb"></i>
                        </div>
                        <h3>Innovation</h3>
                        <p>We embrace cutting-edge technology and treatments</p>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section">
                <h2 className="section-title">Our Services</h2>
                <div className="services-grid">
                    <div className="service-item">
                        <i className="fas fa-heartbeat"></i>
                        <span>24/7 Emergency Care</span>
                    </div>
                    <div className="service-item">
                        <i className="fas fa-user-md"></i>
                        <span>Specialist Consultations</span>
                    </div>
                    <div className="service-item">
                        <i className="fas fa-procedures"></i>
                        <span>Advanced Surgery</span>
                    </div>
                    <div className="service-item">
                        <i className="fas fa-x-ray"></i>
                        <span>Diagnostic Imaging</span>
                    </div>
                    <div className="service-item">
                        <i className="fas fa-vial"></i>
                        <span>Laboratory Services</span>
                    </div>
                    <div className="service-item">
                        <i className="fas fa-pills"></i>
                        <span>Pharmacy</span>
                    </div>
                    <div className="service-item">
                        <i className="fas fa-tint"></i>
                        <span>Blood Bank</span>
                    </div>
                    <div className="service-item">
                        <i className="fas fa-ambulance"></i>
                        <span>Ambulance Service</span>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <h2 className="section-title">Get In Touch</h2>
                <div className="contact-grid">
                    <div className="contact-card">
                        <div className="contact-icon">
                            <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <h3>Address</h3>
                        <p>123 Medical Center<br/>Dhaka, Bangladesh</p>
                    </div>
                    <div className="contact-card">
                        <div className="contact-icon">
                            <i className="fas fa-phone"></i>
                        </div>
                        <h3>Phone</h3>
                        <p>+880 1234-567890<br/>+880 9876-543210</p>
                    </div>
                    <div className="contact-card">
                        <div className="contact-icon">
                            <i className="fas fa-envelope"></i>
                        </div>
                        <h3>Email</h3>
                        <p>info@healingwave.com<br/>support@healingwave.com</p>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default About;
