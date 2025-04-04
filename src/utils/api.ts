import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

interface QueuePromise {
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}

interface TokenResponse {
  success: boolean;
  error?: string;
  data?: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

const api = axios.create();
let isRefreshing = false;
let failedQueue: QueuePromise[] = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(api);
    }
  });
  failedQueue = [];
};

const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    // Simple direct redirect to login
    console.log('[Auth] Redirecting to login page');
    window.location.href = "/login";
  }
};

const refreshTokenAndRetry = async (
  failedRequest: InternalAxiosRequestConfig,
) => {
  // Skip token refresh for authentication endpoints
  if (typeof window !== 'undefined') {
    const authRoutes = ['/login', '/register', '/get-started', '/verify', '/forgot-password'];
    const currentPath = window.location.pathname;
    
    // Skip refresh if we're on an auth route
    if (authRoutes.some(route => currentPath.startsWith(route))) {
      return Promise.reject(new Error("Token refresh skipped for auth route"));
    }
    
    // Also skip if the request URL contains auth endpoints
    const url = failedRequest.url || '';
    if (url.includes('/auth/login') || 
        url.includes('/auth/register') || 
        url.includes('/auth/verify') || 
        url.includes('/auth/forgot-password')) {
      return Promise.reject(new Error("Token refresh skipped for auth endpoint"));
    }
  }
  
  try {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(failedRequest));
    }

    isRefreshing = true;
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      console.warn("[Auth] No refresh token available");
      throw new Error("No refresh token available");
    }

    console.log("[Auth] Attempting to refresh token...");
    
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh-token`,
        { refreshToken },
        { headers: { "Content-Type": "application/json" } },
      );
  
      // Check for invalid refresh token response
      if (data.success === false && data.error === "Invalid refresh token") {
        console.warn("[Auth] Invalid refresh token response from API");
        throw new Error("Invalid refresh token");
      }
  
      if (data.success && data.data?.tokens) {
        console.log("[Auth] Token refresh successful");
        localStorage.setItem("accessToken", data.data.tokens.accessToken);
        // localStorage.setItem("refreshToken", data.data.tokens.refreshToken);
        api.defaults.headers.common["Authorization"] =
          `Bearer ${data.data.tokens.accessToken}`;
        processQueue();
  
        return api({
          ...failedRequest,
          headers: {
            ...failedRequest.headers,
            Authorization: `Bearer ${data.data.tokens.accessToken}`,
          },
        });
      } else {
        console.error("[Auth] Token refresh failed - unexpected response format");
        throw new Error("Token refresh failed");
      }
    } catch (refreshError) {
      console.error("[Auth] Error during token refresh:", refreshError);
      
      // Check if this is an invalid token error
      if (refreshError instanceof Error && 
          refreshError.message === "Invalid refresh token") {
        console.warn("[Auth] Invalid refresh token detected");
      } else if (axios.isAxiosError(refreshError) && 
                refreshError.response?.data?.error === "Invalid refresh token") {
        console.warn("[Auth] Invalid refresh token response from API");
      }
      
      throw refreshError;
    }
  } catch (error: unknown) {
    console.error("[Auth] Token refresh process failed", error);
    processQueue(error);
    
    // Clear tokens and cookies
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Only redirect to login if not on an auth page
    if (typeof window !== 'undefined') {
      const authRoutes = ['/login', '/register', '/get-started', '/verify', '/forgot-password'];
      const currentPath = window.location.pathname;
      
      if (!authRoutes.some(route => currentPath.startsWith(route))) {
        redirectToLogin();
      }
    }
    
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
};

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Skip token refresh for authentication routes
    if (typeof window !== 'undefined') {
      const authRoutes = ['/login', '/register', '/get-started', '/verify', '/forgot-password'];
      const currentPath = window.location.pathname;
      
      // Skip refresh if we're on an auth route
      if (authRoutes.some(route => currentPath.startsWith(route))) {
        return response;
      }
    }
    
    // Check for unauthorized response
    if (
      response.data?.success === false &&
      response.data?.error === "Unauthorized"
    ) {
      console.log('[Auth] Detected unauthorized response, attempting refresh');
      return refreshTokenAndRetry(response.config);
    }
    
    // Check for invalid refresh token
    if (
      response.data?.success === false &&
      response.data?.error === "Invalid refresh token"
    ) {
      console.log('[Auth] Invalid refresh token detected');
      if (typeof window !== 'undefined') {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        
        // Don't redirect if on auth pages
        const authRoutes = ['/login', '/register', '/get-started', '/verify', '/forgot-password'];
        const currentPath = window.location.pathname;
        
        if (!authRoutes.some(route => currentPath.startsWith(route))) {
          redirectToLogin();
        }
      }
      return Promise.reject(new Error("Invalid refresh token"));
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Skip token refresh for authentication endpoints
    if (typeof window !== 'undefined') {
      const authRoutes = ['/login', '/register', '/get-started', '/verify', '/forgot-password'];
      const currentPath = window.location.pathname;
      
      // Skip refresh if we're on an auth route
      if (authRoutes.some(route => currentPath.startsWith(route))) {
        return Promise.reject(error);
      }
      
      // Also skip if the request URL contains auth endpoints
      const url = originalRequest.url || '';
      if (url.includes('/auth/login') || 
          url.includes('/auth/register') || 
          url.includes('/auth/verify') || 
          url.includes('/auth/forgot-password')) {
        return Promise.reject(error);
      }
    }

    // Check for 401 Unauthorized or 403 Forbidden status
    if (
      error.response?.status === 401 ||
      error.response?.status === 403 ||
      (error.response?.data as TokenResponse)?.error === "Unauthorized"
    ) {
      console.log('[Auth] Received', error.response?.status, 'error, attempting token refresh');
      originalRequest._retry = true;
      return refreshTokenAndRetry(originalRequest);
    }

    return Promise.reject(error);
  },
);

// Token refresh setup with Next.js App Router considerations
const setupTokenRefresh = () => {
  if (typeof window === "undefined") return;

  const refreshInterval = setInterval(
    async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken && !isRefreshing) {
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh-token`,
            { refreshToken },
            { headers: { "Content-Type": "application/json" } },
          );

          if (data.success && data.data?.tokens) {
            localStorage.setItem("accessToken", data.data.tokens.accessToken);
            api.defaults.headers.common["Authorization"] =
              `Bearer ${data.data.tokens.accessToken}`;
          }
        } catch (error: unknown) {
          console.error("Failed to refresh token:", error);
        }
      }
    },
    14 * 60 * 1000,
  );

  window.addEventListener("unload", () => clearInterval(refreshInterval));
};

if (typeof window !== "undefined") {
  setupTokenRefresh();
}

export { api };
