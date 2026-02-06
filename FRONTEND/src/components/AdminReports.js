import React, { useState, useEffect } from 'react';
import api from '../api/config';
import AdminLayout from './AdminLayout';
import { FaChartLine, FaWallet, FaPrescriptionBottle, FaMicroscope, FaBed, FaSearch, FaArrowRight } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const AdminReports = () => {
    const [reports, setReports] = useState({
        medBills: [],
        testBills: [],
        wardBills: [],
        cabinBills: []
    });
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAllReports();
    }, []);

    const fetchAllReports = async () => {
        try {
            const [med, test, ward, cabin] = await Promise.all([
                api.get('/medicineBill/all-bills'),
                api.get('/testAndServicesBill/all-bills'),
                api.get('/wardBooking/all-bills'),
                api.get('/cabinBooking/all-bills')
            ]);

            setReports({
                medBills: med.data,
                testBills: test.data,
                wardBills: ward.data,
                cabinBills: cabin.data
            });
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = (bills) => bills.reduce((acc, curr) => acc + (curr.totalBill || 0), 0);

    const totals = {
        medicine: calculateTotal(reports.medBills),
        test: calculateTotal(reports.testBills),
        ward: calculateTotal(reports.wardBills),
        cabin: calculateTotal(reports.cabinBills),
    };

    const grossRevenue = Object.values(totals).reduce((a, b) => a + b, 0);

    const allTransactions = [
        ...reports.medBills.map(b => ({ ...b, type: 'Medicine', name: b.name })),
        ...reports.testBills.map(b => ({ ...b, type: 'Test', name: b.patientName })),
        ...reports.wardBills.map(b => ({ ...b, type: 'Ward', name: b.patientName })),
        ...reports.cabinBills.map(b => ({ ...b, type: 'Cabin', name: b.patientName }))
    ].sort((a, b) => new Date(b.date || b.bookedDate) - new Date(a.date || a.bookedDate));

    const filteredTransactions = allTransactions.filter(t => {
        const matchesSearch = t.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             t.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || t.type === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <AdminLayout title="Reports" subtitle="Clinical and financial performance dashboard">
            <Helmet>
                <title>Clinical Reports - HealingWave</title>
            </Helmet>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <SummaryCard title="Gross Revenue" value={`৳${grossRevenue.toLocaleString()}`} icon={<FaWallet />} color="blue" />
                <SummaryCard title="Pharmacy Sales" value={`৳${totals.medicine.toLocaleString()}`} icon={<FaPrescriptionBottle />} color="indigo" />
                <SummaryCard title="Lab Analytics" value={`৳${totals.test.toLocaleString()}`} icon={<FaMicroscope />} color="emerald" />
                <SummaryCard title="Room Bookings" value={`৳${(totals.ward + totals.cabin).toLocaleString()}`} icon={<FaBed />} color="orange" />
            </div>

            <div className="admin-card bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden mb-8">
                <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-800/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="admin-toggle-container flex bg-white dark:bg-zinc-800 p-1 rounded-lg border border-gray-200 dark:border-zinc-700 w-fit">
                        {['All', 'Medicine', 'Test', 'Ward', 'Cabin'].map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                    activeCategory === cat 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                                    : 'admin-btn-secondary bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative max-w-sm w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <FaSearch />
                        </span>
                        <input 
                            type="text" 
                            placeholder="Search by patient or category..." 
                            className="admin-search-input w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-gray-200 transition-all font-sans"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-zinc-800/10 border-b border-gray-100 dark:border-zinc-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                <th className="p-4">Transaction Date</th>
                                <th className="p-4">Patient / Category</th>
                                <th className="p-4">Record Type</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {loading ? (
                                <tr><td colSpan="6" className="p-12 text-center text-gray-400">Compiling financial data...</td></tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr><td colSpan="6" className="p-12 text-center text-gray-400">No records found for the selection.</td></tr>
                            ) : (
                                filteredTransactions.map((t, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(t.date || t.bookedDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-900 dark:text-gray-100">{t.name || 'Anonymous'}</div>
                                            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">ID: {t._id.slice(-8).toUpperCase()}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                t.type === 'Medicine' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' :
                                                t.type === 'Test' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                                            }`}>
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-gray-900 dark:text-gray-100">৳{t.totalBill.toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                                t.paid ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                                            }`}>
                                                {t.paid ? 'SETTLED' : 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="text-blue-500 hover:text-blue-700 cursor-pointer text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all flex items-center justify-end gap-1">
                                                Details <FaArrowRight className="text-[10px]" />
                                            </span>
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

const SummaryCard = ({ title, value, icon, color }) => {
    const colors = {
        blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30",
        indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30",
        emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
        orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/30"
    };

    return (
        <div className="admin-card bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl shadow-sm border ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none">{value}</p>
            </div>
        </div>
    );
};

export default AdminReports;
