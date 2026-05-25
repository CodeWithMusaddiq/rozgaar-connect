import React from "react";
import { Link, useLocation } from "react-router-dom";
import { X, LogIn, UserPlus, User, LayoutDashboard, LogOut } from "lucide-react";

/**
 * MobileMenu - Slide-in mobile navigation with auth support
 */
const MobileMenu = ({
  isOpen,
  onClose,
  navLinks,
  isActive,
  isAuthenticated,
  user,
  isOwner,
  onLogout,
}) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 md:hidden"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div className="fixed top-0 right-0 h-full w-[300px] bg-white z-50 md:hidden shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-lg font-bold text-[#0F172A]">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#374151] hover:bg-[#F3F4F6] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info (if authenticated) */}
        {isAuthenticated && user && (
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#0F172A] text-white"
                    : "text-[#374151] hover:bg-[#F3F4F6]"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}

          {/* Profile Link for authenticated users */}
          {isAuthenticated && (
            <Link
              to="/profile"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === "/profile"
                  ? "bg-[#0F172A] text-white"
                  : "text-[#374151] hover:bg-[#F3F4F6]"
              }`}
            >
              <User className="w-5 h-5" />
              My Profile
            </Link>
          )}

          {/* Dashboard Link for owners */}
          {isAuthenticated && isOwner && (
            <Link
              to="/owner/dashboard"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === "/owner/dashboard"
                  ? "bg-[#0F172A] text-white"
                  : "text-[#374151] hover:bg-[#F3F4F6]"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="p-4 border-t border-gray-100 space-y-3">
          {isAuthenticated ? (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={onClose}
                className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === "/login"
                    ? "bg-[#0F172A] text-white"
                    : "bg-[#F3F4F6] text-[#374151] hover:bg-gray-200"
                }`}
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium bg-[#22C55E] text-white hover:bg-[#16a34a] transition-all duration-200"
              >
                <UserPlus className="w-4 h-4" />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
