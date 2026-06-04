import axios from "axios";

const isBrowser = typeof window !== "undefined";

const api = axios.create({
  // Use relative URLs in the browser (same-origin) to avoid CORS/network errors.
  // On the server or in non-browser contexts, use NEXT_PUBLIC_API_URL if provided.
  baseURL: isBrowser ? "" : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  // ✅ CRITICAL: Allow cookies to be sent with requests (HttpOnly cookies, etc.)
  withCredentials: true,
});

// Attach token automatically from localStorage/sessionStorage
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || sessionStorage.getItem("token")
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle 401 errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      }
    }
    return Promise.reject(error);
  }
);

export default api;