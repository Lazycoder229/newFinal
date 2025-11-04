import React, { useState, useEffect } from "react";
import axios from "axios";
import { MessageSquare, Trash2, Plus, X, ArrowLeft, Send } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminForum() {
  const API = "http://localhost:3000/api/forum";
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [newThread, setNewThread] = useState({ title: "", content: "" });
  const [newReply, setNewReply] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch all threads
  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/threads`);
      const data = Array.isArray(res.data) ? res.data : res.data.threads || [];
      setThreads(data);
    } catch (error) {
      console.error("Error fetching threads:", error);
      toast.error("Failed to load forum threads.");
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

  const openThread = async (thread) => {
    try {
      console.log("Opening thread:", thread); // shows thread object from list

      // Make sure the API endpoint is correct
      const res = await axios.get(`${API}/thread/${thread.thread_id}`);

      // Log safely
      console.log("Thread data from API:", res?.data);

      // Update state with full thread details
      setSelectedThread(res.data);
    } catch (error) {
      console.error(
        "Error fetching thread:",
        error.response?.data || error.message || error
      );
      toast.error("Failed to open thread.");
    }
  };

  // Create a new thread
  const createThread = async () => {
    if (!user) return toast.error("You must be logged in to create a thread.");
    if (!newThread.title.trim() || !newThread.content.trim()) {
      return toast.warning("Please fill in both fields.");
    }

    try {
      await axios.post(`${API}/thread`, {
        title: newThread.title,
        content: newThread.content,
        created_by: user.id, // ✅ use logged-in user ID
      });
      toast.success("✅ Thread created successfully!");
      setShowCreateModal(false);
      setNewThread({ title: "", content: "" });
      fetchThreads();
    } catch (error) {
      console.error(error);
      toast.error("Error creating thread.");
    }
  };

  // Delete a thread
  const deleteThread = async (id) => {
    if (!window.confirm("Are you sure you want to delete this thread?")) return;
    try {
      await axios.delete(`${API}/thread/${id}`);
      toast.info("🗑️ Thread deleted.");
      fetchThreads();
      setSelectedThread(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete thread.");
    }
  };

  // Add reply
  const addReply = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return toast.error("You must be logged in to reply.");
    if (!newReply.trim()) return toast.warning("Please type a reply first.");

    if (!selectedThread || !selectedThread.thread_id) {
      return toast.error("No thread selected.");
    }

    try {
      await axios.post(`${API}/reply`, {
        thread_id: selectedThread.thread_id, // this must come from state
        user_id: user.id,
        content: newReply,
      });

      setNewReply("");
      toast.success("💬 Reply added!");
      // Fetch the updated thread with new replies
      const res = await axios.get(`${API}/thread/${selectedThread.thread_id}`);
      setSelectedThread(res.data); // update state with latest replies
    } catch (error) {
      console.error(error.response?.data || error);
      toast.error("Failed to add reply.");
    }
  };

  // Delete reply
  const deleteReply = async (id) => {
    if (!window.confirm("Delete this reply?")) return;
    try {
      await axios.delete(`${API}/reply/${id}`);
      toast.info("🗑️ Reply deleted.");
      openThread(selectedThread);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete reply.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MessageSquare size={24} /> Forum Discussions
        </h1>
        {!selectedThread && user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} /> New Thread
          </button>
        )}
      </div>

      {/* Thread List */}
      {!selectedThread ? (
        <div className="space-y-4">
          {loading ? (
            <p className="text-center py-6 text-gray-500">Loading threads...</p>
          ) : threads.length > 0 ? (
            threads.map((t) => (
              <div
                key={t.thread_id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => openThread(t)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700 hover:underline">
                      {t.title}
                    </h3>
                    <p className="text-gray-700 mt-1 line-clamp-2">
                      {t.content}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Posted by{" "}
                      <span className="font-medium text-gray-700">
                        {t.created_by_name || "Unknown"}
                      </span>{" "}
                      • {new Date(t.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteThread(t.thread_id);
                    }}
                    className="text-red-500 hover:text-red-700"
                    title="Delete thread"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-6">No threads found.</p>
          )}
        </div>
      ) : (
        // Thread Details
        <div className="bg-white shadow rounded-lg p-6">
          <button
            onClick={() => setSelectedThread(null)}
            className="flex items-center gap-1 text-blue-600 mb-4 hover:underline"
          >
            <ArrowLeft size={16} /> Back to Threads
          </button>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {selectedThread.title}
          </h2>
          <p className="text-gray-700 mb-4">{selectedThread.content}</p>
          <p className="text-gray-500 text-sm mb-4">
            Posted by{" "}
            <strong>{selectedThread.created_by_name || "Unknown"}</strong> •{" "}
            {new Date(selectedThread.created_at).toLocaleString()}
          </p>

          {/* Replies */}
          <h3 className="font-semibold text-gray-800 mt-6 mb-3 flex items-center gap-2">
            💬 Replies ({selectedThread.replies?.length || 0})
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {selectedThread.replies && selectedThread.replies.length > 0 ? (
              selectedThread.replies.map((r) => (
                <div
                  key={r.reply_id}
                  className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                    {r.user_name ? r.user_name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-gray-800">
                        {r.user_name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(r.created_at).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-gray-700 mt-1">{r.content}</p>
                  </div>
                  <button
                    onClick={() => deleteReply(r.reply_id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                    title="Delete reply"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-3">No replies yet.</p>
            )}
          </div>

          {/* Add Reply */}
          {user && (
            <div className="mt-5 border-t pt-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Write your reply..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={addReply}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Send size={16} /> Send
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Thread Modal */}
      {showCreateModal && user && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                Create New Thread
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Thread Title"
              value={newThread.title}
              onChange={(e) =>
                setNewThread({ ...newThread, title: e.target.value })
              }
              className="w-full border px-3 py-2 mb-3 rounded-lg focus:outline-blue-500"
            />
            <textarea
              placeholder="Thread Content"
              rows="4"
              value={newThread.content}
              onChange={(e) =>
                setNewThread({ ...newThread, content: e.target.value })
              }
              className="w-full border px-3 py-2 mb-3 rounded-lg focus:outline-blue-500"
            />
            <button
              onClick={createThread}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create Thread
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
