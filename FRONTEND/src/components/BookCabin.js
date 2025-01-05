import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/BookCabin.css';
import successSoundFile from '../assets/success.mp3';
import errorSoundFile from '../assets/error.mp3';
import { Helmet } from 'react-helmet';

const successSound = new Audio(successSoundFile);
const errorSound = new Audio(errorSoundFile);

const BookCabin = () => {
  const [formData, setFormData] = useState({
    cabinType: '',
    floor: '',
    cabinNo: '',
    patientName: '',
    email: '',
    phone: '',
    totalDays: '',
    bookedDate: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [cabinNos, setCabinNos] = useState([]);

  useEffect(() => {
    const fetchAvailableCabins = async () => {
      try {
        const response = await axios.get('/api/cabinBooking/cavailable');
        setCabinNos(response.data);
      } catch (error) {
        console.error('Error fetching available cabins', error);
      }
    };

    fetchAvailableCabins();
    preloadAudio(successSound).catch(console.error);
    preloadAudio(errorSound).catch(console.error);
  }, []);

  const preloadAudio = (audio) => {
    return new Promise((resolve, reject) => {
      audio.oncanplaythrough = () => resolve(audio);
      audio.onerror = (e) => reject(`Error loading sound: ${e}`);
    });
  };

  const handleCabinTypeChange = (e) => {
    const cabinType = e.target.value;
    setFormData({ ...formData, cabinType, floor: '', cabinNo: '' });
  };

  const handleFloorChange = (e) => {
    const floor = e.target.value;
    setFormData({ ...formData, floor, cabinNo: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/cabinBooking/cbook', formData);
      setMessage(response.data.message);
      setMessageType('success');
      playSound(successSound); 
      setFormData({
        cabinType: '',
        floor: '',
        cabinNo: '',
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
    <div className="book-cabin-page">
      <Helmet>
                   <title>Book Ward Page</title>
                </Helmet>
      <div className="book-cabin-container">
        <h2>Book a Cabin</h2>
        {message && (
          <p className={`book-cabin-message ${messageType}`}>{message}</p>
        )}
        <form className="book-cabin-form" onSubmit={handleSubmit}>
          <div className="book-cabin-row">
            <div className="book-cabin-field">
              <select className="book-cabin-select" name="cabinType" value={formData.cabinType} onChange={handleCabinTypeChange} required>
                <option value="">Select Cabin Type</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
              </select>
            </div>
            <div className="book-cabin-field">
              <select className="book-cabin-select" name="floor" value={formData.floor} onChange={handleFloorChange} required>
                <option value="">Select Floor</option>
                {formData.cabinType === 'single' && [7, 8].map(floor => (
                  <option key={floor} value={floor}>{floor}</option>
                ))}
                {formData.cabinType === 'double' && [9].map(floor => (
                  <option key={floor} value={floor}>{floor}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="book-cabin-row">
            <div className="book-cabin-field">
              <select className="book-cabin-select" name="cabinNo" value={formData.cabinNo} onChange={(e) => setFormData({ ...formData, cabinNo: e.target.value })} required>
                <option value="">Select Cabin No</option>
                {['A', 'B', 'C', 'D', 'E'].map(letter => (
                  <option key={letter} value={`${formData.floor}${letter}`}>{`${formData.floor}${letter}`}</option>
                ))}
              </select>
            </div>
            <div className="book-cabin-field">
              <input className="book-cabin-input" type="text" name="patientName" value={formData.patientName} onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} placeholder="Patient Name" required />
            </div>
          </div>
          <div className="book-cabin-row">
            <div className="book-cabin-field">
              <input className="book-cabin-input" type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" required />
            </div>
            <div className="book-cabin-field">
              <input className="book-cabin-input" type="text" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone" required />
            </div>
          </div>
          <div className="book-cabin-row">
            <div className="book-cabin-field">
              <input className="book-cabin-input" type="number" name="totalDays" value={formData.totalDays} onChange={(e) => setFormData({ ...formData, totalDays: e.target.value })} placeholder="Total Days" required />
            </div>
            <div className="book-cabin-field">
              <input className="book-cabin-input" type="date" name="bookedDate" value={formData.bookedDate} onChange={(e) => setFormData({ ...formData, bookedDate: e.target.value })} required />
            </div>
          </div>
          <button className="book-cabin-button" type="submit">Book Cabin</button>
        </form>
      </div>
    </div>
  );
};

export default BookCabin;
