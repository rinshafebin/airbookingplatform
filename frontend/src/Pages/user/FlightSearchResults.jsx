import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import axios from "axios";

export default function FlightSearchResults() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get passed flights and search data
  const { flights: initialFlights, searchData } = location.state || {};
  const { from, to, date } = searchData || {};

  const [flights, setFlights] = useState(initialFlights || []);
  const [loading, setLoading] = useState(!initialFlights); // only true if flights not passed
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [filterAirline, setFilterAirline] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [showFilters, setShowFilters] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false); // for simulated payment

  useEffect(() => {
    if (!from || !to || !date) {
      setError("Invalid search. Please go back and enter all details.");
      setLoading(false);
      return;
    }

    if (initialFlights && initialFlights.length > 0) {
      setLoading(false);
      return;
    }

    const fetchFlights = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `http://127.0.0.1:8000/api/flights/?departure_airport=${from}&arrival_airport=${to}&date=${date}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFlights(response.data);
      } catch (err) {
        console.error(err);
        setError("No flights found or server error.");
        setFlights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [from, to, date, initialFlights]);

  // Filter and sort flights
  const airlines = [...new Set(flights.map(f => f.airline))];
  const filteredFlights = flights
    .filter(f => (filterAirline === "all" || f.airline === filterAirline) &&
      f.price >= priceRange.min && f.price <= priceRange.max)
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "duration") return a.duration.localeCompare(b.duration);
      if (sortBy === "departure") return new Date(a.departure_time) - new Date(b.departure_time);
      return 0;
    });

  // Handle simulated booking/payment
  const handleBooking = async (flightId) => {
    setBookingLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const token = localStorage.getItem("access_token");
      const bookingData = { flight_id: flightId, seats: 1 };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/bookings/",
        bookingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Booking created:", response.data);
      alert("Booking confirmed!");
      navigate("/bookings");
    } catch (err) {
      console.error("Booking error:", err.response || err);
      alert("Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-orange-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Searching for flights...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-orange-50">
          <p className="text-red-500 font-bold">{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-8 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Search Summary */}
          <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-semibold text-gray-900">{from}</p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <PaperAirplaneIcon className="w-5 h-5 text-orange-600 rotate-90" />
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-semibold text-gray-900">{to}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <CalendarIcon className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-gray-900">{date}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate("/user/home")}
                className="flex items-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg font-medium transition"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                Modify Search
              </button>
            </div>
          </div>

          {/* Results Header with Filters */}
          <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Available Flights</h2>
              <p className="text-gray-600">{filteredFlights.length} flights found</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filters</span>
              </button>

              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white text-sm font-medium"
                >
                  <option value="price">Price: Low to High</option>
                  <option value="duration">Duration</option>
                  <option value="departure">Departure Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100 grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Airline</label>
                <select
                  value={filterAirline}
                  onChange={(e) => setFilterAirline(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Airlines</option>
                  {airlines.map(airline => (
                    <option key={airline} value={airline}>{airline}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Price Range: ₹{priceRange.min} - ₹{priceRange.max}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  className="w-full accent-orange-500"
                />
              </div>
            </div>
          )}

          {/* Flights List */}
          {filteredFlights.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-12 text-center">
              <PaperAirplaneIcon className="w-16 h-16 text-orange-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No flights found</h3>
              <p className="text-gray-600">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFlights.map((flight) => (
                <div key={flight.id} className="bg-white rounded-2xl shadow-md border border-orange-100 p-6 hover:shadow-lg transition-all flex flex-col lg:flex-row lg:items-center gap-6">

                  {/* Flight Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <PaperAirplaneIcon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{flight.flight_number}</h3>
                        <p className="text-sm text-gray-600">{flight.airline}</p>
                      </div>
                      <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">{flight.stops}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-2xl font-bold text-gray-900">{new Date(flight.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-sm text-gray-600 mt-1">{flight.departure_airport}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <p className="text-sm text-gray-500 mb-2">{flight.duration}</p>
                        <div className="w-full h-0.5 bg-orange-300 relative">
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-1 text-right">
                        <p className="text-2xl font-bold text-gray-900">{new Date(flight.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-sm text-gray-600 mt-1">{flight.arrival_airport}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="lg:border-l lg:pl-6 border-gray-100 flex flex-col items-center justify-center gap-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <CurrencyRupeeIcon className="w-6 h-6 text-orange-600" />
                        <span className="text-3xl font-bold text-gray-900">{flight.price}</span>
                      </div>
                      <p className="text-sm text-gray-500">per person</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
                      <UsersIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-700">{flight.available_seats} seats left</span>
                    </div>

                    {/* Book Now */}
                    <button
                      onClick={() => handleBooking(flight.id)}
                      disabled={bookingLoading}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                    >
                      {bookingLoading ? "Processing..." : "Book Now"}
                    </button>

                    {/* Track on Map */}
                    <button
                      onClick={() => navigate(`/opensky-flight/${flight.icao24}`)}
                      className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      Track on Map
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
