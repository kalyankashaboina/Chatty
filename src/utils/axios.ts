import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://chatty-server-uhm7.onrender.com';
console.log('API_BASE_URL:', API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Session expired. Please log in again.', error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
