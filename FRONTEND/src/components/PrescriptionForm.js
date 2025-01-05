import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { prescriptionPDF } from './PDFGenerator'; 
import './styles/PrescriptionForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faDownload } from '@fortawesome/free-solid-svg-icons';
import successSoundFile from '../assets/success.mp3';
import errorSoundFile from '../assets/error.mp3';
import { Helmet } from 'react-helmet';

const successSound = new Audio(successSoundFile);
const errorSound = new Audio(errorSoundFile);

const PrescriptionForm = () => {
  const [formData, setFormData] = useState({
    doctorName: '',
    doctorEmail: '',
    date: '',
    patientEmail: '',
    patientName: '',
    age: '',
    sex: '',
    phoneNumber: '',
    prescriptionText: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    
    preloadAudio(successSound).catch(console.error);
    preloadAudio(errorSound).catch(console.error);
  }, []);

  
  const preloadAudio = (audio) => {
    return new Promise((resolve, reject) => {
      audio.oncanplaythrough = () => resolve(audio);
      audio.onerror = (e) => reject(`Error loading sound: ${e}`);
    });
  };

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/prescriptions/create', formData);
      setMessage(response.data.message);
      setError('');
      playSound(successSound); 
    } catch (err) {
      setError('Error creating prescription');
      setMessage('');
      playSound(errorSound); 
    }
  };

  
  const handleDownload = (e) => {
    e.preventDefault();
    prescriptionPDF(formData);
  };

  
  const playSound = (sound) => {
    sound.currentTime = 1.1; 
    sound.play().catch(error => {
      console.error('Error playing sound:', error);
      
    });
  };

  return (
    <div className="prescription-form-container">
      <Helmet>
        <title>Prescription Form Page</title>
      </Helmet>
      <div className="prescription-form-box">
        <form className="prescription-form" onSubmit={handleSubmit}>
          <h2 className="prescription-form-title">Prescription Form</h2>
          <div className="prescription-form-row">
            <div className="prescription-form-field">
              <label htmlFor="doctorName">Doctor Name</label>
              <input
                type="text"
                id="doctorName"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                placeholder="Enter doctor's name"
                required
              />
            </div>
            <div className="prescription-form-field">
              <label htmlFor="doctorEmail">Doctor Email</label>
              <input
                type="email"
                id="doctorEmail"
                name="doctorEmail"
                value={formData.doctorEmail}
                onChange={handleChange}
                placeholder="Enter doctor's email"
                required
              />
            </div>
          </div>
          <div className="prescription-form-row">
            <div className="prescription-form-field">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="prescription-form-field">
              <label htmlFor="patientEmail">Patient Email</label>
              <input
                type="email"
                id="patientEmail"
                name="patientEmail"
                value={formData.patientEmail}
                onChange={handleChange}
                placeholder="Enter patient's email"
                required
              />
            </div>
          </div>
          <div className="prescription-form-row">
            <div className="prescription-form-field">
              <label htmlFor="patientName">Patient Name</label>
              <input
                type="text"
                id="patientName"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Enter patient's name"
                required
              />
            </div>
            <div className="prescription-form-field">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter patient's age"
                required
              />
            </div>
          </div>
          <div className="prescription-form-row">
            <div className="prescription-form-field">
              <label htmlFor="sex">Sex</label>
              <input
                type="text"
                id="sex"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                placeholder="Enter patient's sex"
                required
              />
            </div>
            <div className="prescription-form-field">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter patient's phone number"
                required
              />
            </div>
          </div>
          <div className="prescription-form-field">
            <label htmlFor="prescriptionText">Prescription Details</label>
            <textarea
              id="prescriptionText"
              name="prescriptionText"
              value={formData.prescriptionText}
              onChange={handleChange}
              placeholder="Enter prescription details"
              required
            />
          </div>
          <div className="prescription-form-buttons">
            <button type="submit" className="prescription-form-submit-button">
              <FontAwesomeIcon icon={faPaperPlane} /> Submit
            </button>
            <button type="button" onClick={handleDownload} className="prescription-form-download-button">
              <FontAwesomeIcon icon={faDownload} /> Download
            </button>
          </div>
          {message && <div className="prescription-form-message prescription-form-success">{message}</div>}
          {error && <div className="prescription-form-message prescription-form-error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default PrescriptionForm;
