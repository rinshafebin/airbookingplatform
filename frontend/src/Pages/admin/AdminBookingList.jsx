import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import axios from "axios";
import BookingStats from '../../Components/Booking/BookingStats'
import BookingSearchFilter from '../../Components/Booking/BookingSearchFilter'
import BookingTable from "../../Components/Booking/BookingTable";

export default function AdminBookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/admin/bookings/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setBookings(res.data);
        console.log(res.data)
      } catch (err) {
        console.error("Error fetching bookings:", err.response?.data || err.message);
        alert("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const username = b.user?.username || "";
    const flightNumber = b.flight_details?.flight_number || "";
    const paymentStatus = b.payment_status || "";

    const matchesSearch =
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flightNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || paymentStatus.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-white">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-6">
        <BookingStats bookings={bookings} />
        <BookingSearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
        <BookingTable bookings={filteredBookings} getStatusColor={getStatusColor} />
      </div>
      <Footer />
    </div>
  );
}
