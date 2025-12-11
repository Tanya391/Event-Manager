import React, { useState, useEffect } from 'react';
import { eventAPI, userAPI, announcementAPI } from '../../services/api';
import { Users, Calendar, Bell, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        students: 0,
        events: 0,
        announcements: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [events, students, announcements] = await Promise.all([
                    eventAPI.getAll(),
                    userAPI.getAllStudents(),
                    announcementAPI.getAll()
                ]);
                setStats({
                    events: events.length,
                    students: students.length,
                    announcements: announcements.length
                });
            } catch (error) {
                console.error("Error fetching stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center">
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 mr-4">
                        <Calendar className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Events</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.events}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center">
                    <div className="p-3 rounded-full bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 mr-4">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Registered Students</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.students}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center">
                    <div className="p-3 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 mr-4">
                        <Bell className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Announcements</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.announcements}</p>
                    </div>
                </div>
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
