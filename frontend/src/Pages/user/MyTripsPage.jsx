import React, { useEffect, useState } from "react";
import { Plane, Calendar, MapPin, Clock } from "lucide-react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function MyTrips() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("access_token");
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
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Split into upcoming and past based on current date
  const currentDate = new Date();
  const upcomingTrips = bookings.filter(
    (b) => new Date(b.flight.departure_time) > currentDate
  );
  const pastTrips = bookings.filter(
    (b) => new Date(b.flight.departure_time) <= currentDate
  );

  const trips = activeTab === "upcoming" ? upcomingTrips : pastTrips;

  if (loading) {
    return <div className="text-center mt-20 text-gray-600">Loading trips...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Trips</h1>
            <p className="text-gray-600">View your upcoming and past journeys</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-3 rounded-xl font-semibold transition ${
                activeTab === "upcoming"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-orange-50 border border-orange-100"
              }`}
            >
              Upcoming Trips
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-6 py-3 rounded-xl font-semibold transition ${
                activeTab === "past"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-orange-50 border border-orange-100"
              }`}
            >
              Past Trips
            </button>
          </div>

          {/* Trips List */}
          <div className="space-y-6">
            {trips.map((trip) => {
              const depTime = new Date(trip.flight.departure_time);
              const arrTime = new Date(trip.flight.arrival_time);

              return (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl shadow-md p-6 border border-orange-100 hover:shadow-lg transition"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Plane className="text-orange-500 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Flight {trip.flight.flight_number} — {trip.flight.airline}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {depTime.toLocaleDateString()} | {trip.payment_status}
                        </p>
                      </div>
                    </div>

                    {activeTab === "past" && (
                      <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                        Completed
                      </span>
                    )}
                  </div>

                  {/* Route */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-gray-800">
                        {depTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="text-gray-600 mt-1">{trip.flight.departure_airport}</p>
                    </div>

                    <div className="flex flex-col items-center px-6">
                      <p className="text-sm text-gray-500 mb-2">{trip.flight.status}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="w-20 h-0.5 bg-orange-300"></div>
                        <Plane className="text-orange-500 w-4 h-4 rotate-90" />
                        <div className="w-20 h-0.5 bg-orange-300"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      </div>
                    </div>

                    <div className="flex-1 text-right">
                      <p className="text-2xl font-bold text-gray-800">
                        {arrTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="text-gray-600 mt-1">{trip.flight.arrival_airport}</p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {activeTab === "upcoming" && (
                    <div className="flex items-center gap-6 pt-4 border-t border-gray-100 text-sm text-gray-600">
                      <span>
                        <strong>Seats:</strong> {trip.seats}
                      </span>
                      <span>
                        <strong>Price:</strong> ₹{trip.flight.price}
                      </span>
                      <span>
                        <strong>Status:</strong>{" "}
                        <span className="capitalize">{trip.flight.status}</span>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {trips.length === 0 && (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-orange-100">
              <Plane className="text-orange-300 w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No {activeTab} trips
              </h3>
              <p className="text-gray-600">
                {activeTab === "upcoming"
                  ? "Start planning your next adventure!"
                  : "Your travel history will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
