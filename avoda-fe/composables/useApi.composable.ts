import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

// import { useLocalStorage } from '@vueuse/core';

export const useApi = () => {
  const runtimeConfig = useRuntimeConfig();

  const token = ref<string | null>(null);

  if (import.meta.client) {
    token.value = localStorage.getItem('ACCESS_TOKEN');
  }

  const authHeader = computed(() => {
    return token.value ? `Bearer ${token.value}` : null;
  });

  // Create axios instance with default config
  const api: AxiosInstance = axios.create({
    baseURL: runtimeConfig.public.BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      // Add auth token if it exists
      if (authHeader.value) {
        config.headers.Authorization = authHeader.value;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401) {
        // Clear token and redirect to login
        token.value = '';
        // You might want to add router navigation here
        // router.push('/login');
      }
      return Promise.reject(error);
    }
  );

  // Wrapper functions for HTTP methods with better typing
  const get = async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> = await api.get(url, config);
    return response.data;
  };

  const post = async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> = await api.post(url, data, config);
    return response.data;
  };

  const patch = async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> = await api.patch(url, data, config);
    return response.data;
  };

  const put = async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> = await api.put(url, data, config);
    return response.data;
  };

  const del = async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> = await api.delete(url, config);
    return response.data;
  };

  return {
    api, // The base axios instance if needed
    get, // Typed GET requests
    post, // Typed POST requests
    put, // Typed PUT requests
    delete: del, // Typed DELETE requests
    patch,
  };
};
