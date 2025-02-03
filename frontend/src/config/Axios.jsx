import axios from 'axios';

export const axiosi = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    withCredentials: true,
});

axiosi.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 && window.location.pathname !== '/login') {
            window.location.href = '/login'; // Redirect to login page
        }
        return Promise.reject(error); // Pass error to be handled elsewhere
    }
);

