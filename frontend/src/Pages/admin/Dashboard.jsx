import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { 
  UserGroupIcon, 
  UserPlusIcon,
  ClockIcon,
  PaperAirplaneIcon,
  TicketIcon,
  ChartBarIcon 
} from "@heroicons/react/24/outline";
import StatCard from "../../Components/Dashboard/StatCard";
import QuickActionButton from "../../Components/Dashboard/QuickActionButton";
import SystemStatus from "../../Components/Dashboard/SystemStatus";

export default function Dashboard() {
  const [stats, setStats] = useState({
    pending_registrations: 0,
    active_flights: 0,
    total_bookings: 0,
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/admin/dashboard/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        alert("Failed to load dashboard data. Make sure you are an admin.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-white">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={ClockIcon}
            title="Pending Registrations"
            value={stats.pending_registrations}
            subtitle="Users awaiting approval"
            tagText="Pending"
            tagColor="text-amber-600"
            bgGradient="bg-gradient-to-br from-amber-400 to-amber-600"
          />
          <StatCard
            icon={PaperAirplaneIcon}
            title="Active Flights"
            value={stats.active_flights}
            subtitle="Currently scheduled flights"
            tagText="Active"
            tagColor="text-orange-600"
            bgGradient="bg-gradient-to-br from-orange-400 to-orange-600"
          />
          <StatCard
            icon={TicketIcon}
            title="Total Bookings"
            value={stats.total_bookings.toLocaleString()}
            subtitle="Completed transactions"
            tagText="All Time"
            tagColor="text-emerald-600"
            bgGradient="bg-gradient-to-br from-emerald-400 to-emerald-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionButton
              icon={UserPlusIcon}
              title="Manage Users"
              subtitle="View all users"
              onClick={() => navigate("/admin/users")}
              bgGradient="from-orange-50 to-orange-100"
              iconBg="bg-orange-500"
            />
            <QuickActionButton
              icon={PaperAirplaneIcon}
              title="Add Flight"
              subtitle="Create new flight"
              onClick={() => navigate("/admin/flights/new")}
              bgGradient="from-blue-50 to-blue-100"
              iconBg="bg-blue-500"
            />
            <QuickActionButton
              icon={TicketIcon}
              title="View Bookings"
              subtitle="All reservations"
              onClick={() => navigate("/admin/booking/stats")}
              bgGradient="from-emerald-50 to-emerald-100"
              iconBg="bg-emerald-500"
            />
            <QuickActionButton
              icon={ChartBarIcon}
              title="Statistics"
              subtitle="View analytics"
              onClick={() => navigate("/admin/statistics")}
              bgGradient="from-purple-50 to-purple-100"
              iconBg="bg-purple-500"
            />
          </div>
        </div>

        {/* System Status */}
        <SystemStatus />
      </div>
      <Footer />
    </div>
  );
}
