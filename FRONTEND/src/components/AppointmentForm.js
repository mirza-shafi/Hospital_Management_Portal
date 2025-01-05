import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/AppointmentForm.css';
import { Helmet } from 'react-helmet';
import successSoundFile from '../assets/success.mp3';
import errorSoundFile from '../assets/error.mp3';


const successSound = new Audio(successSoundFile);
const errorSound = new Audio(errorSoundFile);

const AppointmentForm = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [doctorEmail, setDoctorEmail] = useState('');
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [patientName, setPatientName] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [patientPhone, setPatientPhone] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        axios.get('/api/appointments/departments')
            .then(response => setDepartments(response.data))
            .catch(error => console.error('Error fetching departments:', error));
            preloadAudio(successSound).catch(console.error);
            preloadAudio(errorSound).catch(console.error);
    }, []);
    
  const preloadAudio = (audio) => {
    return new Promise((resolve, reject) => {
      audio.oncanplaythrough = () => resolve(audio);
      audio.onerror = (e) => reject(`Error loading sound: ${e}`);
    });
  };

    useEffect(() => {
        if (selectedDepartment) {
            axios.get(`/api/appointments/doctors/${selectedDepartment}`)
                .then(response => setDoctors(response.data))
                .catch(error => console.error('Error fetching doctors:', error));
        } else {
            setDoctors([]);
        }
    }, [selectedDepartment]);

    useEffect(() => {
        if (selectedDoctor) {
            axios.get(`/api/appointments/doctor/${selectedDoctor}`)
                .then(response => setDoctorEmail(response.data.email))
                .catch(error => console.error('Error fetching doctor email:', error));
        } else {
            setDoctorEmail('');
        }
    }, [selectedDoctor]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newAppointment = {
            department: selectedDepartment,
            doctor: selectedDoctor,
            date,
            timeSlot,
            patientName,
            patientEmail,
            patientPhone,
        };

        axios.post('/api/appointments', newAppointment)
            .then(response => {
                setMessage('You have booked the appointment successfully!');
                playSound(successSound); 
                setIsError(false);
                setSelectedDepartment('');
                setSelectedDoctor('');
                setDate('');
                setTimeSlot('');
                setPatientName('');
                setPatientEmail('');
                setPatientPhone('');
            })
            .catch(error => {
                setMessage(error.response?.data?.error || 'Error creating appointment');
                setIsError(true);
                playSound(errorSound); 
            });
    };
    
  const playSound = (sound) => {
    sound.currentTime = 1.1; 
    sound.play().catch(error => {
      console.error('Error playing sound:', error);
      
    });
  };

    return (
        <div className="appointment-form-container">
            <Helmet>
                   <title>Appoinment Page</title>
                </Helmet>
            <form className="appointment-form" onSubmit={handleSubmit}>
                <h2 className="appointment-form-title">Book an Appointment</h2>

                
                <div className="appointment-row">
                    <div className="appointment-field">
                        <label className="appointment-label">Department</label>
                        <select
                            className="appointment-select"
                            value={selectedDepartment}
                            onChange={e => setSelectedDepartment(e.target.value)}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <div className="appointment-field">
                        <label className="appointment-label">Doctor</label>
                        <select
                            className="appointment-select"
                            value={selectedDoctor}
                            onChange={e => setSelectedDoctor(e.target.value)}
                            required
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map(doctor => (
                                <option key={doctor._id} value={doctor._id}>{doctor.firstName} {doctor.lastName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {doctorEmail && (
                    <div className="appointment-field">
                        <label className="appointment-label">Doctor's Email</label>
                        <input
                            className="appointment-input"
                            type="email"
                            value={doctorEmail}
                            readOnly
                        />
                    </div>
                )}

                <div className="appointment-row">
                    <div className="appointment-field">
                        <label className="appointment-label">Date</label>
                        <input
                            className="appointment-input"
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="appointment-field">
                        <label className="appointment-label">Time Slot</label>
                        <select
                            className="appointment-select"
                            value={timeSlot}
                            onChange={e => setTimeSlot(e.target.value)}
                            required
                        >
                            <option value="">Select Time Slot</option>
                            <option value="9:00-9:20">9:00-9:20</option>
                            <option value="9:30-9:50">9:30-9:50</option>
                            <option value="10:00-10:20">10:00-10:20</option>
                            <option value="10:30-10:50">10:30-10:50</option>
                            <option value="11:00-11:20">11:00-11:20</option>
                            <option value="11:30-11:50">11:30-11:50</option>
                        </select>
                    </div>
                </div>

                <div className="appointment-row">
                    <div className="appointment-field">
                        <label className="appointment-label">Patient Name</label>
                        <input
                            className="appointment-input"
                            type="text"
                            value={patientName}
                            onChange={e => setPatientName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="appointment-field">
                        <label className="appointment-label">Patient Email</label>
                        <input
                            className="appointment-input"
                            type="email"
                            value={patientEmail}
                            onChange={e => setPatientEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="appointment-field">
                    <label className="appointment-label">Patient Phone</label>
                    <input
                        className="appointment-input"
                        type="tel"
                        value={patientPhone}
                        onChange={e => setPatientPhone(e.target.value)}
                        required
                    />
                </div>

                <div className="appointment-field">
                    <button type="submit" className="appointment-button">
                        Book Appointment
                    </button>
                    
                </div>
                {message && (
                    <div className={`appointment-message ${isError ? 'is-danger' : 'is-success'}`}>
                        {message}
                    </div>
                )}

            </form>
        </div>
    );
};

export default AppointmentForm;
