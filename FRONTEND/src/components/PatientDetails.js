import React, { useState } from 'react';
import axios from 'axios';
import './styles/PatientDetails.css';
import { Helmet } from 'react-helmet';
import { FaSearch, FaUser, FaPhone, FaTint, FaDiagnoses, FaVenusMars, FaNotesMedical, FaCalendarAlt } from 'react-icons/fa';

const PatientDetails = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await axios.get(`/api/patients/pdetails/search?searchQuery=${searchQuery}`);
      setPatients(response.data);
      setNoResults(response.data.length === 0);
    } catch (error) {
      console.error('Error searching patients:', error);
      setNoResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="patient-details-container">
      <Helmet>
        <title>Patient Details Page</title>
      </Helmet>
      <h2 className="page-title">Patient Details & Medical Info</h2>
      
      <div className="pd-search-section">
        <div className="pd-search-bar">
          <FaSearch className="pd-search-icon" />
          <input
            type="text"
            placeholder="Search by name or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="pd-search-input"
          />
          <button onClick={handleSearch} className="pd-search-button" disabled={isSearching}>
            {isSearching ? '...' : 'Search'}
          </button>
        </div>
      </div>

      {noResults ? (
        <div className="no-results fade-in">
          <p>No patients found. Please try a different search term.</p>
        </div>
      ) : (
        <div className="patient-cards-grid">
          {patients.map((patient) => (
            <div key={patient._id} className="patient-card">
              <div className="card-header">
                <div className="avatar-circle">
                   <FaUser />
                </div>
                <h3 className="patient-name">{`${patient.firstName} ${patient.lastName}`}</h3>
              </div>
              
              <div className="card-body">
                <div className="info-section">
                  <h4 className="section-title">Personal Information</h4>
                  <div className="info-row">
                    <span className="info-label"><FaCalendarAlt /> Age</span>
                    <span className="info-value">{patient.age}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label"><FaVenusMars /> Sex</span>
                    <span className="info-value">{patient.sex}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label"><FaPhone /> Contact</span>
                    <span className="info-value">{patient.mobileNumber}</span>
                  </div>
                </div>

                <div className="info-section">
                  <h4 className="section-title">Medical Configuration</h4>
                  <div className="info-row">
                    <span className="info-label"><FaTint /> Blood Group</span>
                    <span className="info-value highlight-blue">{patient.bloodGroup}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label"><FaDiagnoses /> Difficulty</span>
                    <span className="info-value">{patient.difficulty}</span>
                  </div>
                  <div className="info-row status-full">
                    <span className="info-label"><FaNotesMedical /> Diagnosed</span>
                    <span className="info-value">{patient.beendignosed}</span>
                  </div>
                   <div className="info-row status-full">
                    <span className="info-label"><FaNotesMedical /> Condition</span>
                    <span className="info-value">{patient.condition}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
