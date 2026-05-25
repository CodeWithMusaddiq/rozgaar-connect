import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  Menu,
  X,
  Briefcase,
  MessageCircle,
  LayoutDashboard,
  Home,
  User,
  LogOut,
  Bell,
} from "lucide-react";
import MobileMenu from "./MobileMenu.jsx";

/**
 * Navbar - Responsive sticky navigation bar with auth integration
 */
const Navbar = () => {
  const { user, isAuthenticated, isOwner, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  // Track scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Navigation links based on auth state and role
  const getNavLinks = () => {
    const links = [{ path: "/", label: "Home", icon: Home }];

    if (isAuthenticated) {
      if (isOwner) {
        links.push(
          { path: "/owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { path: "/owner/applications", label: "Applications", icon: Briefcase }
        );
      }
      links.push(
        { path: "/chat", label: "Chat", icon: MessageCircle }
      );
    }

    return links;
  };

  const navLinks = getNavLinks();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 bg-[#0F172A] rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#0F172A] hidden sm:block">
                Fouz Ki Dukaan
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-[#0F172A] text-white"
                        : "text-[#374151] hover:bg-[#F3F4F6] hover:text-[#0F172A]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <button className="relative p-2.5 text-[#374151] hover:bg-[#F3F4F6] rounded-xl transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F97316] rounded-full" />
                  </button>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#F3F4F6] transition-colors"
                    >
                      <div className="w-8 h-8 bg-[#0F172A] rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-[#0F172A]">
                        {user?.fullName?.split(" ")[0] || "User"}
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-[#0F172A]">
                            {user?.fullName}
                          </p>
                          <p className="text-xs text-gray-400">{user?.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-[#0F172A] text-white text-xs rounded-md">
                            {user?.role === "owner" ? "Shop Owner" : "Job Seeker"}
                          </span>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F3F4F6] transition-colors"
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </Link>
                        {isOwner && (
                          <Link
                            to="/owner/dashboard"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F3F4F6] transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                        )}
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === "/login"
                        ? "bg-[#0F172A] text-white"
                        : "text-[#374151] hover:bg-[#F3F4F6]"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 rounded-lg text-sm font-medium bg-[#22C55E] text-white hover:bg-[#16a34a] transition-all duration-200 shadow-sm"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#374151] hover:bg-[#F3F4F6] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navLinks={navLinks}
        isActive={isActive}
        isAuthenticated={isAuthenticated}
        user={user}
        isOwner={isOwner}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Navbar;
