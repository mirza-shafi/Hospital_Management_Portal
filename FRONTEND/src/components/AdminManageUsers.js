import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/AdminManageUsers.css';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const AdminManageUsers = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [newPatient, setNewPatient] = useState({});
  const [newDoctor, setNewDoctor] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editType, setEditType] = useState(''); 
  const [showDoctors, setShowDoctors] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' }); 

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('/api/admin/patients');
      setPatients(res.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setMessage({ text: 'Error fetching patients.', type: 'error' });
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('/api/admin/doctors');
      setDoctors(res.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setMessage({ text: 'Error fetching doctors.', type: 'error' });
    }
  };

  const handleAddPatient = async () => {
    try {
      const res = await axios.post('/api/admin/patients', newPatient);
      setPatients([...patients, res.data]);
      setNewPatient({});
      setEditMode(false);
      setMessage({ text: 'Patient added successfully!', type: 'success' });
    } catch (error) {
      console.error('Error adding patient:', error);
      setMessage({ text: 'Error adding patient.', type: 'error' });
    }
  };

  const handleAddDoctor = async () => {
    try {
      const res = await axios.post('/api/admin/doctors', newDoctor);
      setDoctors([...doctors, res.data]);
      setNewDoctor({});
      setEditMode(false);
      setMessage({ text: 'Doctor added successfully!', type: 'success' });
    } catch (error) {
      console.error('Error adding doctor:', error);
      setMessage({ text: 'Error adding doctor.', type: 'error' });
    }
  };

  const handleUpdatePatient = async () => {
    try {
      const res = await axios.put(`/api/admin/patients/${selectedPatient._id}`, selectedPatient);
      setPatients(patients.map(patient => (patient._id === selectedPatient._id ? res.data : patient)));
      setSelectedPatient(null);
      setEditMode(false);
      setEditType('');
      setMessage({ text: 'Patient updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error updating patient:', error);
      setMessage({ text: 'Error updating patient.', type: 'error' });
    }
  };

  const handleUpdateDoctor = async () => {
    try {
      const res = await axios.put(`/api/admin/doctors/${selectedDoctor._id}`, selectedDoctor);
      setDoctors(doctors.map(doctor => (doctor._id === selectedDoctor._id ? res.data : doctor)));
      setSelectedDoctor(null);
      setEditMode(false);
      setEditType('');
      setMessage({ text: 'Doctor updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error updating doctor:', error);
      setMessage({ text: 'Error updating doctor.', type: 'error' });
    }
  };

  const handleDeletePatient = async (id) => {
    try {
      await axios.delete(`/api/admin/patients/${id}`);
      setPatients(patients.filter(patient => patient._id !== id));
      setMessage({ text: 'Patient deleted successfully!', type: 'success' });
    } catch (error) {
      console.error('Error deleting patient:', error);
      setMessage({ text: 'Error deleting patient.', type: 'error' });
    }
  };

  const handleDeleteDoctor = async (id) => {
    try {
      await axios.delete(`/api/admin/doctors/${id}`);
      setDoctors(doctors.filter(doctor => doctor._id !== id));
      setMessage({ text: 'Doctor deleted successfully!', type: 'success' });
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setMessage({ text: 'Error deleting doctor.', type: 'error' });
    }
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setEditMode(true);
    setEditType('patient');
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setEditMode(true);
    setEditType('doctor');
  };

  return (
    <div className="admin-manage-users">
      <Helmet>
        <title>Manage User Page</title>
      </Helmet>
      <div className="tabs">
        <ul>
          <li className={showDoctors ? 'is-active' : ''} onClick={() => setShowDoctors(true)}>Doctors</li>
          <li className={!showDoctors ? 'is-active' : ''} onClick={() => setShowDoctors(false)}>Patients</li>
        </ul>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          <p>{message.text}</p>
        </div>
      )}

      {showDoctors ? (
        <div className="admin-manage-users-section">
          <h2 className="title">Doctors</h2>
          <button className="button is-primary" onClick={() => { setEditMode(true); setEditType('doctor'); }}>Add Doctor</button>
          {editMode && editType === 'doctor' && (
            <div className="admin-manage-users-form">
              <h3>{selectedDoctor ? 'Edit Doctor' : 'Add Doctor'}</h3>
              <input
                className="input"
                type="text"
                placeholder="First Name"
                value={selectedDoctor ? selectedDoctor.firstName : newDoctor.firstName || ''}
                onChange={(e) => setSelectedDoctor ? setSelectedDoctor({ ...selectedDoctor, firstName: e.target.value }) : setNewDoctor({ ...newDoctor, firstName: e.target.value })}
              />
              <input
                className="input"
                type="text"
                placeholder="Last Name"
                value={selectedDoctor ? selectedDoctor.lastName : newDoctor.lastName || ''}
                onChange={(e) => setSelectedDoctor ? setSelectedDoctor({ ...selectedDoctor, lastName: e.target.value }) : setNewDoctor({ ...newDoctor, lastName: e.target.value })}
              />
              <input
                className="input"
                type="email"
                placeholder="Email"
                value={selectedDoctor ? selectedDoctor.email : newDoctor.email || ''}
                onChange={(e) => setSelectedDoctor ? setSelectedDoctor({ ...selectedDoctor, email: e.target.value }) : setNewDoctor({ ...newDoctor, email: e.target.value })}
              />
              <input
                className="input"
                type="text"
                placeholder="Sex"
                value={selectedDoctor ? selectedDoctor.sex : newDoctor.sex || ''}
                onChange={(e) => setSelectedDoctor ? setSelectedDoctor({ ...selectedDoctor, sex: e.target.value }) : setNewDoctor({ ...newDoctor, sex: e.target.value })}
              />
              <input
                className="input"
                type="date"
                placeholder="Date of Birth"
                value={selectedDoctor ? selectedDoctor.dateOfBirth : newDoctor.dateOfBirth || ''}
                onChange={(e) => setSelectedDoctor ? setSelectedDoctor({ ...selectedDoctor, dateOfBirth: e.target.value }) : setNewDoctor({ ...newDoctor, dateOfBirth: e.target.value })}
              />
              <input
                className="input"
                type="text"
                placeholder="Mobile Number"
                value={selectedDoctor ? selectedDoctor.mobileNumber : newDoctor.mobileNumber || ''}
                onChange={(e) => setSelectedDoctor ? setSelectedDoctor({ ...selectedDoctor, mobileNumber: e.target.value }) : setNewDoctor({ ...newDoctor, mobileNumber: e.target.value })}
              />
              <input
                className="input"
                type="password"
                placeholder="Password"
                value={selectedDoctor ? selectedDoctor.password : newDoctor.password || ''}
                onChange={(e) => setSelectedDoctor ? setSelectedDoctor({ ...selectedDoctor, password: e.target.value }) : setNewDoctor({ ...newDoctor, password: e.target.value })}
              />
              <div className="button-container">
  <button className="button is-success" onClick={editType === 'doctor' ? handleUpdateDoctor : handleAddDoctor}>
    {editType === 'doctor' ? 'Update Doctor' : 'Save'}
  </button>
  <button className="button is-danger" onClick={() => { setEditMode(false); setEditType(''); }}>
    Cancel
  </button>
</div>

            </div>
          )}
          <div className="table-container">
            <table className="table is-striped is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map(doctor => (
                  <tr key={doctor._id}>
                    <td>{doctor.firstName} {doctor.lastName}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.mobileNumber}</td>
                    <td>
                      <button className="button is-info" onClick={() => handleEditDoctor(doctor)}>Edit</button>
                      <button className="button is-danger" onClick={() => handleDeleteDoctor(doctor._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="admin-manage-users-section">
          <h2 className="title">Patients</h2>
          <button className="button is-primary" onClick={() => { setEditMode(true); setEditType('patient'); }}>Add Patient</button>
          {editMode && editType === 'patient' && (
            <div className="admin-manage-users-form">
              <h3>{selectedPatient ? 'Edit Patient' : 'Add Patient'}</h3>
              <input
                className="input"
                type="text"
                placeholder="First Name"
                value={selectedPatient ? selectedPatient.firstName : newPatient.firstName || ''}
                onChange={(e) => setSelectedPatient ? setSelectedPatient({ ...selectedPatient, firstName: e.target.value }) : setNewPatient({ ...newPatient, firstName: e.target.value })}
              />
              <input
                className="input"
                type="text"
                placeholder="Last Name"
                value={selectedPatient ? selectedPatient.lastName : newPatient.lastName || ''}
                onChange={(e) => setSelectedPatient ? setSelectedPatient({ ...selectedPatient, lastName: e.target.value }) : setNewPatient({ ...newPatient, lastName: e.target.value })}
              />
              <input
                className="input"
                type="email"
                placeholder="Email"
                value={selectedPatient ? selectedPatient.email : newPatient.email || ''}
                onChange={(e) => setSelectedPatient ? setSelectedPatient({ ...selectedPatient, email: e.target.value }) : setNewPatient({ ...newPatient, email: e.target.value })}
              />
              <input
                className="input"
                type="text"
                placeholder="Sex"
                value={selectedPatient ? selectedPatient.sex : newPatient.sex || ''}
                onChange={(e) => setSelectedPatient ? setSelectedPatient({ ...selectedPatient, sex: e.target.value }) : setNewPatient({ ...newPatient, sex: e.target.value })}
              />
              <input
                className="input"
                type="date"
                placeholder="Date of Birth"
                value={selectedPatient ? selectedPatient.dateOfBirth : newPatient.dateOfBirth || ''}
                onChange={(e) => setSelectedPatient ? setSelectedPatient({ ...selectedPatient, dateOfBirth: e.target.value }) : setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
              />
              <input
                className="input"
                type="text"
                placeholder="Mobile Number"
                value={selectedPatient ? selectedPatient.mobileNumber : newPatient.mobileNumber || ''}
                onChange={(e) => setSelectedPatient ? setSelectedPatient({ ...selectedPatient, mobileNumber: e.target.value }) : setNewPatient({ ...newPatient, mobileNumber: e.target.value })}
              />
              <input
                className="input"
                type="password"
                placeholder="Password"
                value={selectedPatient ? selectedPatient.password : newPatient.password || ''}
                onChange={(e) => setSelectedPatient ? setSelectedPatient({ ...selectedPatient, password: e.target.value }) : setNewPatient({ ...newPatient, password: e.target.value })}
              />
              <button className="button is-success" onClick={editType === 'patient' ? handleUpdatePatient : handleAddPatient}>
                {editType === 'patient' ? 'Update Patient' : 'Save'}
              </button>
              <button className="button is-danger" onClick={() => { setEditMode(false); setEditType(''); }}>Cancel</button>
            </div>
          )}
          <div className="table-container">
            <table className="table is-striped is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(patient => (
                  <tr key={patient._id}>
                    <td>{patient.firstName} {patient.lastName}</td>
                    <td>{patient.email}</td>
                    <td>{patient.mobileNumber}</td>
                    <td>
                      <button className="button is-info" onClick={() => handleEditPatient(patient)}>Edit</button>
                      <button className="button is-danger" onClick={() => handleDeletePatient(patient._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageUsers;
