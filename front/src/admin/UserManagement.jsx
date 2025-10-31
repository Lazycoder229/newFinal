import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Edit,
  Trash2,
  Plus,
  Eye,
  Upload,
  FileDown,
  Search,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserManagement() {
  const API_URL = "http://localhost:3000/api/users";

  const [users, setUsers] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 13;

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "Member",
    job_title: "",
    profile_pic: "",
    status: "Active",
    last_active: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    }
  };
  const handleAdd = async () => {
    const errors = {};

    if (!form.first_name.trim()) errors.first_name = "First name is required";
    if (!form.last_name.trim()) errors.last_name = "Last name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errors.email = "Email is invalid";
    if (!form.job_title.trim()) errors.job_title = "Job title is required";
    if (!form.role) errors.role = "Role is required";
    if (!form.status) errors.status = "Status is required";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "profile_pic" && form[key] instanceof File) {
          formData.append("profile_pic", form[key]);
        } else {
          formData.append(key, form[key]);
        }
      });

      await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchUsers();
      resetForm();
      toast.success("User added successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add user");
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "profile_pic") {
          // If profile_pic is a File object, append it as a new file
          if (form.profile_pic instanceof File) {
            formData.append("profile_pic", form.profile_pic);
          } else {
            // If no new file, send the old URL
            formData.append("profile_pic_old", form.profile_pic);
          }
        } else {
          formData.append(key, form[key]);
        }
      });

      await axios.post(`${API_URL}/${selectedUser.id}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchUsers();
      resetForm();
      toast.success("User updated successfully");
    } catch {
      toast.error("Failed to update user");
    }
  };
  // Edit User
  const handleEdit = (user) => {
    setIsEditing(true);
    setSelectedUser(user);
    setForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      job_title: user.job_title || "",
      role: user.role || "Member",
      status: user.status || "Active",
      profile_pic: user.profile_pic || "", // keep the URL from server
      last_active: user.last_active || new Date().toISOString().split("T")[0],
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const resetForm = () => {
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      role: "Member",
      job_title: "",
      profile_pic: "",
      status: "Active",
      last_active: new Date().toISOString().split("T")[0],
    });
    setIsAdding(false);
    setIsEditing(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((u) => {
    const searchMatch =
      u.first_name.toLowerCase().includes(search.toLowerCase()) ||
      u.last_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.job_title.toLowerCase().includes(search.toLowerCase());
    const roleMatch = filterRole === "All" || u.role === filterRole;
    const statusMatch = filterStatus === "All" || u.status === filterStatus;
    return searchMatch && roleMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportCSV = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Role",
      "Job Title",
      "Status",
      "Last Active",
    ];
    const rows = filteredUsers.map((u) => [
      u.first_name,
      u.last_name,
      u.email,
      u.role,
      u.job_title,
      u.status,
      u.last_active,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((r) => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "users.csv";
    link.click();
    toast.success("CSV exported");
  };
  const renderForm = () => (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-auto p-5">
      <h2 className="text-lg font-semibold mb-4 text-center">
        {isEditing ? "Edit User" : "Add User"}
      </h2>

      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-4">
        <div className="relative">
          <img
            src={
              form.profile_pic instanceof File
                ? URL.createObjectURL(form.profile_pic)
                : form.profile_pic || "./kk.png"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border shadow-sm"
          />
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
            <Upload size={16} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files[0] &&
                setForm((prev) => ({
                  ...prev,
                  profile_pic: e.target.files[0],
                }))
              }
            />
          </label>
        </div>
      </div>

      {/* Form Inputs */}
      <div className="grid grid-cols-2 gap-3">
        {["first_name", "last_name", "email", "job_title"].map((key) => (
          <div key={key}>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              {key
                .replaceAll("_", " ")
                .toLowerCase()
                .replace(/^\w/, (c) => c.toUpperCase())}
            </label>

            <input
              type={key === "email" ? "email" : "text"}
              value={form[key]}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, [key]: e.target.value }));
                setFormErrors((prev) => ({ ...prev, [key]: "" })); // clear error
              }}
              className="border py-1 px-2 rounded text-sm w-full"
            />
            {formErrors[key] && (
              <p className="text-red-600 text-xs mt-1">{formErrors[key]}</p>
            )}
          </div>
        ))}

        {/* Role */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Role
          </label>
          <select
            value={form.role}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, role: e.target.value }));
              setFormErrors((prev) => ({ ...prev, role: "" }));
            }}
            className="border py-1 px-2 rounded text-sm w-full"
          >
            <option>Member</option>
            <option>Mentor</option>
            <option>Admin</option>
          </select>
          {formErrors.role && (
            <p className="text-red-600 text-xs mt-1">{formErrors.role}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, status: e.target.value }));
              setFormErrors((prev) => ({ ...prev, status: "" }));
            }}
            className="border py-1 px-2 rounded text-sm w-full"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
          {formErrors.status && (
            <p className="text-red-600 text-xs mt-1">{formErrors.status}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={resetForm}
          className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm"
        >
          Cancel
        </button>
        <button
          onClick={isEditing ? handleUpdate : handleAdd}
          className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
        >
          {isEditing ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        closeButton={false} // ✅ disables the "×" icon
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="bg-white border border-gray-300 rounded-lg shadow-lg text-gray-800 px-4 py-2"
        bodyClassName="font-medium text-sm"
      />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-500 text-sm">Manage users.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1 bg-green-600 text-white px-2.5 py-1.5 rounded text-sm hover:bg-green-700"
          >
            <FileDown size={14} /> Export
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
          >
            <Plus size={14} /> Add User
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border pl-7 pr-2 py-1 rounded text-sm w-full"
          />
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        >
          <option>All</option>
          <option>Member</option>
          <option>Mentor</option>
          <option>Admin</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-xs border border-gray-200">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th className="py-1.5 px-2 text-left">User</th>
              <th className="py-1.5 px-2 text-left">Email</th>
              <th className="py-1.5 px-2 text-left">Role</th>
              <th className="py-1.5 px-2 text-left">Job Title</th>
              <th className="py-1.5 px-2 text-left">Status</th>
              <th className="py-1.5 px-2 text-left">Last Active</th>
              <th className="py-1.5 px-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="py-1.5 px-2 flex items-center gap-2">
                    {u.profile_pic ? (
                      <img
                        src={u.profile_pic}
                        alt={u.first_name}
                        className="w-7 h-7 rounded-full"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                        N/A
                      </div>
                    )}
                    <span>
                      {u.first_name} {u.last_name}
                    </span>
                  </td>
                  <td className="py-1.5 px-2">{u.email}</td>
                  <td className="py-1.5 px-2">{u.role}</td>
                  <td className="py-1.5 px-2">{u.job_title}</td>
                  <td className="py-1.5 px-2">
                    <span
                      className={`px-2 py-0.5 text-[11px] rounded ${
                        u.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-1.5 px-2">{u.last_active}</td>
                  <td className="py-1.5 px-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setIsViewing(true);
                          setSelectedUser(u);
                        }}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleEdit(u)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-3 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-2 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {(isAdding || isEditing) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
          {renderForm()}
        </div>
      )}

      {isViewing && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm relative text-sm text-gray-700">
            <div className="flex flex-col items-center">
              {selectedUser.profile_pic && (
                <img
                  src={selectedUser.profile_pic}
                  alt={selectedUser.first_name}
                  className="w-24 h-24 rounded-full border-4 border-blue-100 shadow-md"
                />
              )}
              <h2 className="text-lg font-semibold mt-3">
                {selectedUser.first_name} {selectedUser.last_name}
              </h2>
              <p className="text-gray-500 text-sm">{selectedUser.job_title}</p>
              <p className="text-gray-400 text-xs mb-3">{selectedUser.email}</p>
            </div>
            <div className="border-t my-3"></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs">Role</p>
                <p className="font-medium">{selectedUser.role}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Job Title</p>
                <p className="font-medium">{selectedUser.job_title}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Status</p>
                <p
                  className={`font-medium ${
                    selectedUser.status === "Active"
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {selectedUser.status}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Last Active</p>
                <p className="font-medium">{selectedUser.last_active}</p>
              </div>
            </div>
            <div className="mt-5 text-center">
              <button
                onClick={() => setIsViewing(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
