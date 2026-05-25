import { useState, useCallback } from "react";
import { applicationService } from "../services/application.service.js";

/**
 * useApplications - Custom hook for application-related operations
 */
export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  /**
   * Apply for a job
   */
  const applyForJob = useCallback(async (applicationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationService.applyForJob(applicationData);
      if (response.success) {
        setApplications((prev) => [response.data.application, ...prev]);
        return { success: true, application: response.data.application };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch my applications (seeker)
   */
  const fetchMyApplications = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationService.getMyApplications(params);
      if (response.success) {
        setApplications(response.data.applications);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch received applications (owner)
   */
  const fetchReceivedApplications = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationService.getReceivedApplications(params);
      if (response.success) {
        setApplications(response.data.applications);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update application status (accept/reject)
   */
  const updateStatus = useCallback(async (id, statusData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationService.updateStatus(id, statusData);
      if (response.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app._id === id ? response.data.application : app
          )
        );
        return { success: true };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Withdraw application
   */
  const withdrawApplication = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await applicationService.withdrawApplication(id);
      setApplications((prev) => prev.filter((app) => app._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    applications,
    loading,
    error,
    pagination,
    applyForJob,
    fetchMyApplications,
    fetchReceivedApplications,
    updateStatus,
    withdrawApplication,
    setApplications,
  };
};
