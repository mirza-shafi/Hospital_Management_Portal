import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/TestBill.css';
import { FaTimes } from 'react-icons/fa';
import { generateTestBillPDF } from './PDFGenerator';
import { Helmet } from 'react-helmet';

const TestBill = () => {
  const [bills, setBills] = useState([]);
  const [healthCard, setHealthCard] = useState(null);
  const email = localStorage.getItem('patientEmail');
  const [activeTab, setActiveTab] = useState('testAndServices');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const response = await axios.get(`/api/testAndServicesBill/bills/${email}`);
        setBills(response.data);

   
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
      const response = await axios.put(`/api/testAndServicesBill/pay/${billId}`, {
        email,
        topUpAmount: healthCard.topUpAmount
      });
      setMessage(response.data.message);

      
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
    generateTestBillPDF([bill], 'testAndServices');
  };

  return (
    <div className="test-bill-container">
      <Helmet>
        <title>Test Bill Page</title>
      </Helmet>
      {message && <p className="success-message">{message}</p>}
      
      <div className="tabs">
        <button className={`tab ${activeTab === 'testAndServices' ? 'active' : ''}`} onClick={() => setActiveTab('testAndServices')}>
          Test and Services Bills
        </button>
      </div>

      <div className={`bills-section ${activeTab === 'testAndServices' ? 'active' : ''}`}>
        {bills.length > 0 ? bills.map(bill => (
          <div key={bill._id} className="bill-card">
            <button className="remove-btn" onClick={() => handleRemoveBill(bill._id)}><FaTimes /></button>
            <div className="bill-details">
              <p><strong>Doctor Name:</strong> {bill.doctorName}</p>
              <p><strong>Doctor Email:</strong> {bill.doctorEmail}</p>
              <p><strong>Patient Name:</strong> {bill.patientName}</p>
              <p><strong>Patient Email:</strong> {bill.patientEmail}</p>
              <p><strong>Phone:</strong> {bill.phone}</p>
              <p><strong>Selected Items:</strong></p>
              {bill.selectedItems.map((item, index) => (
                <p key={index}><strong>{item.type}:</strong> {item.name} - {item.price}</p>
              ))}
              <p><strong>Total Bill:</strong> {bill.totalBill}</p>
              <p><strong>Paid Status:</strong> {bill.paid ? 'Paid' : 'Unpaid'}</p>
              {!bill.paid && healthCard && (
                <div className="button-group">
                  <button className="pay-btn" onClick={() => handlePay(bill._id)}>Pay with HealthCard</button>
                  <button className="download-btn" onClick={() => handleDownloadPDF(bill)}>Download PDF</button>
                </div>
              )}
            </div>
          </div>
        )) : <p className="no-bills">No Test and Services Bills Available</p>}
      </div>
    </div>
  );
};

export default TestBill;
