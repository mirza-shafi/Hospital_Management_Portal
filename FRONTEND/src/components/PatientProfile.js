import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/PatientProfile.css';
import { Helmet } from 'react-helmet'; 

const PatientProfile = ({ email, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bloodGroup: '',
    age: '',
    difficulty: '',
    beendignosed: '',
    condition: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const res = await axios.get(`/api/patients/pdetails/email/${email}`);
        setFormData(res.data);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch patient details.');
      }
    };

    fetchPatientDetails();
  }, [email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/patients/pupdate', { email, ...formData });
      setMessage(res.data.message);
      setError('');
    } catch (error) {
      setMessage('');
      setError(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="modal is-active">
      <Helmet>
        <title>Patient Profile Page</title>
      </Helmet>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Update Your Profile</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <form className="patient-profile-form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">First Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Last Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Blood Group</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="bloodGroup"
                  placeholder="Blood Group"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Age</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Difficulty</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="difficulty"
                  placeholder="Difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Diagnosed</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="beendignosed"
                  placeholder="Diagnosed"
                  value={formData.beendignosed}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Condition</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="condition"
                  placeholder="Condition"
                  value={formData.condition}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button className="button is-primary" type="submit">Update</button>
          </form>
          {message && <p className="notification is-success">{message}</p>}
          {error && <p className="notification is-danger">{error}</p>}
        </section>
      </div>
    </div>
  );
};

export default PatientProfile;
