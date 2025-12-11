import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, BookOpen, Hash } from 'lucide-react';

const ProfilePage = () => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                <div className="bg-indigo-600 h-32"></div>
                <div className="px-6 py-8 relative">
                    <div className="absolute -top-16 left-6 border-4 border-white dark:border-slate-800 rounded-full bg-white p-2">
                        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold">
                            {user.name.charAt(0)}
                        </div>
                    </div>

                    <div className="mt-12">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                    </div>

                    <div className="mt-8 space-y-6">
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <Mail className="w-5 h-5 mr-3 text-gray-400" />
                            <span>{user.email}</span>
                        </div>
                        {user.studentId && (
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                <Hash className="w-5 h-5 mr-3 text-gray-400" />
                                <span>Student ID: {user.studentId}</span>
                            </div>
                        )}
                        {user.department && (
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                <BookOpen className="w-5 h-5 mr-3 text-gray-400" />
                                <span>{user.department} • {user.year}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
