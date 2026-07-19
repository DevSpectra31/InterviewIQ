import axios from 'axios';

// ─── Axios Instance ─────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ─── Request Interceptor: Attach JWT Token ──────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('interviewiq_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle Errors ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Auto-logout on 401 (expired / invalid token)
    if (response?.status === 401) {
      localStorage.removeItem('interviewiq_token');
      localStorage.removeItem('interviewiq_user');

      // Only redirect if we're not already on an auth page
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location.href = '/login';
      }
    }

    // Normalize error message
    const message =
      response?.data?.message ||
      response?.data?.errors?.[0]?.msg ||
      error.message ||
      'Something went wrong';

    return Promise.reject(new Error(message));
  }
);

export default api;
