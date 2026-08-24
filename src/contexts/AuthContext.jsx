/**
 * Authentication Context
 * Manages user authentication state, login, logout, and token storage
 */

import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../lib/axios';
import { API_CONFIG } from '../config/api.config';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Register
  const register = async (userData) => {
    try {
      const data = await axios.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
      
      if (data && data.token) {
        const { token: newToken, user: newUser } = data;
        
        // Store in state
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
        
        // Store in localStorage
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        toast.success('تم إنشاء الحساب بنجاح!');
        return { success: true, data };
      }
      
      return { success: false, error: 'فشل إنشاء الحساب' };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'فشل إنشاء الحساب' 
      };
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      const data = await axios.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
      
      if (data && data.token) {
        const { token: newToken, user: newUser } = data;
        
        // Store in state
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
        
        // Store in localStorage
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        // Show first name or full name safely
        const displayName = newUser.fullName ? newUser.fullName.split(' ')[0] : (newUser.firstName || 'بك');
        toast.success(`مرحباً ${displayName}!`);
        return { success: true, data };
      }
      
      return { success: false, error: 'فشل تسجيل الدخول' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'فشل تسجيل الدخول' 
      };
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Call logout endpoint (optional - backend will invalidate token)
      await axios.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      toast.success('تم تسجيل الخروج بنجاح');
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const data = await axios.put(API_CONFIG.ENDPOINTS.USERS.UPDATE_PROFILE, userData);
      
      if (data && (data.email || data.fullName)) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        toast.success('تم تحديث الملف الشخصي بنجاح');
        return { success: true, data };
      }
      
      return { success: false, error: 'فشل تحديث الملف الشخصي' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'فشل تحديث الملف الشخصي' 
      };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      const response = await axios.post(API_CONFIG.ENDPOINTS.USERS.CHANGE_PASSWORD, passwordData);
      
      if (response && (response.isSuccess || response.success || response.message)) {
        toast.success('تم تغيير كلمة المرور بنجاح');
        return { success: true };
      }
      
      return { success: false, error: 'فشل تغيير كلمة المرور' };
    } catch (error) {
      console.error('Change password error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'فشل تغيير كلمة المرور' 
      };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      
      if (response && (response.isSuccess || response.success || response.message)) {
        toast.success('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
        return { success: true };
      }
      
      return { success: false, error: 'فشل إرسال رابط إعادة التعيين' };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'فشل إرسال رابط إعادة التعيين' 
      };
    }
  };

  // Reset password
  const resetPassword = async (resetData) => {
    try {
      const response = await axios.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, resetData);
      
      if (response && (response.isSuccess || response.success || response.message)) {
        toast.success('تم إعادة تعيين كلمة المرور بنجاح');
        return { success: true };
      }
      
      return { success: false, error: 'فشل إعادة تعيين كلمة المرور' };
    } catch (error) {
      console.error('Reset password error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'فشل إعادة تعيين كلمة المرور' 
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
