import React from 'react';
import {BrowserRouter as Router, Routes, Route, Outlet, Navigate} from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AccountPage from './pages/Account';
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Profile from "./pages/Profile";
import Header from './components/Header';
import NotFoundPage from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";

const App = () => {
    const LayoutWithHeader = () => (
        <>
            <Header userName="User's Name Here" /> {/* Replace with actual user data */}
            <Outlet />
        </>
    );

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/reset-password/confirm/:token" element={<ResetPasswordConfirm />} />

                    {/* Redirect root (/) to /account */}
                    <Route path="/" element={<Navigate to="/account" />} />

                    {/* Protected routes with Header */}
                    <Route
                        path="/" element={
                        <ProtectedRoute>
                            <LayoutWithHeader />
                        </ProtectedRoute>
                        }
                    >
                        <Route path="/account" element={<AccountPage  />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Router>
        </>
    );
};


export default App;
