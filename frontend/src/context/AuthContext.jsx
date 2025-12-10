// Authentication Context - Manages user authentication state across the app
// This provides login, logout, and user data to all components

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use auth context - makes it easy to access auth data
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

// AuthProvider component - wraps the entire app
export const AuthProvider = ({ children }) => {
    // State to store current user and loading status
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On component mount, check if user is already logged in
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    // Admin login function
    const adminLogin = async (credentials) => {
        try {
            const response = await authAPI.adminLogin(credentials);
            const { token, admin } = response.data;

            // Save to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ ...admin, role: 'admin' }));

            // Update state
            setUser({ ...admin, role: 'admin' });

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            };
        }
    };

    // Student register function
    const studentRegister = async (data) => {
        try {
            const response = await authAPI.studentRegister(data);
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Registration failed'
            };
        }
    };

    // Student login - step 1: request OTP
    const studentRequestOTP = async (credentials) => {
        try {
            const response = await authAPI.studentLogin(credentials);
            return {
                success: true,
                message: response.data.message,
                email: credentials.email
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to send OTP'
            };
        }
    };

    // Student login - step 2: verify OTP
    const studentVerifyOTP = async (data) => {
        try {
            const response = await authAPI.studentVerifyOTP(data);
            const { token, student } = response.data;

            // Save to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ ...student, role: 'student' }));

            // Update state
            setUser({ ...student, role: 'student' });

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'OTP verification failed'
            };
        }
    };

    // Logout function - works for both admin and student
    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear localStorage and state regardless of API call result
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    // Check if user is admin
    const isAdmin = () => user?.role === 'admin';

    // Check if user is student
    const isStudent = () => user?.role === 'student';

    // Check if user is authenticated
    const isAuthenticated = () => !!user;

    // Value object that will be provided to all components
    const value = {
        user,
        loading,
        adminLogin,
        studentRegister,
        studentRequestOTP,
        studentVerifyOTP,
        logout,
        isAdmin,
        isStudent,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
