import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  UserRoundPlus,
  FolderKanban,
  ClipboardList,
  Plus,
  CalendarDays,
  Settings,
  TrendingUp,
  Activity,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const API_URL = "http://localhost:3000/api";

  // State
  const [users, setUsers] = useState([]);
  const [mentorships, setMentorships] = useState([]);
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, mentorshipsRes, groupsRes, membersRes] = await Promise.all([
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/mentorships`),
        axios.get(`${API_URL}/groups`),
        axios.get(`${API_URL}/members`),
      ]);

      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setMentorships(Array.isArray(mentorshipsRes.data) ? mentorshipsRes.data : []);
      setGroups(Array.isArray(groupsRes.data) ? groupsRes.data : []);
      setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === "Active").length,
    totalMentors: users.filter(u => u.role === "Mentor").length,
    activeMentorships: mentorships.filter(m => m.status === "Active").length,
    pendingMentorships: mentorships.filter(m => m.status === "Pending").length,
    totalGroups: groups.length,
    totalMembers: members.length,
  };

  // Get top mentors (mentors with most mentorships)
  const getTopMentors = () => {
    const mentorCounts = {};
    mentorships.forEach(m => {
      if (m.mentor_id) {
        mentorCounts[m.mentor_id] = (mentorCounts[m.mentor_id] || 0) + 1;
      }
    });

    return users
      .filter(u => u.role === "Mentor" && mentorCounts[u.id])
      .map(mentor => ({
        ...mentor,
        menteeCount: mentorCounts[mentor.id],
      }))
      .sort((a, b) => b.menteeCount - a.menteeCount)
      .slice(0, 4);
  };

 const getRecentActivities = () => {
  const activities = [];

  // --- 1. Recent user creations ---
  [...users].forEach(user => {
    activities.push({
      type: 'user',
      user: user,
      action: `New ${user.role} joined the platform`,
      time: user.date_joined,
      status: user.status,
    });
  });

  // --- 2. User status events (log every update) ---
  [...users].forEach(user => {
    if (user.updated_at) { // every update triggers a new log
      let actionMsg = '';
      switch (user.status) {
        case 'pending':
          actionMsg = `${user.first_name} ${user.last_name} is now pending approval`;
          break;
        case 'approved':
          actionMsg = `${user.first_name} ${user.last_name} was approved by admin`;
          break;
        case 'rejected':
          actionMsg = `${user.first_name} ${user.last_name} was rejected`;
          break;
        default:
          actionMsg = `${user.first_name} ${user.last_name} status changed to ${user.status}`;
      }

      activities.push({
        type: 'user-status',
        user: user,
        action: actionMsg,
        time: user.updated_at,
        status: user.status,
      });
    }
  });

  // --- 3. Mentorship creations ---
  [...mentorships].forEach(m => {
    const mentor = users.find(u => u.id === m.mentor_id);
    const mentee = users.find(u => u.id === m.mentee_id);
    if (mentor && mentee) {
      activities.push({
        type: 'mentorship',
        user: mentor,
        action: `Started mentoring ${mentee.first_name} ${mentee.last_name}`,
        time: m.start_date,
        status: m.status,
      });
    }
  });

  // --- 4. Mentorship status events (log every update) ---
  [...mentorships].forEach(m => {
    if (m.updated_at) { // every update triggers a new log
      const mentor = users.find(u => u.id === m.mentor_id);
      const mentee = users.find(u => u.id === m.mentee_id);
      if (mentor && mentee) {
        let actionMsg = '';
        switch (m.status) {
          case 'pending':
            actionMsg = `Mentorship between ${mentor.first_name} and ${mentee.first_name} is now pending`;
            break;
          case 'active':
            actionMsg = `Mentorship between ${mentor.first_name} and ${mentee.first_name} is now active`;
            break;
          case 'completed':
            actionMsg = `Mentorship between ${mentor.first_name} and ${mentee.first_name} completed`;
            break;
          default:
            actionMsg = `Mentorship between ${mentor.first_name} and ${mentee.first_name} changed to ${m.status}`;
        }

        activities.push({
          type: 'mentorship-status',
          user: mentor,
          action: actionMsg,
          time: m.updated_at,
          status: m.status,
        });
      }
    }
  });

  // --- 5. Sort by most recent ---
  return activities
    .sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0))
    .slice(0, 10); // keep top 10 recent
};
   const recentActivities = getRecentActivities();

const getTimeAgo = (date) => {
  if (!date) return 'Recently';
  const now = new Date();
  const past = new Date(date + "Z");
  const diffInMs = now - past;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  return 'Just now';
};

  // Get top groups (by member count)
  const getTopGroups = () => {
    return groups
      .map(group => ({
        ...group,
        memberCount: members.filter(m => m.group_id === group.group_id).length,
      }))
      .sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, 3);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6 lg:p-8">
      <div className="space-y-8">
        {/* HEADER */}
        <header>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, Admin 👋
          </h1>
          <p className="text-lg text-gray-600">
            Here's an overview of system activity and key performance insights.
          </p>
        </header>

        {/* KPI CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Users size={24} />,
              label: "Total Users",
              value: stats.totalUsers,
              subtext: `${stats.activeUsers} active`,
              color: "blue",
              trend: "+12%",
            },
            {
              icon: <UserRoundPlus size={24} />,
              label: "Active Mentors",
              value: stats.totalMentors,
              subtext: `${stats.activeMentorships} mentorships`,
              color: "green",
              trend: "+8%",
            },
            {
              icon: <FolderKanban size={24} />,
              label: "Groups",
              value: stats.totalGroups,
              subtext: `${stats.totalMembers} members`,
              color: "purple",
              trend: "+5%",
            },
            {
              icon: <ClipboardList size={24} />,
              label: "Pending",
              value: stats.pendingMentorships,
              subtext: "Awaiting approval",
              color: "orange",
              trend: "-3%",
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
                <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                  <TrendingUp size={14} />
                  {item.trend}
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

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* LEFT SIDE - 2 columns */}
          <div className="xl:col-span-2 space-y-8">
            {/* Recent Activity */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                <Activity className="text-gray-400" size={24} />
              </div>
           

<div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
  {recentActivities.length > 0 ? (
    <ul className="space-y-4">
      {recentActivities.map((activity, idx) => (
        <li
          key={idx}
          className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
        >
          {activity.user?.profile_image ? (
            <img
              src={activity.user.profile_image}
              alt="User"
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
              {activity.user?.first_name?.[0]}
              {activity.user?.last_name?.[0]}
            </div>
          )}
          <div className="flex-1">
            <p className="text-base text-gray-900">
              <span className="font-semibold">
                {activity.user?.first_name} {activity.user?.last_name}
              </span>{" "}
              {activity.action}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-500">{getTimeAgo(activity.time)}</p>
              {activity.status && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    activity.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : activity.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {activity.status}
                </span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-center text-gray-500 py-8">No recent activities</p>
  )}
</div>

            </section>

            {/* Top Mentors */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Top Mentors</h2>
                <button className="text-blue-600 text-base flex items-center gap-1 hover:underline font-medium">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getTopMentors().map((mentor) => (
                  <div
                    key={mentor.id}
                    className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
                  >
                    {mentor.profile_image ? (
                      <img
                        src={mentor.profile_image}
                        alt={mentor.first_name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                        {mentor.first_name?.[0]}{mentor.last_name?.[0]}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-base text-gray-900">
                        {mentor.first_name} {mentor.last_name}
                      </p>
                      <p className="text-sm text-gray-600">{mentor.role}</p>
                      <p className="text-xs text-blue-600 font-medium mt-1">
                        {mentor.menteeCount} mentee{mentor.menteeCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Top Groups */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Active Groups</h2>
                <button className="text-blue-600 text-base flex items-center gap-1 hover:underline font-medium">
                  <Plus size={16} /> View All
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                {getTopGroups().length > 0 ? (
                  <ul className="space-y-4">
                    {getTopGroups().map((group) => (
                      <li
                        key={group.group_id}
                        className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-3 rounded-xl">
                            <FolderKanban className="text-purple-600" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-base text-gray-900">
                              {group.group_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {group.description || "No description"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">
                            {group.memberCount}
                          </p>
                          <p className="text-xs text-gray-500">members</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-500 py-8">No groups yet</p>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT SIDE - 1 column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Add User", icon: <UserRoundPlus size={22} />, color: "blue" },
                  { label: "New Group", icon: <FolderKanban size={22} />, color: "purple" },
                  { label: "Mentorship", icon: <Users size={22} />, color: "green" },
                  { label: "Settings", icon: <Settings size={22} />, color: "gray" },
                ].map((btn, i) => (
                  <button
                    key={i}
                    className="bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center p-5 text-base font-medium hover:shadow-md hover:border-blue-300 transition-all"
                  >
                    <span className={`text-${btn.color}-600 mb-2`}>{btn.icon}</span>
                    {btn.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Mentorship Status */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Mentorship Status</h2>
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 space-y-4">
                {[
                  {
                    label: "Active",
                    count: stats.activeMentorships,
                    icon: <CheckCircle size={20} />,
                    color: "green",
                  },
                  {
                    label: "Pending",
                    count: stats.pendingMentorships,
                    icon: <Clock size={20} />,
                    color: "yellow",
                  },
                  {
                    label: "Completed",
                    count: mentorships.filter(m => m.status === "Completed").length,
                    icon: <CheckCircle size={20} />,
                    color: "gray",
                  },
                  {
                    label: "Rejected",
                    count: mentorships.filter(m => m.status === "Reject").length,
                    icon: <XCircle size={20} />,
                    color: "red",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`bg-${item.color}-100 p-2 rounded-lg text-${item.color}-600`}>
                        {item.icon}
                      </div>
                      <span className="text-base font-medium text-gray-900">{item.label}</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* System Stats */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">System Overview</h2>
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Mentorships</span>
                    <span className="text-lg font-bold text-gray-900">
                      {mentorships.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${mentorships.length > 0 ? (stats.activeMentorships / mentorships.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Active: {stats.activeMentorships}</span>
                    <span>
                      {mentorships.length > 0
                        ? Math.round((stats.activeMentorships / mentorships.length) * 100)
                        : 0}
                      % completion
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}