import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/AdmissionBill.css';
import { FaTimes } from 'react-icons/fa';
import { generateBillPDF } from './PDFGenerator'; 
import { Helmet } from 'react-helmet';

const AdmissionBill = () => {
  const [wardBills, setWardBills] = useState([]);
  const [cabinBills, setCabinBills] = useState([]);
  const [healthCard, setHealthCard] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const email = localStorage.getItem('patientEmail');
  const [activeTab, setActiveTab] = useState('ward'); 

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const wardRes = await axios.get(`/api/wardBooking/ward-bills/${email}`);
        setWardBills(wardRes.data);
        const cabinRes = await axios.get(`/api/cabinBooking/cabin-bills/${email}`);
        setCabinBills(cabinRes.data);
        const cardRes = await axios.get(`/api/healthcards/${email}`);
        setHealthCard(cardRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBills();
  }, [email]);

  const handlePay = async (billId, type) => {
    try {
      if (healthCard.topUpAmount <= 0) {
        setErrorMessage('Insufficient points. Please top up some points.');
        return;
      }
      
      const res = await axios.put(`/api/${type}Booking/pay-${type}-bill/${billId}`, {
        topUpAmount: healthCard.topUpAmount,
        email
      });
      
      setSuccessMessage(res.data.message);
      setErrorMessage('');

      const newHealthCard = await axios.get(`/api/healthcards/${email}`);
      setHealthCard(newHealthCard.data);

      if (type === 'ward') {
        setWardBills(wardBills.filter(bill => bill._id !== billId));
      } else {
        setCabinBills(cabinBills.filter(bill => bill._id !== billId));
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Payment failed. Please top up your health card.');
      setSuccessMessage('');
    }
  };

  const handleRemoveBill = (billId, type) => {
    if (window.confirm("Are you sure you want to remove this bill?")) {
      if (type === 'ward') {
        setWardBills(wardBills.filter(bill => bill._id !== billId));
      } else {
        setCabinBills(cabinBills.filter(bill => bill._id !== billId));
      }
    }
  };

  const handleDownloadPDF = (bill, type) => {
    generateBillPDF([bill], type); 
  };

  return (
    <div className="admission-bill-container">
      <Helmet>
        <title>Admission Bill Page</title>
      </Helmet>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      
      <div className="tabs">
        <button className={`tab ${activeTab === 'ward' ? 'active' : ''}`} onClick={() => setActiveTab('ward')}>Ward Bills</button>
        <button className={`tab ${activeTab === 'cabin' ? 'active' : ''}`} onClick={() => setActiveTab('cabin')}>Cabin Bills</button>
      </div>

      <div className={`bills-section ${activeTab === 'ward' ? 'active' : ''}`}>
        {wardBills.length > 0 ? wardBills.map(bill => (
          <div key={bill._id} className="bill-card">
            <button className="remove-btn" onClick={() => handleRemoveBill(bill._id, 'ward')}><FaTimes /></button>
            <div className="bill-details">
              <p><strong>Ward Type:</strong> {bill.wardType}</p>
              <p><strong>Floor No:</strong> {bill.floor}</p>
              <p><strong>Ward No:</strong> {bill.wardNo}</p>
              <p><strong>Patient Name:</strong> {bill.patientName}</p>
              <p><strong>Email:</strong> {bill.email}</p>
              <p><strong>Phone:</strong> {bill.phone}</p>
              <p><strong>Booked Date:</strong> {new Date(bill.bookedDate).toLocaleDateString()}</p>
              <p><strong>Total Bill:</strong> {bill.totalBill}</p>
              <p><strong>Paid Status:</strong> {bill.paid ? 'Paid' : 'Unpaid'}</p>
            </div>
            {!bill.paid && healthCard && (
              <div className="button-group">
                <button className="pay-btn" onClick={() => handlePay(bill._id, 'ward')}>Pay</button>
                <button className="download-btn" onClick={() => handleDownloadPDF(bill, 'ward')}>Download PDF</button>
              </div>
            )}
          </div>
        )) : <p className="no-bills">No Ward Bills Available</p>}
      </div>

      <div className={`bills-section ${activeTab === 'cabin' ? 'active' : ''}`}>
        {cabinBills.length > 0 ? cabinBills.map(bill => (
          <div key={bill._id} className="bill-card">
            <button className="remove-btn" onClick={() => handleRemoveBill(bill._id, 'cabin')}><FaTimes /></button>
            <div className="bill-details">
              <p><strong>Cabin Type:</strong> {bill.cabinType}</p>
              <p><strong>Cabin No:</strong> {bill.cabinNo}</p>
              <p><strong>Patient Name:</strong> {bill.patientName}</p>
              <p><strong>Email:</strong> {bill.email}</p>
              <p><strong>Phone:</strong> {bill.phone}</p>
              <p><strong>Booked Date:</strong> {new Date(bill.bookedDate).toLocaleDateString()}</p>
              <p><strong>Total Bill:</strong> {bill.totalBill}</p>
              <p><strong>Paid Status:</strong> {bill.paid ? 'Paid' : 'Unpaid'}</p>
            </div>
            {!bill.paid && healthCard && (
              <div className="button-group">
                <button className="pay-btn" onClick={() => handlePay(bill._id, 'cabin')}>Pay</button>
                <button className="download-btn" onClick={() => handleDownloadPDF(bill, 'cabin')}>Download PDF</button>
              </div>
            )}
          </div>
        )) : <p className="no-bills">No Cabin Bills Available</p>}
      </div>
    </div>
  );
};

export default AdmissionBill;
