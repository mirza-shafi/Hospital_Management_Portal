import React, { useEffect, useState } from 'react';
import { FaTimes, FaPhone, FaEnvelope, FaUserMd, FaStethoscope, FaHospital, FaStar, FaCalendarCheck } from 'react-icons/fa';
import axios from 'axios';

const DoctorDetailsSheet = ({ doctor, onClose }) => {
  const [appointments, setAppointments] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Mocking fetching doctor's schedule or appointments if needed.
  // For now, we'll just show mock stats or fetch if a real endpoint exists.
  // Assuming strict parity with Patient view, we show their "history" or "schedule".

  useEffect(() => {
    if (doctor?.email) {
        // fetchDoctorSchedule(doctor.email); // Placeholder if API existed
    }
  }, [doctor]);

  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Sheet Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-100 dark:border-zinc-800">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-start justify-between bg-gray-50/50 dark:bg-zinc-800/20">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold border-4 border-white dark:border-zinc-800 shadow-sm">
                    {doctor.firstName?.[0]}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dr. {doctor.firstName} {doctor.lastName}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{doctor.specialty || 'General Physician'}</p>
                    <div className="flex gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400`}>
                            {doctor.department || 'General'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${doctor.status === 'Available' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-400'}`}>
                            {doctor.status || 'Available'}
                        </span>
                    </div>
                </div>
            </div>
            <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
                <FaTimes />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Personal Info Group */}
            <div>
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Contact Information</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-800">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-gray-400 shadow-sm border dark:border-zinc-700">
                            <FaPhone className="text-sm" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">Phone Number</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{doctor.mobileNumber || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-800">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-gray-400 shadow-sm border dark:border-zinc-700">
                            <FaEnvelope className="text-sm" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">Email Address</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{doctor.email || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Professional Info */}
            <div>
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Professional Details</h3>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                            <FaStethoscope />
                            <span className="text-xs font-bold">Specialty</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{doctor.specialty || 'General'}</p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-900/30">
                        <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400">
                            <FaHospital />
                            <span className="text-xs font-bold">Department</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{doctor.department || 'OPD'}</p>
                    </div>
                 </div>
            </div>

            {/* Stats / Performance Mock */}
            <div>
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Performance Overview</h3>
                <div className="p-4 border border-gray-100 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Patient Satisfaction</span>
                        <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                            <FaStar /> {doctor.rating || '4.5'}
                        </div>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2 mb-1">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${((doctor.rating || 4.5) / 5) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-right">Based on 120 reviews</p>
                </div>
            </div>

            {/* Activity Mock */}
             <div>
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Today's Schedule</h3>
                <div className="space-y-3">
                      {['09:00 AM - Consultation', '11:30 AM - Surgery', '02:00 PM - Rounds'].map((slot, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 dark:border-zinc-800 rounded-lg">
                             <div className="text-blue-500 dark:text-blue-400"><FaCalendarCheck /></div>
                             <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{slot}</span>
                        </div>
                      ))}
                </div>
            </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/20">
            <button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center gap-2">
                <FaUserMd />
                View Full Profile
            </button>
        </div>

      </div>
    </div>
  );
};

export default DoctorDetailsSheet;
