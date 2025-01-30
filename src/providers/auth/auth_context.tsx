import React, { createContext, useEffect, useState, } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { API_BASE_URL } from "../../configs/config.ts";
import { Lecturer } from '../../models/lecturer.ts';

interface AuthContextType {
    isAuthenticated: boolean;
    lecturer: Lecturer | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [lecturer, setLecturer] = useState<Lecturer | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check for existing auth token on mount
        const token = localStorage.getItem('authToken');
        const lecturerId = localStorage.getItem('lecturerId');

        if (token) {
            if (lecturerId) {
                fetchLecturerData(lecturerId).then(() => {

                });
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const fetchLecturerData = async (lecturerId: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/lecturer/${lecturerId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setLecturer(response.data.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error fetching lecturer data:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };


    const login = async (username: string, password: string) => {
        try {
            setLoading(true);
            // Make login request
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                username,
                password
            });

            console.log(response.data);

            const token = response.data.token;
            const lecturer = response.data.profile;

            // Store token and lecturer ID
            localStorage.setItem('authToken', token);
            localStorage.setItem('lecturerId', lecturer.lecturer_id);

            // Set up axios default headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Fetch lecturer data
            setLecturer(lecturer);
            setIsAuthenticated(true);
            message.success('Successfully logged in!');
        } catch (error) {
            console.error('Login error:', error);
            message.error('Invalid credentials or server error');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('lecturerId');
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        setLecturer(null);
        message.success('Successfully logged out');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, lecturer, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

