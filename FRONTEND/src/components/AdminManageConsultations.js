import React, { useState, useEffect } from 'react';
import api from '../api/config';
import AdminLayout from './AdminLayout';
import { FaSearch, FaFilePrescription, FaUserMd, FaUser, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const AdminManageConsultations = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            const res = await api.get('/prescriptions/all');
            setPrescriptions(res.data);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPrescriptions = prescriptions.filter(p => 
        p.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Consultations" subtitle="Monitor patient prescriptions and clinical notes">
            <Helmet>
                <title>Consultation Records - HealingWave</title>
            </Helmet>

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Clinical Registry</h1>
                    <p className="text-sm text-gray-500 mt-1">Found {prescriptions.length} historical consultation records</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-12">
                <div className="p-4 border-b border-gray-100 bg-gray-50/30">
                    <div className="relative max-w-md w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <FaSearch />
                        </span>
                        <input 
                            type="text" 
                            placeholder="Search by patient or doctor..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                                <th className="p-4">Consultation Date</th>
                                <th className="p-4">Patient Information</th>
                                <th className="p-4">Attending Doctor</th>
                                <th className="p-4">Clinical Notes</th>
                                <th className="p-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="5" className="p-12 text-center text-gray-400">Loading consultation records...</td></tr>
                            ) : filteredPrescriptions.length === 0 ? (
                                <tr><td colSpan="5" className="p-12 text-center text-gray-400">No records found.</td></tr>
                            ) : (
                                filteredPrescriptions.map((p) => (
                                    <tr key={p._id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <FaCalendarAlt className="text-gray-400" />
                                                {new Date(p.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                    <FaUser className="text-xs" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{p.patientName}</div>
                                                    <div className="text-xs text-gray-500">{p.patientEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <FaUserMd className="text-blue-500" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Dr. {p.doctorName}</div>
                                                    <div className="text-[10px] text-gray-400 uppercase tracking-wide">{p.doctorEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="max-w-xs truncate text-sm text-gray-600 italic">
                                                "{p.prescriptionText}"
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <FaChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminManageConsultations;
