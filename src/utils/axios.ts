import axios from 'axios';
import { logoutUser } from '../services/authService';

const API_BASE_URL = '/api';
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
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Session expired. Logging out.', error);
      try {
        await logoutUser();
      } catch (logoutError) {
        console.error('Logout failed:', logoutError);
      }
      window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
