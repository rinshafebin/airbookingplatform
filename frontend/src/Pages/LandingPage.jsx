import React from "react";
import { Plane, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center shadow-inner">
              <Plane className="text-orange-500 w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-wide">AirEase</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="text-gray-700 hover:text-orange-600 font-medium"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Book Your Flights Effortlessly with{" "}
            <span className="text-orange-600">AirEase</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Seamless flight search, easy booking, and real-time flight updates — 
            all in one place. Start your journey with confidence.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 mx-auto transition"
          >
            Get Started <ArrowRight size={18} />
          </button>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-16 border-t border-orange-100">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10 text-center">
          {[
            {
              title: "Flight Search",
              desc: "Find flights by airport, date, and availability with ease.",
            },
            {
              title: "Booking Management",
              desc: "Reserve seats, make payments, and manage bookings smoothly.",
            },
            {
              title: "My Trips",
              desc: "Track all your booked flights in one convenient dashboard.",
            },
            {
              title: "Real-time Status",
              desc: "Stay updated with live flight status powered by AirLabs.",
            },
          ].map((f, idx) => (
            <div
              key={idx}
              className="p-6 bg-orange-50 rounded-2xl shadow-inner hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-orange-700 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-orange-100 text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} AirEase. All rights reserved.
      </footer>
    </div>
  );
}
