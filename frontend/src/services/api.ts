// frontend/src/services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false, // Set to true if you're using cookies
});

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log outgoing requests in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Log successful responses in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        }
        return response;
    },
    (error: AxiosError) => {
        console.error('API Error:', error.response?.status, error.response?.data);

        if (error.response?.status === 401) {
            // Only redirect if we're not already on auth pages
            const isAuthPage = window.location.pathname.includes('/login') ||
                window.location.pathname.includes('/register');

            if (!isAuthPage) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }

        // Extract error message
        const message = (error.response?.data as any)?.message ||
            (error.response?.data as any)?.error ||
            error.message ||
            'An unexpected error occurred';

        return Promise.reject(new Error(message));
    }
);

export default api;