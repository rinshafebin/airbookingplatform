import React from "react";

export default function QuickActionButton({ icon: Icon, title, subtitle, onClick, bgGradient, iconBg }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-4 bg-gradient-to-br rounded-xl hover:shadow-md transition-all group"
      style={{ background: bgGradient }}
    >
      <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-left">
        <p className="font-semibold text-gray-900 text-sm">{title}</p>
        <p className="text-xs text-gray-600">{subtitle}</p>
      </div>
    </button>
  );
}
