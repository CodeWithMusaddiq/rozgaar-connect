import React from "react";
import { hyderabadAreas } from "../../data/hyderabadAreas.js";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";

/**
 * JobFilters - Single component, handles both sidebar (desktop) and drawer (mobile)
 * 
 * Props:
 *  filters      - { area, type, minSalary, maxSalary }
 *  onChange     - (newFilters) => void
 *  onClear      - () => void
 *  isOpen       - boolean (mobile drawer open)
 *  onClose      - () => void (mobile drawer close)
 */
const JobFilters = ({ filters, onChange, onClear, isOpen, onClose }) => {
  const isMobileDrawer = onClose !== undefined;

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const jobTypes = [
    { value: "all", label: "All Types" },
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "internship", label: "Internship" },
  ];

  const salaryRanges = [
    { value: "", label: "Any Salary" },
    { value: "5000", label: "₹5,000+" },
    { value: "8000", label: "₹8,000+" },
    { value: "12000", label: "₹12,000+" },
    { value: "15000", label: "₹15,000+" },
    { value: "20000", label: "₹20,000+" },
  ];

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Job Type */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Job Type
        </h3>
        <div className="flex flex-wrap gap-2">
          {jobTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => handleChange("type", t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                filters.type === t.value
                  ? "bg-[#0F172A] text-white border-[#0F172A]"
                  : "bg-white text-[#374151] border-gray-200 hover:border-[#0F172A] hover:text-[#0F172A]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Area */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Area
        </h3>
        <select
          value={filters.area}
          onChange={(e) => handleChange("area", e.target.value)}
          className="w-full px-3 py-2.5 bg-[#F3F4F6] border border-gray-200 rounded-xl text-sm text-[#374151] outline-none focus:border-[#0F172A] transition-colors cursor-pointer"
        >
          <option value="all">All Areas</option>
          {hyderabadAreas.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>

      {/* Minimum Salary */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Minimum Salary
        </h3>
        <div className="flex flex-col gap-1.5">
          {salaryRanges.map((s) => (
            <button
              key={s.value}
              onClick={() => handleChange("minSalary", s.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-all duration-200 border ${
                filters.minSalary === s.value
                  ? "bg-[#0F172A] text-white border-[#0F172A]"
                  : "bg-white text-[#374151] border-gray-100 hover:border-[#0F172A] hover:text-[#0F172A]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Button */}
      <button
        onClick={onClear}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-[#374151] hover:bg-[#F3F4F6] transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
      </button>
    </div>
  );

  // ── Desktop sidebar (always rendered inside the layout, no drawer) ──
  if (!isMobileDrawer) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm sticky top-24">
        <div className="flex items-center gap-2 mb-5">
          <SlidersHorizontal className="w-4 h-4 text-[#0F172A]" />
          <h2 className="font-bold text-[#0F172A] text-sm">Filters</h2>
        </div>
        <FilterContent />
      </div>
    );
  }

  // ── Mobile drawer ──
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 sm:hidden"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl sm:hidden max-h-[85vh] flex flex-col">
        {/* Handle */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#0F172A]" />
            <h2 className="font-bold text-[#0F172A]">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
          >
            <X className="w-5 h-5 text-[#374151]" />
          </button>
        </div>
        <div className="overflow-y-auto p-5 flex-1">
          <FilterContent />
        </div>
        <div className="p-4 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#0F172A] text-white rounded-xl font-semibold text-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default JobFilters;