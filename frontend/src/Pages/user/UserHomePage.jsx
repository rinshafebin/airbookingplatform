import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  ClipboardList,
  Briefcase,
  Activity,
  Calendar,
  MapPin,
  ArrowRight,
  Search,
  Sparkles,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import axios from "axios";

export default function UserHomePage() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setSearchData({ ...searchData, [e.target.name]: e.target.value });

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `http://127.0.0.1:8000/api/flights/?departure_airport=${searchData.from}&arrival_airport=${searchData.to}&date=${searchData.date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const flights = response.data;
      console.log("Flights found:", flights);

      navigate("/flights/search-results", {
        state: { flights, searchData },
      });
    } catch (err) {
      console.error("Error fetching flights:", err);
      setError("No flights found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const QuickActionCard = ({ icon: Icon, title, description, onClick, gradient }) => (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className="text-white w-6 h-6" />
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-300" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );

  const FeatureBadge = ({ icon: Icon, text }) => (
    <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-orange-100">
      <Icon className="w-4 h-4 text-orange-500" />
      <span className="text-sm font-medium text-gray-700">{text}</span>
    </div>
  );

  return (
    <>
      <Navbar />
      
      {/* Hero Section with Background Pattern */}
      <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative py-16 px-6">
          {/* Welcome Section */}
          <div className="max-w-6xl mx-auto text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Your Journey Starts Here</span>
            </div>
            
            <p className="text-gray-600 text-xl max-w-2xl mx-auto mb-8">
              Plan your next journey with{" "}
              <span className="text-orange-500 font-semibold">AirEase</span>.
              Book flights, manage trips, and travel with confidence.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <FeatureBadge icon={Shield} text="Secure Booking" />
              <FeatureBadge icon={TrendingUp} text="Best Prices" />
              <FeatureBadge icon={Clock} text="24/7 Support" />
            </div>
          </div>

          {/* Flight Search Section */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-orange-100 backdrop-blur-sm">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
                  <Plane className="text-white w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Search Flights
                </h2>
              </div>

              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {/* From Input */}
                  <div className="group">
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      From
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
                      <input
                        type="text"
                        name="from"
                        value={searchData.from}
                        onChange={handleChange}
                        placeholder="Departure airport"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors text-gray-800 placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  {/* To Input */}
                  <div className="group">
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      To
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
                      <input
                        type="text"
                        name="to"
                        value={searchData.to}
                        onChange={handleChange}
                        placeholder="Destination airport"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors text-gray-800 placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Date Input */}
                  <div className="group">
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
                      <input
                        type="date"
                        name="date"
                        value={searchData.date}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors text-gray-800"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Search Flights</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-600 text-center font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Quick Actions
              </h2>
              <p className="text-gray-600">
                Access your bookings and manage your trips effortlessly
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <QuickActionCard
                icon={ClipboardList}
                title="My Bookings"
                description="View and manage all your active flight reservations in one place."
                onClick={() => navigate("/bookings")}
                gradient="from-blue-500 to-blue-600"
              />

              <QuickActionCard
                icon={Briefcase}
                title="My Trips"
                description="Check your upcoming adventures and review past travel experiences."
                onClick={() => navigate("/my-trips")}
                gradient="from-purple-500 to-purple-600"
              />

              <QuickActionCard
                icon={Activity}
                title="Flight Status"
                description="Track your flights in real-time with live updates and notifications."
                onClick={() => navigate("/flight-status")}
                gradient="from-green-500 to-green-600"
              />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}