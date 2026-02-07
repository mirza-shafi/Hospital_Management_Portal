import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faUser, faEnvelope, faPhone, faClock, faStethoscope, faBuilding } from '@fortawesome/free-solid-svg-icons';
import successSoundFile from '../../../../assets/success.mp3';
import errorSoundFile from '../../../../assets/error.mp3';

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
                setMessage('Appointment booked successfully!');
                playSound(successSound);
                setIsError(false);
                setSelectedDepartment('');
                setSelectedDoctor('');
                setDate('');
                setTimeSlot('');
                setPatientName('');
                setPatientEmail('');
                setPatientPhone('');
                setTimeout(() => setMessage(''), 5000);
            })
            .catch(error => {
                setMessage(error.response?.data?.error || 'Error creating appointment');
                setIsError(true);
                playSound(errorSound);
            });
    };

    const playSound = (sound) => {
        sound.currentTime = 0;
        sound.play().catch(error => console.error('Error playing sound:', error));
    };

    return (
        <div className="animate-fade-in-up h-[calc(100vh-100px)] flex flex-col">
            <Helmet>
                <title>Book Appointment</title>
            </Helmet>

            {/* Header */}
            <div className="bg-[#ffffff] dark:bg-[#18181b] px-6 py-4 rounded-xl shadow-sm mb-4 shrink-0 transition-all duration-200">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarCheck} className="text-blue-500" />
                    Book an Appointment
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Reserve your spot with our professional medical staff</p>
            </div>

            {/* Form Container */}
            <div className="flex-1 bg-[#ffffff] dark:bg-[#18181b] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-0 transition-all duration-200">
                <form className="flex flex-col h-full" onSubmit={handleSubmit}>
                    
                    {/* Scrollable Form Content */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <div className="max-w-4xl mx-auto space-y-6">
                            
                            {/* Selection Section */}
                            <div className="bg-gray-50/50 dark:bg-[#27272a]/20 p-4 rounded-xl transition-all duration-200 space-y-4">
                                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    Clinician Selection
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">Department</label>
                                        <div className="relative">
                                            <FontAwesomeIcon icon={faBuilding} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                            <select
                                                className="w-full pl-9 pr-4 py-2.5 bg-gray-100 dark:!bg-[#121214] border-none rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
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
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">Doctor</label>
                                        <div className="relative">
                                            <FontAwesomeIcon icon={faStethoscope} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                            <select
                                                className="w-full pl-9 pr-4 py-2.5 bg-gray-100 dark:!bg-[#121214] border-none rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
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
                                </div>

                                {doctorEmail && (
                                    <div className="animate-fade-in pt-2">
                                        <span className="text-[11px] font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border-none">
                                            <FontAwesomeIcon icon={faEnvelope} className="mr-1.5" /> {doctorEmail}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Schedule Section */}
                            <div className="bg-gray-50/50 dark:bg-[#27272a]/20 p-4 rounded-xl transition-all duration-200 space-y-4">
                                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Preferred Schedule
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">Visit Date</label>
                                        <div className="relative">
                                            <input
                                                className="w-full px-4 py-2.5 bg-gray-100 dark:!bg-[#121214] border-none rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                                type="date"
                                                value={date}
                                                onChange={e => setDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">Time Slot</label>
                                        <div className="relative">
                                            <FontAwesomeIcon icon={faClock} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                            <select
                                                className="w-full pl-9 pr-4 py-2.5 bg-gray-100 dark:!bg-[#121214] border-none rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none"
                                                value={timeSlot}
                                                onChange={e => setTimeSlot(e.target.value)}
                                                required
                                            >
                                                <option value="">Select Time Slot</option>
                                                <option value="9:00-9:20">9:00 - 9:20 AM</option>
                                                <option value="9:30-9:50">9:30 - 9:50 AM</option>
                                                <option value="10:00-10:20">10:00 - 10:20 AM</option>
                                                <option value="10:30-10:50">10:30 - 10:50 AM</option>
                                                <option value="11:00-11:20">11:00 - 11:20 AM</option>
                                                <option value="11:30-11:50">11:30 - 11:50 AM</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Patient Info Section */}
                            <div className="bg-gray-50/50 dark:bg-[#27272a]/20 p-4 rounded-xl transition-all duration-200 space-y-4">
                                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                    Patient Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">Full Name</label>
                                        <div className="relative">
                                            <FontAwesomeIcon icon={faUser} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                            <input
                                                className="w-full pl-9 pr-4 py-2.5 bg-gray-100 dark:!bg-[#121214] border-none rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-gray-400/50"
                                                type="text"
                                                placeholder="Patient's name"
                                                value={patientName}
                                                onChange={e => setPatientName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">Email Address</label>
                                        <div className="relative">
                                            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                            <input
                                                className="w-full pl-9 pr-4 py-2.5 bg-gray-100 dark:!bg-[#121214] border-none rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-gray-400/50"
                                                type="email"
                                                placeholder="patient@example.com"
                                                value={patientEmail}
                                                onChange={e => setPatientEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">Phone Number</label>
                                    <div className="relative">
                                        <FontAwesomeIcon icon={faPhone} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                        <input
                                            className="w-full pl-9 pr-4 py-2.5 bg-gray-100 dark:!bg-[#121214] border-none rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-gray-400/50"
                                            type="tel"
                                            placeholder="+880 1XXX XXXXXX"
                                            value={patientPhone}
                                            onChange={e => setPatientPhone(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-gray-100 dark:border-none flex items-center justify-between bg-gray-50/50 dark:bg-[#18181b]">
                        {message && (
                            <div className={`${isError ? 'text-red-500' : 'text-emerald-500'} text-sm font-medium animate-fade-in`}>
                                {message}
                            </div>
                        )}
                        {!message && <div></div>} {/* Spacer */}
                        
                        <button 
                            type="submit" 
                            className="px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 transform active:scale-95 disabled:opacity-50"
                        >
                            <FontAwesomeIcon icon={faCalendarCheck} /> Confirm Appointment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppointmentForm;

