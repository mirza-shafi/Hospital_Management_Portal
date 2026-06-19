import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import api from '../core/api/config';
import { storage } from '../utils/storage';
import { useAuthModal } from '../features/auth/AuthModalContext';
import DoctorCard from '../features/shared/components/DoctorCard';
import Footer from '../features/shared/components/layout/Footer';
import '../components/styles/Doctors.css';

const Doctors = () => {
  const navigate = useNavigate();
  const { openAuth } = useAuthModal();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDept, setActiveDept] = useState('All');

  useEffect(() => {
    let active = true;
    api.get('/doctors/all')
      .then((res) => { if (active) setDoctors(Array.isArray(res.data) ? res.data : []); })
      .catch((err) => console.error('Error loading doctors:', err))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const departments = useMemo(() => {
    const set = new Set(doctors.map((d) => d.department).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [doctors]);

  const visible = activeDept === 'All'
    ? doctors
    : doctors.filter((d) => d.department === activeDept);

  const handleBook = (doctor) => {
    const target = `/patient/appointment?doctor=${doctor._id}`;
    const patientToken = storage.getItem('patientToken');
    if (patientToken) {
      navigate(target);
    } else {
      openAuth({ role: 'patient', mode: 'login', redirect: target });
    }
  };

  return (
    <div className="doctors-page">
      <Helmet>
        <title>Our Doctors - HealingWave</title>
      </Helmet>

      <section className="doctors-hero">
        <h1>Find a Doctor</h1>
        <p>
          Meet our team of experienced, board-certified specialists. Choose a doctor
          and book your appointment in just a few clicks.
        </p>
      </section>

      {!loading && departments.length > 1 && (
        <div className="doctors-toolbar">
          {departments.map((dept) => (
            <button
              key={dept}
              className={`dept-chip ${activeDept === dept ? 'active' : ''}`}
              onClick={() => setActiveDept(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="doctors-loading">Loading doctors…</div>
      ) : visible.length === 0 ? (
        <div className="doctors-empty">No doctors found.</div>
      ) : (
        <div className="doctors-grid">
          {visible.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} onBook={handleBook} />
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Doctors;
