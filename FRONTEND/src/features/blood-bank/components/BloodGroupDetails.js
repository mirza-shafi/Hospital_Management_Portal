import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.min.css';
import '../../../components/styles/BloodGroupDetails.css';
import axios from 'axios';
import { Helmet } from 'react-helmet';

import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const BloodGroupDetails = () => {
  const navigate = useNavigate();
  const [donorDetails, setDonorDetails] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchDonorDetails = async () => {
      try {
        const response = await axios.get('/api/blooddonor/details');
        setDonorDetails(response.data);
      } catch (error) {
        setError('Failed to load donor details.');
      }
    };

    fetchDonorDetails();
  }, []);

  const totalPages = Math.ceil(donorDetails.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDonors = donorDetails.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="blood-group-details-page">
      <div className="blood-group-details-box-container">
        <Helmet>
          <title>Blood Group Details Page</title>
        </Helmet>
        <button className="blood-group-details-back-button" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <h1 className="blood-group-details-title">Blood Donor Details</h1>
        {error && <div className="notification is-danger blood-group-details-notification">{error}</div>}
        <div className="blood-group-details-table-container">
          <table className="table is-fullwidth blood-group-details-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Blood Group</th>
              </tr>
            </thead>
            <tbody>
              {currentDonors.map(donor => (
                <tr key={donor._id} className="blood-group-details-row">
                  <td>{donor.firstName} {donor.lastName}</td>
                  <td>{donor.phoneNumber}</td>
                  <td>{donor.gender}</td>
                  <td>{donor.email}</td>
                  <td>{donor.bloodGroup}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-container">
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BloodGroupDetails;
