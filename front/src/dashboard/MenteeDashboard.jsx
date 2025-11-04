import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  BookOpen,
  Users,
  TrendingUp,
  Loader2,
  Clock,
  CheckCircle,
  Award,
  MessageCircle,
  Home,
  GraduationCap,
  Calendar,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";

export default function MenteeDashboard() {
  const API_URL = "http://localhost:3000/api";
  const dropdownRef = useRef(null);

  // State
  const [mentorships, setMentorships] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(
        localStorage.getItem("user") || sessionStorage.getItem("user")
      );
      setUser(storedUser);

      const [mentorshipsRes, mentorsRes, coursesRes] = await Promise.all([
        axios.get(`${API_URL}/mentorships`),
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/courses`),
      ]);

      const menteeMentorships = mentorshipsRes.data.filter(
        (m) => m.mentee_id === storedUser?.id
      );

      const mentorIds = menteeMentorships.map((m) => m.mentor_id);
      const menteeMentors = mentorsRes.data.filter((m) =>
        mentorIds.includes(m.id)
      );

      setMentorships(menteeMentorships);
      setMentors(menteeMentors);
      setCourses(coursesRes.data || []);
    } catch (error) {
      console.error("Failed to fetch mentee dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      window.localStorage.removeItem("auth_token");
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("user_role");
    } catch (e) {
      console.warn("localStorage clear error", e);
    }
    try {
      window.sessionStorage.removeItem("auth_token");
      window.sessionStorage.removeItem("user");
      window.sessionStorage.removeItem("user_role");
    } catch (e) {
      console.warn("sessionStorage clear error", e);
    }

    toast.success("Logging out...", { autoClose: 1500 });
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "courses", label: "My Courses", icon: GraduationCap },
    { id: "mentors", label: "My Mentors", icon: Users },
    { id: "sessions", label: "Sessions", icon: Calendar },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const stats = {
    activeMentorships: mentorships.filter((m) => m.status === "Active").length,
    pendingMentorships: mentorships.filter((m) => m.status === "Pending")
      .length,
    completedMentorships: mentorships.filter((m) => m.status === "Completed")
      .length,
    totalMentors: mentors.length,
    totalCourses: courses.length,
  };

  const getRecentActivities = () => {
    return mentorships
      .map((m) => ({
        mentor: mentors.find((mt) => mt.id === m.mentor_id),
        action:
          m.status === "Completed"
            ? "You completed a mentorship!"
            : m.status === "Active"
            ? "Mentorship session ongoing"
            : "Mentorship request sent",
        time: m.updated_at || m.start_date,
        status: m.status,
      }))
      .sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0))
      .slice(0, 5);
  };

  const recentActivities = getRecentActivities();

  const getTimeAgo = (date) => {
    if (!date) return "Recently";
    const now = new Date();
    const past = new Date(date + "Z");
    const diffMs = now - past;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-40 w-64 bg-white h-full shadow-lg transition-transform duration-300`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img src="/icon.png" alt="Logo" className="w-10 h-10" />
              <h1 className="text-xl font-bold text-indigo-600">PeerConnect</h1>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeMenu === item.id
                      ? "bg-indigo-50 text-indigo-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Menu Button & Search */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu size={24} />
              </button>

              <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 w-80">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses, mentors..."
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>
            </div>

            {/* Right - Notifications & Profile */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <img
                    src={user?.profile_image || "/profile.jpg"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <ChevronDown size={16} className="text-gray-600" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setActiveMenu("settings");
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings size={16} />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
          <div className="space-y-8">
            {/* Welcome Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.first_name || "Mentee"} 👋
              </h1>
              <p className="text-lg text-gray-600">
                Here's your learning overview and mentorship progress.
              </p>
            </div>

            {/* KPI CARDS */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <BookOpen size={24} />,
                  label: "Courses",
                  value: stats.totalCourses,
                  subtext: "Active courses",
                  color: "blue",
                },
                {
                  icon: <Users size={24} />,
                  label: "Mentors",
                  value: stats.totalMentors,
                  subtext: "Connected mentors",
                  color: "green",
                },
                {
                  icon: <CheckCircle size={24} />,
                  label: "Completed",
                  value: stats.completedMentorships,
                  subtext: "Mentorships done",
                  color: "purple",
                },
                {
                  icon: <Clock size={24} />,
                  label: "Pending",
                  value: stats.pendingMentorships,
                  subtext: "Awaiting approval",
                  color: "orange",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`bg-${item.color}-50 p-3 rounded-xl text-${item.color}-600`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                      <TrendingUp size={14} /> +{Math.floor(Math.random() * 10)}
                      %
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {item.value}
                    </p>
                    <p className="text-xs text-gray-500">{item.subtext}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* LEFT - 2 cols */}
              <div className="xl:col-span-2 space-y-8">
                {/* Recent Activity */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Recent Activity
                  </h2>
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                    {recentActivities.length > 0 ? (
                      <ul className="space-y-4">
                        {recentActivities.map((a, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
                          >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                              {a.mentor?.first_name?.[0]}
                              {a.mentor?.last_name?.[0]}
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-900">
                                <span className="font-semibold">
                                  {a.mentor
                                    ? `${a.mentor.first_name} ${a.mentor.last_name}`
                                    : "Mentor"}
                                </span>{" "}
                                — {a.action}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {getTimeAgo(a.time)}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center text-gray-500 py-8">
                        No recent mentorship activity yet.
                      </p>
                    )}
                  </div>
                </section>

                {/* Courses Section */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    My Courses
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {courses.length > 0 ? (
                      courses.map((course) => (
                        <div
                          key={course.id}
                          className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {course.title}
                            </h3>
                            <Award className="text-blue-500" size={20} />
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {course.description || "No description available."}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${Math.min(
                                  course.progress || 0,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Progress: {course.progress || 0}%
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-6 col-span-2">
                        You haven't enrolled in any courses yet.
                      </p>
                    )}
                  </div>
                </section>
              </div>

              {/* RIGHT - 1 col */}
              <div className="space-y-8">
                {/* Mentor List */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    My Mentors
                  </h2>
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 space-y-4">
                    {mentors.length > 0 ? (
                      mentors.map((mentor) => (
                        <div
                          key={mentor.id}
                          className="flex items-center justify-between border-b pb-4 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                              {mentor.first_name?.[0]}
                              {mentor.last_name?.[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {mentor.first_name} {mentor.last_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {mentor.role}
                              </p>
                            </div>
                          </div>
                          <button className="bg-blue-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center gap-1">
                            <MessageCircle size={14} /> Chat
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">
                        You have no assigned mentors yet.
                      </p>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
