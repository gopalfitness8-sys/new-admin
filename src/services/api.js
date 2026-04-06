import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://api.mhmatka.space/api',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('adminToken');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        // Extract exact message from backend response if available
        const message = error.response?.data?.message || error.message || 'Something went wrong with the network request';
        error.message = message; // Overwrite error.message for components to use directly

        return Promise.reject(error);
    }
);

export default api;
