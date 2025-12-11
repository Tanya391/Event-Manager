import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');

        if (token && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // Ensure role is attached to user object for convenience
            setUser({ ...parsedUser, role: storedRole });
        }
        setLoading(false);
    }, []);

    const login = (userData, role = 'student') => { // Default to student if not provided
        const userWithRole = { ...userData, role };
        setUser(userWithRole);
        // localStorage is already handled in api.js, but good to be safe or if context used independently
        // ideally api.js handles API calls and context handles state. 
        // But since api.js writes to LS, context should just update state.

        // However, api.js calls return the user object. Component calls login(user).
        // We should update the component calls to pass role, OR infer it.
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('uni_user'); // Clean up old mock key
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!user,
            isAdmin: user?.role === 'admin',
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
