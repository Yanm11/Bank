import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { axiosi } from "../config/Axios";

const Header = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem("username");

    const handleLogout = async () => {
        // Clear session and redirect to login
        localStorage.clear(); // Assuming tokens are stored in localStorage
        await axiosi.post('/auth/logout');
        navigate('/login');
    };

    return (
        <header className="header-container">
            <div className="header-left" onClick={() => navigate('/account')}>
                <h1>Welcome, {userName || 'Guest'}</h1>
            </div>
            <div className="header-right">
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </header>
    );
};

export default Header;
