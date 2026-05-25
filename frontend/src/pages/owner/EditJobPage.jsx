import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useJobs } from "../../hooks/useJobs.js";
import {
  ArrowLeft, Briefcase, MapPin, IndianRupee, Clock,
  FileText, CheckCircle, Save, Loader2,
} from "lucide-react";

/**
 * EditJobPage - Connected to backend, updates real jobs
 */
const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { job, loading, fetchJobById, updateJob } = useJobs();
  const [formError, setFormError] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    type: "Full-time",
    experience: "",
    description: "",
    requirements: "",
  });

  // Fetch job data
  useEffect(() => {
    const loadJob = async () => {
      setIsFetching(true);
      const fetchedJob = await fetchJobById(id);
      if (fetchedJob) {
        setFormData({
          title: fetchedJob.title || "",
          location: fetchedJob.location || "",
          salaryMin: fetchedJob.salaryMin?.toString() || "",
          salaryMax: fetchedJob.salaryMax?.toString() || "",
          type: fetchedJob.type || "Full-time",
          experience: fetchedJob.experience || "",
          description: fetchedJob.description || "",
          requirements: fetchedJob.requirements || "",
        });
      }
      setIsFetching(false);
    };
    loadJob();
  }, [id, fetchJobById]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const result = await updateJob(id, {
      ...formData,
      salaryMin: Number(formData.salaryMin),
      salaryMax: Number(formData.salaryMax),
    });

    if (result.success) {
      navigate("/owner/dashboard");
    } else {
      setFormError(result.message || "Failed to update job");
    }
  };

  const jobTypes = ["Full-time", "Part-time", "Internship", "Contract"];

  if (isFetching) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#0F172A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-6 sm:py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/owner/dashboard"
          className="inline-flex items-center gap-2 text-[#374151] hover:text-[#0F172A] mb-6 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Edit Job</h1>
          <p className="text-[#374151] text-sm mt-1">Update the details for this job posting</p>
        </div>

        {formError && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Job Title</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Sales Assistant, Cashier, Delivery Boy"
                className="w-full pl-12 pr-4 py-3 bg-[#F3F4F6] rounded-xl text-sm outline-none placeholder:text-gray-400 border border-transparent focus:border-[#0F172A] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Charminar, Hyderabad"
                className="w-full pl-12 pr-4 py-3 bg-[#F3F4F6] rounded-xl text-sm outline-none placeholder:text-gray-400 border border-transparent focus:border-[#0F172A] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Salary Range (per month)</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  placeholder="Min"
                  className="w-full pl-12 pr-4 py-3 bg-[#F3F4F6] rounded-xl text-sm outline-none placeholder:text-gray-400 border border-transparent focus:border-[#0F172A] transition-colors"
                  required
                />
              </div>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  placeholder="Max"
                  className="w-full pl-12 pr-4 py-3 bg-[#F3F4F6] rounded-xl text-sm outline-none placeholder:text-gray-400 border border-transparent focus:border-[#0F172A] transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Job Type</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-[#F3F4F6] rounded-xl text-sm outline-none border border-transparent focus:border-[#0F172A] transition-colors appearance-none"
                >
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">Experience Required</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 0-1 year, Fresher"
                className="w-full px-4 py-3 bg-[#F3F4F6] rounded-xl text-sm outline-none placeholder:text-gray-400 border border-transparent focus:border-[#0F172A] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Job Description</label>
            <div className="relative">
              <FileText className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the job responsibilities, work hours, and what you are looking for..."
                rows={4}
                className="w-full pl-12 pr-4 py-3 bg-[#F3F4F6] rounded-xl text-sm outline-none placeholder:text-gray-400 border border-transparent focus:border-[#0F172A] transition-colors resize-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Requirements</label>
            <div className="relative">
              <CheckCircle className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="List the skills, qualifications, and requirements..."
                rows={3}
                className="w-full pl-12 pr-4 py-3 bg-[#F3F4F6] rounded-xl text-sm outline-none placeholder:text-gray-400 border border-transparent focus:border-[#0F172A] transition-colors resize-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#0F172A] hover:bg-[#1e293b] disabled:bg-gray-400 text-white py-3.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </button>
            <Link
              to="/owner/dashboard"
              className="flex-1 bg-[#F3F4F6] hover:bg-gray-200 text-[#374151] py-3.5 rounded-xl font-semibold text-sm transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobPage;
