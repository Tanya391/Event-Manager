import React, { useState, useEffect } from 'react';
import { announcementAPI } from '../../services/api';
import AnnouncementCard from '../../components/AnnouncementCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus } from 'lucide-react';

const ManageAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ title: '', message: '', author: 'Admin' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await announcementAPI.getAll();
            setAnnouncements(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this announcement?')) return;
        try {
            await announcementAPI.delete(id);
            fetchData();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await announcementAPI.create({ ...formData, date: new Date().toISOString() });
            setIsCreating(false);
            setFormData({ title: '', message: '', author: 'Admin' });
            fetchData();
        } catch (error) {
            alert('Failed to post announcement');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Announcements</h1>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    {isCreating ? 'Cancel' : 'Post Announcement'}
                </button>
            </div>

            {isCreating && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-slate-700 animate-fade-in-down">
                    <form onSubmit={handleCreate} className="space-y-4">
                        <input required placeholder="Announcement Title" className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        <textarea required placeholder="Content" className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white" rows="3" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}></textarea>
                        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors">Post Announcement</button>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {announcements.map(announcement => (
                    <AnnouncementCard
                        key={announcement.id}
                        announcement={announcement}
                        isAdmin={true}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default ManageAnnouncements;
