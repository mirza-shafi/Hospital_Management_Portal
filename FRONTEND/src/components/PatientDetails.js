import React, { useState } from 'react';
import axios from 'axios';
import './styles/PatientDetails.css';
import { Helmet } from 'react-helmet';

const PatientDetails = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/patients/pdetails/search?searchQuery=${searchQuery}`);
      setPatients(response.data);
      setNoResults(response.data.length === 0);
    } catch (error) {
      console.error('Error searching patients:', error);
      setNoResults(true);
    }
  };

  return (
    <div className="patient-details-container">
      <Helmet>
        <title>Patient Details Page</title>
      </Helmet>
      <h2 className="page-title">Patient Details & Medical Info</h2>
      <div className="search-bar">
       
        <input
          type="text"
          placeholder="Search by name or phone number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          className="search-input"
        />
      </div>

      {noResults ? (
        <div className="no-results">
          <p>No patients found.</p>
        </div>
      ) : (
        <div className="patient-list">
          {patients.map((patient) => (
            <div key={patient._id} className="patient-card">
              <h3 className="patient-name">{`${patient.firstName} ${patient.lastName}`}</h3>
              <div className="patient-info">
                <p><strong>Age:</strong> {patient.age}</p>
                <p><strong>Sex:</strong> {patient.sex}</p>
                <p><strong>Phone Number:</strong> {patient.mobileNumber}</p>
                <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
                <p><strong>Difficulty:</strong> {patient.difficulty}</p>
                <p><strong>Been Diagnosed:</strong> {patient.beendignosed}</p>
                <p><strong>Condition:</strong> {patient.condition}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
