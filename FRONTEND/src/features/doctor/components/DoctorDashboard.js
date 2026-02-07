import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { storage } from '../../../utils/storage';
import AppointmentsChart from '../../shared/components/charts/AppointmentsChart';
import PatientsChart from '../../shared/components/charts/PatientsChart';
import { 
  FaCalendarCheck, FaUserInjured, FaCalendarDay, 
  FaSearch, FaClipboardList, FaCalendarAlt, FaFileMedical 
} from 'react-icons/fa';

const DoctorDashboard = () => {
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [doctorEmail, setDoctorEmail] = useState('');
  const [activeTab, setActiveTab] = useState('trends'); // 'trends' or 'patients'

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const email = storage.getItem('doctorEmail');
        if (!email) return;
        setDoctorEmail(email);

        const appointmentRes = await axios.get(`/api/appointments/count/${email}`);
        setTotalAppointments(appointmentRes.data.count);

        const patientRes = await axios.get(`/api/prescriptions/count-patients?doctorEmail=${email}`);
        setTotalPatients(patientRes.data.count);

        const todayAppointmentsRes = await axios.get(`/api/appointments/today-appointments?doctorEmail=${email}`);
        setTodayAppointments(todayAppointmentsRes.data);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-4 animate-fade-in-up pb-6 h-[calc(100vh-100px)] flex flex-col">
      
      {/* 1. Header Stats Bar - Ultra Compact */}
      <div className="bg-[#ffffff] dark:bg-[#18181b] px-6 py-3 rounded-xl shadow-sm flex flex-wrap items-center justify-between shrink-0 gap-4 transition-all duration-200">
          <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Dashboard</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back, Dr. {doctorEmail.split('@')[0]}</p>
          </div>
          <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                      <FaCalendarCheck className="text-sm" />
                  </div>
                  <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Appts</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-none">{totalAppointments}</p>
                  </div>
              </div>
              <div className="hidden"></div>
              <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                      <FaUserInjured className="text-sm" />
                  </div>
                  <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Unique Patients</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-none">{totalPatients}</p>
                  </div>
              </div>
              <div className="hidden"></div>
              <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                      <FaCalendarDay className="text-sm" />
                  </div>
                  <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-none">{todayAppointments.length}</p>
                  </div>
              </div>
          </div>
      </div>

       {/* 1. Compact Actions List */}
       <div className="bg-[#ffffff] dark:bg-[#18181b] rounded-xl shadow-sm overflow-hidden shrink-0 transition-all duration-200">
            <div className="px-4 py-2 bg-gray-50/50 dark:bg-[#18181b]">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quick Actions</h3>
            </div>
            <div className="p-2 grid grid-cols-2 gap-2">
                 {[
                     { 
                         icon: <FaClipboardList />, 
                         label: 'Prescribe', 
                         path: '/doctor/add-prescription', 
                         btnClass: 'hover:bg-blue-50 dark:hover:bg-blue-900/10',
                         iconBgClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                     },
                     { 
                         icon: <FaCalendarAlt />, 
                         label: 'Schedule', 
                         path: '/doctor/appointments', 
                         btnClass: 'hover:bg-purple-50 dark:hover:bg-purple-900/10',
                         iconBgClass: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' 
                     },
                     { 
                         icon: <FaUserInjured />, 
                         label: 'Patients', 
                         path: '/doctor/patients', 
                         btnClass: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/10',
                         iconBgClass: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                     },
                     { 
                         icon: <FaFileMedical />, 
                         label: 'Records', 
                         path: '/doctor/prescriptions', 
                         btnClass: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/10',
                         iconBgClass: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                     },
                 ].map((action, idx) => (
                     <button 
                        key={idx}
                        onClick={() => window.location.href=action.path}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all text-left group ${action.btnClass}`}
                     >
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform ${action.iconBgClass}`}>
                             {action.icon}
                         </div>
                         <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{action.label}</span>
                     </button>
                 ))}
            </div>
       </div>

      {/* 3. Main Workspace - Split View (Schedule & Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
          
          {/* Left Column: Today's Schedule (Takes 2/3 space) */}
          <div className="lg:col-span-2 bg-[#ffffff] dark:bg-[#18181b] rounded-xl shadow-sm overflow-hidden flex flex-col h-full transition-all duration-200">
            <div className="px-5 py-3 flex justify-between items-center bg-gray-50/50 dark:bg-[#18181b] shrink-0">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                   <FaCalendarDay className="text-blue-500" /> Today's Schedule
              </h3>
              <div className="flex gap-2">
                  <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors"><FaSearch className="text-xs" /></button>
                  <button onClick={() => window.location.href='/doctor/appointments'} className="text-xs font-medium text-blue-500 hover:text-blue-600 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">View All</button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto custom-scrollbar p-0">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-[#27272a]/50 sticky top-0 z-10 backdrop-blur-sm shadow-sm">
                  <tr>
                    <th className="px-5 py-3 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">Time</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient Details</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">Status</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-transparent dark:divide-transparent">
                  {todayAppointments.length > 0 ? (
                    todayAppointments.map((apt) => (
                      <tr key={apt._id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group cursor-default">
                        <td className="px-5 py-3 text-xs text-gray-700 dark:text-gray-300 font-bold whitespace-nowrap font-mono">{apt.timeSlot}</td>
                        <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                    {apt.patientName.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{apt.patientName}</p>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-500 leading-tight">{apt.patientEmail}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 rounded-md dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Scheduled
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                            <button className="text-[11px] font-medium bg-[#ffffff] border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all dark:bg-[#27272a] dark:border-[#3f3f46] dark:text-gray-300 dark:hover:bg-[#3f3f46] shadow-sm">
                                Open
                            </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-2 opacity-60">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-[#27272a] rounded-full flex items-center justify-center">
                                <FaCalendarCheck className="text-xl text-gray-400" />
                            </div>
                            <p className="text-sm font-medium">No appointments remaining today</p>
                            <p className="text-xs">Enjoy your free time!</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Tabbed Insights Widget (Takes 1/3 space) */}
          <div className="lg:col-span-1 bg-[#ffffff] dark:bg-[#18181b] rounded-xl shadow-sm flex flex-col h-full overflow-hidden transition-all duration-200">
               {/* Tabs */}
               <div className="flex shrink-0">
                   <button 
                       onClick={() => setActiveTab('trends')}
                       className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'trends' ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                   >
                       Overview
                   </button>
                   <button 
                        onClick={() => setActiveTab('patients')}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'patients' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                   >
                       Patients
                   </button>
               </div>

               {/* Chart Content - Centered & Compact */}
               <div className="flex-1 p-4 flex items-center justify-center relative">
                   <div className="absolute inset-0 p-4 flex items-center justify-center">
                       {activeTab === 'trends' && (
                           <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
                               <div className="w-48 h-48 mb-2">
                                   <AppointmentsChart totalAppointments={totalAppointments} />
                               </div>
                               <p className="text-xs text-center text-gray-400 mt-2">Monthly Appointment Distribution</p>
                           </div>
                       )}
                       {activeTab === 'patients' && (
                           <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
                               <div className="w-full h-full">
                                   <PatientsChart totalPatients={totalPatients} />
                               </div>
                               <p className="text-xs text-center text-gray-400 mt-2">Patient Growth Metrics</p>
                           </div>
                       )}
                   </div>
               </div>
          </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
