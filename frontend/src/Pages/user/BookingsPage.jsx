import React, { useEffect, useState } from "react";
import { Plane, Calendar, MapPin, CheckCircle, XCircle, Clock, Download } from "lucide-react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("access_token"); // JWT token from login
        const res = await fetch("http://127.0.0.1:8000/api/bookings/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    if (status === "confirmed") return "bg-green-100 text-green-700 border-green-200";
    if (status === "cancelled") return "bg-red-100 text-red-700 border-red-200";
    if (status === "delayed") return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status) => {
    if (status === "confirmed") return <CheckCircle className="w-4 h-4" />;
    if (status === "cancelled") return <XCircle className="w-4 h-4" />;
    if (status === "delayed") return <Clock className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-600">Loading bookings...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600 mb-8">View and manage your flight reservations</p>

          {/* Bookings List */}
          {bookings.length > 0 ? (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl shadow-md p-6 border border-orange-100 hover:shadow-lg transition"
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Plane className="text-orange-500 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Booking ID: {booking.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Flight {booking.flight.flight_number} – {booking.flight.airline}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(
                        booking.flight.status
                      )}`}
                    >
                      {getStatusIcon(booking.flight.status)}
                      <span className="text-sm font-semibold capitalize">
                        {booking.flight.status}
                      </span>
                    </div>
                  </div>

                  {/* Flight Details */}
                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-orange-500 w-5 h-5 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Route</p>
                        <p className="text-gray-800 font-medium">
                          {booking.flight.departure_airport} → {booking.flight.arrival_airport}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="text-orange-500 w-5 h-5 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Departure</p>
                        <p className="text-gray-800 font-medium">
                          {new Date(booking.flight.departure_time).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex gap-6 text-sm text-gray-600">
                      <span>
                        <strong>Seats:</strong> {booking.seats}
                      </span>
                      <span>
                        <strong>Payment:</strong> {booking.payment_status}
                      </span>
                      <span>
                        <strong>Price:</strong> ₹{booking.flight.price}
                      </span>
                    </div>

                    <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition">
                      <Download className="w-4 h-4" />
                      Download Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-orange-100">
              <Plane className="text-orange-300 w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Yet</h3>
              <p className="text-gray-600">Start planning your next adventure!</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
