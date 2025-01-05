import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/BookWard.css';
import successSoundFile from '../assets/success.mp3';
import errorSoundFile from '../assets/error.mp3';
import { Helmet } from 'react-helmet';

const successSound = new Audio(successSoundFile);
const errorSound = new Audio(errorSoundFile);
const BookWard = () => {
  const [formData, setFormData] = useState({
    wardType: '',
    floor: '',
    wardNo: '',
    patientName: '',
    email: '',
    phone: '',
    totalDays: '',
    bookedDate: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [wardNos, setWardNos] = useState([]);

  useEffect(() => {
    const fetchAvailableWards = async () => {
      try {
        const response = await axios.get('/api/wardBooking/wavailable');
        setWardNos(response.data);
      } catch (error) {
        console.error('Error fetching available wards', error);
      }
    };

    fetchAvailableWards();
    preloadAudio(successSound).catch(console.error);
    preloadAudio(errorSound).catch(console.error);
  }, []);

    const preloadAudio = (audio) => {
    return new Promise((resolve, reject) => {
      audio.oncanplaythrough = () => resolve(audio);
      audio.onerror = (e) => reject(`Error loading sound: ${e}`);
    });
  };

  const handleWardTypeChange = (e) => {
    const wardType = e.target.value;
    setFormData({ ...formData, wardType, floor: '', wardNo: '' });
  };

  const handleFloorChange = (e) => {
    const floor = e.target.value;
    setFormData({ ...formData, floor, wardNo: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/wardBooking/wbook', formData);
      setMessage(response.data.message);
      setMessageType('success');
      playSound(successSound); 
      setFormData({
        wardType: '',
        floor: '',
        wardNo: '',
        patientName: '',
        email: '',
        phone: '',
        totalDays: '',
        bookedDate: '',
      });
    } catch (error) {
      setMessage(error.response.data.error || 'An error occurred');
      setMessageType('error');
      playSound(errorSound); 
    }
  };
  
  const playSound = (sound) => {
    sound.currentTime = 1.1; 
    sound.play().catch(error => {
      console.error('Error playing sound:', error);
      
    });
  };

  return (
    <div className="book-ward-page">
      <Helmet>
        <title>Book Ward Page</title>
      </Helmet>
      <div className="book-ward-container">
        <h2>Book a Ward</h2>
        {message && (
          <p className={`book-ward-message ${messageType}`}>{message}</p>
        )}
        <form className="book-ward-form" onSubmit={handleSubmit}>
          <div className="book-ward-row">
            <div className="book-ward-field">
              <select className="book-ward-select" name="wardType" value={formData.wardType} onChange={handleWardTypeChange} required>
                <option value="">Select Ward Type</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>
            <div className="book-ward-field">
              <select className="book-ward-select" name="floor" value={formData.floor} onChange={handleFloorChange} required>
                <option value="">Select Floor</option>
                {formData.wardType === 'men' && [3, 4].map(floor => (
                  <option key={floor} value={floor}>{floor}</option>
                ))}
                {formData.wardType === 'women' && [5, 6].map(floor => (
                  <option key={floor} value={floor}>{floor}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="book-ward-row">
            <div className="book-ward-field">
              <select className="book-ward-select" name="wardNo" value={formData.wardNo} onChange={(e) => setFormData({ ...formData, wardNo: e.target.value })} required>
                <option value="">Select Ward No</option>
                {formData.floor && ['A', 'B', 'C', 'D', 'E'].map(letter => (
                  <option key={letter} value={`${formData.floor}${letter}`}>{`${formData.floor}${letter}`}</option>
                ))}
              </select>
            </div>
            <div className="book-ward-field">
              <input className="book-ward-input" type="text" name="patientName" value={formData.patientName} onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} placeholder="Patient Name" required />
            </div>
          </div>
          <div className="book-ward-row">
            <div className="book-ward-field">
              <input className="book-ward-input" type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" required />
            </div>
            <div className="book-ward-field">
              <input className="book-ward-input" type="text" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone" required />
            </div>
          </div>
          <div className="book-ward-row">
            <div className="book-ward-field">
              <input className="book-ward-input" type="number" name="totalDays" value={formData.totalDays} onChange={(e) => setFormData({ ...formData, totalDays: e.target.value })} placeholder="Total Days" required />
            </div>
            <div className="book-ward-field">
              <input className="book-ward-input" type="date" name="bookedDate" value={formData.bookedDate} onChange={(e) => setFormData({ ...formData, bookedDate: e.target.value })} required />
            </div>
          </div>
          <button className="book-ward-button" type="submit">Book Ward</button>
        </form>
      </div>
    </div>
  );
};

export default BookWard;
