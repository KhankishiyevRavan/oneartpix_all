// services/api.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// --- Tokeni request-lərə qoş ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- 401 refresh axını üçün sadə növbə (queue) ---
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function isAuthUrl(url = "") {
  const u = url.toLowerCase();
  return (
    u.includes("/auth/login") ||
    u.includes("/auth/register") ||
    u.includes("/auth/refresh")
  );
}

// --- Tək response interceptor ---
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const originalRequest = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const url = originalRequest?.url || "";

    // Login/Register/Refresh cavablarını toxunmadan ötür
    if (isAuthUrl(url)) {
      return Promise.reject(error);
    }

    // Şifrə səhvi və s. üçün 400/422-ləri UI göstərəcək — redirect etmə
    if (status === 400 || status === 422) {
      return Promise.reject(error);
    }

    // Yalnız access token vaxtı bitəndə 401 üçün refresh et
    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      // Eyni vaxtda gələn çoxlu 401-ləri gözlət
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addSubscriber((newToken) => {
            try {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest));
            } catch (e) {
              reject(e);
            }
          });
        });
      }

      isRefreshing = true;
      try {
        // Refresh üçün base axios istifadə et (interceptor-lardan yan keçsin)
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = res.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token in refresh response");
        }

        localStorage.setItem("token", newAccessToken);
        onRefreshed(newAccessToken);

        // orijinal sorğunu yeni tokenlə təkrar et
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        // Refresh də alınmadı — təmizlə və signin-ə yönləndir
        localStorage.removeItem("token");
        window.location.href = "/signin";
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Digər hallar
    return Promise.reject(error);
  }
);

export default api;
