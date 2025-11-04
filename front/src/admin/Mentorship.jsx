import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Mentor() {
  const API_URL = "http://localhost:3000/api/mentorships";
  const USERS_API = "http://localhost:3000/api/users";

  const [mentorships, setMentorships] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMentorship, setSelectedMentorship] = useState(null);
  const [form, setForm] = useState({
    mentor_id: "",
    mentee_id: "",
    start_date: "",
    end_date: "",
    status: "Pending",
  });
  const [formErrors, setFormErrors] = useState({});
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const LIMIT = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchMentorships(), fetchUsers()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentorships = async () => {
    try {
      const res = await axios.get(API_URL);
      setMentorships(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch mentorships");
      setMentorships([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(USERS_API);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.mentor_id) errors.mentor_id = "Please select a mentor";
    if (!form.mentee_id) errors.mentee_id = "Please select a mentee";
    if (!form.start_date) errors.start_date = "Start date is required";
    if (form.mentor_id === form.mentee_id)
      errors.mentee_id = "Mentor and mentee cannot be the same person";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      setSubmitting(true);
      if (selectedMentorship) {
        await axios.put(`${API_URL}/${selectedMentorship.mentorship_id}`, form);
        toast.success("Mentorship updated successfully");
      } else {
        await axios.post(API_URL, form);
        toast.success("Mentorship created successfully");
      }
      fetchMentorships();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save mentorship");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (m) => {
    setSelectedMentorship(m);
    setForm({ ...m });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this mentorship?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Mentorship deleted successfully");
      fetchMentorships();
    } catch {
      toast.error("Failed to delete mentorship");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status });
      toast.success(`Mentorship ${status.toLowerCase()} successfully`);
      fetchMentorships();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const resetForm = () => {
    setForm({
      mentor_id: "",
      mentee_id: "",
      start_date: "",
      end_date: "",
      status: "Pending",
    });
    setFormErrors({});
    setSelectedMentorship(null);
    setIsModalOpen(false);
  };

  // Filter and paginate mentorships (search + status filter)
  const filtered = Array.isArray(mentorships)
    ? mentorships.filter((m) => {
        const mentorName =
          (users.find((u) => u.id === m.mentor_id)?.first_name || "") +
          " " +
          (users.find((u) => u.id === m.mentor_id)?.last_name || "");
        const menteeName =
          (users.find((u) => u.id === m.mentee_id)?.first_name || "") +
          " " +
          (users.find((u) => u.id === m.mentee_id)?.last_name || "");
        const term = search.toLowerCase();
        const matchesSearch =
          mentorName.toLowerCase().includes(term) ||
          menteeName.toLowerCase().includes(term);
        const matchesStatus =
          filterStatus === "All" || m.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
    : [];

  const totalPages = Math.ceil(filtered.length / LIMIT);
  const paginated = filtered.slice(
    (currentPage - 1) * LIMIT,
    currentPage * LIMIT
  );

  // clamp currentPage when filters change
  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(1);
    } else if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircle size={16} className="inline mr-1" />;
      case "Completed":
        return <CheckCircle size={16} className="inline mr-1" />;
      case "Reject":
        return <XCircle size={16} className="inline mr-1" />;
      default:
        return <Clock size={16} className="inline mr-1" />;
    }
  };

  return (
    <div className="min-h-screen ">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
              <Users className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mentorship Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage mentor-mentee relationships and track progress
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-3 mb-4">
          <div className="flex flex-col lg:flex-row gap-3 items-center lg:items-start lg:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by mentor or mentee name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 items-center">
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="min-w-[140px] border border-gray-300 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Reject">Rejected</option>
              </select>

              {/* Add Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm whitespace-nowrap"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-3 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
                <p className="text-xl font-bold text-gray-900">
                  {filtered.length}
                </p>
              </div>
              <Users className="text-blue-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
                <p className="text-xl font-bold text-gray-900">
                  {filtered.filter((m) => m.status === "Active").length}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Pending
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {filtered.filter((m) => m.status === "Pending").length}
                </p>
              </div>
              <Clock className="text-yellow-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 border-l-4 border-gray-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Completed
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {filtered.filter((m) => m.status === "Completed").length}
                </p>
              </div>
              <CheckCircle className="text-gray-500" size={32} />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
          ) : (
            <>
              {/* Mobile cards (small screens) */}
              <div className="md:hidden p-3">
                {paginated.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {paginated.map((m) => {
                      const mentor = users.find((u) => u.id === m.mentor_id);
                      const mentee = users.find((u) => u.id === m.mentee_id);
                      return (
                        <div
                          key={m.mentorship_id}
                          className="bg-white border rounded-lg p-3 shadow-sm"
                        >
                          <div className="flex items-start gap-3">
                            {mentor ? (
                              mentor.profile_image ? (
                                <img
                                  src={mentor.profile_image}
                                  alt={mentor.first_name}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                  {mentor.first_name?.[0]}
                                  {mentor.last_name?.[0]}
                                </div>
                              )
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gray-200" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {mentor
                                      ? `${mentor.first_name} ${
                                          mentor.last_name || ""
                                        }`
                                      : "-"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {mentee
                                      ? `${mentee.first_name} ${
                                          mentee.last_name || ""
                                        }`
                                      : "-"}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleEdit(m)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    title="Edit"
                                    aria-label="Edit mentorship"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDelete(m.mentorship_id)
                                    }
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    title="Delete"
                                    aria-label="Delete mentorship"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                  {m.status === "Pending" && (
                                    <>
                                      <button
                                        onClick={() =>
                                          handleStatusChange(
                                            m.mentorship_id,
                                            "Active"
                                          )
                                        }
                                        title="Accept mentorship"
                                        aria-label="Accept mentorship"
                                        className="p-2 text-green-600 hover:text-green-700 rounded-lg bg-transparent hover:bg-transparent"
                                      >
                                        <CheckCircle size={16} />
                                      </button>

                                      <button
                                        onClick={() =>
                                          handleStatusChange(
                                            m.mentorship_id,
                                            "Reject"
                                          )
                                        }
                                        title="Decline mentorship"
                                        aria-label="Decline mentorship"
                                        className="p-2 text-red-600 hover:text-red-700 rounded-lg bg-transparent hover:bg-transparent"
                                      >
                                        <XCircle size={16} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="mt-2 text-xs text-gray-600 flex items-center gap-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                  {m.start_date || "-"}
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                  {m.end_date || "-"}
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                                  {m.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-gray-600 p-3">
                    No mentorships found
                  </div>
                )}
              </div>

              {/* Desktop/table view (md+) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Mentor
                      </th>
                      <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Mentee
                      </th>
                      <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        End Date
                      </th>
                      <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-2 px-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginated.length > 0 ? (
                      paginated.map((m) => {
                        const mentor = users.find((u) => u.id === m.mentor_id);
                        const mentee = users.find((u) => u.id === m.mentee_id);
                        return (
                          <tr
                            key={m.mentorship_id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-3">
                                {mentor && mentor.profile_image ? (
                                  <img
                                    src={mentor.profile_image}
                                    alt={mentor.first_name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-sm">
                                    {mentor
                                      ? `${mentor.first_name?.[0] || ""}${
                                          mentor.last_name?.[0] || ""
                                        }`
                                      : ""}
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {mentor
                                      ? `${mentor.first_name}${
                                          mentor.last_name
                                            ? " " + mentor.last_name
                                            : ""
                                        }`
                                      : "-"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-3">
                                {mentee && mentee.profile_image ? (
                                  <img
                                    src={mentee.profile_image}
                                    alt={mentee.first_name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-sm">
                                    {mentee
                                      ? `${mentee.first_name?.[0] || ""}${
                                          mentee.last_name?.[0] || ""
                                        }`
                                      : ""}
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {mentee
                                      ? `${mentee.first_name}${
                                          mentee.last_name
                                            ? " " + mentee.last_name
                                            : ""
                                        }`
                                      : "-"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 px-3 text-sm text-gray-700">
                              <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-gray-400" />
                                {m.start_date || "-"}
                              </div>
                            </td>
                            <td className="py-2 px-3 text-sm text-gray-700">
                              <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-gray-400" />
                                {m.end_date || "-"}
                              </div>
                            </td>
                            <td className="py-2 px-3">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 text-sm font-semibold rounded-full ${
                                  m.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : m.status === "Completed"
                                    ? "bg-gray-200 text-gray-700"
                                    : m.status === "Reject"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {getStatusIcon(m.status)}
                                {m.status}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEdit(m)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit"
                                  aria-label="Edit mentorship"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(m.mentorship_id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                  aria-label="Delete mentorship"
                                >
                                  <Trash2 size={16} />
                                </button>
                                {m.status === "Pending" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleStatusChange(
                                          m.mentorship_id,
                                          "Active"
                                        )
                                      }
                                      title="Accept mentorship"
                                      aria-label="Accept mentorship"
                                      className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                                    >
                                      <CheckCircle size={16} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleStatusChange(
                                          m.mentorship_id,
                                          "Reject"
                                        )
                                      }
                                      title="Decline mentorship"
                                      aria-label="Decline mentorship"
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                    >
                                      <XCircle size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-8 text-gray-600"
                        >
                          No mentorships found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 0 && (
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <span className="text-sm text-gray-700 font-medium">
                      Showing{" "}
                      {filtered.length === 0
                        ? 0
                        : (currentPage - 1) * LIMIT + 1}
                      –
                      {filtered.length === 0
                        ? 0
                        : Math.min(currentPage * LIMIT, filtered.length)}{" "}
                      of {filtered.length} results
                    </span>
                    <div className="flex gap-2">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          currentPage === 1
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        Previous
                      </button>
                      {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = index + 1;
                        } else if (currentPage <= 3) {
                          pageNum = index + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + index;
                        } else {
                          pageNum = currentPage - 2 + index;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                              currentPage === pageNum
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          currentPage === totalPages
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
                <h2 className="text-2xl font-bold text-white">
                  {selectedMentorship
                    ? "Edit Mentorship"
                    : "Create New Mentorship"}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {selectedMentorship
                    ? "Update mentorship details"
                    : "Add a new mentor-mentee relationship"}
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-4 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {/* Mentor Select */}
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    Mentor <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.mentor_id}
                    onChange={(e) =>
                      setForm({ ...form, mentor_id: e.target.value })
                    }
                    className={`w-full border ${
                      formErrors.mentor_id
                        ? "border-red-500"
                        : "border-gray-300"
                    } py-2 px-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                    disabled={submitting}
                  >
                    <option value="">Select Mentor</option>
                    {Array.isArray(users)
                      ? users
                          .filter((u) => u.role?.toLowerCase() === "mentor")
                          .map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.first_name} {u.last_name}
                            </option>
                          ))
                      : null}
                  </select>
                  {formErrors.mentor_id && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <XCircle size={14} />
                      {formErrors.mentor_id}
                    </p>
                  )}
                </div>

                {/* Mentee Select */}
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    Mentee <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.mentee_id}
                    onChange={(e) =>
                      setForm({ ...form, mentee_id: e.target.value })
                    }
                    className={`w-full border ${
                      formErrors.mentee_id
                        ? "border-red-500"
                        : "border-gray-300"
                    } py-2 px-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                    disabled={submitting}
                  >
                    <option value="">Select Mentee</option>
                    {Array.isArray(users)
                      ? users
                          .filter((u) => u.role?.toLowerCase() === "mentee")
                          .map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.first_name} {u.last_name}
                            </option>
                          ))
                      : null}
                  </select>
                  {formErrors.mentee_id && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <XCircle size={14} />
                      {formErrors.mentee_id}
                    </p>
                  )}
                </div>

                {/* Date Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.start_date}
                      onChange={(e) =>
                        setForm({ ...form, start_date: e.target.value })
                      }
                      className={`w-full border ${
                        formErrors.start_date
                          ? "border-red-500"
                          : "border-gray-300"
                      } py-2 px-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                      disabled={submitting}
                    />
                    {formErrors.start_date && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <XCircle size={14} />
                        {formErrors.start_date}
                      </p>
                    )}
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={form.end_date}
                      onChange={(e) =>
                        setForm({ ...form, end_date: e.target.value })
                      }
                      className="w-full border border-gray-300 py-2 px-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      disabled={submitting}
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className="w-full border border-gray-300 py-2 px-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    disabled={submitting}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Reject">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={resetForm}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {submitting && <Loader2 className="animate-spin" size={16} />}
                  {selectedMentorship ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
