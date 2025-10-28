import React, { useState, useRef, useEffect } from "react";
import { Bell, Menu, TextAlignJustify, ChevronRight } from "lucide-react";
import Sidebar from "./sidebar/Sidebar";

export default function Layout({ children, activeMenu, onMenuSelect }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* ===== Sidebar ===== */}
      <aside
        className={`bg-white shadow-lg text-black shrink-0 flex flex-col transform transition-all duration-300 ease-in-out
          ${
            isMobileSidebarOpen
              ? "translate-x-0 fixed z-40 w-56"
              : "md:translate-x-0"
          }
          ${isSidebarOpen ? "w-56" : "w-16"}
          md:relative h-full`}
      >
        <Sidebar
          active={activeMenu}
          onSelect={(menu) => {
            onMenuSelect(menu);
            setIsMobileSidebarOpen(false); // ✅ auto-close on mobile tap
          }}
          collapsed={!isSidebarOpen}
        />
      </aside>

      {/* ===== Overlay (mobile only) ===== */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-30"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* ===== Main Content Area ===== */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* ===== Header ===== */}
        <header className="flex items-center justify-between bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] px-4 py-1.5 z-20 relative">
          {/* Collapse toggle (desktop) */}
          <div className="hidden md:flex justify-end p-2">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {isSidebarOpen ? (
                <TextAlignJustify size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>

          {/* Menu button (mobile) */}
          <button
            onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
            className="p-2 rounded-md hover:bg-gray-100 md:hidden"
          >
            <Menu size={20} className="text-gray-700" />
          </button>

          {/* Notifications + User dropdown */}
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full"></span>
            </button>

            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="focus:outline-none"
            >
              <img
                src="./profile.jpg"
                alt="User"
                className="w-9 h-9 rounded-full object-cover border hover:scale-105 transition-transform"
              />
            </button>

            {/* Dropdown menu */}
            <div
              className={`absolute right-0 top-12 w-40 bg-white rounded-md shadow-lg border py-1 z-10 transform transition-all duration-200 origin-top-right ${
                isDropdownOpen
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }`}
            >
              <button
                onClick={() => alert("Edit Profile clicked")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit Profile
              </button>
              <button
                onClick={() => alert("Logout clicked")}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* ===== Main Page Content ===== */}
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
