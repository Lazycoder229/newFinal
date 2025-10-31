import React, { useState } from "react";
import Layout from "./dashboard/Layout";
import Myprofile from "./dashboard/Myprofile";
import AdminDashboard from "./admin/AdminDashboard";
import UserManagement from "./admin/UserManagement";
import PeerConnectLanding from "./dashboard/AuthPage";

export default function App() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ controls mode (landing or dashboard)

  // 🔹 This controls which dashboard content to show
  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <AdminDashboard />;
      case "User Management":
        return <UserManagement />;
      case "Approve":
        return <div>Approval tasks go here.</div>;
      case "Groups":
        return <div>Group management page.</div>;
      case "Forum":
        return <div>Forum discussions appear here.</div>;
      case "Announcement":
        return <div>Announcements for your team.</div>;
      case "Logs":
        return <div>System logs will be shown here.</div>;
      case "System Settings":
        return <div>Change system settings here.</div>;
      default:
        return <div>Select a menu item.</div>;
    }
  };

  return (
    <>
      {!isLoggedIn ? (
        // 🔹 Show PeerConnect landing page first
        <PeerConnectLanding onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        // 🔹 Once logged in, show the dashboard layout
        <Layout activeMenu={activeMenu} onMenuSelect={setActiveMenu}>
          {renderContent()}
        </Layout>
      )}
    </>
  );
}
