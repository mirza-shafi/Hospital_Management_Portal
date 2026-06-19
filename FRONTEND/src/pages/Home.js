import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bulma/css/bulma.min.css';
import '../components/styles/Home.css';

import api from '../core/api/config';
import { storage } from '../utils/storage';
import { useAuthModal } from '../features/auth/AuthModalContext';
import Chatbot from '../features/shared/components/utils/Chatbot';
import NewsTicker from '../features/shared/components/utils/NewsTicker';
import { Helmet } from 'react-helmet';
import Footer from '../features/shared/components/layout/Footer';
import StatsCard from '../features/shared/components/charts/StatsCard';
import DoctorCard from '../features/shared/components/DoctorCard';
import { FaUserMd, FaSmile, FaCalendarCheck, FaTrophy } from 'react-icons/fa';
import hospital1 from '../assets/hospital1.png';
import hospital2 from '../assets/hospital2.png';
import hospital3 from '../assets/hospital3.png';
import hospital4 from '../assets/hospital4.png';

const Home = () => {
  const navigate = useNavigate();
  const { openAuth } = useAuthModal();
  const [showChatbox, setShowChatbox] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);

  const slides = [
    {
      image: hospital1,
      title: 'World-Class Healthcare, Close to You',
      subtitle: 'State-of-the-art medical center staffed by leading specialists'
    },
    {
      image: hospital2,
      title: 'Comfortable, Patient-First Spaces',
      subtitle: 'A calm, welcoming environment designed around your care'
    },
    {
      image: hospital3,
      title: 'Advanced Medical Consultation',
      subtitle: 'Personalized care backed by modern diagnostic technology'
    },
    {
      image: hospital4,
      title: '24/7 Emergency Services',
      subtitle: 'Always ready to provide critical care when you need it'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    api.get('/doctors/all')
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setFeaturedDoctors(list.slice(0, 4));
      })
      .catch((err) => console.error('Error loading featured doctors:', err));
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  const handleBook = (doctor) => {
    const target = `/patient/appointment?doctor=${doctor._id}`;
    if (storage.getItem('patientToken')) {
      navigate(target);
    } else {
      openAuth({ role: 'patient', mode: 'login', redirect: target });
    }
  };

  const toggleChatbox = () => setShowChatbox(!showChatbox);

  return (
    <div className="home-page">
      <Helmet>
        <title>HealingWave — Health Services</title>
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
                    <button className="hero-cta" onClick={() => navigate('/doctors')}>
                      Find a Doctor &amp; Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>
            <i className="fas fa-chevron-right"></i>
          </button>

          <div className="carousel-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="features-title">Our Services</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-heartbeat"></i></div>
            <h3>24/7 Emergency Care</h3>
            <p>Round-the-clock emergency services with expert medical staff</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-user-md"></i></div>
            <h3>Expert Doctors</h3>
            <p>Highly qualified specialists across all medical departments</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-procedures"></i></div>
            <h3>Modern Facilities</h3>
            <p>State-of-the-art equipment and comfortable patient rooms</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-ambulance"></i></div>
            <h3>Ambulance Service</h3>
            <p>Quick response ambulance service available 24/7</p>
          </div>
        </div>
      </div>

      {/* Featured Doctors */}
      {featuredDoctors.length > 0 && (
        <section className="featured-doctors">
          <div className="featured-doctors__head">
            <h2>Meet Our Specialists</h2>
            <p>Experienced, board-certified doctors dedicated to your care</p>
          </div>
          <div className="featured-doctors__grid">
            {featuredDoctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} onBook={handleBook} />
            ))}
          </div>
          <div className="featured-doctors__cta">
            <button className="btn-outline-dark" onClick={() => navigate('/doctors')}>
              View All Doctors
            </button>
          </div>
        </section>
      )}

      {/* Statistics Section */}
      <div className="stats-section">
        <div className="stats-container">
          <StatsCard title="Expert Doctors" value="500+" icon={<FaUserMd size={24} />} type="default" />
          <StatsCard title="Happy Patients" value="50,000+" icon={<FaSmile size={24} />} type="default" />
          <StatsCard title="Years Experience" value="25+" icon={<FaCalendarCheck size={24} />} type="default" />
          <StatsCard title="Medical Awards" value="100+" icon={<FaTrophy size={24} />} type="default" />
        </div>
      </div>

      <Footer />

      <div className="chatbot-icon" onClick={toggleChatbox}>
        <i className="fas fa-robot"></i>
      </div>

      {showChatbox && <Chatbot onClose={toggleChatbox} />}
    </div>
  );
};

export default Home;
