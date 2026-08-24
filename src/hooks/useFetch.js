/**
 * useFetch Hook
 * Automatically fetches data on mount with loading and error states
 */

import { useState, useEffect } from 'react';

export const useFetch = (apiFunc, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiFunc();
        
        if (isMounted) {
          // Handle ApiResponse<T> structure from backend
          if (response && response.success) {
            setData(response.data);
          } else {
            setError(response?.message || 'حدث خطأ غير متوقع');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'حدث خطأ غير متوقع');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiFunc();
      
      if (response && response.success) {
        setData(response.data);
      } else {
        setError(response?.message || 'حدث خطأ غير متوقع');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

export default useFetch;
