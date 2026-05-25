import api from "./api.js";

/**
 * Users API Service
 */
export const userService = {
  /**
   * Get all users
   */
  getAllUsers: async (params = {}) => {
    const response = await api.get("/users", { params });
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Update own profile
   */
  updateProfile: async (profileData) => {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  },

  /**
   * Delete own account
   */
  deleteAccount: async () => {
    const response = await api.delete("/users/me");
    return response.data;
  },
};
