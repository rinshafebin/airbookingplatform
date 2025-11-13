import React from "react";
import { PaperAirplaneIcon, PencilSquareIcon, MapPinIcon, CalendarIcon, CurrencyRupeeIcon, UsersIcon } from "@heroicons/react/24/outline";

export default function FlightCard({ flight, navigate }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 relative">
        <button
          onClick={() => navigate(`/admin/flights/${flight.id}`)}
          className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all"
        >
          <PencilSquareIcon className="w-5 h-5 text-white" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <PaperAirplaneIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{flight.flight_number}</h3>
            <p className="text-orange-100 text-sm">{flight.airline}</p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4">
        {/* Route */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
              <MapPinIcon className="w-4 h-4" />
              <span className="text-xs">From</span>
            </div>
            <p className="font-semibold text-gray-900">{flight.departure_airport}</p>
          </div>

          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>

          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-2 text-gray-600 text-sm mb-1">
              <span className="text-xs">To</span>
              <MapPinIcon className="w-4 h-4" />
            </div>
            <p className="font-semibold text-gray-900">{flight.arrival_airport}</p>
          </div>
        </div>

        {/* Time Info */}
        <div className="grid grid-cols-2 gap-3">
          {["departure_time", "arrival_time"].map((timeType, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>{timeType === "departure_time" ? "Departure" : "Arrival"}</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(flight[timeType]).toLocaleString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
              </p>
            </div>
          ))}
        </div>

        {/* Price & Seats */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <CurrencyRupeeIcon className="w-5 h-5 text-orange-600" />
            <span className="text-2xl font-bold text-gray-900">{flight.price}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
            <UsersIcon className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">
              {flight.available_seats} seats
            </span>
          </div>
        </div>

        {/* View Button */}
        <button
          onClick={() => navigate(`/admin/flights/${flight.id}`)}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
