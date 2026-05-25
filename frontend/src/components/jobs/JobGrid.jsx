import React, { useState } from "react";
import JobCard from "./JobCard";
import { Loader2, PackageSearch, ChevronDown } from "lucide-react";

const INITIAL_COUNT = 9;
const LOAD_MORE_COUNT = 6;

/**
 * Skeleton card for loading state
 */
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="h-5 w-20 bg-gray-100 rounded-full" />
      <div className="h-5 w-5 bg-gray-100 rounded" />
    </div>
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 bg-gray-100 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-20 bg-gray-100 rounded-full" />
      <div className="h-6 w-24 bg-gray-100 rounded-full" />
    </div>
    <div className="h-5 w-32 bg-gray-100 rounded" />
    <div className="h-3 bg-gray-100 rounded w-full" />
    <div className="h-3 bg-gray-100 rounded w-2/3" />
    <div className="flex gap-2 mt-auto pt-1">
      <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
      <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
    </div>
  </div>
);

/**
 * JobGrid - Responsive grid with load more system
 * Shows 9 jobs initially, load 6 more per click
 */
const JobGrid = ({ jobs = [], loading = false, emptyMessage = "No jobs found" }) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <PackageSearch className="w-14 h-14 text-gray-200 mb-4" />
        <p className="text-[#0F172A] font-semibold text-lg">{emptyMessage}</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  const visibleJobs = jobs.slice(0, visibleCount);
  const hasMore = visibleCount < jobs.length;

  return (
    <div className="space-y-6">
      {/* Grid — 1 col mobile, 2 tablet, 3 desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleJobs.map((job) => (
          <JobCard key={job._id || job.id} job={job} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex flex-col items-center gap-2 pt-2">
          <p className="text-sm text-gray-400">
            Showing {visibleJobs.length} of {jobs.length} jobs
          </p>
          <button
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F172A] text-white rounded-xl text-sm font-semibold hover:bg-[#1e293b] transition-colors shadow-sm"
          >
            Load More <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* All loaded */}
      {!hasMore && jobs.length > INITIAL_COUNT && (
        <p className="text-center text-sm text-gray-400 pt-2">
          ✓ All {jobs.length} jobs loaded
        </p>
      )}
    </div>
  );
};

export default JobGrid;