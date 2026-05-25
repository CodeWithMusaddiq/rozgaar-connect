import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useJobs } from "../../hooks/useJobs.js";
import {
  Plus, Briefcase, Users, Eye, TrendingUp, Edit3, Trash2,
  Clock, MapPin, IndianRupee, Loader2,
} from "lucide-react";

/**
 * OwnerDashboard - Connected to backend, shows real data
 */
const OwnerDashboard = () => {
  const { user } = useAuth();
  const { jobs, loading, error, fetchJobs, deleteJob } = useJobs();

  // Fetch owner's jobs on mount
  useEffect(() => {
    fetchJobs({ limit: 10 });
    // Note: In a real app, you'd use getMyJobs endpoint. For now using getAllJobs filtered by owner
  }, [fetchJobs]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await deleteJob(id);
    }
  };

  // Calculate stats from jobs
  const stats = [
    {
      label: "Active Jobs",
      value: jobs.filter((j) => j.status === "active").length,
      icon: Briefcase,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Applications",
      value: jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0),
      icon: Users,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Total Views",
      value: jobs.reduce((sum, j) => sum + (j.viewCount || 0), 0),
      icon: Eye,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Total Jobs",
      value: jobs.length,
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Owner Dashboard
            </h1>
            <p className="text-[#374151] text-sm mt-1">
              Welcome back, {user?.fullName?.split(" ")[0]}
            </p>
          </div>
          <Link
            to="/owner/add-job"
            className="inline-flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#16a34a] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Post New Job
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#0F172A]">{stat.value}</div>
                <div className="text-sm text-[#374151] mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* My Jobs Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0F172A]">My Job Listings</h2>
            {loading && <Loader2 className="w-5 h-5 animate-spin text-[#0F172A]" />}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-b border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="divide-y divide-gray-100">
            {jobs.length === 0 && !loading ? (
              <div className="p-10 text-center text-gray-400">
                <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No jobs posted yet</p>
                <Link to="/owner/add-job" className="text-[#0F172A] font-medium text-sm hover:underline mt-2 inline-block">
                  Post your first job
                </Link>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job._id} className="p-5 sm:p-6 hover:bg-[#F3F4F6]/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[#0F172A]">{job.title}</h3>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                          job.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {job.status === "active" ? "Active" : "Closed"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm text-[#374151]">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {job.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-gray-400">
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                        <Link
                          to="/owner/applications"
                          className="text-xs font-medium text-[#0F172A] hover:underline"
                        >
                          {job.applicationCount || 0} applications
                        </Link>
                        <span className="text-xs text-gray-400">
                          {job.viewCount || 0} views
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/owner/edit-job/${job._id}`}
                        className="p-2.5 bg-[#F3F4F6] text-[#374151] rounded-xl hover:bg-gray-200 transition-colors"
                        title="Edit Job"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
