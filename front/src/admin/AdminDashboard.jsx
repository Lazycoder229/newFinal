import React, { useState } from "react";
import {
  Users,
  UserRoundPlus,
  FolderKanban,
  ClipboardList,
  Plus,
  CalendarDays,
  Settings,
} from "lucide-react";

export default function AdminDashboard() {
  const [mentors] = useState([
    { id: 1, name: "Resty Gonzales", role: "Mentor", image: "./profile.jpg" },
    { id: 2, name: "Jane Dela Cruz", role: "Advisor", image: "./profile.jpg" },
    { id: 3, name: "Carl Mendoza", role: "Team Lead", image: "./profile.jpg" },
  ]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <header>
        <h1 className="text-2xl font-semibold">Welcome back, Admin 👋</h1>
        <p className="text-gray-600 text-sm">
          Here’s an overview of system activity and key performance insights.
        </p>
      </header>

      {/* KPI CARDS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Users size={20} />, label: "Total Users", value: "1,248" },
          {
            icon: <UserRoundPlus size={20} />,
            label: "Active Mentors",
            value: "86",
          },
          { icon: <FolderKanban size={20} />, label: "Projects", value: "134" },
          {
            icon: <ClipboardList size={20} />,
            label: "Logs Today",
            value: "432",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3 border border-gray-200 hover:shadow-md transition"
          >
            <div className="bg-blue-50 p-2 rounded-full text-blue-600">
              {item.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-lg font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <img
                    src="./profile.jpg"
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p>
                      <span className="font-semibold">Sarah Chen</span> added a
                      new project <span className="font-semibold">Phoenix</span>
                      .
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <img
                    src="./profile.jpg"
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p>
                      <span className="font-semibold">Mike Johnson</span>{" "}
                      updated user roles.
                    </p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <img
                    src="./profile.jpg"
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p>
                      <span className="font-semibold">Admin</span> reviewed
                      pending mentorship applications.
                    </p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Mentorship Overview */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Top Mentors</h2>
              <button className="text-blue-600 text-sm flex items-center gap-1 hover:underline">
                <Plus size={14} /> View All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mentors.slice(0, 2).map((m) => (
                <div
                  key={m.id}
                  className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 hover:shadow-md transition"
                >
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Add User", icon: <UserRoundPlus size={18} /> },
                { label: "New Project", icon: <FolderKanban size={18} /> },
                { label: "Schedule", icon: <CalendarDays size={18} /> },
                { label: "Settings", icon: <Settings size={18} /> },
              ].map((btn, i) => (
                <button
                  key={i}
                  className="bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center p-3 text-sm hover:shadow-md hover:bg-blue-50 transition"
                >
                  <span className="text-blue-600 mb-1">{btn.icon}</span>
                  {btn.label}
                </button>
              ))}
            </div>
          </section>

          {/* Upcoming Events */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Upcoming Events</h2>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <div className="flex flex-col items-center bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    <span className="text-[10px] font-bold uppercase">Nov</span>
                    <span className="text-sm font-bold">25</span>
                  </div>
                  <div>
                    <p className="font-medium">Admin System Sync</p>
                    <p className="text-xs text-gray-500">
                      10:00 AM — Audit Meeting
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex flex-col items-center bg-red-100 text-red-600 px-2 py-1 rounded">
                    <span className="text-[10px] font-bold uppercase">Nov</span>
                    <span className="text-sm font-bold">27</span>
                  </div>
                  <div>
                    <p className="font-medium">User Report Deadline</p>
                    <p className="text-xs text-gray-500">
                      Generate system analytics
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
