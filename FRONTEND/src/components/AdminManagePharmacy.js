import React, { useState, useEffect } from 'react';
import api from '../api/config';
import AdminLayout from './AdminLayout';
import { FaPlus, FaSearch, FaCapsules, FaSyncAlt, FaTrashAlt, FaImage } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const AdminManagePharmacy = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('inventory'); // 'inventory' or 'add'

    // Form state for adding medicine
    const [formData, setFormData] = useState({
        name: '', genericName: '', dosageForm: '', strength: '',
        price: '', strip: '', manufacturer: '', description: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const res = await api.get('/medicines');
            setMedicines(res.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, image: file }));
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleAddMedicine = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key]) data.append(key, formData[key]);
        });

        try {
            await api.post('/medicines/add', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus({ type: 'success', message: 'Medicine added successfully!' });
            setFormData({ name: '', genericName: '', dosageForm: '', strength: '', price: '', strip: '', manufacturer: '', description: '', image: null });
            setImagePreview(null);
            fetchMedicines();
            setTimeout(() => setViewMode('inventory'), 1500);
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to add medicine.' });
        }
    };

    const handleStockUpdate = async (id, currentVal) => {
        const newVal = prompt("Enter new stock count (Strips):", currentVal);
        if (newVal === null || newVal === "") return;
        
        try {
            await api.put(`/medicines/${id}`, { strip: parseInt(newVal) });
            fetchMedicines();
        } catch (error) {
            alert('Stock update failed.');
        }
    };

    const filteredMedicines = medicines.filter(m => 
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.genericName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Pharmacy Management" subtitle="Manage drug inventory and clinical supply">
            <Helmet>
                <title>Pharmacy Management - HealingWave</title>
            </Helmet>

            <div className="flex items-center justify-between mb-8">
                <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                    <button 
                        onClick={() => setViewMode('inventory')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                            viewMode === 'inventory' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        <FaCapsules /> Inventory Registry
                    </button>
                    <button 
                        onClick={() => setViewMode('add')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                            viewMode === 'add' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        <FaPlus /> Add New Drug
                    </button>
                </div>

                {viewMode === 'inventory' && (
                    <div className="relative max-w-sm w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <FaSearch />
                        </span>
                        <input 
                            type="text" 
                            placeholder="Search by brand or generic name..." 
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {viewMode === 'inventory' ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <tr>
                                    <th className="p-4">Drug Information</th>
                                    <th className="p-4">Composition</th>
                                    <th className="p-4">Pricing</th>
                                    <th className="p-4">Stock (Strips)</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-12 text-center text-gray-400">Loading supply chain data...</td></tr>
                                ) : filteredMedicines.length === 0 ? (
                                    <tr><td colSpan="5" className="p-12 text-center text-gray-400">Nomenclature not found.</td></tr>
                                ) : (
                                    filteredMedicines.map((m) => (
                                        <tr key={m._id} className="hover:bg-indigo-50/30 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                                        {m.image ? <img src={`${m.image}`} className="w-full h-full object-cover" /> : <FaCapsules className="text-gray-300" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{m.name}</div>
                                                        <div className="text-[10px] text-gray-400 uppercase tracking-tight">{m.manufacturer}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm font-medium text-gray-700">{m.genericName}</div>
                                                <div className="text-xs text-gray-500">{m.strength} | {m.dosageForm}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-gray-900">৳{m.price}</div>
                                                <div className="text-[10px] text-gray-500">MRPT per Strip</div>
                                            </td>
                                            <td className="p-4">
                                                <div className={`text-lg font-black ${m.strip < 10 ? 'text-red-600' : 'text-indigo-600'}`}>
                                                    {m.strip}
                                                </div>
                                                {m.strip < 10 && <div className="text-[10px] text-red-500 font-bold">REORDER SOON</div>}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button onClick={() => handleStockUpdate(m._id, m.strip)} className="p-2 hover:bg-indigo-100 rounded-lg text-indigo-600 title='Update Stock'">
                                                        <FaSyncAlt className="text-sm" />
                                                    </button>
                                                    <button className="p-2 hover:bg-red-100 rounded-lg text-red-600 title='Delete'">
                                                        <FaTrashAlt className="text-sm" />
                                                    </button>
                                                </div>
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
                    <form onSubmit={handleAddMedicine} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">DRUG NAME</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">GENERIC NAME</label>
                                <input name="genericName" value={formData.genericName} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">STRENGTH</label>
                                    <input placeholder="e.g. 500mg" name="strength" value={formData.strength} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">DOSAGE FORM</label>
                                    <input placeholder="e.g. Tablet" name="dosageForm" value={formData.dosageForm} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">MANUFACTURER</label>
                                <input name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg" required />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">UNIT PRICE (৳)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">INITIAL STOCK</label>
                                    <input type="number" name="strip" value={formData.strip} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">PRODUCT IMAGE</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-indigo-300 transition-all cursor-pointer relative overflow-hidden h-32">
                                    {imagePreview ? (
                                        <img src={imagePreview} className="absolute inset-0 w-full h-full object-contain" />
                                    ) : (
                                        <>
                                            <FaImage className="text-gray-300 text-2xl" />
                                            <span className="text-xs text-gray-400">Click to upload 1:1 image</span>
                                        </>
                                    )}
                                    <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">DESCRIPTION</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg h-24 resize-none"></textarea>
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            {status.message && (
                                <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-bold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                    {status.message}
                                </div>
                            )}
                            <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                                COMPLETE REGISTRATION
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminManagePharmacy;
