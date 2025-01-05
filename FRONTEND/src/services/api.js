import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 15000
});

// Add request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log('Making request:', {
            url: config.url,
            method: config.method,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('Response received:', {
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('Response error:', {
            message: error.message,
            response: error.response?.data
        });
        return Promise.reject(error);
    }
);

// Doctors API
export const doctorsApi = {
    getAllDoctors: () => api.get('/doctors'),
    getDoctorById: (id) => api.get(`/doctors/${id}`),
    createDoctor: (data) => api.post('/doctors', data),
    updateDoctor: (id, data) => api.put(`/doctors/${id}`, data),
    deleteDoctor: (id) => api.delete(`/doctors/${id}`)
};

// Medicines API
export const medicinesApi = {
    getAllMedicines: () => api.get('/medicines'),
    getMedicineById: (id) => api.get(`/medicines/${id}`),
    createMedicine: (data) => api.post('/medicines', data),
    updateMedicine: (id, data) => api.put(`/medicines/${id}`, data),
    deleteMedicine: (id) => api.delete(`/medicines/${id}`)
};

// Medicine Bills API
export const medicineBillsApi = {
    getAllBills: () => api.get('/medicineBill'),
    getBillById: (id) => api.get(`/medicineBill/${id}`),
    createBill: (data) => api.post('/medicineBill', data),
    updateBill: (id, data) => api.put(`/medicineBill/${id}`, data),
    deleteBill: (id) => api.delete(`/medicineBill/${id}`)
};

export default api; 