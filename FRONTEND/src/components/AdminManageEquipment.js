import React, { useState, useEffect } from 'react';
import api from '../api/config';
import AdminLayout from './AdminLayout';
import { FaTools, FaPlus, FaSearch, FaCheckCircle, FaExclamationCircle, FaWrench, FaTrashAlt } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const AdminManageEquipment = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'add'
    
    // Form state
    const [formData, setFormData] = useState({
        name: '', category: 'Diagnostic', serialNumber: '', 
        status: 'Functional', lastMaintenance: new Date().toISOString().split('T')[0],
        description: '', location: ''
    });

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        try {
            const res = await api.get('/equipment');
            setEquipment(res.data);
        } catch (error) {
            console.error('Error fetching equipment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await api.post('/equipment/add', formData);
            setFormData({
                name: '', category: 'Diagnostic', serialNumber: '', 
                status: 'Functional', lastMaintenance: new Date().toISOString().split('T')[0],
                description: '', location: ''
            });
            fetchEquipment();
            setViewMode('list');
        } catch (error) {
            alert('Failed to add equipment.');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.put(`/equipment/update/${id}`, { status: newStatus });
            fetchEquipment();
        } catch (error) {
            alert('Status update failed.');
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Functional': return <FaCheckCircle className="text-emerald-500" />;
            case 'Maintenance': return <FaWrench className="text-amber-500" />;
            case 'Under Repair': return <FaExclamationCircle className="text-red-500" />;
            default: return <FaTools className="text-gray-400" />;
        }
    };

    const filteredEquipment = equipment.filter(e => 
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Equipment Management" subtitle="Track hospital assets and maintenance status">
            <Helmet>
                <title>Equipment Management - HealingWave</title>
            </Helmet>

            <div className="flex items-center justify-between mb-8">
                <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                            viewMode === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        <FaTools /> Asset Registry
                    </button>
                    <button 
                        onClick={() => setViewMode('add')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                            viewMode === 'add' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        <FaPlus /> Register New
                    </button>
                </div>

                {viewMode === 'list' && (
                    <div className="relative max-w-sm w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <FaSearch />
                        </span>
                        <input 
                            type="text" 
                            placeholder="Search by name or serial..." 
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {viewMode === 'list' ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <tr>
                                    <th className="p-4">Equipment Info</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Serial Number</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Maintenance</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="6" className="p-12 text-center text-gray-400">Syncing asset database...</td></tr>
                                ) : filteredEquipment.length === 0 ? (
                                    <tr><td colSpan="6" className="p-12 text-center text-gray-400">No equipment found.</td></tr>
                                ) : (
                                    filteredEquipment.map((e) => (
                                        <tr key={e._id} className="hover:bg-blue-50/20 transition-colors group">
                                            <td className="p-4">
                                                <div className="font-bold text-gray-900">{e.name}</div>
                                                <div className="text-[10px] text-gray-400 uppercase">{e.location || 'Central Facility'}</div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">{e.category}</td>
                                            <td className="p-4 text-sm font-mono text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded whitespace-nowrap">{e.serialNumber}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(e.status)}
                                                    <span className="text-sm font-semibold text-gray-700">{e.status}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-xs text-gray-500">
                                                {new Date(e.lastMaintenance).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <select 
                                                    value={e.status}
                                                    onChange={(opt) => handleStatusUpdate(e._id, opt.target.value)}
                                                    className="p-1 text-[10px] border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                                >
                                                    <option value="Functional">Functional</option>
                                                    <option value="Maintenance">Maintenance</option>
                                                    <option value="Under Repair">Under Repair</option>
                                                    <option value="Decommissioned">Decommissioned</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-4xl mx-auto">
                    <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 tracking-widest uppercase">Asset Name</label>
                                <input 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="e.g. MRI Scanner"
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20" 
                                    required 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 tracking-widest uppercase">Category</label>
                                    <select 
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                                    >
                                        <option>Diagnostic</option>
                                        <option>Therapeutic</option>
                                        <option>Life Support</option>
                                        <option>Monitoring</option>
                                        <option>Laboratory</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 tracking-widest uppercase">Serial No.</label>
                                    <input 
                                        value={formData.serialNumber} 
                                        onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg" 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 tracking-widest uppercase">Facility Location</label>
                                <input 
                                    value={formData.location} 
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    placeholder="Building/Floor/Room"
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 tracking-widest uppercase">Maintenance Date</label>
                                <input 
                                    type="date"
                                    value={formData.lastMaintenance} 
                                    onChange={(e) => setFormData({...formData, lastMaintenance: e.target.value})}
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg" 
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                             <label className="block text-xs font-bold text-gray-500 mb-1 tracking-widest uppercase">Technical Specifications</label>
                             <textarea 
                                value={formData.description} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg h-24 resize-none"
                             ></textarea>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all">
                                REGISTER MEDICAL ASSET
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminManageEquipment;
