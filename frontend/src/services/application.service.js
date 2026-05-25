import api from "./api.js";

/**
 * Applications API Service
 */
export const applicationService = {
  /**
   * Apply for a job (seeker)
   */
  applyForJob: async (applicationData) => {
    const response = await api.post("/applications", applicationData);
    return response.data;
  },

  /**
   * Get my applications (seeker)
   */
  getMyApplications: async (params = {}) => {
    const response = await api.get("/applications/my-applications", { params });
    return response.data;
  },

  /**
   * Get received applications (owner)
   */
  getReceivedApplications: async (params = {}) => {
    const response = await api.get("/applications/received", { params });
    return response.data;
  },

  /**
   * Update application status (owner)
   */
  updateStatus: async (id, statusData) => {
    const response = await api.put(`/applications/${id}/status`, statusData);
    return response.data;
  },

  /**
   * Withdraw application (seeker)
   */
  withdrawApplication: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },

  /**
   * Get single application
   */
  getApplicationById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },
};
