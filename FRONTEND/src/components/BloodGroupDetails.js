import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.min.css';
import './styles/BloodGroupDetails.css';
import axios from 'axios';
import { Helmet } from 'react-helmet';

const BloodGroupDetails = () => {
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
            className="button is-light pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="button is-light pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default BloodGroupDetails;
