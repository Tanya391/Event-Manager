import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/auth/AdminLogin';
import StudentLogin from './pages/auth/StudentLogin';
import StudentRegister from './pages/auth/StudentRegister';
import StudentDashboard from './pages/student/StudentDashboard';
import EventsPage from './pages/student/EventsPage';
import MyRegistrations from './pages/student/MyRegistrations';
import ProfilePage from './pages/student/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEvents from './pages/admin/ManageEvents';
import ManageStudents from './pages/admin/ManageStudents';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />; // Or access denied page
  }

  return <>{children}</>;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/login/student" element={<StudentLogin />} />
            <Route path="/register" element={<StudentRegister />} />

            {/* Student Routes */}
            <Route path="/student" element={
                <ProtectedRoute role="student">
                    <StudentDashboard />
                </ProtectedRoute>
            } />
            <Route path="/student/events" element={
                <ProtectedRoute role="student">
                    <EventsPage />
                </ProtectedRoute>
            } />
            <Route path="/student/registrations" element={
                <ProtectedRoute role="student">
                    <MyRegistrations />
                </ProtectedRoute>
            } />
             <Route path="/student/profile" element={
                <ProtectedRoute role="student">
                    <ProfilePage />
                </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
                <ProtectedRoute role="admin">
                    <AdminDashboard />
                </ProtectedRoute>
            } />
            <Route path="/admin/events" element={
                <ProtectedRoute role="admin">
                    <ManageEvents />
                </ProtectedRoute>
            } />
            <Route path="/admin/students" element={
                <ProtectedRoute role="admin">
                    <ManageStudents />
                </ProtectedRoute>
            } />
            <Route path="/admin/announcements" element={
                <ProtectedRoute role="admin">
                    <ManageAnnouncements />
                </ProtectedRoute>
            } />
        </Routes>
    )
}

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
