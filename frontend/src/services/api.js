import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "/api",
});

// Request Interceptor: Every outgoing request gets JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ss_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handles expired or invalid session smoothly
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("ss_token");
      localStorage.removeItem("ss_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;