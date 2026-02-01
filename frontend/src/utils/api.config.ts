// api.config.ts

import axios, { 
  AxiosInstance, 
  AxiosError, 
  AxiosRequestConfig, 
  AxiosResponse 
} from 'axios';

// Types
interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError): Promise<ApiError> => {
    return Promise.reject({
      message: error.message,
      status: error.response?.status
    });
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse): ApiResponse => {
    return {
      data: response.data,
      status: response.status,
      message: response.statusText
    };
  },
  (error: AxiosError): Promise<ApiError> => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject({
      message: error.response?.data?.message || 'An error occurred',
      code: error.code,
      status: error.response?.status
    });
  }
);

export type { ApiError, ApiResponse };
export default api;