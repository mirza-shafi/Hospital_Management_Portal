import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import PatientDetailsSheet from './PatientDetailsSheet';
import { FaFilter, FaFileExport, FaCog, FaEllipsisH, FaSearch, FaUserPlus, FaChevronRight } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const AdminManageUsers = () => {
    // We'll focus on Patients for this "Patient" view as per sidebar.
    // (If "Staff" link existed, we'd use a separate component or toggle, but sidebar says "Patient")
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await axios.get('http://localhost:1002/api/admin/patients');
            // Mocking enhanced data to match the UI requirements
            const enhancedData = res.data.map(p => ({
                ...p,
                diagnosis: ['Diabetes', 'Hypertension', 'Asthma', 'Arrhythmia', 'Healthy'][Math.floor(Math.random() * 5)],
                status: ['Stable', 'Critical', 'Mild'][Math.floor(Math.random() * 3)],
                lastAppointment: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString()
            }));
            setPatients(enhancedData);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
          case 'Stable': return 'bg-blue-50 text-blue-600 border border-blue-100';
          case 'Mild': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
          case 'Critical': return 'bg-red-50 text-red-600 border border-red-100';
          default: return 'bg-gray-50 text-gray-600';
        }
    };

    const filteredPatients = patients.filter(p => 
        (p.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AdminLayout>
            <Helmet>
                <title>Patient Management - Medicare</title>
            </Helmet>

            {/* Header / Actions Row */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Patient List</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and view all registered patients</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all">
                    <FaUserPlus />
                    Add New Patient
                </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative max-w-sm w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <FaSearch />
                        </span>
                        <input 
                            type="text" 
                            placeholder="Search patients..." 
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                            <FaFilter className="text-gray-400" />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            <FaFileExport className="text-gray-400" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                <th className="p-4 w-10">
                                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                </th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient Name</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Visit</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Diagnosis</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="p-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="p-12 text-center text-gray-400">Loading patients...</td>
                                </tr>
                            ) : filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="p-12 text-center text-gray-400">No patients found matching your search.</td>
                                </tr>
                            ) : (
                                filteredPatients.map((patient) => (
                                    <tr 
                                        key={patient._id} 
                                        onClick={() => setSelectedPatient(patient)}
                                        className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                                    >
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100">
                                                    {patient.firstName ? patient.firstName[0] : 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{patient.firstName} {patient.lastName}</div>
                                                    <div className="text-xs text-gray-500">ID: #{patient._id.slice(-6).toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-gray-900">{patient.email}</div>
                                            <div className="text-xs text-gray-500">{patient.mobileNumber}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">{patient.lastAppointment}</td>
                                        <td className="p-4">
                                            <span className="text-sm text-gray-700 capitalize px-2 py-1 bg-gray-100 rounded text-xs font-medium">{patient.sex}</span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-900 font-medium">{patient.diagnosis}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                                                {patient.status}
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

                {/* Footer Pagination */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
                    <div>Showing {filteredPatients.length} entries</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>

            {/* Details Sheet Overlay */}
            {selectedPatient && (
                <PatientDetailsSheet 
                    patient={selectedPatient} 
                    onClose={() => setSelectedPatient(null)} 
                />
            )}
        </AdminLayout>
    );
};

export default AdminManageUsers;
