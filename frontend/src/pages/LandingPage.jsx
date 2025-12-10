// Landing Page - Home page with login options

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Shield, Calendar, Bell, TrendingUp, Users } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center animate-fade-in">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            College Event Management Portal
                        </h1>
                        <p className="text-xl md:text-2xl mb-12 text-indigo-100">
                            Discover, Register, and Manage College Events Seamlessly
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/student/login')}
                                className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-50 transition-all duration-300 hover:scale-105 shadow-xl"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <GraduationCap className="w-6 h-6" />
                                    Student Login
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/admin/login')}
                                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 hover:scale-105"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Shield className="w-6 h-6" />
                                    Admin Login
                                </div>
                            </button>
                        </div>

                        {/* Register Link */}
                        <p className="mt-8 text-indigo-100">
                            New student?{' '}
                            <button
                                onClick={() => navigate('/student/register')}
                                className="underline font-semibold hover:text-white"
                            >
                                Register here
                            </button>
                        </p>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
                    Why Choose Our Platform?
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="card-hover text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
                            <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Easy Event Discovery</h3>
                        <p className="text-gray-600">
                            Browse and register for college events with just a few clicks
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="card-hover text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-4">
                            <Bell className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Real-time Notifications</h3>
                        <p className="text-gray-600">
                            Get instant updates about new events and announcements
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="card-hover text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4">
                            <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Analytics Dashboard</h3>
                        <p className="text-gray-600">
                            Comprehensive insights for administrators to track engagement
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400">
                        © 2024 College Event Management Portal. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
