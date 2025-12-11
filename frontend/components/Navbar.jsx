import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, LogOut, User, LayoutDashboard, Calendar, Bell, Users, Sun, Moon, ShieldCheck, GraduationCap } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    // Helper function for nav link classes
    const navLinkClass = ({ isActive }) =>
        `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive
            ? 'text-indigo-700 bg-indigo-50 shadow-sm ring-1 ring-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:ring-indigo-700'
            : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'
        }`;

    const mobileNavLinkClass = ({ isActive }) =>
        `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive
            ? 'text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-900/50'
            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'
        }`;

    return (
        <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md transition-transform group-hover:scale-105">
                                U
                            </div>
                            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                UniEvent Pro
                            </span>
                        </Link>

                        {/* Portal Indicator */}
                        {isAuthenticated && (
                            <div className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${isAdmin
                                    ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
                                    : 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800'
                                }`}>
                                {isAdmin ? <ShieldCheck className="w-3 h-3 mr-1" /> : <GraduationCap className="w-3 h-3 mr-1" />}
                                {isAdmin ? 'Admin Portal' : 'Student Portal'}
                            </div>
                        )}
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2">
                        {!isAuthenticated && (
                            <>
                                <Link to="/login/student" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Student Login
                                </Link>
                                <Link to="/login/admin" className="bg-gray-900 dark:bg-gray-800 text-white hover:bg-gray-800 dark:hover:bg-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                    Admin Portal
                                </Link>
                            </>
                        )}

                        {isAuthenticated && isAdmin && (
                            <>
                                <NavLink to="/admin" end className={navLinkClass}>
                                    <LayoutDashboard className="w-4 h-4 mr-1.5" /> Dashboard
                                </NavLink>
                                <NavLink to="/admin/events" className={navLinkClass}>
                                    <Calendar className="w-4 h-4 mr-1.5" /> Events
                                </NavLink>
                                <NavLink to="/admin/students" className={navLinkClass}>
                                    <Users className="w-4 h-4 mr-1.5" /> Students
                                </NavLink>
                                <NavLink to="/admin/announcements" className={navLinkClass}>
                                    <Bell className="w-4 h-4 mr-1.5" /> Announcements
                                </NavLink>
                            </>
                        )}

                        {isAuthenticated && !isAdmin && (
                            <>
                                <NavLink to="/student" end className={navLinkClass}>
                                    <LayoutDashboard className="w-4 h-4 mr-1.5" /> Dashboard
                                </NavLink>
                                <NavLink to="/student/events" className={navLinkClass}>
                                    <Calendar className="w-4 h-4 mr-1.5" /> Browse Events
                                </NavLink>
                                <NavLink to="/student/registrations" className={navLinkClass}>
                                    <Users className="w-4 h-4 mr-1.5" /> My Registrations
                                </NavLink>
                                <NavLink to="/student/profile" className={navLinkClass}>
                                    <User className="w-4 h-4 mr-1.5" /> Profile
                                </NavLink>
                            </>
                        )}

                        <div className="flex items-center space-x-2 pl-2 ml-2 border-l border-gray-200 dark:border-gray-700">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 transition-colors"
                                aria-label="Toggle Theme"
                            >
                                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            </button>

                            {isAuthenticated && (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <LogOut className="w-4 h-4 mr-1.5" /> Logout
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        {/* Theme Toggle Mobile */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 mr-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 transition-colors"
                        >
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute w-full bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {isAuthenticated && (
                            <div className="px-3 py-2 mb-2 flex items-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${isAdmin
                                        ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
                                        : 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800'
                                    }`}>
                                    {isAdmin ? <ShieldCheck className="w-3 h-3 mr-1" /> : <GraduationCap className="w-3 h-3 mr-1" />}
                                    {isAdmin ? 'Admin Portal' : 'Student Portal'}
                                </span>
                            </div>
                        )}

                        {!isAuthenticated && (
                            <>
                                <Link to="/login/student" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-slate-800">Student Login</Link>
                                <Link to="/login/admin" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-slate-800">Admin Portal</Link>
                            </>
                        )}

                        {isAuthenticated && isAdmin && (
                            <>
                                <NavLink to="/admin" end onClick={toggleMenu} className={mobileNavLinkClass}>Dashboard</NavLink>
                                <NavLink to="/admin/events" onClick={toggleMenu} className={mobileNavLinkClass}>Events</NavLink>
                                <NavLink to="/admin/students" onClick={toggleMenu} className={mobileNavLinkClass}>Students</NavLink>
                                <NavLink to="/admin/announcements" onClick={toggleMenu} className={mobileNavLinkClass}>Announcements</NavLink>
                            </>
                        )}

                        {isAuthenticated && !isAdmin && (
                            <>
                                <NavLink to="/student" end onClick={toggleMenu} className={mobileNavLinkClass}>Dashboard</NavLink>
                                <NavLink to="/student/events" onClick={toggleMenu} className={mobileNavLinkClass}>Browse Events</NavLink>
                                <NavLink to="/student/registrations" onClick={toggleMenu} className={mobileNavLinkClass}>My Registrations</NavLink>
                                <NavLink to="/student/profile" onClick={toggleMenu} className={mobileNavLinkClass}>Profile</NavLink>
                            </>
                        )}

                        {isAuthenticated && (
                            <button
                                onClick={() => { handleLogout(); toggleMenu(); }}
                                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
