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
    window.location.href = "/login";
  }
};

const refreshTokenAndRetry = async (
  failedRequest: InternalAxiosRequestConfig,
) => {
  try {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(failedRequest));
    }

    isRefreshing = true;
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh-token`,
      { refreshToken },
      { headers: { "Content-Type": "application/json" } },
    );

    if (data.success && data.data?.tokens) {
      localStorage.setItem("accessToken", data.data.tokens.accessToken);
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
      throw new Error("Token refresh failed");
    }
  } catch (error: unknown) {
    processQueue(error);
    localStorage.clear();
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    redirectToLogin();
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
    if (
      response.data?.success === false &&
      response.data?.error === "Unauthorized"
    ) {
      return refreshTokenAndRetry(response.config);
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

    if (
      error.response?.status === 401 ||
      (error.response?.data as TokenResponse)?.error === "Unauthorized"
    ) {
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
