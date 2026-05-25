import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { dummyJobs } from "../data/dummyJobs.js";
import {
  MapPin, Clock, IndianRupee, Briefcase, ArrowLeft,
  Share2, Bookmark, CheckCircle, MessageCircle,
  BadgeCheck, Flame, User, Loader2, Send, CheckCheck,
} from "lucide-react";

const JobDetailsPage = () => {
  const { id } = useParams();
  const [job, setJob]                     = useState(null);
  const [loading, setLoading]             = useState(true);
  const [isApplying, setIsApplying]       = useState(false);
  const [applySuccess, setApplySuccess]   = useState(false);
  const [isBookmarked, setIsBookmarked]   = useState(false);
  const [showChat, setShowChat]           = useState(false);
  const [chatInput, setChatInput]         = useState("");
  const [chatMessages, setChatMessages]   = useState([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      // match by string OR number id
      const found = dummyJobs.find(
        (j) => String(j.id) === String(id) || String(j._id) === String(id)
      );
      setJob(found || null);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => { setIsApplying(false); setApplySuccess(true); }, 1500);
  };

  const openChat = () => {
    setShowChat(true);
    setChatMessages([
      {
        _id: "w1",
        sender: "them",
        text: `Hi! I'm the owner of ${job.company}. Interested in the ${job.title} position?`,
        time: "Just now",
      },
    ]);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = { _id: `me_${Date.now()}`, sender: "me", text: chatInput.trim(), time: "Just now" };
    setChatMessages((prev) => [...prev, msg]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { _id: `them_${Date.now()}`, sender: "them", text: "Thanks! Can you share your experience and availability?", time: "Just now" },
      ]);
    }, 1200);
  };

  /* ── loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#0F172A]" />
      </div>
    );
  }

  /* ── not found ── */
  if (!job) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="text-center px-6">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">Job Not Found</h2>
          <p className="text-gray-400 mb-6">This job listing doesn't exist or has been removed.</p>
          <Link to="/" className="inline-block bg-[#0F172A] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#1e293b] transition-colors">
            Browse All Jobs
          </Link>
        </div>
      </div>
    );
  }

  /* related jobs — same location, different id */
  const relatedJobs = dummyJobs
    .filter((j) => j.location === job.location && j.id !== job.id)
    .slice(0, 3);

  const initials = (job.company || "??").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#374151] hover:text-[#0F172A] mb-6 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Link>

        {/* ── Main Card ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">

          {/* Cover image */}
          <div className="relative h-48 sm:h-64">
            <img
              src={job.image}
              alt={job.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = `https://picsum.photos/800/400?random=${job.id}`; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {job.urgent && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold">
                    <Flame className="w-3 h-3" /> Urgent
                  </span>
                )}
                {job.verified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg text-xs font-bold">
                    <BadgeCheck className="w-3 h-3" /> Verified
                  </span>
                )}
                <span className="px-3 py-1 bg-white/90 text-[#0F172A] rounded-lg text-xs font-semibold">
                  {job.type}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{job.title}</h1>
            </div>
          </div>

          <div className="p-6 sm:p-8">

            {/* Shop info row */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="w-14 h-14 bg-[#0F172A] rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-[#0F172A]">{job.company}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#374151] mt-1">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {job.type}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2.5 rounded-xl transition-colors ${isBookmarked ? "bg-[#0F172A] text-white" : "bg-[#F3F4F6] text-[#374151] hover:bg-gray-200"}`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="p-2.5 bg-[#F3F4F6] text-[#374151] rounded-xl hover:bg-gray-200 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Meta chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#F3F4F6] rounded-xl p-4">
                <IndianRupee className="w-5 h-5 text-[#22C55E] mb-2" />
                <p className="text-xs text-gray-400 mb-0.5">Salary</p>
                <p className="text-sm font-bold text-[#0F172A]">{job.salary}</p>
              </div>
              <div className="bg-[#F3F4F6] rounded-xl p-4">
                <Briefcase className="w-5 h-5 text-blue-500 mb-2" />
                <p className="text-xs text-gray-400 mb-0.5">Job Type</p>
                <p className="text-sm font-bold text-[#0F172A]">{job.type}</p>
              </div>
              <div className="bg-[#F3F4F6] rounded-xl p-4">
                <MapPin className="w-5 h-5 text-orange-500 mb-2" />
                <p className="text-xs text-gray-400 mb-0.5">Location</p>
                <p className="text-sm font-bold text-[#0F172A]">{job.location}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#0F172A] mb-3">Job Description</h3>
              <p className="text-[#374151] leading-relaxed">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#0F172A] mb-3">What We're Looking For</h3>
              <ul className="space-y-2">
                {[
                  "Hardworking and punctual",
                  "Good communication skills",
                  "Willing to learn on the job",
                  "Local candidate preferred",
                  "Minimum 10th pass",
                ].map((req, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#374151]">
                    <CheckCircle className="w-4 h-4 text-[#22C55E] shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact box */}
            <div className="bg-[#F3F4F6] rounded-2xl p-5 mb-8">
              <h3 className="text-base font-bold text-[#0F172A] mb-4">Employer Info</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#0F172A] rounded-xl flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#0F172A] text-sm">{job.company}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{job.location}, Hyderabad</p>
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Actively hiring
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {applySuccess ? (
                <div className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-50 text-green-700 rounded-xl font-semibold text-sm">
                  <CheckCircle className="w-5 h-5" /> Application Submitted!
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={isApplying}
                  className="flex-1 bg-[#22C55E] hover:bg-[#16a34a] disabled:bg-gray-300 text-white py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {isApplying
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Applying…</>
                    : <><CheckCircle className="w-4 h-4" /> Apply Now</>
                  }
                </button>
              )}
              <button
                onClick={openChat}
                className="flex-1 bg-[#0F172A] hover:bg-[#1e293b] text-white py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <MessageCircle className="w-4 h-4" /> Chat with Owner
              </button>
            </div>
          </div>
        </div>

        {/* Related Jobs */}
        {relatedJobs.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-bold text-[#0F172A] mb-4">More Jobs in {job.location}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedJobs.map((rj) => (
                <Link
                  key={rj.id}
                  to={`/jobs/${rj.id}`}
                  className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <h4 className="font-bold text-[#0F172A] text-sm mb-1">{rj.title}</h4>
                  <p className="text-xs text-[#374151] mb-2">{rj.company}</p>
                  <p className="text-xs text-[#22C55E] font-semibold">{rj.salary}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Chat Modal ── */}
      {showChat && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowChat(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[80vh]">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100 shrink-0">
              <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#0F172A] text-sm">{job.company}</h4>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Online
                </p>
              </div>
              <button onClick={() => setShowChat(false)} className="p-2 text-gray-400 hover:text-[#0F172A] text-lg leading-none">
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFAFA]">
              {chatMessages.map((msg) => (
                <div key={msg._id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "me"
                      ? "bg-[#0F172A] text-white rounded-br-md"
                      : "bg-white text-[#374151] rounded-bl-md shadow-sm border border-gray-100"
                  }`}>
                    <p>{msg.text}</p>
                    <div className={`flex items-center gap-1 mt-1 ${msg.sender === "me" ? "justify-end" : ""}`}>
                      <span className={`text-xs ${msg.sender === "me" ? "text-gray-300" : "text-gray-400"}`}>{msg.time}</span>
                      {msg.sender === "me" && <CheckCheck className="w-3 h-3 text-blue-400" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendChat} className="p-4 border-t border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 px-4 py-2.5 bg-[#F3F4F6] rounded-xl text-sm outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2.5 bg-[#0F172A] text-white rounded-xl disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;