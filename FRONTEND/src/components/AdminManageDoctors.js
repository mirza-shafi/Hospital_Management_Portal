import React, { useState, useEffect } from 'react';
import api from '../api/config';
import AdminLayout from './AdminLayout';
import DoctorDetailsSheet from './DoctorDetailsSheet';
import { FaFilter, FaFileExport, FaCog, FaEllipsisH, FaSearch, FaUserPlus, FaChevronRight, FaUserMd } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const AdminManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newDoctor, setNewDoctor] = useState({ firstName: '', lastName: '', email: '', sex: 'Male', dateOfBirth: '', mobileNumber: '', password: 'password123' });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/admin/doctors');
            // Mocking enhanced data to match the UI requirements
            const enhancedData = res.data.map(d => ({
                ...d,
                specialty: d.specialty || ['Cardiology', 'Neurology', 'Pediatrics', 'General Surgery'][Math.floor(Math.random() * 4)],
                department: d.department || 'General',
                status: ['Available', 'On Leave', 'Busy'][Math.floor(Math.random() * 3)],
                rating: (Math.random() * 2 + 3).toFixed(1) // Mock rating 3.0 - 5.0
            }));
            setDoctors(enhancedData);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/admin/doctors', newDoctor);
            setShowAddForm(false);
            setNewDoctor({ firstName: '', lastName: '', email: '', sex: 'Male', dateOfBirth: '', mobileNumber: '', password: 'password123' });
            await fetchDoctors();
        } catch (error) {
            console.error('Failed to add doctor:', error);
            alert('Failed to register doctor. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
          case 'Available': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
          case 'On Leave': return 'bg-gray-50 text-gray-600 border border-gray-100';
          case 'Busy': return 'bg-orange-50 text-orange-600 border border-orange-100';
          default: return 'bg-blue-50 text-blue-600';
        }
    };

    const filteredDoctors = doctors.filter(d => 
        (d.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.specialty?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AdminLayout title="Doctors" subtitle="Manage hospital staff and specialists">
            <Helmet>
                <title>Doctor Management - HealingWave</title>
            </Helmet>

            {/* Header / Actions Row */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Doctor List</h1>
                    <p className="text-sm text-gray-500 mt-1">View and manage all registered doctors</p>
                </div>
                <button 
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all font-sans"
                >
                    <FaUserPlus />
                    Add New Doctor
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
                            placeholder="Search doctors..." 
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
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor Name</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Specialty</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="p-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="p-12 text-center text-gray-400">Loading doctors...</td>
                                </tr>
                            ) : filteredDoctors.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="p-12 text-center text-gray-400">No doctors found matching your search.</td>
                                </tr>
                            ) : (
                                filteredDoctors.map((doctor) => (
                                    <tr 
                                        key={doctor._id} 
                                        onClick={() => setSelectedDoctor(doctor)}
                                        className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                                    >
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100 shadow-sm">
                                                    {doctor.firstName ? doctor.firstName[0] : 'D'}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">Dr. {doctor.firstName} {doctor.lastName}</div>
                                                    <div className="text-xs text-gray-500">ID: #{doctor._id.slice(-6).toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-gray-900">{doctor.email}</div>
                                            <div className="text-xs text-gray-500">{doctor.mobileNumber}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-900 font-medium">{doctor.specialty}</td>
                                        <td className="p-4 text-sm text-gray-600">{doctor.department}</td>
                                        <td className="p-4 text-sm font-medium text-gray-900">
                                            <span className="text-yellow-400 mr-1">★</span>{doctor.rating}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(doctor.status)}`}>
                                                {doctor.status}
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
                    <div>Showing {filteredDoctors.length} entries</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>

            {/* Add Doctor Modal */}
            {showAddForm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddForm(false)}></div>
                    <div className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Register New Doctor</h2>
                        <form onSubmit={handleAddDoctor} className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">First Name</label>
                                <input required className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10" onChange={e => setNewDoctor({...newDoctor, firstName: e.target.value})} />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Last Name</label>
                                <input required className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10" onChange={e => setNewDoctor({...newDoctor, lastName: e.target.value})} />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
                                <input required type="email" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10" onChange={e => setNewDoctor({...newDoctor, email: e.target.value})} />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Gender</label>
                                <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10" onChange={e => setNewDoctor({...newDoctor, sex: e.target.value})}>
                                    <option>Male</option><option>Female</option><option>Other</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phone</label>
                                <input required className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10" onChange={e => setNewDoctor({...newDoctor, mobileNumber: e.target.value})} />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Date of Birth</label>
                                <input required type="date" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10" onChange={e => setNewDoctor({...newDoctor, dateOfBirth: e.target.value})} />
                            </div>
                            <div className="col-span-2 flex gap-3 mt-4">
                                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-100">Create Staff Account</button>
                                <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-3 bg-gray-100 text-gray-500 font-bold rounded-xl">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Details Sheet Overlay */}
            {selectedDoctor && (
                <DoctorDetailsSheet 
                    doctor={selectedDoctor} 
                    onClose={() => setSelectedDoctor(null)} 
                />
            )}
        </AdminLayout>
    );
};

export default AdminManageDoctors;
