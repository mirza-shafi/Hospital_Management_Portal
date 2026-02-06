import React, { useState, useEffect } from 'react';
import api from '../api/config';
import AdminLayout from './AdminLayout';
import { FaReply, FaCheckCircle, FaExclamationCircle, FaUserCircle, FaEnvelope, FaHistory } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const AdminManageFeedback = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [solution, setSolution] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await api.get('/support/requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            await api.post(`/support/respond/${selectedRequest._id}`, { solution }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSolution('');
            setSelectedRequest(null);
            fetchRequests();
            alert('Response sent successfully!');
        } catch (error) {
            alert('Failed to send response.');
        }
    };

    const filteredRequests = requests.filter(r => 
        statusFilter === 'All' || r.status === statusFilter
    );

    return (
        <AdminLayout title="Feedback & Support" subtitle="Review and respond to user messages and inquiries">
            <Helmet>
                <title>Feedback - HealingWave Admin</title>
            </Helmet>

            <div className="flex items-center justify-between mb-8">
                <div className="flex bg-white dark:bg-zinc-900 p-1 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                    {['All', 'Pending', 'Resolved'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                statusFilter === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inbox List */}
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {loading ? (
                        <div className="text-center p-12 text-gray-400">Loading feedback...</div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="text-center p-12 text-gray-400">No messages found.</div>
                    ) : (
                        filteredRequests.map(req => (
                            <div 
                                key={req._id}
                                onClick={() => setSelectedRequest(req)}
                                className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                                    selectedRequest?._id === req._id 
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-900/30 shadow-md' 
                                    : 'admin-card bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:border-indigo-100 dark:hover:border-indigo-900/40 shadow-sm'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                            <FaUserCircle size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-gray-100">{req.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{req.email}</div>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                        req.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {req.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 italic">"{req.message}"</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Response Area */}
                <div className="admin-card bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm p-8 h-fit sticky top-8">
                    {selectedRequest ? (
                        <>
                            <div className="border-b border-gray-100 dark:border-zinc-800 pb-6 mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    <FaReply className="text-indigo-600 dark:text-indigo-400" /> Response Flow
                                </h3>
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 italic border-l-4 border-indigo-500">
                                    {selectedRequest.message}
                                </div>
                            </div>

                            {selectedRequest.status === 'Resolved' ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 rounded-xl text-sm flex items-start gap-2 border border-emerald-100 dark:border-emerald-900/30">
                                        <FaCheckCircle className="mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="font-bold">Message Resolved</div>
                                            <div className="mt-1 opacity-80">{selectedRequest.solution}</div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedRequest(null)}
                                        className="w-full py-2.5 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/10 rounded-xl transition-all"
                                    >
                                        Close Details
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleRespond} className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Provide Resolution</label>
                                    <textarea 
                                        value={solution}
                                        onChange={(e) => setSolution(e.target.value)}
                                        className="w-full p-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl h-40 resize-none focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none dark:text-gray-200"
                                        placeholder="Type your response to the user..."
                                        required
                                    ></textarea>
                                    <div className="flex gap-3 pt-2">
                                        <button 
                                            type="submit"
                                            className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <FaEnvelope /> Send Email Response
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setSelectedRequest(null)}
                                            className="px-6 py-3 bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600 mb-4">
                                <FaHistory size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Select a Message</h3>
                            <p className="text-sm text-gray-400 dark:text-gray-500 max-w-[200px]">Review user feedback from the left panel to begin resolution.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminManageFeedback;
