import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { eventAPI, announcementAPI } from '../../services/api';
import EventCard from '../../components/EventCard';
import AnnouncementCard from '../../components/AnnouncementCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsData, announcementsData] = await Promise.all([
                    eventAPI.getAll(),
                    announcementAPI.getAll()
                ]);
                setEvents(eventsData.slice(0, 3)); // Show top 3 events
                setAnnouncements(announcementsData);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleRegister = async (event) => {
        try {
            await eventAPI.register(event.id, user.id);
            alert(`Successfully registered for ${event.title}!`);
            // Refresh events to update counts
            const updatedEvents = await eventAPI.getAll();
            setEvents(updatedEvents.slice(0, 3));
        } catch (error) {
            alert('Registration failed. You might already be registered.');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {user?.name}!
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Here's what's happening on campus today.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Events */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming Events</h2>
                        <button
                            onClick={() => navigate('/student/events')}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium text-sm"
                        >
                            View All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {events.map(event => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onAction={handleRegister}
                                actionLabel="Register Now"
                            />
                        ))}
                    </div>
                    {events.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400">No upcoming events found.</p>
                    )}
                </div>

                {/* Right Column: Announcements */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Announcements</h2>
                    <div className="space-y-4">
                        {announcements.map(announcement => (
                            <AnnouncementCard key={announcement.id} announcement={announcement} />
                        ))}
                        {announcements.length === 0 && (
                            <p className="text-gray-500 dark:text-gray-400">No announcements.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
