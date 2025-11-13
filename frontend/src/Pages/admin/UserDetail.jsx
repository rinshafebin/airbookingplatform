import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Calendar, CheckCircle, XCircle, Shield, User, ArrowLeft, Clock } from "lucide-react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function UserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("access_token");

    const api = axios.create({
        baseURL: "http://127.0.0.1:8000/api/admin",
        headers: { Authorization: `Bearer ${token}` },
    });

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/users/${id}/`);
                setUser(res.data);
            } catch (err) {
                console.error("Error fetching user:", err);
                alert("Failed to load user details.");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchUser();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-white">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading user details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-white">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <p className="text-center text-gray-600 text-lg">User not found.</p>
                </div>
                <Footer />
            </div>
        );
    }

    const InfoCard = ({ icon: Icon, label, value, highlight = false }) => (
        <div className="flex items-start space-x-3 p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`p-2 rounded-lg ${highlight ? 'bg-orange-100' : 'bg-gray-100'}`}>
                <Icon className={`w-5 h-5 ${highlight ? 'text-orange-600' : 'text-gray-600'}`} />
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className="text-gray-800 font-medium">{value}</p>
            </div>
        </div>
    );

    const StatusBadge = ({ active, label, activeText, inactiveText }) => (
        <div className="flex items-center space-x-2">
            {active ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
                <XCircle className="w-5 h-5 text-red-500" />
            )}
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className={`font-medium ${active ? 'text-green-600' : 'text-red-600'}`}>
                    {active ? activeText : inactiveText}
                </p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-white">
            <Navbar />

            <div className="max-w-4xl mx-auto py-10 px-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center space-x-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm border border-gray-200 transition-all hover:shadow-md"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>

                {/* User Header Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
                    <div className="flex items-start space-x-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                                <User className="w-12 h-12 text-white" />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {user.username}
                            </h1>
                            <p className="text-gray-600 flex items-center space-x-2 mb-4">
                                <Mail className="w-4 h-4" />
                                <span>{user.email}</span>
                            </p>

                            {/* Status Badges */}
                            <div className="flex flex-wrap gap-6 mt-4">
                                <StatusBadge
                                    active={user.is_approved}
                                    label="Account Status"
                                    activeText="Approved"
                                    inactiveText="Pending Approval"
                                />
                                <StatusBadge
                                    active={user.is_active}
                                    label="Activity"
                                    activeText="Active"
                                    inactiveText="Inactive"
                                />
                                {user.is_superuser && (
                                    <div className="flex items-center space-x-2">
                                        <Shield className="w-5 h-5 text-blue-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">Role</p>
                                            <p className="font-medium text-blue-600">Administrator</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <InfoCard
                        icon={Calendar}
                        label="Member Since"
                        value={new Date(user.created_at || user.date_joined).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                        highlight={true}
                    />
                    <InfoCard
                        icon={Clock}
                        label="Last Updated"
                        value={new Date(user.created_at || user.date_joined).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    />
                </div>

                {/* Bio Section */}
                {user.bio && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                            <User className="w-5 h-5 text-orange-500" />
                            <span>About</span>
                        </h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {user.bio}
                        </p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}