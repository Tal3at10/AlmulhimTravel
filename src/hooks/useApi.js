/**
 * useApi Hook
 * Generic hook for API calls with loading and error states
 */

import { useState, useCallback } from 'react';

export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiFunc(...args);
        
        // Handle ApiResponse<T> structure from backend
        if (response && response.success) {
          setData(response.data);
          return { success: true, data: response.data };
        } else {
          const errorMsg = response?.message || 'حدث خطأ غير متوقع';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'حدث خطأ غير متوقع';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

export default useApi;
