import api from './api.js';

// ─── Auth Service ───────────────────────────────────────────────────

/**
 * Register a new user account.
 * @param {{ name: string, email: string, password: string }} data
 * @returns {Promise<{ data: object }>}
 */
export const registerUser = async ({ name, email, password }) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

/**
 * Log in with email and password.
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ data: object }>}
 */
export const loginUser = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Get the currently authenticated user's profile.
 * @returns {Promise<{ data: object }>}
 */
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * Update current user's profile.
 * @param {object} data - Fields to update (name, bio, skills, experience, avatar)
 * @returns {Promise<{ data: object }>}
 */
export const updateProfile = async (data) => {
  const response = await api.put('/auth/me', data);
  return response.data;
};

/**
 * Change current user's password.
 * @param {{ currentPassword: string, newPassword: string }} data
 * @returns {Promise<{ data: object }>}
 */
export const changePassword = async ({ currentPassword, newPassword }) => {
  const response = await api.put('/auth/change-password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};
