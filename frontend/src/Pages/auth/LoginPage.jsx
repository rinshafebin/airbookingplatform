import React, { useState } from "react";
import { Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(""); 
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrorMsg("");

  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/auth/login/",
      {
        email: formData.email.trim(),
        password: formData.password,
      }
    );

    // Destructure user here!
    const { access, refresh, user } = res.data;

    // Update auth context
    dispatch({
      type: "LOGIN",
      payload: { user, token: access, refresh },
    });

    console.log("Logged in user:", user);

    // Store tokens
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    // Navigate based on role
    if (user.is_admin === true) {
  navigate("/admin/dashboard");
} else {
  navigate("/user/home");
}

  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);

    const msg =
      err.response?.data?.detail ||
      err.response?.data?.non_field_errors?.[0] ||
      "Login failed. Check your credentials or wait for admin approval.";

    setErrorMsg(msg);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 rounded-full mb-4 shadow-inner">
            <Plane className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500">Sign in to book your next flight</p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              required
            />
          </div>

          <div className="flex items-center justify-end text-sm">
            <button
              type="button"
              className="text-orange-600 hover:text-orange-700 font-medium"
              onClick={() => navigate("/reset-password")}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>


        {/* Signup */}
        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?
          <span
            className="text-orange-600 hover:text-orange-700 font-semibold ml-1 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
