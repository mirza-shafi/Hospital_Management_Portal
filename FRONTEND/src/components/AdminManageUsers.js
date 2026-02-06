import React, { useState, useEffect } from 'react';
import api from '../api/config';
import AdminLayout from './AdminLayout';
import PatientDetailsSheet from './PatientDetailsSheet';
import SuccessNotification from './SuccessNotification';
import { FaFilter, FaFileExport, FaCog, FaEllipsisH, FaSearch, FaUserPlus, FaChevronRight, FaTimes } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const AdminManageUsers = () => {
    // We'll focus on Patients for this "Patient" view as per sidebar.
    // (If "Staff" link existed, we'd use a separate component or toggle, but sidebar says "Patient")
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [successPatientName, setSuccessPatientName] = useState('');
    const [newPatient, setNewPatient] = useState({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        sex: 'Male', 
        dateOfBirth: '', 
        mobileNumber: '', 
        password: 'password123',
        diagnosis: 'Checkup',
        status: 'Stable'
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await api.get('/admin/patients');
            setPatients(res.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPatient = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const fullName = `${newPatient.firstName} ${newPatient.lastName}`;
            if (editingPatient) {
                await api.put(`/admin/patients/${editingPatient._id}`, newPatient);
                setSuccessMessage('Patient updated successfully!');
                setSuccessPatientName(fullName);
            } else {
                await api.post('/admin/patients', newPatient);
                setSuccessMessage('Patient created successfully!');
                setSuccessPatientName(fullName);
            }
            setShowSuccessNotification(true);
            setShowAddForm(false);
            setEditingPatient(null);
            setNewPatient({ 
                firstName: '', 
                lastName: '', 
                email: '', 
                sex: 'Male', 
                dateOfBirth: '', 
                mobileNumber: '', 
                password: 'password123',
                diagnosis: 'Checkup',
                status: 'Stable'
            });
            await fetchPatients();
        } catch (error) {
            console.error('Failed to save patient:', error);
            alert('Failed to save patient data. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (patient, e) => {
        e.stopPropagation();
        setEditingPatient(patient);
        const [firstName, ...lastNameParts] = (patient.name || '').split(' ');
        setNewPatient({
            firstName: firstName || '',
            lastName: lastNameParts.join(' ') || '',
            email: patient.email || '',
            sex: patient.sex || 'Male',
            dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
            mobileNumber: patient.mobileNumber || '',
            password: 'password123',
            diagnosis: patient.diagnosis || 'Checkup',
            status: patient.status || 'Stable'
        });
        setShowAddForm(true);
    };

    const getStatusColor = (status) => {
        switch(status) {
          case 'Stable': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30';
          case 'Mild': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
          case 'Critical': return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30';
          default: return 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-400';
        }
    };

    const filteredPatients = patients.filter(p => 
        (p.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AdminLayout title="Patient" subtitle="Manage and view all registered patients">
            <Helmet>
                <title>Patient Management - HealingWave</title>
            </Helmet>

            {/* Header / Actions Row */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Patient List</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and view all registered patients</p>
                </div>
                <button 
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 dark:shadow-none transition-all font-sans"
                >
                    <FaUserPlus />
                    Add New Patient
                </button>
            </div>

            {/* Main Content Card */}
            <div className="admin-card bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30 dark:bg-zinc-800/10">
                    <div className="relative max-w-sm w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <FaSearch />
                        </span>
                        <input 
                            type="text" 
                            placeholder="Search patients..." 
                            className="admin-search-input w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-gray-200 transition-all"
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
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 dark:bg-zinc-800/20 border-b border-gray-100 dark:border-zinc-800">
                                <th className="p-4 w-10">
                                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                </th>
                                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient Name</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Visit</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gender</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Diagnosis</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="p-4 w-10"></th>
                            </tr>
                        </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
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
                                        className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group border-b border-gray-100 dark:border-zinc-800"
                                    >
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-100 dark:border-blue-900/30">
                                                    {patient.name ? patient.name[0] : 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 dark:text-gray-100">{patient.name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">ID: #{patient._id.slice(-6).toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-gray-900 dark:text-gray-200">{patient.email}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{patient.mobileNumber}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{patient.lastVisit}</td>
                                        <td className="p-4">
                                            <span className="text-sm text-gray-700 dark:text-gray-300 capitalize px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded text-xs font-medium">{patient.sex}</span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-900 dark:text-gray-100 font-medium">{patient.diagnosis}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                                                {patient.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center gap-2 justify-end">
                                                <button 
                                                    onClick={(e) => handleEditClick(patient, e)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                                                    title="Edit Patient"
                                                >
                                                    <FaCog size={14} />
                                                </button>
                                                <FaChevronRight className="text-gray-300 group-hover:text-blue-400 transition-colors text-xs" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination */}
                <div className="p-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-zinc-800/10">
                    <div>Showing {filteredPatients.length} entries</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>

            {/* Add Patient Modal */}
            {showAddForm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm" onClick={() => setShowAddForm(false)}></div>
                    <div className="relative bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{editingPatient ? 'Edit Patient Details' : 'Register New Patient'}</h2>
                            <button onClick={() => { setShowAddForm(false); setEditingPatient(null); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleAddPatient} className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">First Name</label>
                                <input required className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 dark:text-gray-100" value={newPatient.firstName} onChange={e => setNewPatient({...newPatient, firstName: e.target.value})} />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Last Name</label>
                                <input required className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 dark:text-gray-100" value={newPatient.lastName} onChange={e => setNewPatient({...newPatient, lastName: e.target.value})} />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
                                <input required type="email" className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 dark:text-gray-100" value={newPatient.email} onChange={e => setNewPatient({...newPatient, email: e.target.value})} />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Gender</label>
                                <select className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 dark:text-gray-100" value={newPatient.sex} onChange={e => setNewPatient({...newPatient, sex: e.target.value})}>
                                    <option>Male</option><option>Female</option><option>Other</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phone</label>
                                <input required className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 dark:text-gray-100" value={newPatient.mobileNumber} onChange={e => setNewPatient({...newPatient, mobileNumber: e.target.value})} />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Date of Birth</label>
                                <input required type="date" className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 dark:text-gray-100" value={newPatient.dateOfBirth} onChange={e => setNewPatient({...newPatient, dateOfBirth: e.target.value})} />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Initial Diagnosis</label>
                                <input 
                                    list="diagnosis-options"
                                    className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 dark:text-gray-100" 
                                    placeholder="e.g. Fever" 
                                    value={newPatient.diagnosis}
                                    onChange={e => setNewPatient({...newPatient, diagnosis: e.target.value})} 
                                />
                                <datalist id="diagnosis-options">
                                    <option value="Fever" />
                                    <option value="Cold / Flu" />
                                    <option value="Hypertension" />
                                    <option value="Diabetes" />
                                    <option value="Asthma" />
                                    <option value="Injury" />
                                    <option value="General Checkup" />
                                </datalist>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Admission Status</label>
                                <select className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 dark:text-gray-100" value={newPatient.status} onChange={e => setNewPatient({...newPatient, status: e.target.value})}>
                                    <option>Stable</option>
                                    <option>Mild</option>
                                    <option>Critical</option>
                                </select>
                            </div>
                            {!editingPatient && (
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Default Password</label>
                                    <input disabled className="w-full p-3 bg-gray-100 dark:bg-zinc-800/80 border border-gray-100 dark:border-zinc-700 rounded-xl outline-none dark:text-gray-400 italic" value="password123" />
                                </div>
                            )}
                            <div className="col-span-2 flex gap-3 mt-4">
                                <button type="submit" className="flex-1 bg-blue-600 dark:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-100 dark:shadow-none">
                                    {editingPatient ? 'Update Patient' : 'Create Patient'}
                                </button>
                                <button type="button" onClick={() => { setShowAddForm(false); setEditingPatient(null); }} className="px-6 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 font-bold rounded-xl transition-all">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Details Sheet Overlay */}
            {selectedPatient && (
                <PatientDetailsSheet 
                    patient={selectedPatient} 
                    onClose={() => setSelectedPatient(null)} 
                />
            )}

            {/* Success Notification Popup */}
            <SuccessNotification 
                show={showSuccessNotification}
                message={successMessage}
                patientName={successPatientName}
                onClose={() => setShowSuccessNotification(false)}
                duration={4000}
            />
        </AdminLayout>
    );
};

export default AdminManageUsers;
