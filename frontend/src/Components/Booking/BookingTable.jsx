// BookingTable.jsx
import React from "react";

export default function BookingTable({ bookings, getStatusColor }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-gray-200">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Flight</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Seats</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Booking Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                    No bookings found
                                </td>
                            </tr>
                        ) : (
                            bookings.map((b) => (
                                <tr key={b.id} className="hover:bg-orange-50/50 transition-colors">
                                    {/* User */}
                                    <td className="px-6 py-4 text-gray-900 font-medium">
                                        User ID: {b.user} {/* Or fetch username if you want */}
                                    </td>

                                    {/* Flight */}
                                    <td className="px-6 py-4 text-gray-900 font-medium">
                                        {b.flight?.flight_number || "Unknown Flight"}
                                    </td>

                                    {/* Seats */}
                                    <td className="px-6 py-4 text-gray-900 font-medium">{b.seats}</td>

                                    {/* Payment */}
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg font-medium text-sm border ${getStatusColor(b.payment_status)}`}>
                                            {b.payment_status}
                                        </span>
                                    </td>

                                    {/* Booking Time */}
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {new Date(b.created_at).toLocaleString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
