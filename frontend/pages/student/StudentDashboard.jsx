import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { eventAPI, announcementAPI, userAPI } from '../../services/api';
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
                    userAPI.getRegistrations(), // Fetch only registered events
                    announcementAPI.getAll()
                ]);
                setEvents(eventsData);
                setAnnouncements(announcementsData);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);



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
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Registered Events</h2>
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
                                onAction={null}
                                actionLabel="Registered"
                                actionDisabled={true}
                            />
                        ))}
                    </div>
                    {events.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400">You haven't registered for any events yet.</p>
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
