import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { storage } from '../../../../utils/storage';
import { prescriptionPDF } from '../../../shared/components/utils/PDFGenerator'; 
import '../../../../components/styles/PrescriptionForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faDownload } from '@fortawesome/free-solid-svg-icons';
import successSoundFile from '../../../../assets/success.mp3';
import errorSoundFile from '../../../../assets/error.mp3';
import { Helmet } from 'react-helmet';

const successSound = new Audio(successSoundFile);
const errorSound = new Audio(errorSoundFile);

const PrescriptionForm = () => {
  const [formData, setFormData] = useState({
    doctorName: '',
    doctorEmail: '',
    date: '',
    patientEmail: '',
    patientName: '',
    age: '',
    sex: '',
    phoneNumber: '',
    prescriptionText: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fillDoctorDetails = async () => {
      const storedEmail = storage.getItem('doctorEmail');
      if (storedEmail) {
        setFormData(prev => ({ ...prev, doctorEmail: storedEmail }));
        try {
          const res = await axios.get(`/api/doctors/ddetails/email/${storedEmail}`);
          if (res.data) {
             setFormData(prev => ({ 
               ...prev, 
               doctorEmail: storedEmail,
               doctorName: `${res.data.firstName} ${res.data.lastName}` 
             }));
          }
        } catch (e) {
          console.error("Could not fetch doctor details for auto-fill", e);
        }
      }
    };
    fillDoctorDetails();

    preloadAudio(successSound).catch(console.error);
    preloadAudio(errorSound).catch(console.error);
  }, []);

  const preloadAudio = (audio) => {
    return new Promise((resolve, reject) => {
      audio.oncanplaythrough = () => resolve(audio);
      audio.onerror = (e) => reject(`Error loading sound: ${e}`);
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/prescriptions/create', formData);
      setMessage(response.data.message);
      setError('');
      playSound(successSound); 
    } catch (err) {
      setError('Error creating prescription');
      setMessage('');
      playSound(errorSound); 
    }
  };

  const handleDownload = (e) => {
    e.preventDefault();
    prescriptionPDF(formData);
  };

  const playSound = (sound) => {
    sound.currentTime = 1.1; 
    sound.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  };

  return (
    <div className="animate-fade-in-up h-[calc(100vh-100px)] flex flex-col">
      <Helmet>
        <title>Prescription Form</title>
      </Helmet>
      
      {/* Header */}
      <div className="bg-white dark:bg-[#18181b] px-6 py-4 rounded-xl shadow-sm mb-4 shrink-0 transition-all duration-200 border border-gray-100 dark:border-none">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Add Prescription</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Create a new prescription for your patient</p>
      </div>

      {/* Form Container */}
      <div className="flex-1 bg-white dark:bg-[#18181b] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-0 transition-all duration-200 border border-gray-100 dark:border-none">
        <form className="flex flex-col h-full" onSubmit={handleSubmit}>
          
          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="space-y-8">
                
                {/* Doctor Details Section */}
                <div className="bg-gray-50/50 dark:bg-[#27272a]/20 p-4 rounded-xl transition-all duration-200">
                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Doctor Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">Doctor Name</label>
                            <input
                                type="text"
                                name="doctorName"
                                value={formData.doctorName}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-100 dark:!bg-[#121214] border-none rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400/50"
                                placeholder="Enter doctor's name"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">Doctor Email</label>
                            <input
                                type="email"
                                name="doctorEmail"
                                value={formData.doctorEmail}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-100 dark:!bg-[#121214] border-none rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400/50"
                                placeholder="Enter doctor's email"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Patient Details Section */}
                <div className="bg-gray-50/50 dark:bg-[#27272a]/20 p-4 rounded-xl transition-all duration-200">
                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Patient Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-100 dark:!bg-[#121214] border-none rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-gray-500 dark:text-gray-400"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">Patient Email</label>
                            <input
                                type="email"
                                name="patientEmail"
                                value={formData.patientEmail}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-100 dark:!bg-[#121214] border-none rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400/50"
                                placeholder="Enter patient's email"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">Patient Name</label>
                            <input
                                type="text"
                                name="patientName"
                                value={formData.patientName}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-100 dark:!bg-[#121214] border-none rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400/50"
                                placeholder="Enter patient's name"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">Phone Number</label>
                             <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-100 dark:!bg-[#121214] border-none rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400/50"
                                placeholder="Enter phone number"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:col-span-2 lg:col-span-2">
                          <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">Age</label>
                              <input
                                  type="number"
                                  name="age"
                                  value={formData.age}
                                  onChange={handleChange}
                                  className="w-full px-4 py-2.5 bg-gray-100 dark:!bg-[#121214] border-none rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400/50"
                                  placeholder="Age"
                                  required
                              />
                          </div>
                          <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">Sex</label>
                              <input
                                  type="text"
                                  name="sex"
                                  value={formData.sex}
                                  onChange={handleChange}
                                  className="w-full px-4 py-2.5 bg-gray-100 dark:!bg-[#121214] border-none rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400/50"
                                  placeholder="Sex"
                                  required
                              />
                          </div>
                        </div>
                    </div>
                </div>

                 {/* Prescription Details */}
                <div className="space-y-2 h-full">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                        Prescription Details
                    </label>
                    <textarea
                        name="prescriptionText"
                        value={formData.prescriptionText}
                        onChange={handleChange}
                        className="w-full h-48 px-5 py-4 bg-gray-50 dark:!bg-[#27272a] border-none rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none shadow-sm leading-relaxed placeholder:text-gray-400/50"
                        placeholder="Type prescription details here..."
                        required
                    />
                </div>

            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-100 dark:border-none flex items-center justify-between bg-gray-50/50 dark:bg-[#18181b]">
             {message && <div className="text-emerald-500 text-sm font-medium animate-fade-in">{message}</div>}
             {error && <div className="text-red-500 text-sm font-medium animate-fade-in">{error}</div>}
             {!message && !error && <div></div>} {/* Spacer */}
             
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={handleDownload} 
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-[#111827] border border-gray-200 dark:border-none hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 group/btn relative overflow-hidden active:scale-95 shadow-sm"
                >
                  <FontAwesomeIcon icon={faDownload} className="text-blue-500 group-hover/btn:scale-110 transition-transform" /> Download
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 transform hover:translate-y-[-1px]"
                >
                  <FontAwesomeIcon icon={faPaperPlane} /> Submit Prescription
                </button>
              </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionForm;
