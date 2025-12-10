// Student Login Page - Two-step OTP login process

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Mail, Hash, KeyRound } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentLogin = () => {
    const navigate = useNavigate();
    const { studentRequestOTP, studentVerifyOTP } = useAuth();

    // Track which step we're on (1 = request OTP, 2 = verify OTP)
    const [step, setStep] = useState(1);

    // Form state
    const [credentials, setCredentials] = useState({
        email: '',
        studentId: '',
    });

    const [otp, setOtp] = useState('');

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Handle input changes for step 1
    const handleCredentialsChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    // Handle OTP input change for step 2
    const handleOtpChange = (e) => {
        setOtp(e.target.value);
        setError('');
    };

    // Step 1: Request OTP
    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const result = await studentRequestOTP(credentials);

        if (result.success) {
            setMessage(result.message);
            setStep(2); // Move to OTP verification step
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await studentVerifyOTP({
            email: credentials.email,
            otp: otp,
        });

        if (result.success) {
            // Redirect to student dashboard
            navigate('/student/dashboard');
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    // Go back to step 1
    const handleBackToStep1 = () => {
        setStep(1);
        setOtp('');
        setError('');
        setMessage('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-4">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold gradient-text">Student Login</h2>
                    <p className="text-gray-600 mt-2">
                        {step === 1 ? 'Enter your credentials to receive OTP' : 'Enter the OTP sent to your email'}
                    </p>
                </div>

                {/* Login Card */}
                <div className="card animate-scale-in">
                    {/* Step 1: Request OTP */}
                    {step === 1 && (
                        <form onSubmit={handleRequestOTP} className="space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={credentials.email}
                                        onChange={handleCredentialsChange}
                                        className="input-field pl-10"
                                        placeholder="john@student.edu"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Student ID Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Student ID
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="studentId"
                                        value={credentials.studentId}
                                        onChange={handleCredentialsChange}
                                        className="input-field pl-10"
                                        placeholder="CS2024001"
                                        required
                                    />
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
                                        <KeyRound className="w-5 h-5" />
                                        Request OTP
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Verify OTP */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            {/* Success Message */}
                            {message && (
                                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg">
                                    {message}
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* OTP Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Enter OTP
                                </label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={handleOtpChange}
                                        className="input-field pl-10 text-center text-2xl tracking-widest"
                                        placeholder="000000"
                                        maxLength="6"
                                        pattern="\d{6}"
                                        required
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Check your email for the 6-digit code
                                </p>
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
                                        <LogIn className="w-5 h-5" />
                                        Verify & Login
                                    </>
                                )}
                            </button>

                            {/* Back Button */}
                            <button
                                type="button"
                                onClick={handleBackToStep1}
                                className="btn-secondary w-full"
                            >
                                ← Request New OTP
                            </button>
                        </form>
                    )}

                    {/* Footer Links */}
                    <div className="mt-6 text-center space-y-2">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/student/register')}
                                className="text-cyan-600 hover:text-cyan-700 font-semibold"
                            >
                                Register here
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

export default StudentLogin;
