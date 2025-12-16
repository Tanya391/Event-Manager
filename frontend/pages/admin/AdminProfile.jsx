import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Edit2, Save, X, Camera } from 'lucide-react';
import { adminAPI } from '../../services/api';

const AdminProfile = () => {
    const { user, login } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        profileImage: null
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                profileImage: null
            });
            setPreviewImage(user.profileImage ? `http://localhost:5000/${user.profileImage}` : null);
        }
    }, [user]);

    if (!user) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profileImage: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            if (formData.profileImage) {
                data.append('profileImage', formData.profileImage);
            }

            const response = await adminAPI.updateProfile(data);

            if (response && response.admin) {
                login(response.admin, 'admin');
                localStorage.setItem('user', JSON.stringify(response.admin));

                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setIsEditing(false);
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: typeof err === 'string' ? err : 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: user.name || '',
            profileImage: null
        });
        setPreviewImage(user.profileImage ? `http://localhost:5000/${user.profileImage}` : null);
        setMessage(null);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-32"></div>
                <div className="px-6 py-8 relative">
                    <div className="absolute -top-16 left-6">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 bg-white overflow-hidden flex items-center justify-center">
                                {previewImage ? (
                                    <img src={previewImage} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            {isEditing && (
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute bottom-0 right-0 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 p-2 rounded-full shadow-lg border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <div className="absolute top-4 right-6">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                                <span>Edit Profile</span>
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
                                    <span>Save</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mt-16 sm:mt-20">
                        {isEditing ? (
                            <div className="mb-4 max-w-sm">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        ) : (
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                        )}
                        <p className="text-gray-500 dark:text-gray-400">Administrator</p>
                    </div>

                    {message && (
                        <div className={`mt-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="mt-8 space-y-6">
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <Mail className="w-5 h-5 mr-3 text-gray-400" />
                            <span className="opacity-70 cursor-not-allowed" title="Email cannot be changed">{user.email}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
