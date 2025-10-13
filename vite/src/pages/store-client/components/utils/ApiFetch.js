import { toast } from "sonner";
import { API_BASE_URL } from "../../../../config/endpoin.config";

// src/utils/apiFetch.js
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const apiFetch = async (url, options = {}) => {
  // Directly get token and refreshToken from localStorage
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  const headers = {
    ...(!(options.body instanceof FormData) && { "Content-Type": "application/json" }),
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    // Handle unauthorized (401) – refresh token logic
    if (res.status === 401) {
      if (!refreshToken) {
        toast.error(res.message)
        // No refresh token: just reject, don’t remove anything
        return Promise.reject("Unauthorized: No refresh token");
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/user/refreshToken`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (!refreshRes.ok) {
            isRefreshing = false;
            processQueue("You are not loged In", null);
            return Promise.reject(await refreshRes.json());
          }

          const refreshData = await refreshRes.json();
          localStorage.setItem("token", refreshData.accessToken);
          isRefreshing = false;
          processQueue(null, refreshData.accessToken);
        } catch (err) {
          isRefreshing = false;
          processQueue(err, null);
          return Promise.reject(err);
        }
      } else {
        // Queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(newToken => {
          options.headers = { ...options.headers, Authorization: `Bearer ${newToken}` };
          return apiFetch(url, options);
        });
      }

      // Retry original request after refresh
      const newToken = localStorage.getItem("token");
      options.headers = { ...options.headers, Authorization: `Bearer ${newToken}` };
      return apiFetch(url, options);
    }

    if (!res.ok) {
      // API error: just reject with the message
      throw new Error(data.message || `API Error: ${res.status}`);
    }

    return data;

  } catch (error) {
    // Return error without clearing tokens
    return Promise.reject(error);
  }
};
