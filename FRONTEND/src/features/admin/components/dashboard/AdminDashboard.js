import React, { useState, useEffect } from 'react';
import api from '../../../../core/api/config';
import AdminLayout from '../layout/AdminLayout';
import StatsCard from '../../../shared/components/charts/StatsCard';
import { useAdminTheme } from '../../context/AdminThemeContext';
import { 
  FaUsers, FaUserMd, FaCalendarAlt, FaExclamationTriangle, FaTint, FaCapsules, 
  FaTools, FaChartLine, FaChartPie, FaChevronRight, FaArrowUp, FaArrowDown 
} from 'react-icons/fa';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { Helmet } from 'react-helmet';
import '../../../../components/styles/AdminStats.css';

const AdminDashboard = () => {
  const { theme } = useAdminTheme();
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    pharmacy: { total: 0, lowStock: 0 },
    bloodBank: { donors: 0, requests: 0, stocks: [] },
    equipment: { functional: 0, maintenance: 0 },
    appointmentTrends: []
  });
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await api.get('/admin/stats');
      setStats(prev => ({ ...prev, ...statsRes.data }));

      const patientsRes = await api.get('/admin/patients');
      setPatients(patientsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
  const patientStatusData = [
    { name: 'Stable', value: 45 },
    { name: 'Mild', value: 30 },
    { name: 'Critical', value: 15 },
    { name: 'Others', value: 10 }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Stable': return 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30';
      case 'Mild': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
      case 'Critical': return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30';
      default: return 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-400';
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400 font-bold animate-pulse">Syncing Clinic Intelligence...</p>
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <Helmet>
        <title>Dashboard | HealingWave Admin</title>
      </Helmet>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatsCard title="Total Doctors" value={stats.doctors} type="info" icon={<FaUserMd />} />
        <StatsCard title="Total Patients" value={stats.patients} type="default" icon={<FaUsers />} />
        <StatsCard title="Monthly Appointments" value={stats.appointments} type="warning" icon={<FaCalendarAlt />} />
        <StatsCard title="Emergency Alerts" value={3} type="critical" icon={<FaExclamationTriangle />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Analytics Chart */}
        <div className="admin-card lg:col-span-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Appointment Analytics</h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">Monthly patient visit volume trends</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-lg text-[10px] font-bold">
              <FaArrowUp /> 12.5%
            </div>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.appointmentTrends}>
                <defs>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} opacity={0.5} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10}} dy={5} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
                    boxShadow: '0 8px 12px -2px rgba(0,0,0,0.12)', 
                    padding: '8px' 
                  }}
                  itemStyle={{ color: '#6366f1', fontWeight: 'bold', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="appointments" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorApp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="admin-card bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-0.5">Patient Status</h3>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-4">Global health distribution</p>
          <div className="h-[140px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={patientStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={55} paddingAngle={4} dataKey="value">
                  {patientStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-black text-gray-900 dark:text-gray-100">{stats.patients}</span>
              <span className="text-[7px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest leading-none">Lives</span>
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            {patientStatusData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: COLORS[idx]}}></div>
                  <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="text-[10px] font-bold text-gray-900 dark:text-gray-100">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {/* Pharmacy Card */}
        <div className="admin-card bg-white dark:bg-zinc-900 p-3.5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-900/40 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <FaCapsules size={14} />
            </div>
            <span className="text-[8px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Pharmacy</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-lg font-black text-gray-900 dark:text-gray-100 leading-none mb-1">{stats.pharmacy?.total || 0}</div>
              <p className="text-[8px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter">Inventory</p>
            </div>
            <div className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${stats.pharmacy?.lowStock > 0 ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'}`}>
              {stats.pharmacy?.lowStock || 0} Low
            </div>
          </div>
        </div>

        {/* Blood Bank Card */}
        <div className="admin-card bg-white dark:bg-zinc-900 p-3.5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-red-200 dark:hover:border-red-900/40 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
              <FaTint size={14} />
            </div>
            <span className="text-[8px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">Blood Bank</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-lg font-black text-gray-900 dark:text-gray-100 leading-none mb-1">{stats.bloodBank?.donors || 0}</div>
              <p className="text-[8px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter">Donors</p>
            </div>
            <div className="px-1.5 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-[8px] font-black uppercase">
              {stats.bloodBank?.requests || 0} Req.
            </div>
          </div>
        </div>

        {/* Equipment Card */}
        <div className="admin-card bg-white dark:bg-zinc-900 p-3.5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-blue-200 dark:hover:border-blue-900/40 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <FaTools size={14} />
            </div>
            <span className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Equipment</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-lg font-black text-gray-900 dark:text-gray-100 leading-none mb-1">{stats.equipment?.functional || 0}</div>
              <p className="text-[8px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter">Functional</p>
            </div>
            <div className="px-1.5 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded text-[8px] font-black uppercase">
              {stats.equipment?.maintenance || 0} Maint.
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity / Table */}
      <div className="admin-card bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Medical Registry</h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">Latest patients admitted</p>
          </div>
          <button className="text-indigo-600 dark:text-indigo-400 font-bold text-[10px] flex items-center gap-1 hover:underline">
            Directory <FaChevronRight size={7} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30 dark:bg-zinc-800/50">
                <th className="px-5 py-2.5 text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest italic">Identity</th>
                <th className="px-5 py-2.5 text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest italic">Diagnosis</th>
                <th className="px-5 py-2.5 text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold text-center">Status</th>
                <th className="px-5 py-2.5 text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right italic">Entry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {patients.map((patient) => (
                <tr key={patient._id} className="hover:bg-indigo-50/10 transition-all group">
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                        {patient.firstName ? patient.firstName[0] : 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100 text-[12px] leading-tight underline decoration-indigo-200 dark:decoration-indigo-900/40 decoration-1 underline-offset-2">{patient.firstName} {patient.lastName}</div>
                        <div className="text-[8px] text-gray-400 dark:text-gray-500 font-medium truncate max-w-[100px] leading-none">{patient.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">{patient.diagnosis}</div>
                  </td>
                  <td className="px-5 py-2.5 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-right font-bold text-gray-400 dark:text-gray-500 text-[10px]">
                    {patient.lastVisit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
