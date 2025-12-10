// Loading Spinner Component - Shows while data is loading

import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
    const sizeClasses = {
        small: 'w-6 h-6',
        medium: 'w-12 h-12',
        large: 'w-16 h-16',
    };

    return (
        <div className="flex justify-center items-center">
            <div
                className={`${sizeClasses[size]} border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin`}
            ></div>
        </div>
    );
};

export default LoadingSpinner;
