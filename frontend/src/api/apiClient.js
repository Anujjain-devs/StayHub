import axios from 'axios';
import { storage } from '../utils/storage';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract standardized error messages matching backend GlobalExceptionHandler
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      const { data, status, config } = error.response;
      
      if (status === 401 && !config?.url?.includes('/auth/login')) {
        // Clear stored token and notify AuthContext to cleanly reset session
        storage.clearAuth();
        window.dispatchEvent(new Event('stayhub:unauthorized'));
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (typeof data === 'string' && data) {
        errorMessage = data;
      } else if (data && data.message) {
        errorMessage = data.message;
      } else if (status === 401) {
        errorMessage = 'Unauthorized. Please check your credentials or log in again.';
      } else if (status === 403) {
        errorMessage = 'Access denied. You do not have permission to perform this action.';
      } else if (status === 404) {
        errorMessage = 'Resource not found.';
      } else if (status === 409) {
        errorMessage = 'Conflict. Duplicate resource already exists.';
      } else if (status === 500) {
        errorMessage = 'Internal server error occurred.';
      }
    } else if (error.request) {
      errorMessage = 'Network error. Could not connect to backend server.';
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
