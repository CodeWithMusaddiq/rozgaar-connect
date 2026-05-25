import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApplications } from "../../hooks/useApplications.js";
import {
  ArrowLeft, User, Phone, Mail, MapPin, CheckCircle, XCircle,
  MessageCircle, Filter, Search, Calendar, GraduationCap, Loader2,
} from "lucide-react";

/**
 * ApplicationsPage - Connected to backend, real applications
 */
const ApplicationsPage = () => {
  const {
    applications,
    loading,
    error,
    fetchReceivedApplications,
    updateStatus,
  } = useApplications();

  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch applications on mount
  useEffect(() => {
    fetchReceivedApplications();
  }, [fetchReceivedApplications]);

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    await updateStatus(id, { status });
    setUpdatingId(null);
  };

  const filteredApps = applications.filter((app) => {
    const matchesFilter = filter === "all" || app.status === filter;
    const matchesSearch =
      app.applicant?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted": return "bg-green-50 text-green-700";
      case "rejected": return "bg-red-50 text-red-700";
      default: return "bg-yellow-50 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/owner/dashboard"
          className="inline-flex items-center gap-2 text-[#374151] hover:text-[#0F172A] mb-6 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Applications</h1>
            <p className="text-[#374151] text-sm mt-1">Review and manage job applications</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or job title..."
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl text-sm outline-none placeholder:text-gray-400 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-sm outline-none text-[#374151] cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-4">
          {loading && applications.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#0F172A]" />
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-[#0F172A]">No applications found</h3>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            filteredApps.map((app) => (
              <div key={app._id} className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                  {/* Applicant Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 bg-[#0F172A] rounded-xl flex items-center justify-center shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-[#0F172A]">
                          {app.applicant?.fullName || "Unknown"}
                        </h3>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>

                      <p className="text-sm text-[#374151] mb-3">
                        Applied for <span className="font-medium text-[#0F172A]">{app.job?.title}</span>
                      </p>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#374151]">
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {app.applicant?.email}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {app.applicant?.phone}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {app.applicant?.location || "N/A"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                          {app.applicant?.education || "N/A"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {app.coverMessage && (
                        <div className="mt-3 p-3 bg-[#F3F4F6] rounded-xl">
                          <p className="text-xs text-gray-400 mb-1">Cover Message:</p>
                          <p className="text-sm text-[#374151]">{app.coverMessage}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:flex-col xl:flex-row">
                    {app.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(app._id, "accepted")}
                          disabled={updatingId === app._id}
                          className="flex items-center gap-1.5 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
                        >
                          {updatingId === app._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app._id, "rejected")}
                          disabled={updatingId === app._id}
                          className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-700 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                    <Link
                      to="/chat"
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0F172A] text-white rounded-xl text-sm font-medium hover:bg-[#1e293b] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;
