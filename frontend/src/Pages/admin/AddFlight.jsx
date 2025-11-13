import React, { useState } from "react";
import Navbar from "../../Components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../../Components/Footer";

export default function AddFlight() {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/flights/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      alert("Flight added successfully!");
      navigate("/admin/flights");
    } catch (err) {
      console.error("Error creating flight:", err);
      alert("Failed to add flight. Make sure you are an admin and fields are correct.");
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-white">
        <Navbar />
        <div className="max-w-4xl mx-auto py-10 px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Flight</h1>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-2xl shadow-md grid gap-4"
          >
            <input
              type="text"
              name="flight_number"
              placeholder="Flight Number"
              value={formData.flight_number}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
              required
            />
            <input
              type="text"
              name="airline"
              placeholder="Airline"
              value={formData.airline}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
              required
            />
            <input
              type="text"
              name="departure_airport"
              placeholder="Departure Airport"
              value={formData.departure_airport}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
              required
            />
            <input
              type="text"
              name="arrival_airport"
              placeholder="Arrival Airport"
              value={formData.arrival_airport}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
              required
            />
            <input
              type="datetime-local"
              name="departure_time"
              placeholder="Departure Time"
              value={formData.departure_time}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
              required
            />
            <input
              type="datetime-local"
              name="arrival_time"
              placeholder="Arrival Time"
              value={formData.arrival_time}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
              required
            />
            <input
              type="number"
              name="available_seats"
              placeholder="Available Seats"
              value={formData.available_seats}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
              required
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
              required
            >
              <option value="on-time">On-time</option>
              <option value="delayed">Delayed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold shadow-md mt-2 transition"
            >
              Save Flight
            </button>
          </form>
        </div>
        <Footer />

      </div>

      );
}
