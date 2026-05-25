import { useState, useEffect, useCallback } from "react";
import { jobService } from "../services/job.service.js";

/**
 * useJobs - Custom hook for job-related operations
 */
export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  /**
   * Fetch all jobs with optional filters
   */
  const fetchJobs = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobService.getAllJobs(params);
      if (response.success) {
        setJobs(response.data.jobs);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch single job by ID
   */
  const fetchJobById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobService.getJobById(id);
      if (response.success) {
        setJob(response.data.job);
        return response.data.job;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch nearby jobs
   */
  const fetchNearbyJobs = useCallback(async (location, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobService.getNearbyJobs(location, params);
      if (response.success) {
        setJobs(response.data.jobs);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new job
   */
  const createJob = useCallback(async (jobData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobService.createJob(jobData);
      if (response.success) {
        setJobs((prev) => [response.data.job, ...prev]);
        return { success: true, job: response.data.job };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update job
   */
  const updateJob = useCallback(async (id, jobData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobService.updateJob(id, jobData);
      if (response.success) {
        setJobs((prev) =>
          prev.map((j) => (j._id === id ? response.data.job : j))
        );
        setJob(response.data.job);
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
   * Delete job
   */
  const deleteJob = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await jobService.deleteJob(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    jobs,
    job,
    loading,
    error,
    pagination,
    fetchJobs,
    fetchJobById,
    fetchNearbyJobs,
    createJob,
    updateJob,
    deleteJob,
    setJobs,
    setJob,
  };
};
