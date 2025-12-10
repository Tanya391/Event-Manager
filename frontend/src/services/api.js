// API Service Layer - Centralized API calls to backend
// This file contains all the functions to communicate with the backend

import axios from 'axios';

// Base URL for all API requests - points to your backend server
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - automatically adds JWT token to requests
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // If token exists, add it to request headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handles errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If token is invalid or expired, redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// ============================================
// AUTHENTICATION APIs
// ============================================

export const authAPI = {
    // Admin login - returns token and admin data
    adminLogin: (credentials) =>
        api.post('/auth/admin/login', credentials),

    // Admin register - creates new admin account
    adminRegister: (data) =>
        api.post('/auth/admin/register', data),

    // Student register - creates new student account
    studentRegister: (data) =>
        api.post('/auth/student/register', data),

    // Student login step 1 - request OTP
    studentLogin: (credentials) =>
        api.post('/auth/student/login', credentials),

    // Student login step 2 - verify OTP and get token
    studentVerifyOTP: (data) =>
        api.post('/auth/student/verify-otp', data),

    // Logout - blacklist current token
    logout: () =>
        api.post('/auth/logout'),
};

// ============================================
// STUDENT APIs
// ============================================

export const studentAPI = {
    // Get student profile
    getProfile: () =>
        api.get('/students/profile'),

    // Update student profile
    updateProfile: (data) =>
        api.put('/students/profile', data),

    // Get student's registered events
    getMyRegistrations: () =>
        api.get('/students/registrations'),
};

// ============================================
// EVENT APIs
// ============================================

export const eventAPI = {
    // Get all events (public)
    getAllEvents: () =>
        api.get('/events'),

    // Get single event by ID
    getEventById: (id) =>
        api.get(`/events/${id}`),

    // Register for event (student only)
    registerForEvent: (id) =>
        api.post(`/events/${id}/register`),

    // Create event (admin only)
    createEvent: (data) =>
        api.post('/events', data),

    // Update event (admin only)
    updateEvent: (id, data) =>
        api.put(`/events/${id}`, data),

    // Delete event (admin only)
    deleteEvent: (id) =>
        api.delete(`/events/${id}`),

    // Cancel event (admin only)
    cancelEvent: (id) =>
        api.patch(`/events/${id}/cancel`),

    // Remove participant (admin only)
    removeParticipant: (eventId, studentId) =>
        api.delete(`/events/${eventId}/participants/${studentId}`),

    // Remove all participants (admin only)
    removeAllParticipants: (eventId) =>
        api.delete(`/events/${eventId}/participants`),
};

// ============================================
// ANNOUNCEMENT APIs
// ============================================

export const announcementAPI = {
    // Get all announcements (public)
    getAllAnnouncements: () =>
        api.get('/announcements'),

    // Get single announcement
    getAnnouncementById: (id) =>
        api.get(`/announcements/${id}`),

    // Create announcement (admin only)
    createAnnouncement: (data) =>
        api.post('/announcements', data),

    // Update announcement (admin only)
    updateAnnouncement: (id, data) =>
        api.put(`/announcements/${id}`, data),

    // Delete announcement (admin only)
    deleteAnnouncement: (id) =>
        api.delete(`/announcements/${id}`),
};

// ============================================
// ADMIN APIs
// ============================================

export const adminAPI = {
    // Get admin profile
    getProfile: () =>
        api.get('/admin/profile'),

    // Get all students
    getAllStudents: () =>
        api.get('/admin/students'),

    // Get single student
    getStudentById: (id) =>
        api.get(`/admin/students/${id}`),

    // Update student
    updateStudent: (id, data) =>
        api.put(`/admin/students/${id}`, data),

    // Delete student
    deleteStudent: (id) =>
        api.delete(`/admin/students/${id}`),
};

// ============================================
// ANALYTICS APIs (Admin only)
// ============================================

export const analyticsAPI = {
    // Get dashboard statistics
    getDashboardStats: () =>
        api.get('/analytics/dashboard'),

    // Get recent registrations
    getRecentRegistrations: (limit = 10) =>
        api.get(`/analytics/registrations/recent?limit=${limit}`),

    // Get popular events
    getPopularEvents: (limit = 5) =>
        api.get(`/analytics/events/popular?limit=${limit}`),

    // Get upcoming events stats
    getUpcomingEventsStats: () =>
        api.get('/analytics/events/upcoming'),

    // Get student engagement
    getStudentEngagement: () =>
        api.get('/analytics/students/engagement'),

    // Get monthly statistics
    getMonthlyStats: (year) =>
        api.get(`/analytics/monthly?year=${year}`),
};

// Export the configured axios instance for custom requests
export default api;
