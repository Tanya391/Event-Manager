import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { eventAPI } from '../../services/api';
import EventCard from '../../components/EventCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const EventsPage = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);


    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await eventAPI.getAll();
            setEvents(data);
        } catch (err) {
            console.error("Error fetching events", err);
            setError("Failed to load events. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (event) => {
        if (!confirm(`Register for ${event.title}?`)) return;

        try {
            await eventAPI.register(event.id, user.id);
            alert('Registration successful!');
            fetchEvents(); // Refresh data
        } catch (error) {
            alert('Could not register.');
        }
    };



    if (loading) return <LoadingSpinner />;

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-red-500 text-xl font-semibold">{error}</div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Browse Events</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                    <EventCard
                        key={event.id || event._id}
                        event={event}
                        onAction={handleRegister}
                        actionLabel="Register"
                    />
                ))}
            </div>

            {events.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No events available at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default EventsPage;
