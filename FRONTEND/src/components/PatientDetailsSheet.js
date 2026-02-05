import React, { useEffect, useState } from 'react';
import { FaTimes, FaUser, FaPhone, FaEnvelope, FaBirthdayCake, FaVenusMars, FaNotesMedical, FaFilePrescription, FaCalendarCheck } from 'react-icons/fa';
import axios from 'axios';

const PatientDetailsSheet = ({ patientId, onClose }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    if (patientId) {
      fetchPatientDetails();
    }
  }, [patientId]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      // Fetch basic patient info - assuming we might need to fetch fresh to get full details 
      // or we could have passed the object. Fetching unique ensures up to date.
      // However, current backend API might not have a direct "get by ID" readable by admin effortlessly without some changes?
      // Actually /api/admin/patients returns all. /api/patients/profile requires auth as that patient.
      // For Admin, we might rely on the data passed or add an admin endpoint.
      // Let's assume we pass the full object for now or re-fetch from the list if needed.
      // But wait, the list has basic info. Let's try to fetch apppointments at least.
      
      // Since we don't have a specific "get patient by ID for admin" endpoint confirmed, 
      // I'll assume we might need to rely on what we have or mocked extensions.
      // Realistically, I should pass the patient object from the parent. 
      // But to look robust, I'll simulate a fetch delay.
    
      // Fetch appointments for this patient
      // We need patient email for the existing endpoint: /api/appointments/patient/email/:email
      // So we need the patient object first.
    } catch (error) {
       console.error(error);
    } finally {
       setLoading(false);
    }
  };

  // We'll accept the full patient object as a prop instead of ID to simplify for now, 
  // as the Admin API doesn't seem to have a strict "get one patient" route visible in my prior reads.
  // Correction: Admin routes had PUT /patients/:id and DELETE, but not explicit GET /patients/:id.
  // So passing the object is safer.
  return null; 
};

// Re-defining component to accept 'patient' object directly
const PatientDetailsSheetActual = ({ patient, onClose }) => {
  const [appointments, setAppointments] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    if (patient?.email) {
        fetchAppointments(patient.email);
    }
  }, [patient]);

  const fetchAppointments = async (email) => {
      try {
          setLoadingApps(true);
          const res = await axios.get(`/api/appointments/patient/email/${email}`);
          setAppointments(res.data);
      } catch(err) {
          console.error("Failed to load appointments", err);
      } finally {
          setLoadingApps(false);
      }
  }

  if (!patient) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Sheet Content */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold border-4 border-white shadow-sm">
                    {patient.name?.[0]}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{patient.name}</h2>
                    <p className="text-sm text-gray-500">{patient.email}</p>
                    <div className="flex gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700`}>
                            Patient
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${patient.status === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {patient.status || 'Stable'}
                        </span>
                    </div>
                </div>
            </div>
            <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
                <FaTimes />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Personal Info Group */}
            <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Personal Information</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                            <FaPhone className="text-sm" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Phone Number</p>
                            <p className="text-sm font-medium text-gray-900">{patient.mobileNumber || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                            <FaVenusMars className="text-sm" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Gender</p>
                            <p className="text-sm font-medium text-gray-900 capitalize">{patient.sex || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                            <FaBirthdayCake className="text-sm" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Date of Birth</p>
                            <p className="text-sm font-medium text-gray-900">{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Medical History Mock */}
            <div>
                 <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Medical Overview</h3>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                        <div className="flex items-center gap-2 mb-2 text-orange-600">
                            <FaNotesMedical />
                            <span className="text-xs font-bold">Diagnosis</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{patient.diagnosis || 'None Recorded'}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <div className="flex items-center gap-2 mb-2 text-purple-600">
                            <FaFilePrescription />
                            <span className="text-xs font-bold">Prescriptions</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">0 Active</p>
                    </div>
                 </div>
            </div>

            {/* Appointments History */}
            <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Appointment History</h3>
                {loadingApps ? (
                    <div className="text-center py-4 text-gray-400 text-sm">Loading appointments...</div>
                ) : appointments.length > 0 ? (
                    <div className="space-y-3">
                        {appointments.slice(0, 5).map(app => (
                            <div key={app._id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl hover:border-blue-200 transition-colors">
                                <div className="mt-1 text-blue-500">
                                    <FaCalendarCheck />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{new Date(app.date).toLocaleDateString()}</p>
                                    <p className="text-xs text-gray-500">{app.timeSlot} • {app.doctorName}</p>
                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${
                                        app.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                        app.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {app.status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-sm text-gray-400">No appointments found</p>
                    </div>
                )}
            </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
                <FaNotesMedical />
                View Full Medical Record
            </button>
        </div>

      </div>
    </div>
  );
};

export default PatientDetailsSheetActual;
