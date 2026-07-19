import { create } from 'zustand';
import { loginUser, registerUser, getMe } from '../services/authService.js';

/**
 * Authentication store — manages user session, token persistence,
 * login/register/logout actions, and initial auth hydration.
 */
const useAuthStore = create((set) => ({
  // ─── State ──────────────────────────────────────────────────────────
  user: JSON.parse(localStorage.getItem('interviewiq_user') || 'null'),
  token: localStorage.getItem('interviewiq_token') || null,
  isAuthenticated: !!localStorage.getItem('interviewiq_token'),
  isLoading: false,
  isHydrating: true, // True until initial auth check completes
  error: null,

  // ─── Actions ────────────────────────────────────────────────────────

  /**
   * Log in with email and password.
   */
  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const result = await loginUser({ email, password });
      const { token, ...user } = result.data;

      localStorage.setItem('interviewiq_token', token);
      localStorage.setItem('interviewiq_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, message: err.message };
    }
  },

  /**
   * Register a new account.
   */
  register: async ({ name, email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const result = await registerUser({ name, email, password });
      const { token, ...user } = result.data;

      localStorage.setItem('interviewiq_token', token);
      localStorage.setItem('interviewiq_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, message: err.message };
    }
  },

  /**
   * Log out — clear all auth state and local storage.
   */
  logout: () => {
    localStorage.removeItem('interviewiq_token');
    localStorage.removeItem('interviewiq_user');

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  /**
   * Hydrate auth state on app load — verify stored token is still valid
   * by calling getMe. If token is expired/invalid, auto-logout.
   */
  checkAuth: async () => {
    const token = localStorage.getItem('interviewiq_token');

    if (!token) {
      set({ isHydrating: false, isAuthenticated: false });
      return;
    }

    try {
      const result = await getMe();
      const user = result.data;

      localStorage.setItem('interviewiq_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isHydrating: false,
      });
    } catch {
      // Token invalid or expired — clean up
      localStorage.removeItem('interviewiq_token');
      localStorage.removeItem('interviewiq_user');

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isHydrating: false,
      });
    }
  },

  /**
   * Clear any stored error.
   */
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
