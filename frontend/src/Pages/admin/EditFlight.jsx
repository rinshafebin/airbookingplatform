import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function EditFlight() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:8000/api";

  const [formData, setFormData] = useState({
    flight_number: "",
    airline: "",
    departure_airport: "",
    arrival_airport: "",
    departure_time: "",
    arrival_time: "",
    price: "",
    available_seats: "",
    status: "on-time",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/flights/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const flight = res.data;
        setFormData({
          flight_number: flight.flight_number,
          airline: flight.airline,
          departure_airport: flight.departure_airport,
          arrival_airport: flight.arrival_airport,
          departure_time: flight.departure_time.slice(0, 16), 
          arrival_time: flight.arrival_time.slice(0, 16),
          price: flight.price,
          available_seats: flight.available_seats,
          status: flight.status,
        });
      } catch (err) {
        console.error("Error fetching flight:", err);
        alert("Failed to load flight details.");
      } finally {
        setLoading(false);
      }
    };
    fetchFlight();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/flights/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      alert("Flight updated successfully!");
      navigate("/admin/flights");
    } catch (err) {
      console.error("Error updating flight:", err);
      alert("Failed to update flight. Check console for details.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this flight? This action cannot be undone.")) {
      try {
        await axios.delete(`${BASE_URL}/flights/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        alert("Flight deleted successfully!");
        navigate("/admin/flights");
      } catch (err) {
        console.error("Error deleting flight:", err);
        alert("Failed to delete flight. Check console for details.");
      }
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading flight details...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-white">
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Edit Flight</h1>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition"
          >
            Delete Flight
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md">
          {Object.keys(formData).map((key) => {
            if (key === "status") {
              return (
                <div key={key} className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="on-time">On-time</option>
                    <option value="delayed">Delayed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              );
            }

            return (
              <div key={key} className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">{key.replace("_", " ")}</label>
                <input
                  type={
                    key.includes("time")
                      ? "datetime-local"
                      : key === "price" || key === "available_seats"
                      ? "number"
                      : "text"
                  }
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>
            );
          })}
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition"
          >
            Update Flight
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
