/**
 * Axios Instance with Interceptors
 * Handles authentication, error handling, and request/response transformation
 */

import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import toast from 'react-hot-toast';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Return the data directly from ApiResponse<T>
    // After Backend update, data is wrapped in { isSuccess: true, data: ... }
    if (response.data && response.data.isSuccess !== undefined) {
      return response.data.data !== null && response.data.data !== undefined 
        ? response.data.data 
        : response.data;
    }
    return response.data;
  },
  (error) => {
    if (Boolean(error?.config?.suppressErrorToast)) {
      return Promise.reject(error);
    }

    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          // Validation errors
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach(err => {
              const msg = typeof err === 'string' ? err : (err.message || 'خطأ في البيانات المدخلة');
              toast.error(msg);
            });
          } else {
            toast.error(data.message || 'خطأ في البيانات المدخلة');
          }
          break;
          
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          toast.error('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى');
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            setTimeout(() => {
              window.location.href = '/login';
            }, 1500);
          }
          break;
          
        case 403:
          toast.error('ليس لديك صلاحية للوصول إلى هذا المورد');
          break;
          
        case 404:
          toast.error(data.message || 'المورد المطلوب غير موجود');
          break;
          
        case 409:
          // Conflict (e.g., duplicate email)
          toast.error(data.message || 'البيانات موجودة مسبقاً');
          break;
          
        case 500:
          toast.error('حدث خطأ في الخادم. يرجى المحاولة لاحقاً');
          break;
          
        default:
          toast.error(data.message || 'حدث خطأ غير متوقع');
      }
    } else if (error.request) {
      // Network error
      toast.error('فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت');
    } else {
      // Other errors
      toast.error('حدث خطأ غير متوقع');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
