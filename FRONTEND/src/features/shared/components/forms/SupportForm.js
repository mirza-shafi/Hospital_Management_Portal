import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FaArrowLeft, FaPaperPlane, FaExclamationCircle, FaCheckCircle, FaBook, FaSearch, FaQuestionCircle, FaStethoscope, FaCapsules, FaUsers, FaArrowRight } from 'react-icons/fa';
import '../../../../components/styles/SupportForm.css'; 

const SupportForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);

  const categories = [
    { title: 'User Management', icon: <FaUsers className="text-blue-500" />, desc: 'How to register patients and manage roles.' },
    { title: 'Inventory Control', icon: <FaCapsules className="text-emerald-500" />, desc: 'Managing pharmacy stock and equipment.' },
    { title: 'Clinical Operations', icon: <FaStethoscope className="text-indigo-500" />, desc: 'Handling appointments and reports.' },
  ];

  const faqs = [
    { q: "How do I update medicine stock?", a: "Navigate to 'Pharmacy', click the sync icon on any drug, and enter the new strip count." },
    { q: "How to view financial reports?", a: "The 'Reports' section provides a complete summary of all bills generated in the system." },
    { q: "Can I manage equipment status?", a: "Yes, go to 'Equipment' to register assets and update status." }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/support/submit', formData);
      setStatus('Your support request has been successfully submitted!');
      setIsError(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setStatus('Error submitting your request. Please try again.');
      setIsError(true);
    }
  };

  return (
    <div className="support-portal-root font-sans">
      <Helmet>
        <title>Help & Support Portal - HealingWave</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        {/* Header Navigation */}
        <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline group">
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
        </div>

        <div className="text-center mb-16">
            <h1 className="text-5xl font-black text-gray-900 dark:text-gray-100 mb-4 tracking-tight">Help & Support <span className="text-blue-600">Portal</span></h1>
            <p className="text-xl text-gray-500 dark:text-gray-400">Find answers or get in touch with our expert team.</p>
        </div>

        {/* Documentation Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {categories.map((cat, i) => (
                <div key={i} className="support-card p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                        {cat.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{cat.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">{cat.desc}</p>
                    <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold group">
                        Read Docs <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* FAQ Section */}
            <div className="support-card p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-500 text-xl">
                        <FaQuestionCircle />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Common Questions</h2>
                </div>
                
                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="group cursor-pointer">
                            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-start gap-3">
                                <span className="text-blue-600">Q:</span> {faq.q}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 pl-7 leading-relaxed flex items-start gap-3">
                                <span className="text-emerald-500 font-bold">A:</span> {faq.a}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-10 border-t border-gray-50 dark:border-zinc-800">
                    <div className="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-2xl">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Still have questions? Our support team typically responds within 24 hours.</p>
                        <p className="mt-2 font-bold text-gray-900 dark:text-gray-100">it-desk@healingwave.com</p>
                    </div>
                </div>
            </div>

            {/* Support Form Container */}
            <div className="support-card p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 text-xl">
                        <FaPaperPlane />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Submit Request</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                            <input
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-gray-100 font-medium transition-all"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                            <input
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-gray-100 font-medium transition-all"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                        <input
                            className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-gray-100 font-medium transition-all"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+880 1XXX-XXXXXX"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">How can we help?</label>
                        <textarea
                            className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-gray-100 font-medium transition-all min-h-[140px]"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Describe your issue or question..."
                            required
                        ></textarea>
                    </div>

                    <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 transition-all active:scale-95">
                        <FaPaperPlane /> Submit Ticket
                    </button>

                    {status && (
                        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-bottom-2 ${isError ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'}`}>
                            {isError ? <FaExclamationCircle /> : <FaCheckCircle />}
                            {status}
                        </div>
                    )}
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SupportForm;
