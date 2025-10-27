// App.jsx
import React, { useState } from "react";
import Layout from "./dashboard/Layout";
import Sidebar from "./dashboard/sidebar/Sidebar";
import Dashboard from "./dashboard/Dashboard";
import Myprofile from "./dashboard/Myprofile";

export default function App() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Render different content based on the active menu
  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <Dashboard />;
      case "Profile":
        return <Myprofile />;
      case "Approve":
        return <div>Approval tasks go here.</div>;
      case "Groups":
        return <div>Group management page.</div>;
      case "Forum":
        return <div>Forum discussions appear here.</div>;
      case "Announcement":
        return <div>Announcements for your team.</div>;
      case "Logs":
        return <div>System logs will be shown.</div>;
      case "System Settings":
        return <div>Change system settings here.</div>;
      default:
        return <div>Select a menu item.</div>;
    }
  };

  return (
    <Layout
      sidebar={<Sidebar active={activeMenu} onSelect={setActiveMenu} />}
      header={<h1 className="text-xl font-bold">{activeMenu}</h1>}
    >
      {renderContent()}
    </Layout>
  );
}
