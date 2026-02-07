
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../components/styles/BuyMedicine.css';
import successSoundFile from '../../../assets/success.mp3';
import errorSoundFile from '../../../assets/error.mp3';
import { FaSearch, FaArrowLeft, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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
  const medicinesPerPage = 6;

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
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = medicines.filter((medicine) =>
      medicine.name.toLowerCase().includes(searchTerm)
    );
    setFilteredMedicines(filtered);
    setCurrentPage(1);
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
      if (existingItem) {
        return prev.map(item => 
          item.medicineId === medicine._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
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
  }, [selectedMedicines, medicines]);

  const handleSubmit = async () => {
    if (selectedMedicines.length === 0) {
      setMessage('Your cart is empty.');
      return;
    }
    if (!patientDetails.name || !patientDetails.email || !patientDetails.phoneNumber || !patientDetails.address) {
      setMessage('Please fill in all patient details.');
      return;
    }

    try {
      const response = await axios.post('/api/medicineBill/buy', {
        ...patientDetails,
        selectedMedicines,
      });
      setMessage(`Purchase successful! Total Bill: ৳${response.data.totalBill}`);
      successSound.play().catch(e => console.error(e));
      setSelectedMedicines([]);
      setPatientDetails({ name: '', email: '', phoneNumber: '', address: '' });
    } catch (error) {
      console.error('Error submitting purchase:', error);
      setMessage('Error submitting purchase.');
      errorSound.play().catch(e => console.error(e));
    }
  };

  const indexOfLastMedicine = currentPage * medicinesPerPage;
  const indexOfFirstMedicine = indexOfLastMedicine - medicinesPerPage;
  const currentMedicines = filteredMedicines.slice(indexOfFirstMedicine, indexOfLastMedicine);
  const totalPages = Math.ceil(filteredMedicines.length / medicinesPerPage);

  return (
    <div className="buy-medicine">
      <Helmet>
        <title>Buy Medicine - HealingWave</title>
      </Helmet>

      <div style={{ width: '100%', maxWidth: '1300px' }}>
        <Link to="/" className="back-home-link">
          <FaArrowLeft /> Back to Home
        </Link>

        <div className="buy-medicine-header">
          <h1>Complete Your Purchase</h1>
        </div>

        <div className="buy-medicine-container">
          <div className="medicine-search-section">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search for medicines..."
                onChange={handleSearch}
              />
            </div>
            
            <div className="medicine-list">
              {currentMedicines.map((medicine) => (
                <div key={medicine._id} className="medicine-item">
                  <div>
                    <h3>{medicine.name}</h3>
                    <p>{medicine.dosageForm}</p>
                    <p>{medicine.strength}</p>
                    <p>{medicine.manufacturer}</p>
                  </div>
                  <div className="medicine-price-row">
                    <span className="medicine-price-tag">৳ {medicine.price}</span>
                    <button className="add-btn" onClick={() => handleAddMedicine(medicine)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`page-btn ${index + 1 === currentPage ? 'active' : ''}`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="cart-details-section">
            <h2><FaShoppingCart style={{ marginRight: '10px' }} /> Your Cart</h2>
            
            <div className="selected-medicines">
              {selectedMedicines.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>Cart is empty</p>
              ) : (
                selectedMedicines.map((item) => {
                  const medicine = medicines.find((med) => med._id === item.medicineId);
                  return (
                    <div key={item.medicineId} className="selected-medicine">
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '700' }}>{medicine?.name}</span>
                        <span>৳ {medicine?.price * item.quantity}</span>
                      </div>
                      <div className="quantity-control">
                        <button className="quantity-btn" onClick={() => handleQuantityChange(item.medicineId, -1)}><FaMinus size={12} /></button>
                        <span>{item.quantity}</span>
                        <button className="quantity-btn" onClick={() => handleQuantityChange(item.medicineId, 1)}><FaPlus size={12} /></button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {selectedMedicines.length > 0 && (
              <div className="cart-checkout-form">
                <p className="total-bill">Total: ৳ {totalBill}</p>
                <div className="patient-details">
                  <input
                    type="text"
                    placeholder="Patient Name"
                    value={patientDetails.name}
                    onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
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
                    placeholder="Full Address"
                    value={patientDetails.address}
                    onChange={(e) => setPatientDetails({ ...patientDetails, address: e.target.value })}
                  />
                </div>
                <button className="checkout-btn" onClick={handleSubmit}>
                  Confirm Purchase
                </button>
              </div>
            )}

            {message && <p className="message">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyMedicine;
