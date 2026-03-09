import { useState, useCallback } from 'react';

/**
 * Hook personalizado para chamadas API com tratamento consistente de erros e loading
 */
export const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = useCallback(async (fetchFunction, options = {}) => {
    const {
      onSuccess,
      onError,
      showErrorAlert = true,
      timeout = 30000 // 30 segundos default
    } = options;

    setLoading(true);
    setError(null);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    );

    try {
      const response = await Promise.race([
        fetchFunction(),
        timeoutPromise
      ]);

      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (err) {
      const errorMessage = err.message === 'Request timeout'
        ? 'Connection timeout. Please check your internet connection.'
        : err.message || 'Network error. Please try again.';

      setError(errorMessage);

      if (showErrorAlert) {
        console.error('API Error:', errorMessage);
      }

      if (onError) {
        onError(errorMessage);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return { apiCall, loading, error, reset };
};
