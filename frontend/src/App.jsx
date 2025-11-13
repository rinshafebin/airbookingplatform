import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/auth/LoginPage';
import RegisterPage from './Pages/auth/RegisterPage';
import ResetPasswordPage from './Pages/auth/ResetPasswordPage';
import ChangePasswordPage from './Pages/auth/ChangePasswordPage';
import UserHomePage from './Pages/user/UserHomePage';
import BookingsPage from './Pages/user/BookingsPage';
import MyTripsPage from './Pages/user/MyTripsPage';
import NewBooking from './Pages/user/NewBooking';
import FlightSearchResults from './Pages/user/FlightSearchResults';
import LiveFlights from './Pages/user/LiveFlights';

import UserManagement from './Pages/admin/UserManagement';
import Dashboard from './Pages/admin/Dashboard';
import FlightManagement from './Pages/admin/FlightManagement';
import AddFlight from './Pages/admin/AddFlight';
import EditFlight from './Pages/admin/EditFlight';
import AdminBookingList from './Pages/admin/AdminBookingList';
import UserDetail from './Pages/admin/UserDetail';




import toast, { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/user/home" element={<UserHomePage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/my-trips" element={<MyTripsPage />} />
        <Route path="/newbooking" element={<NewBooking />} />
        <Route path="/flights/search-results" element={<FlightSearchResults />} />
        <Route path="flight-status" element={<LiveFlights />} />


        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/flights" element={<FlightManagement />} />
        <Route path="/admin/flights/new" element={<AddFlight />} />
        <Route path="/admin/flights/:id" element={<EditFlight />} />
        <Route path="/admin/booking/stats" element={<AdminBookingList />} />
        <Route path="/admin/users/:id" element={<UserDetail />} />



        <Route
          path="*"
          element={<div className="text-center mt-20 text-2xl">Page Not Found</div>}
        />
      </Routes>
    </Router>
  );
};

export default App;
