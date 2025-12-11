import React, { useState, useEffect } from 'react';
import { eventAPI } from '../../services/api';
import EventCard from '../../components/EventCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus } from 'lucide-react';

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', time: '', location: '', capacity: 100
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = await eventAPI.getAll();
            setEvents(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (event) => {
        if (!confirm(`Delete event "${event.title}"?`)) return;
        try {
            await eventAPI.delete(event.id);
            fetchEvents();
        } catch (error) {
            alert("Failed to delete");
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await eventAPI.create({
                ...formData,
                maxParticipants: formData.capacity,
                // Backend creates default status 'upcoming'
            });
            setIsCreating(false);
            setFormData({ title: '', description: '', date: '', time: '', location: '', capacity: 100 });
            fetchEvents();
        } catch (error) {
            alert('Failed to create event');
        }
    };

    if (loading && !events.length) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Events</h1>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    {isCreating ? 'Cancel' : 'Create Event'}
                </button>
            </div>

            {isCreating && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-slate-700 animate-fade-in-down">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">New Event Details</h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required placeholder="Event Title" className="p-2 border rounded dark:bg-slate-700 dark:text-white" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        <input required placeholder="Category" className="p-2 border rounded dark:bg-slate-700 dark:text-white" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        <input required type="date" className="p-2 border rounded dark:bg-slate-700 dark:text-white" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        <input required type="time" className="p-2 border rounded dark:bg-slate-700 dark:text-white" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                        <input required placeholder="Location" className="p-2 border rounded dark:bg-slate-700 dark:text-white" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                        <input required type="number" placeholder="Capacity" className="p-2 border rounded dark:bg-slate-700 dark:text-white" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })} />
                        <textarea required placeholder="Description" className="md:col-span-2 p-2 border rounded dark:bg-slate-700 dark:text-white" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                        <div className="md:col-span-2">
                            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors">Publish Event</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                    <div key={event.id} className="relative group">
                        <EventCard event={event} isAdmin={true} actionLabel="Delete Event" onAction={handleDelete} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageEvents;
