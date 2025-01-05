import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import './About.css';

const About = () => {
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get('/about');
                
                if (response.data && response.data.success) {
                    setAboutData(response.data.data);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (err) {
                console.error('Error fetching about data:', err);
                setError('Failed to load about information. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    if (loading) return <LoadingSpinner message="Loading about information..." />;
    
    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    if (!aboutData) {
        return (
            <div className="no-data-container">
                <p>No information available</p>
            </div>
        );
    }

    return (
        <div className="about-container">
            <div className="about-header">
                <h1>{aboutData.title}</h1>
                <p className="description">{aboutData.description}</p>
            </div>

            <div className="about-section">
                <h2>Our Mission</h2>
                <p>{aboutData.mission}</p>
            </div>

            <div className="about-section">
                <h2>Our Vision</h2>
                <p>{aboutData.vision}</p>
            </div>

            <div className="about-section">
                <h2>Our Services & Achievements</h2>
                <ul className="achievements-list">
                    {aboutData.achievements?.map((achievement, index) => (
                        <li key={index} className="achievement-item">
                            {achievement}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default About; 