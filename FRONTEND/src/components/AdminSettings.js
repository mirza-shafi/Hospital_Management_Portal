import React, { useState, useEffect } from 'react';
import api from '../api/config';
import AdminLayout from './AdminLayout';
import { FaCloudUploadAlt, FaSave, FaShieldAlt, FaPalette, FaUserShield } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

const AdminSettings = () => {
    const [activeSection, setActiveSection] = useState('profile');
    const [profile, setProfile] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/admin/profile');
            setProfile({ ...res.data, password: '' }); // Don't show password
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            await api.put('/admin/profile', profile);
            alert('Profile updated successfully!');
            fetchProfile();
        } catch (error) {
            alert('Failed to update profile.');
        }
    };
    
    return (
        <AdminLayout title="System Settings" subtitle="Manage your administrative credentials and clinic configuration">
            <Helmet>
                <title>Settings - HealingWave Admin</title>
            </Helmet>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Sidemenu */}
                <div className="w-full lg:w-64 flex flex-col gap-2">
                    {[
                        { id: 'profile', label: 'Admin Profile', icon: <FaUserShield /> },
                        { id: 'security', label: 'Security', icon: <FaShieldAlt /> },
                        { id: 'branding', label: 'Clinic Branding', icon: <FaPalette /> },
                    ].map(item => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold transition-all text-sm ${
                                activeSection === item.id 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                                : 'text-gray-500 hover:bg-white hover:text-gray-900'
                            }`}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
                    {loading ? (
                        <div className="text-center py-20 text-gray-400">Loading settings...</div>
                    ) : activeSection === 'profile' && (
                        <form onSubmit={handleSaveProfile} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">Administrative Profile</h3>
                                <p className="text-sm text-gray-400">Update your primary contact and public identification.</p>
                            </div>
                            
                            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl">
                                <div className="w-20 h-20 bg-indigo-100 rounded-2xl overflow-hidden relative group cursor-pointer">
                                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" />
                                    <div className="absolute inset-0 bg-indigo-900/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FaCloudUploadAlt size={24} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="font-bold text-gray-900">{profile.name}</div>
                                    <div className="text-xs text-gray-500 uppercase font-black tracking-widest text-indigo-600">Super Administrator</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Display Name</label>
                                    <input 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/10" 
                                        value={profile.name} 
                                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Contact Email</label>
                                    <input 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/10" 
                                        value={profile.email} 
                                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-100 transition-all">
                                        <FaSave /> Save Profile Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {activeSection === 'security' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">System Security</h3>
                                <p className="text-sm text-gray-400">Update your password and authentication preferences.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="p-6 border border-gray-100 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-gray-900">Change Password</div>
                                        <div className="text-xs text-gray-400 mt-1">Last changed 24 days ago</div>
                                    </div>
                                    <button className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all text-gray-700">Update</button>
                                </div>
                                <div className="p-6 border border-gray-100 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-gray-900">Session Timeout</div>
                                        <div className="text-xs text-gray-400 mt-1">Current: 30 minutes</div>
                                    </div>
                                    <button className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all text-gray-700">Change</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'branding' && (
                         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 text-center py-20">
                            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-6">
                                <FaPalette size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Theming Engine</h3>
                            <p className="text-sm text-gray-400 max-w-sm mx-auto">Hospital branding and color palette customization features are coming in the next update.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
