import React from 'react';
import { Bell, Clock } from 'lucide-react';
import { formatDate } from '../utils/formatDate';

const AnnouncementCard = ({ announcement, isAdmin, onDelete }) => {


    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 p-5 hover:shadow-md transition-shadow relative">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> {formatDate(announcement.createdAt)}
                    </span>
                </div>
                {isAdmin && onDelete && (
                    <button
                        onClick={() => onDelete(announcement._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <span className="sr-only">Delete</span>
                        &times;
                    </button>
                )}
            </div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                <Bell className="w-4 h-4 mr-2 text-indigo-500" />
                {announcement.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {announcement.message}
            </p>
            <div className="mt-4 pt-3 border-t border-gray-50 dark:border-slate-700 text-xs text-gray-400">
                Posted by {announcement.createdBy?.name || 'Admin'}
            </div>
        </div>
    );
};

export default AnnouncementCard;
