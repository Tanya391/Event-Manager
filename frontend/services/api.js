import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: Auto logout on 401
            // localStorage.removeItem('token');
            // window.location.href = '/login'; 
        }
        return Promise.reject(error.response?.data?.error || 'Something went wrong');
    }
);

export const authAPI = {
    adminLogin: async (credentials) => {
        const response = await api.post('/auth/admin/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.admin));
            localStorage.setItem('role', 'admin');
        }
        return response.data.admin;
    },

    studentLoginStep1: async (email, studentId) => {
        const response = await api.post('/auth/student/login', { email, studentId });
        return response.data;
    },

    studentLoginStep2: async (email, otp) => { // Changed signature to match backend requirement (needs email)
        const response = await api.post('/auth/student/verify-otp', { email, otp });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.student));
            localStorage.setItem('role', 'student');
        }
        return response.data.student;
    },

    registerStudent: async (data) => {
        const response = await api.post('/auth/student/register', data);
        return response.data;
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
        }
    }
};

export const eventAPI = {
    getAll: async () => {
        const response = await api.get('/events');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },

    create: async (eventData) => {
        const response = await api.post('/events', eventData);
        return response.data;
    },

    update: async (id, eventData) => {
        const response = await api.put(`/events/${id}`, eventData);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/events/${id}`);
    },

    register: async (eventId) => {
        // Backend: POST /:id/register
        const response = await api.post(`/events/${eventId}/register`);
        return response.data;
    },

    cancel: async (id) => {
        const response = await api.patch(`/events/${id}/cancel`);
        return response.data;
    }
};

export const userAPI = {
    getProfile: async () => {
        const response = await api.get('/students/profile');
        return response.data;
    },

    updateProfile: async (data) => {
        // Axios automatically handles Content-Type for FormData
        const response = await api.put('/students/profile', data);
        return response.data;
    },

    getRegistrations: async () => {
        const response = await api.get('/students/registrations');
        return response.data.events; // Backend returns { events: [] }
    },

    getAllStudents: async () => {
        const response = await api.get('/admin/students');
        return response.data.students; // Backend returns { students: [] }
    }
};

export const adminAPI = {
    getProfile: async () => {
        const response = await api.get('/admin/profile');
        return response.data;
    },
    updateProfile: async (data) => {
        const response = await api.put('/admin/profile', data);
        return response.data;
    }
};

export const announcementAPI = {
    getAll: async () => {
        const response = await api.get('/announcements');
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/admin/announcements', data); // Check admin routes
        return response.data.announcement;
    },

    delete: async (id) => {
        // Check admin routes for delete announcement. It is directly /announcements/:id?? 
        // Let me check adminRoutes.js vs announcementRoutes.js
        // announcementRoutes has DELETE /:id, adminRoutes has POST /announcements
        // Wait, announcementRoutes has DELETE /:id protected by verifyAdmin.
        // And it is mounted at /api/announcements
        await api.delete(`/announcements/${id}`);
    }
};

export const analyticsAPI = {
    getDashboardStats: async () => {
        const response = await api.get('/analytics/dashboard');
        return response.data;
    },
    getRecentRegistrations: async () => {
        const response = await api.get('/analytics/registrations/recent');
        return response.data;
    },
    getPopularEvents: async () => {
        const response = await api.get('/analytics/events/popular');
        return response.data;
    },
    getStudentEngagement: async () => {
        const response = await api.get('/analytics/students/engagement');
        return response.data;
    }
};

export default api;
