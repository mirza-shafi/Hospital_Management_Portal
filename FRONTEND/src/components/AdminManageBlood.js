import React, { useState, useEffect } from 'react';
import api from '../api/config';
import AdminLayout from './AdminLayout';
import { FaSearch, FaTint, FaUserFriends, FaClipboardList, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const AdminManageBlood = () => {
    const [donors, setDonors] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('donors');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBloodData();
    }, []);

    const fetchBloodData = async () => {
        try {
            const [donorRes, recipientRes, availabilityRes] = await Promise.all([
                api.get('/bloodDonor/details'),
                api.get('/bloodRecipient'),
                api.get('/bloodAvailability')
            ]);
            setDonors(donorRes.data);
            setRecipients(recipientRes.data);
            setAvailability(availabilityRes.data);
        } catch (error) {
            console.error('Error fetching blood management data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDonors = donors.filter(d => 
        `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredRecipients = recipients.filter(r => 
        `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.bloodNeeded.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Blood Bank Management" subtitle="Monitor donors, requests, and current stock">
            <Helmet>
                <title>Blood Management - HealingWave</title>
            </Helmet>

            {/* Tab Navigation */}
            <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm w-fit mb-8">
                <button 
                    onClick={() => { setActiveTab('donors'); setSearchTerm(''); }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                        activeTab === 'donors' ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    <FaUserFriends /> Donors
                </button>
                <button 
                    onClick={() => { setActiveTab('recipients'); setSearchTerm(''); }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                        activeTab === 'recipients' ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    <FaClipboardList /> Recipients
                </button>
                <button 
                    onClick={() => { setActiveTab('availability'); setSearchTerm(''); }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all ${
                        activeTab === 'availability' ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    <FaTint /> Availability
                </button>
            </div>

            {/* Search Bar (except for availability tab) */}
            {activeTab !== 'availability' && (
                <div className="mb-6 relative max-w-md">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaSearch />
                    </span>
                    <input 
                        type="text" 
                        placeholder={`Search ${activeTab === 'donors' ? 'donors' : 'recipients'} by name or blood group...`}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    {activeTab === 'donors' && (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Donor Name</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Blood Group</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Contact</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Email</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="4" className="p-12 text-center text-gray-400">Loading donor list...</td></tr>
                                ) : filteredDonors.length === 0 ? (
                                    <tr><td colSpan="4" className="p-12 text-center text-gray-400">No donors found.</td></tr>
                                ) : (
                                    filteredDonors.map((d, i) => (
                                        <tr key={i} className="hover:bg-red-50/30 transition-colors">
                                            <td className="p-4 font-semibold text-gray-900">{d.firstName} {d.lastName}</td>
                                            <td className="p-4">
                                                <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold">
                                                    {d.bloodGroup}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">{d.phoneNumber}</td>
                                            <td className="p-4 text-sm text-gray-600">{d.email}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'recipients' && (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Recipient Name</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Blood Needed</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Bags</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Contact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="4" className="p-12 text-center text-gray-400">Loading recipient list...</td></tr>
                                ) : filteredRecipients.length === 0 ? (
                                    <tr><td colSpan="4" className="p-12 text-center text-gray-400">No requests found.</td></tr>
                                ) : (
                                    filteredRecipients.map((r, i) => (
                                        <tr key={i} className="hover:bg-red-50/30 transition-colors">
                                            <td className="p-4 font-semibold text-gray-900">{r.firstName} {r.lastName}</td>
                                            <td className="p-4">
                                                <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">
                                                    {r.bloodNeeded}
                                                </span>
                                            </td>
                                            <td className="p-4 font-bold text-gray-900">{r.totalBagsNeeded} Units</td>
                                            <td className="p-4 text-sm text-gray-600">{r.phoneNumber}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'availability' && (
                        <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                            {loading ? (
                                <div className="col-span-full text-center text-gray-400">Checking inventory...</div>
                            ) : availability.map((a, i) => (
                                <div key={i} className="bg-gray-50 border border-gray-100 p-6 rounded-2xl flex flex-col items-center gap-2">
                                    <div className="text-3xl font-black text-red-600">{a.bloodGroup}</div>
                                    <div className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Availability</div>
                                    <div className={`mt-2 px-4 py-1 rounded-full text-xs font-bold ${
                                        a.count > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {a.count > 0 ? `${a.count} Units Available` : 'Out of Stock'}
                                    </div>
                                    {a.count < 2 && a.count > 0 && (
                                        <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-600 font-bold">
                                            <FaExclamationTriangle className="text-[10px]" /> LOW STOCK
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminManageBlood;
