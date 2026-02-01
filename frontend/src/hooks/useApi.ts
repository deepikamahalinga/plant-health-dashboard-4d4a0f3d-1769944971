import { useState, useCallback, useEffect } from 'react';

interface UseApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  fetchData: (url: string, options?: RequestInit) => Promise<void>;
  postData: (url: string, body: any, options?: RequestInit) => Promise<void>;
}

export function useApi<T>(): UseApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const controller = new AbortController();
  const signal = controller.signal;

  const handleApiCall = useCallback(async (
    url: string,
    options?: RequestInit
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unknown error occurred'));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchData = useCallback(async (
    url: string,
    options?: RequestInit
  ) => {
    await handleApiCall(url, {
      method: 'GET',
      ...options,
    });
  }, [handleApiCall]);

  const postData = useCallback(async (
    url: string,
    body: any,
    options?: RequestInit
  ) => {
    await handleApiCall(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      ...options,
    });
  }, [handleApiCall]);

  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, []);

  return {
    data,
    loading,
    error,
    fetchData,
    postData
  };
}