import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('adminToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    // Assuming we have a profile/me endpoint or similar
                    // For now, let's just assume the token is valid if it exists
                    // In a real app, verify with backend
                    const userData = JSON.parse(localStorage.getItem('adminUser'));
                    if (userData) setUser(userData);
                } catch (error) {
                    logout();
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/admin-login', { email, password });
            const { user, token } = response.data.data;
            
            setUser(user);
            setToken(token);
            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminUser', JSON.stringify(user));
            return true;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
    };

    const isAdmin = user?.role === 'admin';
    const isSuperAdmin = user?.role === 'admin';
    const isSubAdmin = user?.role === 'subadmin';

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAdmin, isSuperAdmin, isSubAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
