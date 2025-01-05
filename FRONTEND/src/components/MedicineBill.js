import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/MedicineBill.css';
import { FaTimes } from 'react-icons/fa';
import { generateMedicineBillPDF } from './PDFGenerator';
import { Helmet } from 'react-helmet';

const MedicineBill = () => {
  const [bills, setBills] = useState([]);
  const [healthCard, setHealthCard] = useState(null);
  const [message, setMessage] = useState('');
  const email = localStorage.getItem('patientEmail');
  const [activeTab, setActiveTab] = useState('medicine');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the bills
        const billResponse = await axios.get(`/api/medicineBill/bills/${email}`);
        setBills(billResponse.data);

        // Fetch the health card
        const cardResponse = await axios.get(`/api/healthcards/${email}`);
        setHealthCard(cardResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [email]);

  const handlePay = async (billId) => {
    try {
      const response = await axios.put(`/api/medicineBill/pay/${billId}`, {
        email,
        topUpAmount: healthCard.topUpAmount
      });
      setMessage(response.data.message);

      // Update the bill status in the local state
      setBills(bills.map(bill => bill._id === billId ? { ...bill, paid: true } : bill));
    } catch (error) {
      alert(error.response?.data?.error || 'Payment failed');
    }
  };

  const handleRemoveBill = (billId) => {
    if (window.confirm("Are you sure you want to remove this bill?")) {
      setBills(bills.filter(bill => bill._id !== billId));
    }
  };

  const handleDownloadPDF = (bill) => {
    generateMedicineBillPDF([bill]); 
  };

  return (
    
    <div className="medicine-bill-container">
       <Helmet>
        <title>Medicine Bill Page</title>
      </Helmet>
      {message && <p className="success-message">{message}</p>}

      <div className="tabs">
        <button className={`tab ${activeTab === 'medicine' ? 'active' : ''}`} onClick={() => setActiveTab('medicine')}>
          Medicine Bills
        </button>
      </div>

      <div className={`bills-section ${activeTab === 'medicine' ? 'active' : ''}`}>
        {bills.length > 0 ? bills.map(bill => (
          <div key={bill._id} className="bill-card">
            <button className="remove-btn" onClick={() => handleRemoveBill(bill._id)}><FaTimes /></button>
            <div className="bill-details">
              <p><strong>Name:</strong> {bill.name}</p>
              <p><strong>Email:</strong> {bill.email}</p>
              <p><strong>Phone Number:</strong> {bill.phoneNumber}</p>
              <p><strong>Address:</strong> {bill.address}</p>
              <p><strong>Total Bill:</strong> ৳ {bill.totalBill}</p>
              <p><strong>Date:</strong> {new Date(bill.date).toLocaleDateString()}</p>
              <h3>Medicines:</h3>
              <ul>
                {bill.medicines.map((item) => (
                  <li key={item.medicineId}>
                    {item.medicineId.name} (৳ {item.totalPrice} for {item.quantity} units)
                  </li>
                ))}
              </ul>
              <hr />
              <p><strong>Paid Status:</strong> <span className={`status ${bill.paid ? 'paid' : 'unpaid'}`}>{bill.paid ? 'Paid' : 'Unpaid'}</span></p>
              <div className="button-group">
                {!bill.paid && healthCard && (
                  <button className="pay-btn" onClick={() => handlePay(bill._id)}>Pay with HealthCard</button>
                )}
                <button className="download-btn" onClick={() => handleDownloadPDF(bill)}>Download PDF</button>
              </div>
            </div>
          </div>
        )) : <p className="no-bills">No Medicine Bills Available</p>}
      </div>
    </div>
  );
};

export default MedicineBill;
