import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import axios from "axios";
import Footer from "../../Components/Footer";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Calendar,
  UserX,
  ChevronRight,
  Shield,
  Activity
} from "lucide-react";

export default function UserManagement() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("pending");
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/admin",
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [pendingRes, allRes] = await Promise.all([
        api.get("/users/pending/"),
        api.get("/users/all/"),
      ]);
      setPendingUsers(pendingRes.data);
      setAllUsers(allRes.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (userId, action) => {
    try {
      await api.post(`/users/${userId}/${action}/`);
      setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
      const actionText = action === "approve" ? "approved" : "rejected";
      alert(`User ${actionText} successfully!`);
      fetchUsers();
    } catch (err) {
      console.error(`Error ${action}ing user:`, err.response || err);
      alert(`Failed to ${action} user.`);
    }
  };

  const usersToShow = view === "pending" ? pendingUsers : allUsers;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const UserCard = ({ user }) => (
    <div
      onClick={() => navigate(`/admin/users/${user.id}`)}
      className="group bg-white rounded-xl p-5 border border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-lg">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-800 text-lg truncate">
                {user.username}
              </h3>
              {user.is_superuser && (
                <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />
              )}
              {user.is_active && view === "all" && (
                <Activity className="w-4 h-4 text-green-500 flex-shrink-0" />
              )}
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Mail className="w-4 h-4 mr-1.5" />
              <span className="truncate">{user.email}</span>
            </div>
            
            <div className="flex items-center text-xs text-gray-400">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              <span>
                Registered {new Date(user.created_at || user.date_joined).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors flex-shrink-0" />
        </div>
      </div>

      {/* Actions for pending users */}
      {view === "pending" && (
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction(user.id, "approve");
            }}
            className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-2.5 rounded-lg hover:bg-green-600 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Approve</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction(user.id, "reject");
            }}
            className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-10 px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center space-x-3">
            <span>User Management</span>
          </h1>
          <p className="text-gray-600">Manage user accounts and approvals</p>
        </div>

        {/* Controls (only toggle buttons now) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setView("pending")}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                view === "pending"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Pending</span>
              {pendingUsers.length > 0 && (
                <span className="bg-white text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingUsers.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setView("all")}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                view === "all"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>All Users</span>
            </button>
          </div>
        </div>

        {/* Users Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              {view === "pending" ? "Pending Approvals" : "All Users"} 
              <span className="text-gray-400 ml-2">({usersToShow.length})</span>
            </h2>
          </div>

          {usersToShow.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
              <UserX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No users to display.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {usersToShow.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
