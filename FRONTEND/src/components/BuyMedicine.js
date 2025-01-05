
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/BuyMedicine.css';
import successSoundFile from '../assets/success.mp3';
import errorSoundFile from '../assets/error.mp3';
import { Helmet } from 'react-helmet';

const successSound = new Audio(successSoundFile);
const errorSound = new Audio(errorSoundFile);


const BuyMedicine = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const medicinesPerPage = 5;

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get('/api/medicines');
        setMedicines(response.data);
        setFilteredMedicines(response.data); 
      } catch (error) {
        console.error('Error fetching medicines:', error);
        setMessage('Error fetching medicines.');
      }
    };

    fetchMedicines();
    preloadAudio(successSound).catch(console.error);
    preloadAudio(errorSound).catch(console.error);
  }, []);

  const preloadAudio = (audio) => {
    return new Promise((resolve, reject) => {
      audio.oncanplaythrough = () => resolve(audio);
      audio.onerror = (e) => reject(`Error loading sound: ${e}`);
    });
  };


  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = medicines.filter((medicine) =>
      medicine.name.toLowerCase().includes(searchTerm)
    );
    setFilteredMedicines(filtered);
  };

  const handleQuantityChange = (medicineId, change) => {
    setSelectedMedicines((prev) => {
      const index = prev.findIndex((item) => item.medicineId === medicineId);
      if (index === -1) return prev;

      const newQuantity = Math.max(prev[index].quantity + change, 0);
      if (newQuantity === 0) {
        return prev.filter((item) => item.medicineId !== medicineId);
      }

      const newSelectedMedicines = [...prev];
      newSelectedMedicines[index] = { ...newSelectedMedicines[index], quantity: newQuantity };
      return newSelectedMedicines;
    });
  };

  const handleAddMedicine = (medicine) => {
    setSelectedMedicines((prev) => {
      const existingItem = prev.find((item) => item.medicineId === medicine._id);
      if (existingItem) return prev;

      return [...prev, { medicineId: medicine._id, quantity: 1 }];
    });
  };

  const calculateTotalBill = () => {
    const total = selectedMedicines.reduce((acc, item) => {
      const medicine = medicines.find((med) => med._id === item.medicineId);
      return acc + (medicine ? medicine.price * item.quantity : 0);
    }, 0);
    setTotalBill(total);
  };

  useEffect(() => {
    calculateTotalBill();
  }, [selectedMedicines]);

  const handleSubmit = async () => {
    if (!patientDetails.name || !patientDetails.email || !patientDetails.phoneNumber || !patientDetails.address) {
      setMessage('Please fill in all patient details.');
      return;
    }

    try {
      const response = await axios.post('/api/medicineBill/buy', {
        ...patientDetails,
        selectedMedicines,
      });
      setMessage(`Bill submitted to medicine bill page Total Bill: ৳${response.data.totalBill}`);
      playSound(successSound); 
    } catch (error) {
      console.error('Error submitting purchase:', error);
      setMessage('Error submitting purchase.');
      playSound(errorSound); 
    }
  };

  const indexOfLastMedicine = currentPage * medicinesPerPage;
  const indexOfFirstMedicine = indexOfLastMedicine - medicinesPerPage;
  const currentMedicines = filteredMedicines.slice(indexOfFirstMedicine, indexOfLastMedicine);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredMedicines.length / medicinesPerPage);

    
  const playSound = (sound) => {
    sound.currentTime = 1.1; 
    sound.play().catch(error => {
      console.error('Error playing sound:', error);
      
    });
  };

  return (
    <div className="buy-medicine">
       <Helmet>
        <title>Buy Medicine Page</title>
      </Helmet>
      
      <h1>Buy Medicine</h1>
      <div className="medicine-search-section">
        <input
          type="text"
          placeholder="Search for medicines..."
          onChange={handleSearch}
        />
        <div className="medicine-list">
          {currentMedicines.map((medicine) => (
            <div key={medicine._id} className="medicine-item">
            <h3>{medicine.name}</h3>
            <p>{medicine.dosageForm}</p>
            <p>{medicine.strength}</p>
            <p>{medicine.manufacturer}</p>
            <p>৳ {medicine.price}</p>
            <button onClick={() => handleAddMedicine(medicine)}>Add</button>
          </div>
          
          ))}
        </div>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={index + 1 === currentPage ? 'active' : ''}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="cart-details-section">
        <div className="selected-medicines">
          {selectedMedicines.map((item) => (
            <div key={item.medicineId} className="selected-medicine">
              <p>{medicines.find((med) => med._id === item.medicineId)?.name}</p>
              <div className="quantity-control">
                <button onClick={() => handleQuantityChange(item.medicineId, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.medicineId, 1)}>+</button>
              </div>
              <p>Total Price: ৳ {medicines.find((med) => med._id === item.medicineId)?.price * item.quantity}</p>
              <hr className="dotted-line" />
            </div>
          ))}
        </div>

        <div className="patient-details">
          <input
            type="text"
            placeholder="Name"
            value={patientDetails.name}
            onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={patientDetails.email}
            onChange={(e) => setPatientDetails({ ...patientDetails, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={patientDetails.phoneNumber}
            onChange={(e) => setPatientDetails({ ...patientDetails, phoneNumber: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            value={patientDetails.address}
            onChange={(e) => setPatientDetails({ ...patientDetails, address: e.target.value })}
          />
        </div>

        <p>Total Bill: ৳ {totalBill}</p>

        <button onClick={handleSubmit}>Send to Medicine Bill</button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default BuyMedicine;
