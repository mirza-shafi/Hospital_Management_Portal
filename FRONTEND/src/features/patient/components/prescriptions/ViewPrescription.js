import React, { useState } from 'react';
import axios from 'axios';
import { prescriptionPDF } from '../../../../features/shared/components/utils/PDFGenerator';
import { FaTimes } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { storage } from '../../../../utils/storage';


const ViewPrescription = () => {
  const patientEmail = storage.getItem('patientEmail');
  const doctorEmail = storage.getItem('doctorEmail');
  const [searchTerm, setSearchTerm] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initial fetch for doctors (since they might want to see all or recent)
  React.useEffect(() => {
      if (doctorEmail && !patientEmail) {
           fetchDoctorPrescriptions();
      }
  }, [doctorEmail, patientEmail]);

  const fetchDoctorPrescriptions = async () => {
      setLoading(true);
      try {
          // Attempting to fetch by doctor email - assuming endpoint consistency
          const response = await axios.get(`/api/prescriptions/doctor/email/${doctorEmail}`);
          setPrescriptions(response.data);
      } catch (err) {
          console.log('Doctor prescription fetch failed, might depend on search', err);
          // If 404, maybe we just wait for search?
      } finally {
          setLoading(false);
      }
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        let response;
        if (doctorEmail) {
            // For doctors, maybe search by patient name? 
             response = await axios.get(`/api/prescriptions/psearch?query=${searchTerm}`);
        } else {
             response = await axios.get(`/api/prescriptions/psearch?query=${searchTerm}`, {
                headers: { 'Patient-Email': patientEmail }
             });
        }
        setPrescriptions(response.data);
      } catch (err) {
        console.error('Error fetching prescriptions:', err);
        setError('Error fetching prescriptions');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownload = (prescription) => {
    prescriptionPDF(prescription);
  };

  const handleRemove = (id) => {
    setPrescriptions(prescriptions.filter(prescription => prescription._id !== id));
  };

  return (
    <div className="animate-fade-in-up h-[calc(100vh-100px)] flex flex-col">
      <Helmet>
        <title>View Prescriptions</title>
      </Helmet>
      
      {/* Header & Search */}
      <div className="bg-[#ffffff] dark:bg-[#18181b] px-6 py-4 rounded-xl shadow-sm mb-4 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200">
          <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Prescriptions</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Manage and view patient prescriptions</p>
          </div>
          <div className="relative w-full md:w-64">
             <input
                type="text"
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full pl-4 pr-10 py-2 bg-gray-50 dark:bg-[#27272a] rounded-lg text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border border-transparent focus:border-blue-500/30"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
          </div>
      </div>

      {loading && <p className="text-center text-gray-500 dark:text-gray-400 py-4 animate-pulse">Loading prescriptions...</p>}
      {error && <p className="text-center text-red-500 py-4">{error}</p>}

      {/* Prescription List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
        {prescriptions.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500 opacity-60">
             <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
             <p className="text-sm font-medium">No prescriptions found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {prescriptions.map((prescription) => (
              <div className="bg-[#ffffff] dark:bg-[#18181b] rounded-xl shadow-sm p-5 relative group border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-200" key={prescription._id}>
                
                <button 
                    onClick={() => handleRemove(prescription._id)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-50 dark:hover:bg-[#27272a]"
                >
                    <FaTimes />
                </button>

                <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-3">
                         <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                             Rx
                         </div>
                         <div>
                             <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm leading-tight">{prescription.patientName}</h3>
                             <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(prescription.date).toLocaleDateString()}</p>
                         </div>
                    </div>

                    <div className="pt-2 border-t border-gray-50 dark:border-[#27272a]">
                        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                             <div>
                                 <span className="text-gray-400 block text-[10px] uppercase">Doctor</span>
                                 <span className="font-medium text-gray-700 dark:text-gray-300">{prescription.doctorName}</span>
                             </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-[#27272a] p-3 rounded-lg">
                            <span className="text-gray-400 block text-[10px] uppercase mb-1">Prescription</span>
                            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed font-mono">
                                {prescription.prescriptionText}
                            </p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => handleDownload(prescription)} 
                    className="w-full py-2 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-2"
                >
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPrescription;
