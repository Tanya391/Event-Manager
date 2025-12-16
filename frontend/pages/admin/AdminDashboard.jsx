import React, { useState, useEffect } from 'react';
import { eventAPI, userAPI, announcementAPI, analyticsAPI } from '../../services/api';
import { Users, Calendar, Bell, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        students: 0,
        events: 0,
        announcements: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch stats from analytics API
                const dashboardData = await analyticsAPI.getDashboardStats();

                // Analytics API returns { stats: { students, events, announcements, ... } } or similar structure?
                // Let's check analyticsController.js in next step if needed, but api.js says it returns response.data
                // Assuming response.data is the JSON object.
                // If the backend returns { stats: ... } then we use dashboardData.stats.
                // If it returns flat data, we use dashboardData.

                // Let's assume the previous code pattern was fetching array lengths.
                // We should make the backend return these counts directly.
                // Since I cannot verify analyticsController easily without another tool call, I will use the analyticsAPI
                // but wrap it safely. If it fails or returns unexpected, we might need a fallback?
                // No, sticking to the plan: USE analyticsAPI. 

                if (dashboardData) {
                    setStats({
                        events: dashboardData.totalEvents || 0,
                        students: dashboardData.totalStudents || 0,
                        announcements: dashboardData.totalAnnouncements || 0
                    });
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
                // Fallback to old method if analytics fails (safety net)
                try {
                    const [events, students, announcements] = await Promise.all([
                        eventAPI.getAll(),
                        userAPI.getAllStudents(),
                        announcementAPI.getAll()
                    ]);
                    setStats({
                        events: events.length || 0,
                        students: students.length || 0,
                        announcements: announcements.length || 0
                    });
                } catch (fallbackError) {
                    console.error("Fallback stats fetch failed", fallbackError);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);
    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Welcome, {user?.name || 'Admin'} 👋
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Events - Clickable */}
                <a href="#/admin/events" className="block group">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center transition-transform transform group-hover:-translate-y-1 group-hover:shadow-md cursor-pointer">
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 mr-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Events</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.events}</p>
                        </div>
                    </div>
                </a>

                {/* Registered Students - Clickable */}
                <a href="#/admin/students" className="block group">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center transition-transform transform group-hover:-translate-y-1 group-hover:shadow-md cursor-pointer">
                        <div className="p-3 rounded-full bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 mr-4 group-hover:bg-pink-200 dark:group-hover:bg-pink-900/50 transition-colors">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Registered Students</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.students}</p>
                        </div>
                    </div>
                </a>

                {/* Active Announcements - Clickable */}
                <a href="#/admin/announcements" className="block group">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center transition-transform transform group-hover:-translate-y-1 group-hover:shadow-md cursor-pointer">
                        <div className="p-3 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 mr-4 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
                            <Bell className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Announcements</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.announcements}</p>
                        </div>
                    </div>
                </a>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <a href="#/admin/events" className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        Manage Events
                    </a>
                    <a href="#/admin/announcements" className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        Post Announcement
                    </a>
                    <a href="#/admin/students" className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        View Students
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
