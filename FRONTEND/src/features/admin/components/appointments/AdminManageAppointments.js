import React, { useState, useEffect } from 'react';
import api from '../../../../core/api/config';
import AdminLayout from '../layout/AdminLayout';
import { FaFilter, FaFileExport, FaSearch, FaChevronRight, FaCalendarCheck } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const AdminManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/appointments');
            setAppointments(res.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
          case 'completed': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
          case 'pending': return 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30';
          case 'cancelled': return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30';
          default: return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30';
        }
    };

    const getPaidStatusColor = (status) => {
        return status === 'paid' 
            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
    };

    const filteredAppointments = appointments.filter(a => 
        a.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Appointments" subtitle="Monitor and manage all patient appointments">
            <Helmet>
                <title>Appointment Management - HealingWave</title>
            </Helmet>

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Appointment Registry</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total {appointments.length} appointments recorded</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-semibold border border-emerald-100 dark:border-emerald-900/30">
                        <FaCalendarCheck />
                        Live Status
                    </div>
                </div>
            </div>

            <div className="admin-card bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30 dark:bg-zinc-800/10">
                    <div className="relative max-w-sm w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <FaSearch />
                        </span>
                        <input 
                            type="text" 
                            placeholder="Search by patient, doctor or department..." 
                            className="admin-search-input w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-gray-200 transition-all font-sans"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="admin-btn-secondary flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                            <FaFilter className="text-gray-400" />
                            Filter
                        </button>
                        <button className="admin-btn-secondary flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                            <FaFileExport className="text-gray-400" />
                            Export
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 dark:bg-zinc-800/10 border-b border-gray-100 dark:border-zinc-800">
                                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient Details</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Consultant</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Schedule</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="p-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="7" className="p-12 text-center text-gray-400">Loading appointments...</td></tr>
                            ) : filteredAppointments.length === 0 ? (
                                <tr><td colSpan="7" className="p-12 text-center text-gray-400">No appointments found.</td></tr>
                            ) : (
                                filteredAppointments.map((app) => (
                                    <tr key={app._id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors border-b border-gray-100 dark:border-zinc-800 group">
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-900 dark:text-gray-100">{app.patientName}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{app.patientEmail}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{app.doctorName}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{app.doctorEmail}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded text-xs font-medium text-gray-600 dark:text-gray-400">{app.department}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-gray-900 dark:text-gray-200">{new Date(app.date).toLocaleDateString()}</div>
                                            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">{app.timeSlot}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getPaidStatusColor(app.paidStatus)}`}>
                                                {app.paidStatus || 'unpaid'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <FaChevronRight className="text-gray-300 group-hover:text-blue-400 transition-colors text-xs" />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-zinc-800/10">
                    <div>Showing {filteredAppointments.length} entries</div>
                    <div className="flex gap-2">
                        <button className="admin-pagination-btn px-3 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50" disabled>Previous</button>
                        <button className="admin-pagination-btn px-3 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminManageAppointments;
