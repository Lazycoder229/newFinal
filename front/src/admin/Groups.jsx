import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Edit, Trash2, UserPlus, X, Loader2, Users, Search } from "lucide-react";
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

  const [groupForm, setGroupForm] = useState({ group_name: "", description: "" });
  const [memberForm, setMemberForm] = useState({ id: "", role: "Member" });

  const [searchTerm, setSearchTerm] = useState("");
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [submittingGroup, setSubmittingGroup] = useState(false);
  const [addingMember, setAddingMember] = useState(false);

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
        axios.get(`${API}/members`)
      ]);
      
      const groupsData = Array.isArray(groupsRes.data) ? groupsRes.data : [];
      const membersData = Array.isArray(membersRes.data) ? membersRes.data : [];

      const groupsWithCount = groupsData.map((g) => {
        const groupMembers = membersData.filter((m) => m.group_id === g.group_id);
        const memberCount = groupMembers.filter((m) => m.role === 'Member').length;
        const moderatorCount = groupMembers.filter((m) => m.role === 'Moderator').length;
        const ownerCount = groupMembers.filter((m) => m.role === 'Owner').length;

        return {
          ...g,
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

  const fetchMembers = useCallback(async (group_id) => {
    try {
      setLoadingMembers(true);
      const res = await axios.get(`${API}/members`);
      const membersData = Array.isArray(res.data) ? res.data.filter((m) => m.group_id === group_id) : [];
      setMembers(membersData);
    } catch {
      toast.error("Failed to fetch members");
    } finally {
      setLoadingMembers(false);
    }
  }, [API]);

  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, [fetchGroups, fetchUsers]);

  // ----------------- Group CRUD -----------------
  const openCreateGroup = () => {
    setSelectedGroup(null);
    setGroupForm({ group_name: "", description: "" });
    setGroupModal(true);
  };

  const openEditGroup = (group) => {
    setSelectedGroup(group);
    setGroupForm({ group_name: group.group_name, description: group.description });
    setGroupModal(true);
  };

  const submitGroup = async () => {
    if (!groupForm.group_name.trim()) return toast.error("Group name required");
    
    try {
      setSubmittingGroup(true);
      if (selectedGroup) {
        await axios.put(`${API}/groups/${selectedGroup.group_id}`, groupForm);
        toast.success("Group updated successfully");
      } else {
        await axios.post(`${API}/groups`, { ...groupForm, created_by: 35 });
        toast.success("Group created successfully");
      }
      setGroupModal(false);
      fetchGroups();
    } catch (err) {
      toast.error(err.response?.data?.error || "Error saving group");
    } finally {
      setSubmittingGroup(false);
    }
  };

  const deleteGroup = async (group_id) => {
    if (!window.confirm("Delete this group? This action cannot be undone.")) return;
    try {
      await axios.delete(`${API}/groups/${group_id}`);
      toast.success("Group deleted successfully");
      setGroups(prev => prev.filter(g => g.group_id !== group_id));
    } catch {
      toast.error("Failed to delete group");
    }
  };

  // ----------------- Member CRUD -----------------
  const openMemberModal = (group) => {
    setSelectedGroup(group);
    setMemberForm({ id: "", role: "Member" });
    fetchMembers(group.group_id);
    setMemberModal(true);
  };

  const addMember = async () => {
    if (!memberForm.id) return toast.error("Select a user");

    const alreadyMember = members.some(m => m.user_id === parseInt(memberForm.id));
    if (alreadyMember) return toast.error("User is already a member of this group");

    try {
      setAddingMember(true);
      const res = await axios.post(`${API}/members`, {
        group_id: selectedGroup.group_id,
        id: memberForm.id,
        role: memberForm.role,
      });

      toast.success("Member added successfully");
      
      const newMember = { 
        ...res.data, 
        user_id: parseInt(memberForm.id), 
        role: memberForm.role, 
        group_member_id: res.data.group_member_id || Date.now() 
      };
      
      setMembers(prev => [...prev, newMember]);
      setGroups(prev => prev.map(g => g.group_id === selectedGroup.group_id ? { 
        ...g, 
        total_members: g.total_members + 1, 
        [`${memberForm.role.toLowerCase()}Count`]: g[`${memberForm.role.toLowerCase()}Count`] + 1 
      } : g));

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
      await axios.delete(`${API}/members/${group_member_id}`);
      toast.success("Member removed successfully");

      setMembers(prev => prev.filter(m => m.group_member_id !== group_member_id));
      setGroups(prev => prev.map(g => g.group_id === selectedGroup.group_id ? { 
        ...g, 
        total_members: g.total_members - 1, 
        [`${role.toLowerCase()}Count`]: g[`${role.toLowerCase()}Count`] - 1 
      } : g));
    } catch {
      toast.error("Failed to remove member");
    }
  };

  const updateMemberRole = async (group_member_id, newRole, oldRole) => {
    try {
      await axios.put(`${API}/members/${group_member_id}`, { role: newRole });
      toast.success("Role updated successfully");

      setMembers(prev => prev.map(m => m.group_member_id === group_member_id ? { ...m, role: newRole } : m));
      setGroups(prev => prev.map(g => g.group_id === selectedGroup.group_id ? { 
        ...g, 
        [`${oldRole.toLowerCase()}Count`]: g[`${oldRole.toLowerCase()}Count`] - 1,
        [`${newRole.toLowerCase()}Count`]: g[`${newRole.toLowerCase()}Count`] + 1
      } : g));
    } catch {
      toast.error("Failed to update role");
    }
  };

  const getUserName = (user_id) => {
    const user = users.find((u) => u.id === user_id);
    return user ? user.name || `${user.first_name} ${user.last_name || ""}`.trim() : `User ${user_id}`;
  };

  const filteredGroups = groups.filter(
    (g) => (g.group_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Groups Management</h1>
          <p className="text-gray-600">Create and manage groups, members, and roles</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <button
              onClick={openCreateGroup}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium inline-flex items-center justify-center gap-2"
            >
              <Users size={18} />
              Create Group
            </button>

            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search groups..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={40} /> Fetching the data.....
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Users className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "No groups found" : "No groups yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? "Try adjusting your search" : "Get started by creating your first group"}
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
          /* Group Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((g) => (
              <div 
                key={g.group_id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
              >
                <div className="flex-1 mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{g.group_name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{g.description || "No description"}</p>
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Members</span>
                    <span className="font-semibold bg-gray-100 px-2 py-0.5 rounded">{g.memberCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Moderators</span>
                    <span className="font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{g.moderatorCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Owners</span>
                    <span className="font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded">{g.ownerCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-gray-200">
                    <span className="text-gray-700">Total Members</span>
                    <span className="bg-gray-900 text-white px-2 py-0.5 rounded">{g.total_members}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => openMemberModal(g)} 
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Manage Members"
                  >
                    <UserPlus size={18} />
                  </button>
                  <button 
                    onClick={() => openEditGroup(g)} 
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Group"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => deleteGroup(g.group_id)} 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Group"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Member Modal */}
        {memberModal && selectedGroup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Manage Members</h3>
                  <p className="text-gray-600 mt-1">{selectedGroup.group_name}</p>
                </div>
                <button 
                  onClick={() => setMemberModal(false)} 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Add Member Form */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-3">Add New Member</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={memberForm.id}
                    onChange={(e) => setMemberForm({ ...memberForm, id: e.target.value })}
                    className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={addingMember}
                  >
                    <option value="">Select User</option>
                    {users
                      .filter(u => !members.some(m => m.user_id === u.id))
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {getUserName(u.id)} (ID: {u.id})
                        </option>
                    ))}
                  </select>

                  <select
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
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
                    {addingMember ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
                    Add
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div className="flex-1 overflow-auto p-6">
                {loadingMembers ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-blue-600" size={32} />Fetching the data...
                  </div>
                ) : members.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="mx-auto mb-3 text-gray-400" size={40} />
                    <p className="text-gray-600">No members yet. Add your first member above.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                          <th className="px-4 py-3 text-center font-semibold text-gray-700">Role</th>
                          <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((m, idx) => (
                          <tr 
                            key={m.group_member_id} 
                            className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                          >
                            <td className="px-4 py-3 text-gray-900">{getUserName(m.user_id)}</td>
                            <td className="px-4 py-3 text-center">
                              <select
                                value={m.role}
                                onChange={(e) => updateMemberRole(m.group_member_id, e.target.value, m.role)}
                                className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="Member">Member</option>
                                <option value="Moderator">Moderator</option>
                                <option value="Owner">Owner</option>
                              </select>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button 
                                onClick={() => removeMember(m.group_member_id, m.role)} 
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
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button 
                  onClick={() => setMemberModal(false)} 
                  className="w-full sm:w-auto bg-gray-600 text-white px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Group Modal */}
        {groupModal && (
          <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedGroup ? "Edit Group" : "Create New Group"}
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Group Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={groupForm.group_name}
                    onChange={(e) => setGroupForm({ ...groupForm, group_name: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter group name"
                    disabled={submittingGroup}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={groupForm.description}
                    onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Enter group description"
                    rows={4}
                    disabled={submittingGroup}
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button 
                  onClick={() => setGroupModal(false)} 
                  disabled={submittingGroup}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitGroup} 
                  disabled={submittingGroup}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {submittingGroup && <Loader2 className="animate-spin" size={18} />}
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