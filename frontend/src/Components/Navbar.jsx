import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = state.user;

  const navItems = user?.is_admin
    ? [
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "Users", path: "/admin/users" },
        { label: "Flights", path: "/admin/flights" },
        { label: "Bookings", path: "/admin/booking/stats" },
      ]
    : [
        { label: "Home", path: "/user/home" },
        { label: "Bookings", path: "/bookings" },
        { label: "My Trips", path: "/my-trips" },
        { label: "Flight Status", path: "/flight-status" },
      ];

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer font-bold text-gray-900 text-lg"
          onClick={() =>
            navigate(user?.is_admin ? "/admin/dashboard" : "/user/home")
          }
        >
          AirEase
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition
                ${
                  location.pathname === item.path
                    ? "text-orange-600 bg-orange-50"
                    : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                }`}
            >
              {item.label}
            </button>
          ))}

          {/* Profile Dropdown for desktop */}
          <div className="relative">
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md bg-orange-50 hover:bg-orange-100 transition"
          >
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6 text-orange-600" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-orange-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-orange-100 shadow-md">
          <div className="flex flex-col px-4 py-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition
                  ${
                    location.pathname === item.path
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                  }`}
              >
                {item.label}
              </button>
            ))}

            {/* Account & Logout */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 mt-1 text-red-600 hover:bg-red-50 transition rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
