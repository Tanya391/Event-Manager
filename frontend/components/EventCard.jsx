import React from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { formatDate, formatTime } from '../utils/formatDate';

const EventCard = ({ event, onAction, actionLabel, actionDisabled, isAdmin, onEdit }) => {
    const registeredCount = event.participants ? event.participants.length : 0;
    const capacity = event.maxParticipants || 100;
    const isFull = registeredCount >= capacity;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col h-full group">
            <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-slate-700">
                <img
                    src={event.image ? `/${event.image}` : 'https://picsum.photos/800/400'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />

                {event.status === 'completed' && (
                    <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                        <span className="text-white font-bold text-xl tracking-widest border-2 border-white px-4 py-2 rounded">COMPLETED</span>
                    </div>
                )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{event.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">{event.description}</p>
                <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                        {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                        {formatTime(event.time)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                        {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-2 text-indigo-500" />
                        <span className={isFull ? 'text-red-500 font-medium' : ''}>
                            {registeredCount} / {capacity} registered
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {onAction && (
                        <button
                            onClick={() => onAction(event)}
                            disabled={actionDisabled || (isFull && !isAdmin && event.status === 'upcoming')}
                            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${actionDisabled
                                ? 'bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-gray-500 cursor-not-allowed'
                                : isFull && !isAdmin && event.status === 'upcoming'
                                    ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 cursor-not-allowed'
                                    : actionLabel === 'Delete' || actionLabel === 'Delete Event' // Specific styling for delete
                                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg dark:bg-red-500 dark:hover:bg-red-600'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg dark:bg-indigo-500 dark:hover:bg-indigo-600'
                                }`}
                        >
                            {actionDisabled
                                ? 'Registered'
                                : isFull && !isAdmin && event.status === 'upcoming'
                                    ? 'Event Full'
                                    : actionLabel || 'View Details'}
                        </button>
                    )}

                    {/* Edit Button for Admin */}
                    {isAdmin && onEdit && (
                        <button
                            onClick={() => onEdit(event)}
                            className="flex-1 py-2.5 px-4 rounded-lg font-medium bg-amber-500 text-white hover:bg-amber-600 shadow-md hover:shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div >
        </div >
    );
};

export default EventCard;
