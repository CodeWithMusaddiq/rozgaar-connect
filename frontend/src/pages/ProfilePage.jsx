import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, Briefcase, GraduationCap,
  Edit3, Camera, Save, X, Bookmark, CheckCircle, XCircle,
  Clock, Loader2,
} from "lucide-react";

/**
 * ProfilePage - With dummy application data
 */
const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Dummy user data
  const [user, setUser] = useState({
    fullName: "Mohammed Ali",
    email: "mohammed.ali@email.com",
    phone: "+91 98765 43210",
    location: "Charminar, Hyderabad",
    role: "seeker",
    education: "B.Com Graduate",
    bio: "Looking for part-time and full-time opportunities in retail and customer service around Hyderabad. Hardworking and reliable.",
    skills: ["Customer Service", "Sales", "Inventory Management", "Hindi", "Telugu", "English"],
    experience: "6 months retail",
  });

  const [profileData, setProfileData] = useState({ ...user, skills: user.skills.join(", ") });

  // Dummy applications
  const [applications] = useState([
    {
      _id: "app_1",
      job: { title: "Sales Assistant", shopName: "Fouz General Store", location: "Charminar" },
      status: "pending",
      appliedDate: "May 24, 2026",
    },
    {
      _id: "app_2",
      job: { title: "Cashier", shopName: "City Mart", location: "Banjara Hills" },
      status: "accepted",
      appliedDate: "May 20, 2026",
    },
    {
      _id: "app_3",
      job: { title: "Delivery Boy", shopName: "Quick Bites", location: "Secunderabad" },
      status: "rejected",
      appliedDate: "May 15, 2026",
    },
    {
      _id: "app_4",
      job: { title: "Juice Shop Worker", shopName: "Fresh Juice Corner", location: "Mehdipatnam" },
      status: "pending",
      appliedDate: "May 26, 2026",
    },
  ]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setUser({
        ...profileData,
        skills: profileData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setIsEditing(false);
      setIsSaving(false);
    }, 800);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted": return "bg-green-50 text-green-700 border-green-200";
      case "rejected": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-[#0F172A] to-[#1e293b] rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                {user.fullName.charAt(0)}
              </div>
              <button className="absolute -bottom-2 -right-2 w-9 h-9 bg-[#22C55E] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#16a34a] transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">{user.fullName}</h1>
                <span className="inline-flex items-center px-3 py-1 bg-[#0F172A] text-white rounded-lg text-xs font-medium mx-auto sm:mx-0">
                  {user.role === "owner" ? "Shop Owner" : "Job Seeker"}
                </span>
              </div>
              <p className="text-[#374151] text-sm leading-relaxed max-w-lg">{user.bio}</p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-[#F3F4F6] text-[#374151] rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#0F172A]">Contact Info</h2>
                {isEditing && (
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#22C55E] text-white rounded-lg text-xs font-medium hover:bg-[#16a34a] transition-colors"
                  >
                    {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Save
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  {["fullName", "phone", "location", "education", "experience"].map((field) => (
                    <div key={field}>
                      <label className="text-xs text-gray-400 block mb-1 capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                      <input
                        type="text"
                        name={field}
                        value={profileData[field]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#F3F4F6] rounded-lg text-sm outline-none"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Skills (comma separated)</label>
                    <input type="text" name="skills" value={profileData.skills} onChange={handleChange} className="w-full px-3 py-2 bg-[#F3F4F6] rounded-lg text-sm outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Bio</label>
                    <textarea name="bio" value={profileData.bio} onChange={handleChange} rows={3} className="w-full px-3 py-2 bg-[#F3F4F6] rounded-lg text-sm outline-none resize-none" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { icon: Mail, label: "Email", value: user.email, color: "bg-blue-50 text-blue-600" },
                    { icon: Phone, label: "Phone", value: user.phone, color: "bg-green-50 text-green-600" },
                    { icon: MapPin, label: "Location", value: user.location, color: "bg-orange-50 text-orange-600" },
                    { icon: GraduationCap, label: "Education", value: user.education, color: "bg-purple-50 text-purple-600" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="text-sm font-medium text-[#374151]">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!isEditing && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-[#0F172A] mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#F3F4F6] text-[#374151] rounded-lg text-xs font-medium">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application History */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-[#0F172A] mb-4">Application History</h2>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app._id} className="flex items-center justify-between p-4 bg-[#F3F4F6] rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0F172A] text-sm">{app.job.title}</h3>
                        <p className="text-xs text-gray-400">{app.job.shopName} · {app.job.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{app.appliedDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Jobs */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-[#0F172A] mb-4">Saved Jobs</h2>
              <div className="text-center py-8 text-gray-400">
                <Bookmark className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No saved jobs yet</p>
                <Link to="/" className="text-[#22C55E] text-xs font-medium hover:underline mt-1 inline-block">Browse jobs</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
