import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { dummyJobs } from "../data/dummyJobs";
import { hyderabadAreas } from "../data/hyderabadAreas";

import JobGrid from "../components/jobs/JobGrid";
import JobFilters from "../components/jobs/JobFilters";

import {
  Search,
  MapPin,
  SlidersHorizontal,
  Zap,
  Flame,
} from "lucide-react";

const HomePage = () => {
  const [jobs, setJobs] = useState(dummyJobs);

  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    area: "all",
    type: "all",
    minSalary: "",
  });

  const [loading, setLoading] = useState(true);

  const [showFilters, setShowFilters] = useState(false);

  // FETCH JOBS
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const response = await api.get("/jobs");

      const backendJobs =
        response?.data?.data?.jobs || [];

      // MERGE REAL + DUMMY JOBS
      setJobs([
        ...backendJobs,
        ...dummyJobs,
      ]);
    } catch (error) {
      console.log("Using dummy jobs only");

      setJobs(dummyJobs);
    } finally {
      setLoading(false);
    }
  };

  // FILTER JOBS
  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    // SEARCH
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();

      filtered = filtered.filter((job) => {
        const nearbyMatch =
          job.nearbyAreas?.some((area) =>
            area.toLowerCase().includes(q)
          );

        return (
          job.title?.toLowerCase().includes(q) ||
          job.location?.toLowerCase().includes(q) ||
          job.shopName?.toLowerCase().includes(q) ||
          nearbyMatch
        );
      });
    }

    // AREA FILTER
    if (filters.area !== "all") {
      filtered = filtered.filter(
        (job) =>
          job.location?.toLowerCase() ===
          filters.area.toLowerCase()
      );
    }

    // TYPE FILTER
    if (filters.type !== "all") {
      filtered = filtered.filter(
        (job) =>
          job.type?.toLowerCase() ===
          filters.type.toLowerCase()
      );
    }

    // SALARY FILTER
    if (filters.minSalary) {
      filtered = filtered.filter(
        (job) =>
          Number(job.salaryMin || 0) >=
          Number(filters.minSalary)
      );
    }

    return filtered;
  }, [jobs, searchQuery, filters]);

  const featuredJobs = filteredJobs.slice(0, 6);

  const clearFilters = () => {
    setFilters({
      area: "all",
      type: "all",
      minSalary: "",
    });

    setSearchQuery("");
  };

  const categories = [
    { name: "Food & Beverage", icon: "🍔", count: 18 },
    { name: "Retail", icon: "🛍️", count: 22 },
    { name: "Delivery", icon: "🛵", count: 15 },
    { name: "Hospitality", icon: "🏨", count: 12 },
    { name: "Fitness", icon: "💪", count: 8 },
    { name: "Beauty", icon: "💇", count: 10 },
    { name: "Technology", icon: "💻", count: 7 },
    { name: "Sales", icon: "📈", count: 14 },
  ];

  return (
    <div className="w-full">

      {/* HERO */}
      <section className="relative bg-[#0F172A] text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 py-20">

          <div className="max-w-2xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-medium mb-6">
              <Zap className="w-3.5 h-3.5 text-[#22C55E]" />
              {jobs.length}+ Jobs Available in Hyderabad
            </div>

            <h1 className="text-5xl font-bold leading-tight mb-5">
              Find Local Jobs in{" "}
              <span className="text-[#22C55E]">
                Hyderabad
              </span>
            </h1>

            <p className="text-gray-300 mb-8">
              Connect with nearby shop owners and discover jobs instantly.
            </p>

            {/* SEARCH */}
            <div className="bg-white rounded-2xl p-2 shadow-2xl">

              <div className="flex flex-col sm:flex-row gap-2">

                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-[#F3F4F6] rounded-xl">
                  <Search className="w-4 h-4 text-gray-400" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    placeholder="Search jobs..."
                    className="bg-transparent outline-none text-black w-full"
                  />
                </div>

                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-[#F3F4F6] rounded-xl">
                  <MapPin className="w-4 h-4 text-gray-400" />

                  <select
                    value={filters.area}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        area: e.target.value,
                      })
                    }
                    className="bg-transparent outline-none text-black w-full"
                  >
                    <option value="all">
                      All Areas
                    </option>

                    {hyderabadAreas.map((area) => (
                      <option
                        key={area}
                        value={area}
                      >
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="bg-[#22C55E] hover:bg-[#16a34a] text-white px-6 py-3 rounded-xl font-semibold">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">

          <h2 className="text-2xl font-bold mb-6">
            Trending Categories
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">

            {categories.map((cat) => (
              <div
                key={cat.name}
                className="bg-[#F3F4F6] rounded-2xl p-4 text-center"
              >
                <div className="text-2xl mb-2">
                  {cat.icon}
                </div>

                <div className="text-sm font-medium">
                  {cat.name}
                </div>

                <div className="text-xs text-gray-500">
                  {cat.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="py-10 bg-[#F3F4F6]">
        <div className="max-w-7xl mx-auto px-4">

          <div className="flex items-center gap-3 mb-6">
            <Flame className="w-5 h-5 text-red-500" />

            <h2 className="text-2xl font-bold">
              Featured Jobs
            </h2>
          </div>

          <JobGrid
            jobs={featuredJobs}
            loading={loading}
          />
        </div>
      </section>

      {/* ALL JOBS */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">

          <div className="flex justify-between items-center mb-6">

            <div>
              <h2 className="text-2xl font-bold">
                All Jobs
              </h2>

              <p className="text-gray-500">
                {filteredJobs.length} jobs found
              </p>
            </div>

            <button
              onClick={() =>
                setShowFilters(!showFilters)
              }
              className="sm:hidden bg-gray-100 p-2 rounded-lg"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-6">

            <div className="hidden sm:block w-64 shrink-0">
              <JobFilters
                filters={filters}
                onChange={setFilters}
                onClear={clearFilters}
              />
            </div>

            <div className="flex-1">
              <JobGrid
                jobs={filteredJobs}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;