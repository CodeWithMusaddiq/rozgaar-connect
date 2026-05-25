import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Briefcase, Loader2 } from "lucide-react";

/**
 * RegisterPage - Connected to backend API
 */
const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "seeker",
    shopName: "",
    shopAddress: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError("");
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");
    setFieldErrors({});

    // Clean up data based on role
    const submitData = { ...formData };
    if (submitData.role === "seeker") {
      delete submitData.shopName;
      delete submitData.shopAddress;
    }

    const result = await register(submitData);

    if (result.success) {
      navigate("/");
    } else {
      if (result.errors && result.errors.length > 0) {
        const errors = {};
        result.errors.forEach((err) => {
          errors[err.field] = err.message;
        });
        setFieldErrors(errors);
      } else {
        setFormError(result.message || "Registration failed. Please try again.");
      }
    }

    setIsLoading(false);
  };

  const getFieldError = (field) => fieldErrors[field];

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#F3F4F6] py-10 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">
              Create Account
            </h1>
            <p className="text-[#374151] text-sm">
              Join Fouz Ki Dukaan and find local jobs
            </p>
          </div>

          {/* Error Message */}
          {formError && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={`w-full pl-12 pr-4 py-3 bg-[#F3F4F6] rounded-xl text-sm outline-none placeholder:text-gray-400 border transition-colors ${
                    getFieldError("fullName")
                      ? "border-red-300 focus:border-red-500"
                      : "border-transparent focus:border-[#0F172A]"
                  }`}
                  required
                />
              </div>
              {getFieldError("fullName") && (
                <p className="text-xs text-red-500 mt-1">{getFieldError("fullName")}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3 bg-[#F3F4F6] rounded-xl text-sm outline-none placeholder:text-gray-400 border transition-colors ${
                    getFieldError("email")
                      ? "border-red-300 focus:border-red-500"
                      : "border-transparent focus:border-[#0F172A]"
                  }`}
                  required
                />
              </div>
              {getFieldError("email") && (
                <p className="text-xs text-red-500 mt-1">{getFieldError("email")}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={`w-full pl-12 pr-4 py-3 bg-[#F3F4F6] rounded-xl text-sm outline-none placeholder:text-gray-400 border transition-colors ${
                    getFieldError("phone")
                      ? "border-red-300 focus:border-red-500"
                      : "border-transparent focus:border-[#0F172A]"
                  }`}
                  required
                />
              </div>
              {getFieldError("phone") && (
                <p className="text-xs text-red-500 mt-1">{getFieldError("phone")}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={`w-full pl-12 pr-12 py-3 bg-[#F3F4F6] rounded-xl text-sm outline-none placeholder:text-gray-400 border transition-colors ${
                    getFieldError("password")
                      ? "border-red-300 focus:border-red-500"
                      : "border-transparent focus:border-[#0F172A]"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#374151] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {getFieldError("password") && (
                <p className="text-xs text-red-500 mt-1">{getFieldError("password")}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.role === "seeker"
                      ? "border-[#0F172A] bg-[#0F172A] text-white"
                      : "border-gray-200 text-[#374151] hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="seeker"
                    checked={formData.role === "seeker"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm font-medium">Job Seeker</span>
                </label>
                <label
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.role === "owner"
                      ? "border-[#0F172A] bg-[#0F172A] text-white"
                      : "border-gray-200 text-[#374151] hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="owner"
                    checked={formData.role === "owner"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Shop Owner</span>
                </label>
              </div>
            </div>

            {/* Shop Details (only for owner) */}
            {formData.role === "owner" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    placeholder="Your shop name"
                    className="w-full px-4 py-3 bg-[#F3F4F6] rounded-xl text-sm outline-none placeholder:text-gray-400 border border-transparent focus:border-[#0F172A] transition-colors"
                    required={formData.role === "owner"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    Shop Address
                  </label>
                  <input
                    type="text"
                    name="shopAddress"
                    value={formData.shopAddress}
                    onChange={handleChange}
                    placeholder="Shop address in Hyderabad"
                    className="w-full px-4 py-3 bg-[#F3F4F6] rounded-xl text-sm outline-none placeholder:text-gray-400 border border-transparent focus:border-[#0F172A] transition-colors"
                    required={formData.role === "owner"}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#22C55E] hover:bg-[#16a34a] disabled:bg-gray-400 text-white py-3.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-center text-sm text-[#374151]">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#0F172A] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
