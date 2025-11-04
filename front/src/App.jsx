import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./dashboard/Layout";
import AdminDashboard from "./admin/AdminDashboard";
import UserManagement from "./admin/UserManagement";
import Mentor from "./admin/Mentorship";
import AdminGroups from "./admin/Groups";
import PeerConnectLanding from "./dashboard/AuthPage";
import MenteeDashboard from "./dashboard/MenteeDashboard";
import AdminForum from "./admin/Forum";
export default function App() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // 🔹 Keep user logged in after refresh
  useEffect(() => {
    const token =
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token");
    const role =
      localStorage.getItem("user_role") || sessionStorage.getItem("user_role");

    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  // 🔹 Helper to wrap admin routes with Layout
  const renderAdminLayout = (content, menuName) => (
    <Layout
      activeMenu={menuName}
      onMenuSelect={setActiveMenu}
      onLogout={() => {
        setIsLoggedIn(false);
        setUserRole(null);
        localStorage.clear();
        sessionStorage.clear();
      }}
    >
      {content}
    </Layout>
  );

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* 🟢 Login / Landing Page */}
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <PeerConnectLanding
                onLoginSuccess={(data) => {
                  setIsLoggedIn(true);
                  setUserRole(data.role || data.user?.role);
                }}
              />
            ) : (
              <Navigate
                to={
                  userRole === "Admin"
                    ? "/admin-dashboard"
                    : userRole === "Mentee"
                    ? "/mentee-dashboard"
                    : "/dashboard"
                }
              />
            )
          }
        />

        {/* 🔵 ADMIN ROUTES */}
        <Route
          path="/admin-dashboard"
          element={
            isLoggedIn && userRole === "Admin" ? (
              renderAdminLayout(<AdminDashboard />, "Dashboard")
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin-users"
          element={
            isLoggedIn && userRole === "Admin" ? (
              renderAdminLayout(<UserManagement />, "User Management")
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin-mentor"
          element={
            isLoggedIn && userRole === "Admin" ? (
              renderAdminLayout(<Mentor />, "Mentor")
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin-groups"
          element={
            isLoggedIn && userRole === "Admin" ? (
              renderAdminLayout(<AdminGroups />, "Groups")
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin-forum"
          element={
            isLoggedIn && userRole === "Admin" ? (
              renderAdminLayout(<AdminForum />, "Forum")
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin-announcements"
          element={
            isLoggedIn && userRole === "Admin" ? (
              renderAdminLayout(
                <div>Announcements for your team.</div>,
                "Announcement"
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin-logs"
          element={
            isLoggedIn && userRole === "Admin" ? (
              renderAdminLayout(
                <div>System logs will be shown here.</div>,
                "Logs"
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin-settings"
          element={
            isLoggedIn && userRole === "Admin" ? (
              renderAdminLayout(
                <div>Change system settings here.</div>,
                "System Settings"
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* 🔸 MENTOR ROUTE (example for non-admin) */}
        <Route
          path="/mentor-dashboard"
          element={
            isLoggedIn && userRole === "Mentor" ? (
              renderAdminLayout(<Mentor />, "Mentor Dashboard")
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* 🚨 Catch-all route */}
        <Route
          path="/mentee-dashboard"
          element={
            isLoggedIn && userRole !== "Admin" && userRole !== "Mentor" ? (
              <MenteeDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}
