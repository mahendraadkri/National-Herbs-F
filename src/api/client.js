// src/api/client.js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g., "https://api.yourapp.com"
  timeout: 15000,
  // If your API uses httpOnly cookies for auth, set this to true:
  // withCredentials: true,
});

// ---- Request: attach token from localStorage if present ----
api.interceptors.request.use(
  (config) => {
    // If AuthContext hasn't run yet on a fresh reload,
    // make sure requests still carry the token.
    const token = localStorage.getItem("token");
    if (token && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response: pass through; normalize errors without redirecting ----
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const serverMsg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message;

    let message = "Network error";
    if (serverMsg) message = serverMsg;
    else if (status === 401) message = "Unauthorized";
    else if (status === 403) message = "Forbidden";
    else if (status === 404) message = "Not found";
    else if (status >= 500) message = "Server error";

    // Tag common auth case so callers can decide what to do.
    const normalized = new Error(message);
    normalized.status = status;
    normalized.data = error?.response?.data;
    normalized.__unauthorized = status === 401;

    // IMPORTANT: Do NOT clear token or redirect here.
    // Let AuthContext/ProtectedRoute handle auth flow.
    return Promise.reject(normalized);
  }
);