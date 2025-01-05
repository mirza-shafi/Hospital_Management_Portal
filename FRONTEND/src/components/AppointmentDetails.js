import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/AppointmentDetails.css'; 
import { Helmet } from 'react-helmet';

const AppointmentDetails = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(null); 

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const doctorEmail = localStorage.getItem('doctorEmail');
                if (!doctorEmail) {
                    throw new Error('Doctor email not found in local storage');
                }
                const res = await axios.get(`/api/appointments/doctor/email/${doctorEmail}`);
                setAppointments(res.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    useEffect(() => {
        document.body.classList.add('appointment-details-body');
        return () => {
            document.body.classList.remove('appointment-details-body');
        };
    }, []);

    const requestPayment = async (id) => {
        try {
            setUpdating(id); // Set updating state to indicate which appointment is being updated
            await axios.put(`/api/appointments/request-payment/${id}`);
            setAppointments(appointments.map(appointment =>
                appointment._id === id ? { ...appointment, paymentRequest: 'requested' } : appointment
            ));
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating("requested"); // Reset updating state
        }
    };

    if (loading) return <div className="appointment-details-loading">Loading...</div>;
    if (error) return <div className="appointment-details-error">Error: {error}</div>;

    return (
        <div className="appointment-details-page">
            <Helmet>
                <title>Appointment Details Page</title>
            </Helmet>
            <div className="appointment-details-container">
                <h2 className="appointment-details-title">Check Your Appointments with Patients</h2>
                {appointments.length === 0 ? (
                    <p className="appointment-details-no-appointments">No appointments found.</p>
                ) : (
                    <div className="appointment-details-table-container">
                        <table className="appointment-details-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time Slot</th>
                                    <th>Patient Name</th>
                                    <th>Patient Email</th>
                                    <th>Patient Phone</th>
                                    <th> Appointment Status</th>
                                    <th>Payment Request</th>
                                    <th>Paid Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appointment, index) => (
                                    <tr key={index}>
                                        <td>{new Date(appointment.date).toLocaleDateString()}</td>
                                        <td>{appointment.timeSlot}</td>
                                        <td>{appointment.patientName}</td>
                                        <td>{appointment.patientEmail}</td>
                                        <td>{appointment.patientPhone}</td>
                                        <td>{appointment.status}</td>
                                        <td>{appointment.paymentRequest}</td>
                                        <td>{appointment.paidStatus}</td>
                                        <td>
                                            {appointment.paymentRequest === 'request payment' && 
                                                <button 
                                                    onClick={() => requestPayment(appointment._id)}
                                                    disabled={updating === appointment._id} // Disable button while updating
                                                >
                                                    {updating === appointment._id ? 'Processing...' : 'Request Payment'}
                                                </button>
                                            }
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

export default AppointmentDetails;
