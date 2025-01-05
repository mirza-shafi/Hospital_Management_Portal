import React, { useState } from 'react';
import axios from 'axios';
import { prescriptionPDF } from './PDFGenerator';
import './styles/ViewPrescription.css';
import { FaTimes } from 'react-icons/fa';
import { Helmet } from 'react-helmet';


const ViewPrescription = () => {
  const patientEmail = localStorage.getItem('patientEmail');
  const [searchTerm, setSearchTerm] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        const response = await axios.get(`/api/prescriptions/psearch?query=${searchTerm}`, {
          headers: { 'Patient-Email': patientEmail }
        });
        setPrescriptions(response.data);
      } catch (err) {
        console.error('Error fetching prescriptions:', err);
        setError('Error fetching prescriptions');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownload = (prescription) => {
    prescriptionPDF(prescription);
  };

  const handleRemove = (id) => {
    setPrescriptions(prescriptions.filter(prescription => prescription._id !== id));
  };

  return (
    <div className="view-prescription-container">
      <Helmet>
        <title>View Prescription Page</title>
      </Helmet>
      <h1 className="page-title">See Patient Prescriptions</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search prescriptions"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
          className="search-input"
        />
      </div>

      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="prescription-list">
        {prescriptions.length === 0 ? (
          <p className="no-prescriptions">No prescriptions found</p>
        ) : (
          prescriptions.map((prescription) => (
            <div className="prescription-card" key={prescription._id}>
              <FaTimes className="close-button" onClick={() => handleRemove(prescription._id)} />
              <div className="card-content">
                <div className="card-detail">
                  <strong>Doctor:</strong> <span className="card-detail-value">{prescription.doctorName}</span>
                </div>
                <div className="card-detail">
                  <strong>Date:</strong> <span className="card-detail-value">{new Date(prescription.date).toLocaleDateString()}</span>
                </div>
                <div className="card-detail">
                  <strong>Patient:</strong> <span className="card-detail-value">{prescription.patientName}</span>
                </div>
                <div className="card-detail">
                  <strong>Prescription:</strong>
                  <div className="prescription-text">{prescription.prescriptionText}</div>
                </div>
              </div>
              <button onClick={() => handleDownload(prescription)} className="download-button">
                Download
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewPrescription;
