import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import StatsCard from './StatsCard';
import { FaUsers, FaUserCheck, FaNotesMedical, FaExclamationTriangle, FaFilter, FaFileExport, FaEllipsisH, FaThList, FaThLarge, FaCog } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import './styles/AdminStats.css'; // Keep for any custom overrides if needed, though we rely mostly on Tailwind now.

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0
  });
  const [patients, setPatients] = useState([]); // Fetch actual patients for table
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      // Fetch Stats
      const statsRes = await axios.get('http://localhost:1002/api/admin/stats');
      setStats(statsRes.data);

      // Fetch Patients for table
      const patientsRes = await axios.get('http://localhost:1002/api/admin/patients');
      // Mocking extra data for visual demo (Status, Diagnosis)
      const enhancedPatients = patientsRes.data.map(p => ({
        ...p,
        diagnosis: ['Hypertension', 'Diabetes', 'Healthy', 'Flu'][Math.floor(Math.random() * 4)],
        status: ['Stable', 'Critical', 'Mild'][Math.floor(Math.random() * 3)],
        lastAppointment: '2025-10-04' // Mock
      }));
      setPatients(enhancedPatients);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock breakdown based on Total Patients
  const mildPatients = Math.floor(stats.patients * 0.5) || 0;
  const stablePatients = Math.floor(stats.patients * 0.4) || 0;
  const criticalPatients = stats.patients - mildPatients - stablePatients || 0;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Stable': return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Mild': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Critical': return 'bg-red-50 text-red-600 border border-red-100';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Medicare Admin Dashboard</title>
      </Helmet>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
            title="Total patients" 
            value={stats.patients} 
            icon={<FaUsers />} 
        />
        <StatsCard 
            title="Mild patients" 
            value={mildPatients} 
            type="success" // Emerald
            icon={<FaUserCheck />} 
        />
         <StatsCard 
            title="Stable patients" 
            value={stablePatients} 
            type="info" // Blue
            icon={<FaNotesMedical />} 
        />
         <StatsCard 
            title="Critical patients" 
            value={criticalPatients} 
            type="critical" // Red
            icon={<FaExclamationTriangle />} 
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaFilter />
                </span>
                <input 
                    type="text" 
                    placeholder="Search patient..." 
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>

            <div className="flex items-center gap-2">
                 <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    <FaFilter className="text-gray-400" />
                    Filter
                </button>
                 <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    All Status
                    <FaCog className="text-gray-400 text-xs" />
                </button>
                 <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200">
                    <FaFileExport />
                    Export
                </button>
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                 <button className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-lg">
                    <FaThList />
                </button>
                 <button className="p-2 text-gray-400 hover:text-gray-600">
                    <FaThLarge />
                </button>
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="p-4 w-4">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        </th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Appointment</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date of Birth</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Diagnosis</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="p-4 w-10"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                         <tr><td colSpan="8" className="p-8 text-center text-gray-500">Loading data...</td></tr>
                    ) : patients.map((patient) => (
                        <tr key={patient._id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="p-4">
                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                        {patient.firstName ? patient.firstName[0] : 'U'}
                                    </div>
                                    <div className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</div>
                                </div>
                            </td>
                            <td className="p-4 text-sm text-gray-600">{patient.lastAppointment}</td>
                            <td className="p-4 text-sm text-gray-600">{patient.dateOfBirth}</td>
                            <td className="p-4 text-sm text-gray-600">{patient.sex}</td>
                            <td className="p-4 text-sm text-gray-900 font-medium">{patient.diagnosis}</td>
                            <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                                    {patient.status}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all">
                                    <FaEllipsisH />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        {/* Pagination (Mock) */}
        {!loading && (
             <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                <div>Showing 1-{patients.length} of {patients.length} patients</div>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Previous</button>
                    <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
                </div>
            </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
