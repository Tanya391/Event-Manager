// Main App Component - Sets up routing and authentication

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/auth/AdminLogin';
import StudentLogin from './pages/auth/StudentLogin';
import StudentRegister from './pages/auth/StudentRegister';

// Protected Route Component - Redirects if not authenticated
const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Temporary placeholder components for student and admin dashboards
const StudentDashboard = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl font-bold gradient-text mb-4">Student Dashboard</h1>
            <p className="text-gray-600">Coming soon in Phase 2...</p>
        </div>
    </div>
);

const AdminDashboard = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl font-bold gradient-text mb-4">Admin Dashboard</h1>
            <p className="text-gray-600">Coming soon in Phase 3...</p>
        </div>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/student/login" element={<StudentLogin />} />
                    <Route path="/student/register" element={<StudentRegister />} />

                    {/* Protected Student Routes */}
                    <Route
                        path="/student/dashboard"
                        element={
                            <ProtectedRoute requiredRole="student">
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected Admin Routes */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch all - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
