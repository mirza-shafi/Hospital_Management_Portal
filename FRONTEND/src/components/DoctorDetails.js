import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/DoctorDetails.css';
import { FaSearch } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const DoctorDetails = () => {
  const [doctorsByDepartment, setDoctorsByDepartment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 6; 

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('/api/doctors/all');
        const groupedDoctors = groupDoctorsByDepartment(response.data);
        setDoctorsByDepartment(groupedDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const groupDoctorsByDepartment = (doctors) => {
    return doctors.reduce((acc, doctor) => {
      const department = doctor.department || 'Other';
      acc[department] = acc[department] || [];
      acc[department].push(doctor);
      return acc;
    }, {});
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDoctors = Object.entries(doctorsByDepartment).reduce(
    (acc, [department, doctors]) => {
      const filteredDeptDoctors = doctors.filter((doctor) => {
        const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
        const departmentName = department.toLowerCase();
        return (
          fullName.includes(searchTerm.toLowerCase()) ||
          departmentName.includes(searchTerm.toLowerCase())
        );
      });

      if (filteredDeptDoctors.length > 0) {
        acc[department] = filteredDeptDoctors;
      }

      return acc;
    },
    {}
  );

 
  const totalPages = Math.ceil(Object.keys(filteredDoctors).length / doctorsPerPage);

  const paginatedDepartments = Object.entries(filteredDoctors).slice(
    (currentPage - 1) * doctorsPerPage,
    currentPage * doctorsPerPage
  );

  return (
    <div className="doctor-details-container">
       <Helmet>
        <title>Doctor Details Page</title>
      </Helmet>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for doctors..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <FaSearch className="search-icon" />
      </div>

      <div className="departments-container">
        {paginatedDepartments.map(([department, doctors]) => (
          <div key={department} className="department-section">
            <h2 className="department-title">{department}</h2>
            <div className="doctor-cards-container">
              {doctors.map((doctor) => (
                <div key={doctor._id} className="doctor-card">
                  <div className="doctor-profile-pic-container">
                    <img
                      src={`/api/doctors/profilepic/${doctor._id}`} // Fetch profile picture using the API
                      alt={`${doctor.firstName} ${doctor.lastName}`}
                      className="doctor-profile-pic"
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{`${doctor.firstName} ${doctor.lastName}`}</h3>
                    <div className="card-text">
                      <div className="doctor-detail">
                        <strong>Email:</strong> {doctor.email}
                      </div>
                      <div className="doctor-detail">
                        <strong>Contact:</strong> {doctor.mobileNumber}
                      </div>
                      <div className="doctor-detail">
                        <strong>Blood Group:</strong> {doctor.bloodGroup}
                      </div>
                      <div className="doctor-detail">
                        <strong>Degrees:</strong> {doctor.degrees}
                      </div>
                      <div className="doctor-detail">
                        <strong>Institute:</strong> {doctor.institute}
                      </div>
                      <div className="doctor-detail">
                        <strong>Specialty:</strong> {doctor.specialty}
                      </div>
                      <div className="doctor-detail">
                        <strong>Availability:</strong> {doctor.availability}
                      </div>
                     
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="pagination-button"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DoctorDetails;
