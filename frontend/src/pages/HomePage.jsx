// import React, { useState, useEffect, useMemo } from "react";
// import { Link } from "react-router-dom";
// import { dummyJobs, filterJobs } from "../data/dummyJobs.js";
// import { hyderabadAreas } from "../data/hyderabadAreas.js";
// import JobGrid from "../components/jobs/JobGrid.jsx";
// import JobFilters from "../components/jobs/JobFilters.jsx";
// import {
//   Search, MapPin, Briefcase, Star, ArrowRight,
//   SlidersHorizontal, Zap, Flame,
// } from "lucide-react";

// const HomePage = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filters, setFilters] = useState({
//     area: "all",
//     type: "all",
//     minSalary: "",
//     maxSalary: "",
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [loading, setLoading]         = useState(true);
//   const [activeCategory, setActiveCategory] = useState("all");

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 800);
//     return () => clearTimeout(timer);
//   }, []);

//   /* ── Core filter logic — runs whenever search OR filters change ── */
//   const filteredJobs = useMemo(() => {
//     let jobs = dummyJobs;

//     // 1. text search (title or location)
//     if (searchQuery.trim()) {
//       const q = searchQuery.toLowerCase();
//       jobs = jobs.filter(
//         (j) =>
//           j.title.toLowerCase().includes(q) ||
//           (j.location || "").toLowerCase().includes(q) ||
//           (j.company || "").toLowerCase().includes(q)
//       );
//     }

//     // 2. area filter
//     if (filters.area && filters.area !== "all") {
//       jobs = jobs.filter(
//         (j) => (j.location || "").toLowerCase() === filters.area.toLowerCase()
//       );
//     }

//     // 3. job type filter  (data uses "Full Time" / "Part Time")
//     if (filters.type && filters.type !== "all") {
//       const typeMap = {
//         "full-time":  "Full Time",
//         "part-time":  "Part Time",
//         "internship": "Internship",
//       };
//       const target = typeMap[filters.type] || filters.type;
//       jobs = jobs.filter(
//         (j) => (j.type || "").toLowerCase() === target.toLowerCase()
//       );
//     }

//     // 4. minimum salary filter
//     // salary field looks like "₹8000/month" — strip non-digits to compare
//     if (filters.minSalary) {
//       const min = parseInt(filters.minSalary, 10);
//       jobs = jobs.filter((j) => {
//         const raw = (j.salary || "").replace(/[^\d]/g, "");
//         return raw ? parseInt(raw, 10) >= min : true;
//       });
//     }

//     return jobs;
//   }, [searchQuery, filters]);

//   const featuredJobs = useMemo(() =>
//     dummyJobs.filter((j) => j.urgent || j.verified).slice(0, 6),
//   []);

//   const categories = [
//     { name: "Food & Beverage", icon: "🍔", count: 18 },
//     { name: "Retail",          icon: "🛍️", count: 22 },
//     { name: "Delivery",        icon: "🛵", count: 15 },
//     { name: "Hospitality",     icon: "🏨", count: 12 },
//     { name: "Fitness",         icon: "💪", count: 8  },
//     { name: "Beauty",          icon: "💇", count: 10 },
//     { name: "Technology",      icon: "💻", count: 7  },
//     { name: "Sales",           icon: "📈", count: 14 },
//   ];

//   const handleSearch = (e) => e.preventDefault();

//   const clearFilters = () => {
//     setFilters({ area: "all", type: "all", minSalary: "", maxSalary: "" });
//     setSearchQuery("");
//   };

//   const activeFilterCount = [
//     filters.area !== "all",
//     filters.type !== "all",
//     filters.minSalary !== "",
//     searchQuery !== "",
//   ].filter(Boolean).length;

//   return (
//     <div className="w-full">
//       {/* ── Hero ── */}
//       <section className="relative bg-[#0F172A] text-white overflow-hidden">
//         <div className="absolute inset-0 opacity-10 pointer-events-none">
//           <div className="absolute top-10 left-10 w-64 h-64 bg-[#22C55E] rounded-full blur-3xl" />
//           <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#F97316] rounded-full blur-3xl" />
//         </div>

//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
//           <div className="max-w-2xl mx-auto text-center">
//             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium mb-6">
//               <Zap className="w-3.5 h-3.5 text-[#22C55E]" />
//               100+ Jobs Available in Hyderabad
//             </div>

