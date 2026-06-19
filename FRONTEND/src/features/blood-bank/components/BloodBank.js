import React, { useEffect, useState } from 'react';
import '../../../components/styles/BloodBank.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import blooddonorImage from '../../../assets/blooddonor.png';
import bloodrecipientImage from '../../../assets/bloodrecipient.png';
import bloodavailImage from '../../../assets/bloodavail.png';
import bloodgroupImage from '../../../assets/bloodgroup.png';
import { Helmet } from 'react-helmet';

const GROUP_ORDER = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const BloodBank = () => {
  const navigate = useNavigate();
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    axios.get('/api/bloodAvailability')
      .then((res) => { if (active) setAvailability(Array.isArray(res.data) ? res.data : []); })
      .catch((err) => console.error('Error loading blood availability:', err))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const bookBlood = (group) => navigate(`/blood-recipient?group=${encodeURIComponent(group)}`);

  const sorted = [...availability].sort(
    (a, b) => GROUP_ORDER.indexOf(a.bloodGroup) - GROUP_ORDER.indexOf(b.bloodGroup)
  );

  const totalUnits = availability.reduce((sum, g) => sum + (g.count || 0), 0);

  return (
    <div className="bloodbank-page">
      <Helmet>
        <title>Blood Bank - HealingWave</title>
      </Helmet>

      <div className="bloodbank-container">
        <Link to="/" className="back-home">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>

        <h1 className="bloodbank-page-title">Blood Bank Portal</h1>
        <p className="bloodbank-page-subtitle">
          Bridging the gap between donors and recipients. Every drop counts in saving a life.
        </p>

        {/* Live blood availability — shown first */}
        <div className="blood-stock">
          <div className="blood-stock-head">
            <h2>Current Blood Availability</h2>
            <span className="blood-stock-total">{totalUnits} units in stock</span>
          </div>

          {loading ? (
            <div className="blood-stock-loading">Loading availability…</div>
          ) : sorted.length === 0 ? (
            <div className="blood-stock-loading">No availability data yet.</div>
          ) : (
            <div className="blood-stock-grid">
              {sorted.map((g) => {
                const low = (g.count || 0) <= 10;
                return (
                  <div key={g.bloodGroup} className={`blood-stat-card ${low ? 'low' : ''}`}>
                    <div className="blood-stat-group">{g.bloodGroup}</div>
                    <div className="blood-stat-count">{g.count}</div>
                    <div className="blood-stat-label">{low ? 'Low stock' : 'units available'}</div>
                    <button
                      className="blood-stat-book"
                      disabled={(g.count || 0) === 0}
                      onClick={() => bookBlood(g.bloodGroup)}
                    >
                      {(g.count || 0) === 0 ? 'Unavailable' : 'Book'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="blood-stock-actions">
            <Link to="/blood-availability" className="blood-stock-link">View detailed availability</Link>
          </div>
        </div>

        <h2 className="bloodbank-section-title">Blood Bank Services</h2>
        <div className="bloodbank-grid">
          <Link to="/blood-donor" className="bloodbank-card-link">
            <div className="bloodbank-card">
              <div className="bloodbank-card-image">
                <img src={blooddonorImage} alt="Blood Donor" />
              </div>
              <div className="bloodbank-card-content">
                <p className="card-title">Donate Blood</p>
                <p className="card-subtitle">Register yourself as a hero and save lives.</p>
              </div>
            </div>
          </Link>

          <Link to="/blood-recipient" className="bloodbank-card-link">
            <div className="bloodbank-card">
              <div className="bloodbank-card-image">
                <img src={bloodrecipientImage} alt="Blood Recipient" />
              </div>
              <div className="bloodbank-card-content">
                <p className="card-title">Book / Buy Blood</p>
                <p className="card-subtitle">Book or buy blood units for patients in need.</p>
              </div>
            </div>
          </Link>

          <Link to="/blood-availability" className="bloodbank-card-link">
            <div className="bloodbank-card">
              <div className="bloodbank-card-image">
                <img src={bloodavailImage} alt="Blood Availability" />
              </div>
              <div className="bloodbank-card-content">
                <p className="card-title">Availability</p>
                <p className="card-subtitle">Real-time check of available blood units.</p>
              </div>
            </div>
          </Link>

          <Link to="/blood-group" className="bloodbank-card-link">
            <div className="bloodbank-card">
              <div className="bloodbank-card-image">
                <img src={bloodgroupImage} alt="Blood Group Information" />
              </div>
              <div className="bloodbank-card-content">
                <p className="card-title">Compatibility</p>
                <p className="card-subtitle">Understand blood group compatibility.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BloodBank;
