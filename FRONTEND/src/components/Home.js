import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bulma/css/bulma.min.css';
import './styles/Home.css';
import dnpImg from '../assets/dnp.jpg';
import Chatbot from './Chatbot';
import NewsTicker from './NewsTicker';
import { Helmet } from 'react-helmet';
import Footer from './Footer';

const Home = () => {
  const navigate = useNavigate();
  const [showChatbox, setShowChatbox] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: require('../assets/hospital1.png'),
      title: 'World-Class Healthcare Facility',
      subtitle: 'State-of-the-art medical center with expert professionals'
    },
    {
      image: require('../assets/hospital2.png'),
      title: 'Modern Reception & Waiting Area',
      subtitle: 'Comfortable and welcoming environment for all patients'
    },
    {
      image: require('../assets/hospital3.png'),
      title: 'Advanced Medical Consultation',
      subtitle: 'Personalized care with cutting-edge technology'
    },
    {
      image: require('../assets/hospital4.png'),
      title: '24/7 Emergency Services',
      subtitle: 'Always ready to provide critical care when you need it'
    }
  ];

  // Auto-slide effect
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleDoctorLogin = () => navigate('/doctor-login');
  const handlePatientLogin = () => navigate('/patient-login');

  const toggleChatbox = () => setShowChatbox(!showChatbox);

  return (
    <div className="home-page">
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <NewsTicker />

      {/* Hero Section with Carousel */}
      <div className="hero-section">
        <div className="carousel-container">
          <div className="carousel-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((slide, index) => (
              <div key={index} className="carousel-slide">
                <img src={slide.image} alt={slide.title} className="carousel-image" />
                <div className="carousel-overlay">
                  <div className="carousel-content">
                    <h1 className="carousel-title">{slide.title}</h1>
                    <p className="carousel-subtitle">{slide.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>
            <i className="fas fa-chevron-right"></i>
          </button>

          {/* Dots Indicator */}
          <div className="carousel-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>

          {/* Login Buttons Overlay */}
          <div className="carousel-login-overlay">
            <button
              className="login-button doctor-button"
              onClick={handleDoctorLogin}
            >
              <span className="icon is-small">
                <i className="fas fa-user-md"></i>
              </span>
              <span>Doctor Login</span>
            </button>
            <button
              className="login-button patient-button"
              onClick={handlePatientLogin}
            >
              <span className="icon is-small">
                <i className="fas fa-user-injured"></i>
              </span>
              <span>Patient Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="features-title">Our Services</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-heartbeat"></i>
            </div>
            <h3>24/7 Emergency Care</h3>
            <p>Round-the-clock emergency services with expert medical staff</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-user-md"></i>
            </div>
            <h3>Expert Doctors</h3>
            <p>Highly qualified specialists across all medical departments</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-procedures"></i>
            </div>
            <h3>Modern Facilities</h3>
            <p>State-of-the-art equipment and comfortable patient rooms</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-ambulance"></i>
            </div>
            <h3>Ambulance Service</h3>
            <p>Quick response ambulance service available 24/7</p>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">Expert Doctors</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">50,000+</div>
            <div className="stat-label">Happy Patients</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">25+</div>
            <div className="stat-label">Years Experience</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">100+</div>
            <div className="stat-label">Medical Awards</div>
          </div>
        </div>
      </div>

      <Footer />



      <div className="chatbot-icon" onClick={toggleChatbox}>
        <i className="fas fa-robot"></i>
      </div>

      {showChatbox && (
        <Chatbot onClose={toggleChatbox} />
      )}
    </div>
  );
};

export default Home;
