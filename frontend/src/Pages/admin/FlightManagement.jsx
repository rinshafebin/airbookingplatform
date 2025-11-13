import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PaperAirplaneIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/outline";
import StatCard from '../../Components/Flights/StatCard'
import FlightCard from '../../Components/Flights/FlightCard'
import SearchFilter from '../../Components/Flights/SearchFilter'

export default function FlightManagement() {
  const [flights, setFlights] = useState([]);
  const [stats, setStats] = useState({ total_flights: 0, total_airlines: 0, total_available_seats: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAirline, setFilterAirline] = useState("all");
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/flights/`, { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } });
        setFlights(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load flights.");
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/flights/stats/`, { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } });
        setStats(res.data);
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  const airlines = [...new Set(flights.map(f => f.airline))];

  const filteredFlights = flights.filter(flight => {
    const matchesSearch =
      flight.flight_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.departure_airport.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.arrival_airport.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAirline = filterAirline === "all" || flight.airline === filterAirline;
    return matchesSearch && matchesAirline;
  });

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-white">
      <Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading flights...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-white">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Flight Management</h1>
            <p className="text-gray-600">Manage and monitor all flight schedules</p>
          </div>
          <button
            onClick={() => navigate("/admin/flights/new")}
            className="mt-4 md:mt-0 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" /> Add New Flight
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Flights" value={stats.total_flights} icon={PaperAirplaneIcon} iconBg="bg-orange-100 text-orange-600" />
          <StatCard title="Airlines" value={stats.total_airlines} icon={MapPinIcon} iconBg="bg-blue-100 text-blue-600" />
          <StatCard title="Available Seats" value={stats.total_available_seats} icon={UsersIcon} iconBg="bg-emerald-100 text-emerald-600" />
        </div>

        {/* Search & Filter */}
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterAirline={filterAirline}
          setFilterAirline={setFilterAirline}
          airlines={airlines}
        />

        {/* Flight Cards */}
        {filteredFlights.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <PaperAirplaneIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium text-lg">No flights available</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or add a new flight</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlights.map(flight => <FlightCard key={flight.id} flight={flight} navigate={navigate} />)}
          </div>
        )}

        {filteredFlights.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {filteredFlights.length} of {flights.length} flights
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
