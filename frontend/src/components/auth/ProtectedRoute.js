import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {axiosi} from "../../config/Axios";
import LoadingSpinner from "../LoadingSpinner";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null while loading

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await axiosi.get('/auth/check-auth'); // Backend API to verify the token
                setIsAuthenticated(true); // Token is valid
            } catch (error) {
                setIsAuthenticated(false); // Token is invalid or expired
            }
        };

        verifyAuth();
    }, []);

    // Show a loading spinner while checking auth
    if (isAuthenticated === null) {
        return <LoadingSpinner />;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
