import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import EventCard from '../../components/EventCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const MyRegistrations = () => {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRegs = async () => {
            try {
                const data = await userAPI.getRegistrations(user.id);
                setRegistrations(data);
            } catch (error) {
                console.error("Error fetching registrations", error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchRegs();
    }, [user]);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Registrations</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registrations.map(event => (
                    <div key={event._id} className="relative">
                        <EventCard
                            event={event}
                            actionLabel="Registered"
                            actionDisabled={true}
                        />
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
                            REGISTERED
                        </div>
                    </div>
                ))}
            </div>

            {registrations.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
                    <p className="text-gray-500 dark:text-gray-400">You haven't registered for any events yet.</p>
                </div>
            )}
        </div>
    );
};

export default MyRegistrations;
