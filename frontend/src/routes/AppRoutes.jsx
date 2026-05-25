import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import MainLayout from "../layouts/MainLayout.jsx";

// Pages
import HomePage from "../pages/HomePage.jsx";
import JobDetailsPage from "../pages/JobDetailsPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import ChatPage from "../pages/ChatPage.jsx";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";

// Owner Pages
import OwnerDashboard from "../pages/owner/OwnerDashboard.jsx";
import AddJobPage from "../pages/owner/AddJobPage.jsx";
import EditJobPage from "../pages/owner/EditJobPage.jsx";
import ApplicationsPage from "../pages/owner/ApplicationsPage.jsx";

/**
 * ProtectedRoute - Redirects to login if not authenticated
 */
const ProtectedRoute = ({ children, requireOwner = false }) => {
  const { isAuthenticated, isLoading, isOwner } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
        <div className="animate-spin w-10 h-10 border-4 border-[#0F172A] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireOwner && !isOwner) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * GuestRoute - Redirects to home if already authenticated
 */
const GuestRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
        <div className="animate-spin w-10 h-10 border-4 border-[#0F172A] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * AppRoutes - Central routing configuration with auth guards
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes with MainLayout (Navbar + Footer) */}
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* Auth Routes (redirect if logged in) */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />

        {/* Owner Routes (require owner role) */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute requireOwner={true}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/add-job"
          element={
            <ProtectedRoute requireOwner={true}>
              <AddJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/edit-job/:id"
          element={
            <ProtectedRoute requireOwner={true}>
              <EditJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/applications"
          element={
            <ProtectedRoute requireOwner={true}>
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 Fallback */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-[#0F172A] mb-4">404</h1>
              <p className="text-[#374151] text-lg mb-6">Page not found</p>
              <a
                href="/"
                className="inline-block bg-[#0F172A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1e293b] transition-colors"
              >
                Go Home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
