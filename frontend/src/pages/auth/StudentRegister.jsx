// Student Registration Page - Register new student account

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Mail, User, Hash, Building, Calendar } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentRegister = () => {
    const navigate = useNavigate();
    const { studentRegister } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        studentId: '',
        department: '',
        year: '',
    });

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
        setSuccess('');
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const result = await studentRegister(formData);

        if (result.success) {
            setSuccess(result.message);
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/student/login');
            }, 2000);
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 animate-fade-in">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold gradient-text">Student Registration</h2>
                    <p className="text-gray-600 mt-2">Create your account to access events</p>
                </div>

                {/* Registration Card */}
                <div className="card animate-scale-in">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Success Message */}
                        {success && (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg">
                                {success}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Two Column Layout */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="john@student.edu"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Student ID */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Student ID
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="studentId"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="CS2024001"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Department */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Department
                                </label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="Computer Science"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Year */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Year
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="2024"
                                        pattern="\d{4}"
                                        title="Please enter a 4-digit year (e.g., 2024)"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <LoadingSpinner size="small" />
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Register
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 text-center space-y-2">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/student/login')}
                                className="text-cyan-600 hover:text-cyan-700 font-semibold"
                            >
                                Login here
                            </button>
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentRegister;
