import React, { useState, useEffect } from 'react';
import api from '../api/config';
import AdminLayout from './AdminLayout';
import { FaSearch, FaFilter, FaFileExport, FaBed, FaHotel, FaChevronRight } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const AdminManageClinic = () => {
    const [wards, setWards] = useState([]);
    const [cabins, setCabins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('wards');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [wardRes, cabinRes] = await Promise.all([
                api.get('/wardBooking/all-bills'),
                api.get('/cabinBooking/all-bills')
            ]);
            setWards(wardRes.data);
            setCabins(cabinRes.data);
        } catch (error) {
            console.error('Error fetching clinic data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPaidStatusStyle = (paid) => {
        return paid 
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' 
            : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
    };

    const currentData = activeTab === 'wards' ? wards : cabins;

    const filteredData = currentData.filter(item => 
        item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activeTab === 'wards' ? item.wardNo : item.cabinNo)?.toString().includes(searchTerm)
    );

    return (
        <AdminLayout title="Clinic Management" subtitle="Manage hospital wards and private cabins">
            <Helmet>
                <title>Clinic Management - HealingWave</title>
            </Helmet>

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex bg-white dark:bg-zinc-900 p-1 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm w-fit">
                    <button 
                        onClick={() => setActiveTab('wards')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                            activeTab === 'wards' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                        }`}
                    >
                        <FaBed /> Wards
                    </button>
                    <button 
                        onClick={() => setActiveTab('cabins')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                            activeTab === 'cabins' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                        }`}
                    >
                        <FaHotel /> Private Cabins
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-4 py-2.5 rounded-xl font-bold border border-emerald-100 dark:border-emerald-900/30 text-sm">
                        <FaFileExport /> Export Registry
                    </button>
                </div>
            </div>

            <div className="admin-card bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-800/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative max-w-md w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <FaSearch />
                        </span>
                        <input 
                            type="text" 
                            placeholder={`Search ${activeTab === 'wards' ? 'ward' : 'cabin'} bookings...`}
                            className="admin-search-input w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-gray-200 font-sans"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/80 dark:bg-zinc-800/10 border-b border-gray-100 dark:border-zinc-800">
                                <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient Details</th>
                                <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Room Info</th>
                                <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stay Duration</th>
                                <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Bill</th>
                                <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="p-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {loading ? (
                                <tr><td colSpan="6" className="p-12 text-center text-gray-400">Syncing accommodation data...</td></tr>
                            ) : filteredData.length === 0 ? (
                                <tr><td colSpan="6" className="p-12 text-center text-gray-400">No active bookings found.</td></tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item._id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors border-b border-gray-100 dark:border-zinc-800 group cursor-pointer">
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-900 dark:text-gray-100">{item.patientName}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {activeTab === 'wards' ? `Ward #${item.wardNo}` : `Cabin #${item.cabinNo}`}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.wardType || item.cabinType} | Floor {item.floor}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-gray-900 dark:text-gray-200">{item.totalDays} Days</div>
                                            <div className="text-[10px] text-gray-400 dark:text-gray-500">Booked: {new Date(item.bookedDate).toLocaleDateString()}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900 dark:text-gray-100">৳{item.totalBill}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getPaidStatusStyle(item.paid)}`}>
                                                {item.paid ? 'Paid' : 'Unpaid'}
                                            </span>
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

export default AdminManageClinic;