//             <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
//               Find Local Jobs in{" "}
//               <span className="bg-gradient-to-r from-[#22C55E] to-[#F97316] bg-clip-text text-transparent">
//                 Hyderabad
//               </span>
//             </h1>
//             <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed max-w-xl mx-auto">
//               Connect with nearby shop owners. Find part-time work, internships,
//               and full-time jobs right in your neighbourhood.
//             </p>

//             {/* Search Bar */}
//             <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 max-w-2xl mx-auto shadow-2xl">
//               <div className="flex flex-col sm:flex-row gap-2">
//                 <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-[#F3F4F6] rounded-xl">
//                   <Search className="w-4 h-4 text-gray-400 shrink-0" />
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Job title, shop name, keyword…"
//                     className="bg-transparent outline-none text-[#374151] w-full text-sm placeholder:text-gray-400"
//                   />
//                 </div>
//                 <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-[#F3F4F6] rounded-xl">
//                   <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
//                   <select
//                     value={filters.area}
//                     onChange={(e) => setFilters({ ...filters, area: e.target.value })}
//                     className="bg-transparent outline-none text-[#374151] w-full text-sm cursor-pointer"
//                   >
//                     <option value="all">All Areas</option>
//                     {hyderabadAreas.map((area) => (
//                       <option key={area} value={area}>{area}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <button
//                   type="submit"
//                   className="bg-[#22C55E] hover:bg-[#16a34a] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shrink-0"
//                 >
//                   Search
//                 </button>
//               </div>
//             </form>

//             {/* Stats */}
//             <div className="flex flex-wrap justify-center gap-8 mt-10">
//               {[
//                 { value: "100+", label: "Jobs Posted",    color: "text-[#22C55E]" },
//                 { value: "40+",  label: "Areas Covered",  color: "text-[#F97316]" },
//                 { value: "500+", label: "Applications",   color: "text-white"     },
//               ].map((s) => (
//                 <div key={s.label} className="text-center">
//                   <div className={`text-2xl sm:text-3xl font-bold ${s.color}`}>{s.value}</div>
//                   <div className="text-gray-400 text-xs mt-0.5">{s.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── Categories ── */}
//       <section className="py-10 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="mb-6">
//             <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Trending Categories</h2>
//             <p className="text-[#374151] text-sm mt-0.5">Popular job types in Hyderabad</p>
//           </div>
//           <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3">
//             {categories.map((cat) => (
//               <button
//                 key={cat.name}
//                 onClick={() => setActiveCategory(activeCategory === cat.name ? "all" : cat.name)}
//                 className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-200 ${
//                   activeCategory === cat.name
//                     ? "bg-[#0F172A] text-white shadow-lg"
//                     : "bg-[#F3F4F6] text-[#374151] hover:bg-gray-200"
//                 }`}
//               >
//                 <span className="text-xl">{cat.icon}</span>
//                 <span className="text-xs font-medium text-center leading-tight">{cat.name}</span>
//                 <span className={`text-xs ${activeCategory === cat.name ? "text-gray-300" : "text-gray-400"}`}>
//                   {cat.count}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── Featured Jobs ── */}
//       <section className="py-10 bg-[#F3F4F6]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
//               <Flame className="w-4 h-4 text-red-500" />
//             </div>
//             <div>
//               <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Featured Jobs</h2>
//               <p className="text-[#374151] text-xs">Urgent hiring & verified employers</p>
//             </div>
//           </div>
//           <JobGrid jobs={featuredJobs} loading={loading} />
//         </div>
//       </section>

//       {/* ── All Jobs + Filters ── */}
//       <section className="py-10 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
//             <div>
//               <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">All Jobs</h2>
//               <p className="text-[#374151] text-sm mt-0.5">
//                 {filteredJobs.length} jobs found
//                 {activeFilterCount > 0 && (
//                   <span className="ml-2 text-[#22C55E] font-medium">
//                     ({activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active)
//                   </span>
//                 )}
//               </p>
//             </div>
//             {/* Mobile filter button */}
//             <button
//               onClick={() => setShowFilters(true)}
//               className="sm:hidden flex items-center gap-2 px-4 py-2 bg-[#F3F4F6] text-[#374151] rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors self-start"
//             >
//               <SlidersHorizontal className="w-4 h-4" />
//               Filters
//               {activeFilterCount > 0 && (
//                 <span className="w-5 h-5 bg-[#0F172A] text-white rounded-full text-xs flex items-center justify-center">
//                   {activeFilterCount}
//                 </span>
//               )}
//             </button>
//           </div>

