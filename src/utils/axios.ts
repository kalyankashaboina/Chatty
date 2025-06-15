import axios from 'axios';
import { logoutUser } from '../services/authService'; 


const API_BASE_URL = '/api';
console.log('API_BASE_URL:', API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Intercept requests (no token needed for cookies)
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Intercept responses
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('🔒 Unauthorized: logging out user');

      try {
        await logoutUser(); 
      } catch (logoutError) {
        console.error('Failed to logout cleanly after 401:', logoutError);
      }

      // Redirect to login page
      window.location.href = '/'; 
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
