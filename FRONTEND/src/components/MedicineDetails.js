import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSyncAlt } from 'react-icons/fa';
import './styles/MedicineDetails.css';
import { Helmet } from 'react-helmet';

const MedicineDetails = () => {
  const [medicines, setMedicines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12; 

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get('/api/medicines');
        if (response.data && Array.isArray(response.data)) {
          setMedicines(response.data);
        } else {
          setError('Unexpected data format.');
        }
      } catch (err) {
        setError('Failed to fetch medicines. Please check the console for details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const handleStripChange = async (id, newStripValue) => {
    try {
      await axios.put(`/api/medicines/${id}`, { strip: newStripValue });
      setMedicines(medicines.map(medicine => 
        medicine._id === id ? { ...medicine, strip: newStripValue } : medicine
      ));
    } catch (err) {
      console.error('Failed to update medicine strip count', err);
    }
  };

  const totalPages = Math.ceil(medicines.length / itemsPerPage);
  const currentPageMedicines = medicines.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="medicine-details-wrapper">
       <Helmet>
        <title> Medicine Details Page</title>
      </Helmet>
      <h1 className="medicine-details-title">Medicine Details</h1>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-danger text-center">{error}</p>}
      <div className="columns is-multiline">
        {currentPageMedicines.length > 0 ? (
          currentPageMedicines.map((medicine) => (
            <div key={medicine._id} className="column is-one-quarter">
              <div className="medicine-card">
                <figure className="image is-4by3">
                  <img src={medicine.image || 'default-image.png'} alt={medicine.name} className="medicine-card-img"/>
                </figure>
                <div className="card-body">
                  <h5 className="medicine-card-title">{medicine.name}</h5>
                  <p className="medicine-card-text"><strong>Generic Name:</strong> {medicine.genericName || 'N/A'}</p>
                  <p className="medicine-card-text"><strong>Dosage Form:</strong> {medicine.dosageForm || 'N/A'}</p>
                  <p className="medicine-card-text"><strong>Strength:</strong> {medicine.strength || 'N/A'}</p>
                  <p className="medicine-card-text"><strong>Price (BDT):</strong> {medicine.price || 'N/A'}</p>
                  <p className="medicine-card-text"><strong>Strip:</strong> {medicine.strip || 'N/A'}</p>
                  <p className="medicine-card-text"><strong>Manufacturer:</strong> {medicine.manufacturer || 'N/A'}</p>
                  {medicine.description && <p className="medicine-card-text"><strong>Description:</strong> {medicine.description}</p>}
                </div>
                <div className="update-strip-container">
                  <input 
                    type="number" 
                    className="strip-input" 
                    value={medicine.strip} 
                    onChange={(e) => handleStripChange(medicine._id, e.target.value)}
                  />
                  <FaSyncAlt 
                    className="update-strip-icon"
                    onClick={() => handleStripChange(medicine._id, medicine.strip)}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-center">No medicines available.</p>
        )}
      </div>
      <div className="pagination-container">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`pagination-button ${currentPage === index + 1 ? 'is-primary' : 'is-outlined'}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MedicineDetails;
