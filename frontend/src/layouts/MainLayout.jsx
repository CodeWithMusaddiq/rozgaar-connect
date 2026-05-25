import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

/**
 * MainLayout - Shared layout wrapper
 * Includes sticky navbar and responsive content area
 * Renders child routes via Outlet
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6]">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold">Fouz Ki Dukaan</h3>
              <p className="text-gray-400 text-sm mt-1">
                Connecting Hyderabad&apos;s shop owners with local talent.
              </p>
            </div>
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Fouz Ki Dukaan. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
