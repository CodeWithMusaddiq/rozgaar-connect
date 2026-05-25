import api from "./api.js";

/**
 * Authentication API Service
 */
export const authService = {
  /**
   * Register a new user
   */
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  /**
   * Get current logged-in user
   */
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  /**
   * Update password
   */
  updatePassword: async (passwordData) => {
    const response = await api.put("/auth/password", passwordData);
    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
    }
    return response.data;
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  /**
   * Get stored user data
   */
  getStoredUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
