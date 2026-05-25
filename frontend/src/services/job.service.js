import api from "./api.js";

/**
 * Jobs API Service
 */
export const jobService = {
  /**
   * Get all jobs with filters
   */
  getAllJobs: async (params = {}) => {
    const response = await api.get("/jobs", { params });
    return response.data;
  },

  /**
   * Get nearby jobs
   */
  getNearbyJobs: async (location, params = {}) => {
    const response = await api.get("/jobs/nearby", {
      params: { location, ...params },
    });
    return response.data;
  },

  /**
   * Get single job by ID
   */
  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  /**
   * Create new job (owner only)
   */
  createJob: async (jobData) => {
    const response = await api.post("/jobs", jobData);
    return response.data;
  },

  /**
   * Update job (owner only)
   */
  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  /**
   * Delete job (owner only)
   */
  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  /**
   * Get jobs posted by logged-in owner
   */
  getMyJobs: async (params = {}) => {
    const response = await api.get("/jobs/my/listings", { params });
    return response.data;
  },
};
