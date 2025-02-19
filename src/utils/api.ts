import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useRouter } from 'next/navigation';

const api = axios.create();
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const redirectToLogin = () => {
  // Use next/navigation for client-side routing
  if (typeof window !== 'undefined') {
    const router = require('next/navigation').useRouter();
    router.push('/auth/login');
  }
};

const refreshTokenAndRetry = async (failedRequest: any) => {
  try {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(failedRequest));
    }

    isRefreshing = true;
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh-token`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (data.success && data.data?.tokens) {
      localStorage.setItem('accessToken', data.data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.data.tokens.accessToken}`;
      processQueue();
      
      return api({
        ...failedRequest,
        headers: {
          ...failedRequest.headers,
          Authorization: `Bearer ${data.data.tokens.accessToken}`
        }
      });
    } else {
      throw new Error('Token refresh failed');
    }
  } catch (error) {
    processQueue(error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    redirectToLogin();
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
};

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (response.data?.success === false && response.data?.error === "Unauthorized") {
      return refreshTokenAndRetry(response.config);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 || 
        (error.response?.data as any)?.error === "Unauthorized") {
      originalRequest._retry = true;
      return refreshTokenAndRetry(originalRequest);
    }

    return Promise.reject(error);
  }
);

// Token refresh setup with Next.js App Router considerations
const setupTokenRefresh = () => {
  if (typeof window === 'undefined') return;

  const refreshInterval = setInterval(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken && !isRefreshing) {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh-token`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (data.success && data.data?.tokens) {
          localStorage.setItem('accessToken', data.data.tokens.accessToken);
          localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${data.data.tokens.accessToken}`;
        }
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    }
  }, 14 * 60 * 1000);

  window.addEventListener('unload', () => clearInterval(refreshInterval));
};

if (typeof window !== 'undefined') {
  setupTokenRefresh();
}

export { api };