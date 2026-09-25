import axios from 'axios';

// Create a single shared Axios instance for all API calls
const axiosClient = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request Interceptor: Automatically add the authentication token if available
axiosClient.interceptors.request.use(
  (config) => {
    // Check if running in the browser before accessing localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle common errors in one central place
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the token expired or user is unauthorized (401), we can optionally clear stored data
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear saved user data if unauthorized
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
