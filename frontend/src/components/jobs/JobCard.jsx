import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Clock, Bookmark, BookmarkCheck, Zap, BadgeCheck,
  IndianRupee, ArrowRight, Building2,
} from "lucide-react";

const JobCard = ({ job }) => {
  const [saved, setSaved] = useState(false);
  if (!job) return null;

  const avatarColors = [
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
  ];
  const colorIndex = (job.title?.charCodeAt(0) || 0) % avatarColors.length;
  const avatarClass = avatarColors[colorIndex];

  const companyName = job.company  || job.shopName  || "Local Shop";
  const jobId       = job.id       || job._id;
  const isVerified  = job.verified ?? job.isVerified ?? false;
  const isUrgent    = job.urgent   ?? job.isUrgent   ?? false;
  const jobLocation = job.location || job.area       || "Hyderabad";
  const jobType     = job.type     || job.jobType    || "Full Time";
  const jobSalary   = job.salary   || job.salaryRange || "Negotiable";

  const initials  = companyName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const typeColor = jobType === "Part Time"
    ? "bg-blue-50 text-blue-700 border-blue-100"
    : "bg-emerald-50 text-emerald-700 border-emerald-100";

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      {/* Badges + bookmark */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {isUrgent && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 text-xs font-semibold rounded-full">
              <Zap className="w-3 h-3" /> Urgent
            </span>
          )}
          {isVerified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-sky-600 border border-sky-100 text-xs font-semibold rounded-full">
              <BadgeCheck className="w-3 h-3" /> Verified
            </span>
          )}
        </div>
        <button
          onClick={() => setSaved(!saved)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-[#0F172A]"
        >
          {saved
            ? <BookmarkCheck className="w-4 h-4 text-[#0F172A]" />
            : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      {/* Avatar + Title */}
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${avatarClass}`}>
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-[#0F172A] text-base leading-snug line-clamp-1 group-hover:text-[#22C55E] transition-colors">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1 line-clamp-1">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            {companyName}
          </p>
        </div>
      </div>

      {/* Type + Location chips */}
      <div className="flex flex-wrap gap-2">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border rounded-full ${typeColor}`}>
          <Clock className="w-3 h-3" /> {jobType}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 text-gray-600 border border-gray-100 text-xs font-medium rounded-full">
          <MapPin className="w-3 h-3" /> {jobLocation}
        </span>
      </div>

      {/* Salary */}
      <div className="flex items-center gap-1 text-[#22C55E] font-bold text-sm">
        <IndianRupee className="w-3.5 h-3.5" />
        {jobSalary}
      </div>

      {/* Description */}
      {job.description && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{job.description}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-1">
        <Link
          to={`/jobs/${jobId}`}
          className="flex-1 text-center px-3 py-2.5 rounded-xl text-sm font-medium bg-[#F3F4F6] text-[#374151] hover:bg-gray-200 transition-colors"
        >
          View Details
        </Link>
        <Link
          to={`/jobs/${jobId}`}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold bg-[#0F172A] text-white hover:bg-[#1e293b] transition-colors"
        >
          Apply Now <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;