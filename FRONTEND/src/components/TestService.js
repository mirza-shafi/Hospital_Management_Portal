import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/TestService.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from 'react-js-pagination';
import successSoundFile from '../assets/success.mp3';
import errorSoundFile from '../assets/error.mp3';
import { Helmet } from 'react-helmet';
const successSound = new Audio(successSoundFile);
const errorSound = new Audio(errorSoundFile);

const TestService = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('/api/items');
        setItems(res.data);
      } catch (err) {
        setError('Failed to fetch items.');
      }
    };

    fetchItems();
    preloadAudio(successSound).catch(console.error);
    preloadAudio(errorSound).catch(console.error);
  }, []);

  const preloadAudio = (audio) => {
    return new Promise((resolve, reject) => {
      audio.oncanplaythrough = () => resolve(audio);
      audio.onerror = (e) => reject(`Error loading sound: ${e}`);
    });
  };

  const handleSelectItem = (item) => {
    if (!selectedItems.some((selectedItem) => selectedItem._id === item._id)) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem._id !== item._id));
    }
  };

  const calculateTotalBill = () => {
    return selectedItems.reduce((total, item) => total + item.price, 0);
  };

  const handleSubmit = async () => {
    try {
      const billData = {
        doctorName,
        doctorEmail,
        patientName,
        patientEmail,
        phoneNumber,
        selectedItems
      };

      console.log(billData);

      await axios.post('/api/testAndServicesBill/add', billData);
      setSuccess('Bill sent to patient successfully!');
      setError('');
      playSound(successSound); 
      setSelectedItems([]);
      setDoctorName('');
      setDoctorEmail('');
      setPatientName('');
      setPatientEmail('');
      setPhoneNumber('');
    } catch (err) {
      console.error(err);
      setError('Failed to submit bill.');
      playSound(errorSound); 
      setSuccess('');
    }
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const playSound = (sound) => {
    sound.currentTime = 0.5; 
    sound.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  };

  return (
    <div className="test-service-body">
      <Helmet>
        <title>Test Service Page</title>
      </Helmet>
      <div className="test-service-wrapper">
        <h1 className="test-service-title">Manage Tests & Services</h1>
        <div className="test-service-billing-section">
          <h2>Billing Details</h2>
          <form className="test-service-billing-form">
            <div className="test-service-form-group">
              <input
                type="text"
                placeholder="Doctor Name"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="form-control test-service-input"
              />
              <input
                type="email"
                placeholder="Doctor Email"
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
                className="form-control test-service-input"
              />
              <input
                type="text"
                placeholder="Patient Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="form-control test-service-input"
              />
              <input
                type="email"
                placeholder="Patient Email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                className="form-control test-service-input"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="form-control test-service-input"
              />
            </div>
            <h3>Selected Items</h3>
            <div className="test-service-selected-items-container">
              {selectedItems.map((item) => (
                <div key={item._id} className="test-service-selected-item">
                  {item.name} - {item.price} BDT ({item.type})
                </div>
              ))}
            </div>
            <h4>Total Bill: {calculateTotalBill()} BDT</h4>
            <button type="button" onClick={handleSubmit} className="btn test-service-submit-btn">
              Send Bill
            </button>
            {error && <p className="test-service-error-message">{error}</p>}
            {success && <p className="test-service-success-message">{success}</p>}
          </form>
        </div>
        <div className="test-service-test-section">
          <h2>Available Tests & Services</h2>
         
          <ul className="list-group test-service-list-group">
            {currentItems.map((item) => (
              <li
                key={item._id}
                className={`list-group-item test-service-list-group-item ${selectedItems.some((selectedItem) => selectedItem._id === item._id) ? 'selected' : ''}`}
              >
                {item.name} - {item.price} BDT ({item.type})
                <button
                  onClick={() => handleSelectItem(item)}
                  className="btn test-service-select-btn"
                >
                  {selectedItems.some((selectedItem) => selectedItem._id === item._id) ? 'Deselect' : 'Select'}
                </button>
              </li>
            ))}
          </ul>
          <Pagination
            activePage={activePage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={items.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      </div>
    </div>
  );
};

export default TestService;
