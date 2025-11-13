import React from "react";
import { Calendar, CreditCard, Clock } from "lucide-react";

export default function BookingStats({ bookings }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Calendar className="text-orange-600 w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Completed</p>
            <p className="text-3xl font-bold text-emerald-600">
              {bookings.filter(b => b.payment_status.toLowerCase() === 'completed').length}
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <CreditCard className="text-emerald-600 w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Pending</p>
            <p className="text-3xl font-bold text-amber-600">
              {bookings.filter(b => b.payment_status.toLowerCase() === 'pending').length}
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
            <Clock className="text-amber-600 w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
