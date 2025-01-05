import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/ViewAppointment.css'; 
import { Helmet } from 'react-helmet';

const ViewAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentMessage, setPaymentMessage] = useState(''); 

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const patientEmail = localStorage.getItem('patientEmail');
                if (!patientEmail) {
                    throw new Error('Patient email not found in local storage');
                }
                const res = await axios.get(`/api/appointments/patient/email/${patientEmail}`);
                setAppointments(res.data);
            } catch (err) {
                setError(err.message || 'An error occurred while fetching appointments.');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);
    

    useEffect(() => {
        document.body.classList.add('view-appointment-body');
        return () => {
            document.body.classList.remove('view-appointment-body');
        };
    }, []);

    const payWithHealthCard = async (id) => {
        try {
            const email = localStorage.getItem('patientEmail');
            if (!email) {
                throw new Error('Patient email not found');
            }
            const res = await axios.put(`/api/appointments/pay/${id}`, { email });
            if (res.data.success) {
                setAppointments(appointments.map(appointment =>
                    appointment._id === id ? { ...appointment, paidStatus: 'paid', status: 'completed', paymentRequest: 'not requested' } : appointment
                ));
                setPaymentMessage('Payment successful!'); 
               
            } else {
                setPaymentMessage(res.data.message || 'Payment unsuccessful. Please try again.'); 
            }
        } catch (err) {
            setPaymentMessage(err.response?.data?.message || err.message || 'An error occurred while processing payment.');  
        }
    };

    if (loading) return <div className="view-appointment-loading">Loading...</div>;
    if (error) return <div className="view-appointment-error">Error: {error}</div>;

    return (
        <div className="view-appointment-page">
            <Helmet>
                <title>View Appointment Page</title>
            </Helmet>
            <div className="view-appointment-container">
                <h2 className="view-appointment-title">Check your Appointments with Doctors</h2>
                {appointments.length === 0 ? (
                    <p className="view-appointment-no-appointments">No appointments found.</p>
                ) : (
                    <div className="view-appointment-table-container">
                        <table className="view-appointment-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time Slot</th>
                                    <th>Doctor Name</th>
                                    <th>Doctor Email</th>
                                    <th>Appointment Status</th>
                                    <th>Paid Status</th>
                                    <th>Pay with Health Card</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appointment, index) => (
                                    <tr key={index}>
                                        <td>{new Date(appointment.date).toLocaleDateString()}</td>
                                        <td>{appointment.timeSlot}</td>
                                        <td>{appointment.doctorName}</td>
                                        <td>{appointment.doctorEmail}</td>
                                        <td>{appointment.status}</td>
                                        <td>{appointment.paidStatus}</td>
                                        <td>
                                            {appointment.paidStatus === 'unpaid' && appointment.paymentRequest === 'requested' ? (
                                                <div className="payment-section">
                                                    <button onClick={() => payWithHealthCard(appointment._id)}>Pay</button>
                                                    {paymentMessage && (
                                                        <p className="payment-message">{paymentMessage}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span>{appointment.paidStatus === '' ? 'Paid' : ''}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewAppointment;
