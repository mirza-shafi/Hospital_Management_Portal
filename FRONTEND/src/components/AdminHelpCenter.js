import React from 'react';
import AdminLayout from './AdminLayout';
import { FaBook, FaSearch, FaQuestionCircle, FaStethoscope, FaCapsules, FaUsers } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const AdminHelpCenter = () => {
    const categories = [
        { title: 'User Management', icon: <FaUsers className="text-blue-500" />, desc: 'How to register patients and manage doctor profiles.' },
        { title: 'Inventory Control', icon: <FaCapsules className="text-emerald-500" />, desc: 'Managing pharmacy stock and medical equipment tracking.' },
        { title: 'Clinical Operations', icon: <FaStethoscope className="text-indigo-500" />, desc: 'Handling appointments, reports, and ward bookings.' },
    ];

    const faqs = [
        { q: "How do I update medicine stock?", a: "Navigate to 'Pharmacy', click the sync icon on any drug, and enter the new strip count." },
        { q: "How to view financial reports?", a: "The 'Reports' section provides a complete summary of all bills generated in the system." },
        { q: "Can I manage equipment status?", a: "Yes, go to 'Equipment' to register assets and update their maintenance status." }
    ];

    return (
        <AdminLayout title="Help Center" subtitle="Access system documentation and administrative guides">
            <Helmet>
                <title>Help Center - HealingWave Admin</title>
            </Helmet>

            <div className="max-w-4xl mx-auto space-y-12">
                {/* Search Header */}
                <div className="text-center bg-gradient-to-br from-indigo-600 to-blue-700 p-12 rounded-3xl text-white shadow-xl">
                    <h2 className="text-3xl font-black mb-4 flex items-center justify-center gap-3">
                        <FaBook /> How can we help?
                    </h2>
                    <div className="max-w-md mx-auto relative mt-6">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                        <input 
                            type="text" 
                            placeholder="Search documentation..." 
                            className="w-full pl-12 pr-6 py-4 bg-white/10 border border-white/20 rounded-2xl outline-none focus:bg-white/20 transition-all placeholder-white/60"
                        />
                    </div>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map((cat, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                             <div className="w-12 h-12 bg-gray-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                {cat.icon}
                             </div>
                             <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{cat.title}</h3>
                             <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{cat.desc}</p>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm p-10">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-2">
                        <FaQuestionCircle className="text-amber-500" /> Frequently Asked Questions
                    </h3>
                    <div className="space-y-6">
                        {faqs.map((faq, i) => (
                            <div key={i} className="p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800">
                                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Q: {faq.q}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">A: {faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Support */}
                <div className="text-center py-10 border-t border-gray-100 dark:border-zinc-800">
                    <p className="text-gray-400 dark:text-gray-500 text-sm">Still stuck? Contact IT support at <span className="font-bold text-indigo-600 dark:text-indigo-400">it-desk@healingwave.com</span></p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminHelpCenter;
