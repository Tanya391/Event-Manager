import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { eventAPI } from '../../services/api';
import EventCard from '../../components/EventCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const EventsPage = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await eventAPI.getAll();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events", error);
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

    const filteredEvents = filter === 'all'
        ? events
        : events.filter(e => e.category.toLowerCase() === filter.toLowerCase());

    const categories = ['all', ...new Set(events.map(e => e.category))];

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Browse Events</h1>

            {/* Filter Tabs */}
            <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === cat
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                            }`}
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                    <EventCard
                        key={event.id}
                        event={event}
                        onAction={handleRegister}
                        actionLabel="Register"
                    />
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No events found in this category.</p>
                </div>
            )}
        </div>
    );
};

export default EventsPage;
