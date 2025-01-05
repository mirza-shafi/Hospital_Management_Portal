import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Pharmacy.css';
import { FaSearch } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const ITEMS_PER_PAGE = 15;

const Pharmacy = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get('/api/medicines');
        setMedicines(response.data);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };

    fetchMedicines();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMedicines.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedMedicines = filteredMedicines.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="pharmacy-page">
      <Helmet>
        <title>Pharmacy Page</title>
      </Helmet>
      <div className="pharmacy-header">
        <h1>HealingWave Pharmacy</h1>
        <p>Find your medicines and more</p>
      </div>
      <div className="pharmacy-search-bar-container">
        <div className="pharmacy-search-bar">
          <FaSearch className="pharmacy-search-icon" />
          <input
            type="text"
            placeholder="Search for medicines..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="pharmacy-medicine-cards-container">
        {displayedMedicines.map((medicine) => (
          <div key={medicine._id} className="pharmacy-medicine-card">
            <div className="pharmacy-medicine-image">
              <img src={medicine.image} alt={medicine.name} />
            </div>
            <div className="pharmacy-medicine-details">
              <h4 className="pharmacy-medicine-name">
                {medicine.name} <span className="pharmacy-medicine-strength">{medicine.strength}</span>
              </h4>
              <p className="pharmacy-generic-name">{medicine.genericName}</p>
              <p className="pharmacy-dosage-form">{medicine.dosageForm}</p>
              <p className="pharmacy-manufacturer">{medicine.manufacturer}</p>
              <p className="pharmacy-medicine-price">৳ {medicine.price}</p>
              <p className="pharmacy-medicine-description">{medicine.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pharmacy-pagination-container">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`pharmacy-pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pharmacy;
