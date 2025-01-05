import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 15000, // Increased timeout
    withCredentials: false
});

// Request interceptor with more detailed logging
api.interceptors.request.use(
    (config) => {
        console.log('API Request:', {
            method: config.method?.toUpperCase(),
            url: `${config.baseURL}${config.url}`,
            headers: config.headers,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor with more detailed logging
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            status: response.status,
            data: response.data,
            url: response.config.url
        });
        return response;
    },
    (error) => {
        console.error('API Response Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            url: error.config?.url
        });
        return Promise.reject(error);
    }
);

export default api; 