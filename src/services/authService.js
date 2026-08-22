import api from './api';

/**
 * Extract a user-friendly error message from an API error response.
 * Handles network errors, backend validation errors, and generic failures.
 */
const extractErrorMessage = (error, fallback = 'An unexpected error occurred.') => {
  // Network error (server not running, CORS, DNS failure)
  if (!error.response) {
    if (error.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
    if (error.message?.includes('Network Error') || error.message?.includes('ERR_NETWORK'))
      return 'Unable to connect to server. Please check if the backend is running.';
    return 'Unable to connect to server. Please check your network connection.';
  }

  const { status, data } = error.response;

  // Try to extract message from common backend response shapes
  const msg =
    data?.message ||
    data?.error ||
    data?.detail ||
    (typeof data === 'string' ? data : null);

  if (status === 400) {
    return msg || 'Invalid input. Please check your details and try again.';
  }
  if (status === 409) {
    return msg || 'This email is already registered. Please use a different email or login.';
  }
  if (status === 401) {
    return msg || 'Invalid credentials. Please check your email and password.';
  }
  if (status === 403) {
    return msg || 'You do not have permission to perform this action.';
  }
  if (status === 404) {
    return msg || 'The requested resource was not found.';
  }
  if (status === 500) {
    return msg || 'Server error. Please try again later.';
  }

  // Fallback to any message the backend sent
  return msg || `Request failed (${status}). Please try again.`;
};

const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      // Attach a friendly message to the error before re-throwing
      error.friendlyMessage = extractErrorMessage(error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response;
    } catch (error) {
      error.friendlyMessage = extractErrorMessage(error);
      throw error;
    }
  },

  getProfile: () => {
    return api.get('/auth/profile');
  },

  updateProfile: (userId, profileData) => {
    return api.put(`/users/${userId}`, profileData);
  },
};

export default authService;
