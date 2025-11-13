// src/pages/NewBooking.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function NewBooking() {
  const { flightId } = useParams(); // flightId from URL
  const [flight, setFlight] = useState(null); // flight details
  const [seatCount, setSeatCount] = useState(1);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };
  const BASE_URL = "http://127.0.0.1:8000/api";

  // Fetch flight details
  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/flights/${flightId}/`, { headers });
        setFlight(response.data);
      } catch (err) {
        setMessage("Failed to load flight details");
      }
    };
    fetchFlight();
  }, [flightId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { flight: flightId, seat_count: seatCount };
      const response = await axios.post(`${BASE_URL}/bookings/`, data, { headers });
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Booking failed");
    }
  };

  if (!flight) return <p className="mt-10 text-center">Loading flight details...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Book Flight: {flight.flight_number}</h1>
      <p><strong>From:</strong> {flight.departure_airport}</p>
      <p><strong>To:</strong> {flight.arrival_airport}</p>
      <p><strong>Departure:</strong> {new Date(flight.departure_time).toLocaleString()}</p>
      <p><strong>Available Seats:</strong> {flight.available_seats}</p>

      <form onSubmit={handleSubmit} className="mt-4">
        <label className="block mb-2">
          Seats to book:
          <input
            type="number"
            min="1"
            max={flight.available_seats}
            value={seatCount}
            onChange={(e) => setSeatCount(e.target.value)}
            className="border p-2 rounded w-full mt-1"
          />
        </label>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Book Now
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
