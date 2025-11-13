import React from "react";

export default function StatCard({ icon: Icon, title, value, subtitle, tagText, tagColor, bgGradient }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 ${bgGradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <span className={`text-xs font-semibold ${tagColor} bg-opacity-20 px-3 py-1 rounded-full`}>
          {tagText}
        </span>
      </div>
      <h3 className="text-gray-600 font-medium text-sm mb-2">{title}</h3>
      <p className="text-4xl font-bold text-gray-900 mb-2">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}
