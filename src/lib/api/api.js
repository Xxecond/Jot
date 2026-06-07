import axios from "axios";

const isBrowser = typeof window !== "undefined";

const api = axios.create({
  baseURL: isBrowser ? "" : process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔥 REQUIRED (cookie auth)
});

export default api;