import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.min.css';
import './styles/About.css';
import hospitalImage from '../assets/thankyou.png';
import { Helmet } from 'react-helmet';

function About() {
    const [aboutData, setAboutData] = useState(null);

    useEffect(() => {
        fetch('/api/about')
            .then((response) => response.json())
            .then((data) => setAboutData(data))
            .catch((error) => console.error('Error fetching about data:', error));
    }, []);

    if (!aboutData) {
        return <div>Loading...</div>;
    }

    return (
        <section className="section about-section">
            <div className="container about-container">
                <Helmet>
                   <title>About Page</title>
                </Helmet>
                <div className="columns is-centered">
                    <div className="column is-10">
                        <div className="box has-background-light about-box">
                            <div className="columns is-vcentered">
                                <div className="column is-half has-text-centered">
                                    <h1 className="title" style={{ color: '#0c8cac' }}>{aboutData.title}</h1>
                                    <img src={hospitalImage} alt="Hospital" className="hospital-image" />
                                    <p className="mission-text">"{aboutData.mission}"</p>
                                </div>
                                <div className="column is-half">
                                    <div className="content">
                                        <div className="about-card">
                                            <h2 className="subtitle is-5">Our Mission</h2>
                                            <p><i className="fas fa-heartbeat"></i> {aboutData.mission}</p>
                                        </div>
                                        <div className="about-card">
                                            <h2 className="subtitle is-5">Core Values</h2>
                                            <ul>
                                                {aboutData.coreValues.map((value, index) => (
                                                    <li key={index}><i className="fas fa-check-circle"></i> {value}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="about-card">
                                            <h2 className="subtitle is-5">Our Services</h2>
                                            <ul>
                                                {aboutData.services.map((service, index) => (
                                                    <li key={index}><i className="fas fa-check-circle"></i> {service}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="about-card">
                                            <h2 className="subtitle is-5">Contact Information</h2>
                                            <p><i className="fas fa-envelope"></i> Email:
                                                <ul>
                                                    {aboutData.contactInfo.emails.map((email, index) => (
                                                        <li key={index}><a href={`mailto:${email}`}>{email}</a></li>
                                                    ))}
                                                </ul>
                                            </p>
                                            <p><i className="fas fa-phone"></i> Phone:
                                                <ul>
                                                    {aboutData.contactInfo.phones.map((phone, index) => (
                                                        <li key={index}>{phone}</li>
                                                    ))}
                                                </ul>
                                            </p>
                                            <p><i className="fas fa-map-marker-alt"></i> Address: {aboutData.contactInfo.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="about-footer">
                                <p>&copy; 2024 HealingWave Health Service. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;
