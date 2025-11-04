import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Edit,
  Trash2,
  UserPlus,
  X,
  Loader2,
  Users,
  Search,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminGroups() {
  const API = "http://localhost:3000/api";

  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [groupModal, setGroupModal] = useState(false);
  const [memberModal, setMemberModal] = useState(false);

  const [groupForm, setGroupForm] = useState({
    group_name: "",
    description: "",
    created_by: "",
  });
  const [memberForm, setMemberForm] = useState({ id: "", role: "Member" });

  const [searchTerm, setSearchTerm] = useState("");

  // Loading states
  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [submittingGroup, setSubmittingGroup] = useState(false);
  const [addingMember, setAddingMember] = useState(false);

  // helpers to normalize IDs from different API shapes
  const getGroupId = (g) => g?.group_id ?? g?.id ?? g?.groupId ?? null;
  const getMemberGroupId = (m) =>
    m?.group_id ?? m?.groupId ?? m?.group?.id ?? null;
  const getMemberId = (m) =>
    m?.group_member_id ?? m?.id ?? m?.member_id ?? null;
  const getUserId = (u) => u?.id ?? u?.user_id ?? null;
  const getGroupCreatorName = (g) => {
    const id = g?.created_by ?? g?.owner_id ?? g?.user_id ?? null;
    if (id) return getUserName(id);
    return g?.creator_name ?? g?.owner_name ?? g?.created_by_name ?? "-";
  };

  // ------------------ Fetching ------------------
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/users`);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to fetch users");
    }
  }, [API]);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const [groupsRes, membersRes] = await Promise.all([
        axios.get(`${API}/groups`),
        axios.get(`${API}/members`),
      ]);

      const groupsData = Array.isArray(groupsRes.data) ? groupsRes.data : [];
      const membersData = Array.isArray(membersRes.data) ? membersRes.data : [];

      const groupsWithCount = groupsData.map((g) => {
        const gid = getGroupId(g);
        const groupMembers = membersData.filter(
          (m) => getMemberGroupId(m) == gid
        );
        const memberCount = groupMembers.filter(
          (m) => m.role === "Member"
        ).length;
        const moderatorCount = groupMembers.filter(
          (m) => m.role === "Moderator"
        ).length;
        const ownerCount = groupMembers.filter(
          (m) => m.role === "Owner"
        ).length;

        // normalize name/description so the UI works with different API shapes
        const normalizedName =
          g.group_name ?? g.name ?? g.title ?? g.groupName ?? "";
        const normalizedDescription =
          g.description ?? g.desc ?? g.details ?? g.description_text ?? "";

        return {
          ...g,
          group_id: gid,
          group_name: normalizedName,
          description: normalizedDescription,
          total_members: groupMembers.length,
          memberCount,
          moderatorCount,
          ownerCount,
        };
      });

      setGroups(groupsWithCount);
      setMembers(membersData);
    } catch {
      toast.error("Failed to fetch groups or members");
    } finally {
      setLoading(false);
    }
  }, [API]);

  const fetchMembers = useCallback(
    async (group_id) => {
      try {
        setLoadingMembers(true);
        const res = await axios.get(`${API}/members`);
        const membersData = Array.isArray(res.data)
          ? res.data.filter((m) => getMemberGroupId(m) == group_id)
          : [];
        setMembers(membersData);
      } catch {
        toast.error("Failed to fetch members");
      } finally {
        setLoadingMembers(false);
      }
    },
    [API]
  );

  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, [fetchGroups, fetchUsers]);

  // ----------------- Group CRUD -----------------
  const openCreateGroup = () => {
    setSelectedGroup(null);
    setGroupForm({ group_name: "", description: "", created_by: "" });
    setGroupModal(true);
  };

  const openEditGroup = (group) => {
    // Open the group modal pre-filled for editing
    setSelectedGroup(group);
    setGroupForm({
      group_name: group.group_name || "",
      description: group.description || "",
      created_by: group.created_by ?? group.owner_id ?? group.user_id ?? "",
    });
    setGroupModal(true);
  };

  const openMemberModal = (group) => {
    // Open the member management modal for the selected group
    setSelectedGroup(group);
    setMemberForm({ id: "", role: "Member" });
    fetchMembers(getGroupId(group));
    setMemberModal(true);
  };

  const submitGroup = async () => {
    if (!groupForm.group_name || !groupForm.group_name.trim())
      return toast.error("Group name is required");
    if (!groupForm.created_by)
      return toast.error("Creator (created_by) is required");

    try {
      setSubmittingGroup(true);
      if (selectedGroup) {
        // Update (use normalized id)
        const gid = getGroupId(selectedGroup);
        const payload = {
          ...groupForm,
          created_by: parseInt(groupForm.created_by),
        };
        const res = await axios.put(`${API}/groups/${gid}`, payload);
        toast.success("Group updated successfully");
        const resp = res.data || { ...selectedGroup, ...groupForm };
        const updated = {
          ...resp,
          group_id: getGroupId(resp) ?? gid,
          group_name:
            resp.group_name ??
            resp.groupName ??
            resp.name ??
            resp.title ??
            groupForm.group_name,
          description:
            resp.description ??
            resp.desc ??
            resp.details ??
            resp.description_text ??
            groupForm.description ??
            "",
          created_by:
            resp.created_by ??
            payload.created_by ??
            parseInt(groupForm.created_by),
        };
        setGroups((prev) =>
          prev.map((g) => (getGroupId(g) === gid ? { ...g, ...updated } : g))
        );
      } else {
        // Create
        const payload = {
          ...groupForm,
          created_by: parseInt(groupForm.created_by),
        };
        const res = await axios.post(`${API}/groups`, payload);
        const resp = res.data || { ...groupForm };
        const created = {
          ...resp,
          group_id: getGroupId(resp) ?? resp.group_id ?? resp.id ?? null,
          group_name:
            resp.group_name ??
            resp.groupName ??
            resp.name ??
            resp.title ??
            groupForm.group_name,
          description:
            resp.description ??
            resp.desc ??
            resp.details ??
            resp.description_text ??
            groupForm.description ??
            "",
          created_by:
            resp.created_by ??
            payload.created_by ??
            parseInt(groupForm.created_by),
        };
        toast.success("Group created successfully");
        setGroups((prev) => [
          {
            ...created,
            total_members: 0,
            memberCount: 0,
            moderatorCount: 0,
            ownerCount: 0,
          },
          ...prev,
        ]);
      }
      setGroupModal(false);
      setGroupForm({ group_name: "", description: "", created_by: "" });
      setSelectedGroup(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to save group");
    } finally {
      setSubmittingGroup(false);
    }
  };

  const deleteGroup = async (group_id) => {
    if (!window.confirm("Delete this group?")) return;
    try {
      // accept either group_id or group id value
      const id = group_id ?? null;
      await axios.delete(`${API}/groups/${id}`);
      toast.success("Group deleted");
      setGroups((prev) => prev.filter((g) => getGroupId(g) !== id));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to delete group");
    }
  };

  const addMember = async () => {
    if (!memberForm.id) return toast.error("Select a user");

    const alreadyMember = members.some(
      (m) => m.user_id === parseInt(memberForm.id)
    );
    if (alreadyMember)
      return toast.error("User is already a member of this group");

    try {
      setAddingMember(true);
      const gid = getGroupId(selectedGroup);
      const userId = parseInt(memberForm.id);
      const res = await axios.post(`${API}/members`, {
        group_id: gid,
        user_id: userId,
        id: memberForm.id,
        role: memberForm.role,
      });

      toast.success("Member added successfully");

      const newMember = {
        ...res.data,
        user_id: userId,
        role: memberForm.role,
        group_member_id: res.data.group_member_id ?? res.data.id ?? Date.now(),
      };

      setMembers((prev) => [...prev, newMember]);
      setGroups((prev) =>
        prev.map((g) =>
          getGroupId(g) === gid
            ? {
                ...g,
                total_members: (g.total_members || 0) + 1,
                [`${memberForm.role.toLowerCase()}Count`]:
                  (g[`${memberForm.role.toLowerCase()}Count`] || 0) + 1,
              }
            : g
        )
      );

      setMemberForm({ id: "", role: "Member" });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add member");
    } finally {
      setAddingMember(false);
    }
  };

  const removeMember = async (group_member_id, role) => {
    if (!window.confirm("Remove this member from the group?")) return;
    try {
      const mid = group_member_id ?? null;
      await axios.delete(`${API}/members/${mid}`);
      toast.success("Member removed successfully");

      setMembers((prev) =>
        prev.filter((m) => m.group_member_id !== group_member_id)
      );
      setGroups((prev) =>
        prev.map((g) =>
          getGroupId(g) === getGroupId(selectedGroup)
            ? {
                ...g,
                total_members: (g.total_members || 1) - 1,
                [`${role.toLowerCase()}Count`]:
                  (g[`${role.toLowerCase()}Count`] || 1) - 1,
              }
            : g
        )
      );
    } catch {
      toast.error("Failed to remove member");
    }
  };

  const updateMemberRole = async (group_member_id, newRole, oldRole) => {
    try {
      const mid = group_member_id ?? null;
      await axios.put(`${API}/members/${mid}`, { role: newRole });
      toast.success("Role updated successfully");

      setMembers((prev) =>
        prev.map((m) =>
          m.group_member_id === group_member_id ? { ...m, role: newRole } : m
        )
      );
      setGroups((prev) =>
        prev.map((g) =>
          getGroupId(g) === getGroupId(selectedGroup)
            ? {
                ...g,
                [`${oldRole.toLowerCase()}Count`]:
                  (g[`${oldRole.toLowerCase()}Count`] || 1) - 1,
                [`${newRole.toLowerCase()}Count`]:
                  (g[`${newRole.toLowerCase()}Count`] || 0) + 1,
              }
            : g
        )
      );
    } catch {
      toast.error("Failed to update role");
    }
  };

  const getUserName = (user_id) => {
    const user = users.find((u) => u.id === user_id);
    return user
      ? user.name || `${user.first_name} ${user.last_name || ""}`.trim()
      : `User ${user_id}`;
  };

  const filteredGroups = groups.filter((g) =>
    (g.group_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // summary counts for stats cards (match mentorship layout)
  const totalGroups = filteredGroups.length;
  const totalMembersCount = groups.reduce(
    (acc, g) => acc + (g.total_members || 0),
    0
  );
  const totalModerators = groups.reduce(
    (acc, g) => acc + (g.moderatorCount || 0),
    0
  );
  const totalOwners = groups.reduce((acc, g) => acc + (g.ownerCount || 0), 0);

  return (
    <div className="min-h-screen">
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
                Groups Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Create and manage groups, members, and roles
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-3 mb-4">
          <div className="flex flex-col lg:flex-row gap-3 items-center lg:items-start lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={openCreateGroup}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-xl hover:bg-green-700 transition-colors shadow-sm font-medium text-sm whitespace-nowrap"
              >
                <Users size={16} />
                Create
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-3 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Groups
                </p>
                <p className="text-xl font-bold text-gray-900">{totalGroups}</p>
              </div>
              <Users className="text-blue-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Members
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {totalMembersCount}
                </p>
              </div>
              <Users className="text-green-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Moderators
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {totalModerators}
                </p>
              </div>
              <Users className="text-yellow-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 border-l-4 border-gray-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Owners</p>
                <p className="text-xl font-bold text-gray-900">{totalOwners}</p>
              </div>
              <Users className="text-gray-500" size={32} />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={40} />{" "}
            Fetching the data.....
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Users className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "No groups found" : "No groups yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Try adjusting your search"
                : "Get started by creating your first group"}
            </p>
            {!searchTerm && (
              <button
                onClick={openCreateGroup}
                className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Your First Group
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Mobile cards */}
            <div className="md:hidden p-3">
              {filteredGroups.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {filteredGroups.map((g) => (
                    <div
                      key={getGroupId(g) ?? g.group_name}
                      className="bg-white border rounded-lg p-3 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {g.group_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {g.description || "No description"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openMemberModal(g)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Manage Members"
                            aria-label="Manage Members"
                          >
                            <UserPlus size={16} />
                          </button>
                          <button
                            onClick={() => openEditGroup(g)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit Group"
                            aria-label="Edit Group"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteGroup(getGroupId(g))}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete Group"
                            aria-label="Delete Group"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-600 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                          Members: {g.memberCount}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                          Mods: {g.moderatorCount}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 text-green-700">
                          Owners: {g.ownerCount}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-900 text-white">
                          Total: {g.total_members}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-3 text-gray-600">
                  No groups found
                </div>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Group
                    </th>
                    <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="py-2 px-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGroups.map((g) => (
                    <tr
                      key={getGroupId(g) ?? g.group_name}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-2 px-3 text-sm font-medium text-gray-900">
                        {g.group_name}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-700 max-w-lg truncate">
                        {g.description || "-"}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-700">
                        {getGroupCreatorName(g)}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openMemberModal(g)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Manage Members"
                            aria-label="Manage Members"
                          >
                            <UserPlus size={16} />
                          </button>
                          <button
                            onClick={() => openEditGroup(g)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit Group"
                            aria-label="Edit Group"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteGroup(getGroupId(g))}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete Group"
                            aria-label="Delete Group"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Member Modal */}
        {memberModal && selectedGroup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="bg-linear-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Manage Members
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">
                    {selectedGroup.group_name}
                  </p>
                </div>
                <button
                  onClick={() => setMemberModal(false)}
                  className="p-2 hover:bg-blue-600/20 rounded-lg text-white"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Add Member Form */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Add New Member
                </h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={memberForm.id}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, id: e.target.value })
                    }
                    className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={addingMember}
                  >
                    <option value="">Select User</option>
                    {users
                      .filter((u) => !members.some((m) => m.user_id === u.id))
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {getUserName(u.id)} (ID: {u.id})
                        </option>
                      ))}
                  </select>

                  <select
                    value={memberForm.role}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, role: e.target.value })
                    }
                    className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={addingMember}
                  >
                    <option value="Member">Member</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Owner">Owner</option>
                  </select>

                  <button
                    onClick={addMember}
                    disabled={addingMember}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    {addingMember ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <UserPlus size={18} />
                    )}
                    Add
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div className="flex-1 overflow-auto p-6">
                {loadingMembers ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                    Fetching the data...
                  </div>
                ) : members.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="mx-auto mb-3 text-gray-400" size={40} />
                    <p className="text-gray-600">
                      No members yet. Add your first member above.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">
                            Name
                          </th>
                          <th className="px-4 py-3 text-center font-semibold text-gray-700">
                            Role
                          </th>
                          <th className="px-4 py-3 text-center font-semibold text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((m, idx) => (
                          <tr
                            key={m.group_member_id}
                            className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                          >
                            <td className="px-4 py-3 text-gray-900">
                              {getUserName(m.user_id)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <select
                                value={m.role}
                                onChange={(e) =>
                                  updateMemberRole(
                                    m.group_member_id,
                                    e.target.value,
                                    m.role
                                  )
                                }
                                className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="Member">Member</option>
                                <option value="Moderator">Moderator</option>
                                <option value="Owner">Owner</option>
                              </select>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() =>
                                  removeMember(m.group_member_id, m.role)
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove Member"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setMemberModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Group Modal */}
        {groupModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden mx-auto">
              {/* Modal Header */}
              <div className="bg-linear-to-r from-blue-600 to-blue-700 px-4 py-3">
                <h2 className="text-2xl font-bold text-white">
                  {selectedGroup ? "Edit Group" : "Create New Group"}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {selectedGroup
                    ? "Update group details"
                    : "Add a new group to the system"}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Group Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={groupForm.group_name}
                    onChange={(e) =>
                      setGroupForm({ ...groupForm, group_name: e.target.value })
                    }
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter group name"
                    disabled={submittingGroup}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Creator <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={groupForm.created_by}
                    onChange={(e) =>
                      setGroupForm({ ...groupForm, created_by: e.target.value })
                    }
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={submittingGroup}
                  >
                    <option value="">Select Creator</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {getUserName(u.id)} (ID: {u.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={groupForm.description}
                    onChange={(e) =>
                      setGroupForm({
                        ...groupForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Enter group description"
                    rows={4}
                    disabled={submittingGroup}
                  />
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setGroupModal(false)}
                  disabled={submittingGroup}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitGroup}
                  disabled={submittingGroup}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {submittingGroup && (
                    <Loader2 className="animate-spin" size={18} />
                  )}
                  {selectedGroup ? "Update Group" : "Create Group"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
