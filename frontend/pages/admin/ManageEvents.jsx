import React, { useState, useEffect } from 'react';
import { eventAPI } from '../../services/api';
import EventCard from '../../components/EventCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus } from 'lucide-react';

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', time: '', location: '', capacity: 100, image: null
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
        // Use _id from Mongo, fallback to id if needed
        const id = event._id || event.id;
        if (!confirm(`Delete event "${event.title}"?`)) return;
        try {
            await eventAPI.delete(id);
            // Refresh events
            fetchEvents();
        } catch (error) {
            alert("Failed to delete: " + (error.response?.data?.error || error.message));
        }
    };

    const handleEdit = (event) => {
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date.split('T')[0],
            time: event.time,
            location: event.location,
            capacity: event.maxParticipants || 100,
            image: null // Reset image on edit
        });
        setEditingId(event._id || event.id);
        setIsCreating(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create FormData object for file upload
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('date', formData.date);
            data.append('time', formData.time);
            data.append('location', formData.location);
            data.append('maxParticipants', formData.capacity);

            if (formData.image) {
                data.append('image', formData.image);
            }

            if (editingId) {
                await eventAPI.update(editingId, data);
            } else {
                await eventAPI.create(data);
            }

            alert(editingId ? "Event Updated Successfully!" : "Event Created Successfully!");

            cancelForm();
            fetchEvents();
        } catch (error) {
            alert('Operation failed: ' + (error.response?.data?.error || error.message));
        }
    };

    const cancelForm = () => {
        setIsCreating(false);
        setEditingId(null);
        setFormData({ title: '', description: '', date: '', time: '', location: '', capacity: 100, image: null });
    };

    if (loading && !events.length) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Events</h1>
                <button
                    onClick={() => {
                        if (isCreating) cancelForm();
                        else setIsCreating(true);
                    }}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    {isCreating ? 'Cancel' : 'Create Event'}
                </button>
            </div>

            {isCreating && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-slate-700 animate-fade-in-down">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        {editingId ? 'Edit Event' : 'New Event Details'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Poster</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-300"
                            />
                        </div>
                        <input required placeholder="Event Title" className="p-2 border rounded dark:bg-slate-700 dark:text-white" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />

                        <input required type="date" className="p-2 border rounded dark:bg-slate-700 dark:text-white" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        <input required type="time" className="p-2 border rounded dark:bg-slate-700 dark:text-white" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                        <input required placeholder="Location" className="p-2 border rounded dark:bg-slate-700 dark:text-white" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                        <input required type="number" placeholder="Capacity" className="p-2 border rounded dark:bg-slate-700 dark:text-white" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })} />
                        <textarea required placeholder="Description" className="md:col-span-2 p-2 border rounded dark:bg-slate-700 dark:text-white" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                        <div className="md:col-span-2 flex gap-4">
                            <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors">
                                {editingId ? 'Update Event' : 'Publish Event'}
                            </button>
                            <button type="button" onClick={cancelForm} className="px-6 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                    <div key={event._id || event.id} className="relative group">
                        <EventCard
                            event={event}
                            isAdmin={true}
                            actionLabel="Delete"
                            onAction={handleDelete}
                            onEdit={handleEdit}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageEvents;