//           <div className="flex gap-6">
//             {/* Desktop sidebar — shown once */}
//             <div className="hidden sm:block w-56 shrink-0">
//               <JobFilters
//                 filters={filters}
//                 onChange={setFilters}
//                 onClear={clearFilters}
//               />
//             </div>

//             {/* Mobile drawer — shown once, visibility via isOpen */}
//             <JobFilters
//               filters={filters}
//               onChange={setFilters}
//               onClear={clearFilters}
//               isOpen={showFilters}
//               onClose={() => setShowFilters(false)}
//             />

//             {/* Job Grid */}
//             <div className="flex-1 min-w-0">
//               <JobGrid
//                 jobs={filteredJobs}
//                 loading={loading}
//                 emptyMessage="No jobs match your filters"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── CTA ── */}
//       <section className="py-16 bg-[#0F172A] relative overflow-hidden">
//         <div className="absolute inset-0 opacity-20 pointer-events-none">
//           <div className="absolute top-0 left-1/4 w-80 h-80 bg-[#22C55E] rounded-full blur-3xl" />
//           <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#F97316] rounded-full blur-3xl" />
//         </div>
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
//             Ready to Get Started?
//           </h2>
//           <p className="text-gray-300 text-base mb-8 max-w-md mx-auto">
//             Join hundreds of shop owners and job seekers in Hyderabad today.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center">
//             <Link
//               to="/register"
//               className="inline-flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#16a34a] text-white px-7 py-3.5 rounded-xl font-semibold transition-colors shadow-lg text-sm"
//             >
//               <Star className="w-4 h-4" /> Get Started <ArrowRight className="w-4 h-4" />
//             </Link>
//             <Link
//               to="/owner/add-job"
//               className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[#0F172A] px-7 py-3.5 rounded-xl font-semibold transition-colors text-sm"
//             >
//               <Briefcase className="w-4 h-4" /> Post a Job
//             </Link>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };


// export default HomePage;

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { hyderabadAreas } from "../data/hyderabadAreas.js";
import JobGrid from "../components/jobs/JobGrid.jsx";
import JobFilters from "../components/jobs/JobFilters.jsx";

import {
  Search,
  MapPin,
  Briefcase,
  Star,
  ArrowRight,
  SlidersHorizontal,
  Zap,
  Flame,
} from "lucide-react";

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    area: "all",
    type: "all",
    minSalary: "",
  });

  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // FETCH JOBS FROM BACKEND
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const response = await api.get("/jobs");

      const fetchedJobs =
        response?.data?.data?.jobs || [];

      setJobs(fetchedJobs);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
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

      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(q) ||
          job.location?.toLowerCase().includes(q) ||
          job.shopName?.toLowerCase().includes(q)
      );
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

    // MIN SALARY FILTER
    if (filters.minSalary) {
      filtered = filtered.filter(
        (job) =>
          Number(job.salaryMin || 0) >=
          Number(filters.minSalary)
      );
    }

    return filtered;
  }, [jobs, searchQuery, filters]);

  // FEATURED JOBS
  const featuredJobs = filteredJobs.slice(0, 6);

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

  const clearFilters = () => {
    setFilters({
      area: "all",
      type: "all",
      minSalary: "",
    });

    setSearchQuery("");
  };

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
                    <option value="all">All Areas</option>

                    {hyderabadAreas.map((area) => (
                      <option key={area} value={area}>
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
                className="bg-[#F3F4F6] rounded-2xl p-4 text-center hover:bg-gray-200 transition"
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

          <JobGrid jobs={featuredJobs} />
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

            {/* FILTERS */}
            <div className="hidden sm:block w-64 shrink-0">

              <JobFilters
                filters={filters}
                onChange={setFilters}
                onClear={clearFilters}
              />
            </div>

            {/* JOBS */}
            <div className="flex-1">

              <JobGrid
                jobs={filteredJobs}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0F172A] text-center text-white">

        <h2 className="text-4xl font-bold mb-4">
          Ready to Get Started?
        </h2>

        <p className="text-gray-300 mb-8">
          Join Hyderabad’s growing local hiring network.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <Link
            to="/register"
            className="bg-[#22C55E] hover:bg-[#16a34a] px-7 py-3 rounded-xl font-semibold"
          >
            Get Started
          </Link>

          <Link
            to="/owner/add-job"
            className="bg-white text-[#0F172A] px-7 py-3 rounded-xl font-semibold"
          >
            Post a Job
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;