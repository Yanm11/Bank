import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Grid, Link } from '@mui/material';
import { axiosi } from "../config/Axios"; // Assuming axiosi is your axios instance

const ResetPasswordConfirm = () => {
    const { token } = useParams();  // Extract reset token from the URL
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Ensure both passwords match
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axiosi.post('/auth/reset-password/confirm', { token, newPassword });

            if (response.status === 200) {
                setSuccessMessage('Password successfully reset! You can now log in.');
                // Navigate the user to the login page after successful password reset
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred. Please try again.');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                backgroundImage: 'url(https://source.unsplash.com/random/1600x900?banking)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Grid container sx={{ width: '100%' }}>
                {/* Left Section (Password Reset Form) */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 400,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            padding: 4,
                            borderRadius: 3,
                            boxShadow: 5,
                        }}
                    >
                        <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center' }}>
                            Reset Your Password
                        </Typography>
                        <form onSubmit={handleResetPassword}>
                            <TextField
                                label="New Password"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <TextField
                                label="Confirm New Password"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {error && (
                                <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
                                    {error}
                                </Typography>
                            )}
                            {successMessage && (
                                <Typography variant="body2" color="primary" sx={{ marginTop: 2 }}>
                                    {successMessage}
                                </Typography>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ marginTop: 2 }}
                            >
                                Reset Password
                            </Button>
                        </form>
                        <Typography variant="body2" sx={{ marginTop: 2, textAlign: 'center' }}>
                            Remember your password?{' '}
                            <Link href="/login" underline="hover">
                                Login here
                            </Link>
                        </Typography>
                    </Box>
                </Grid>

                {/* Right Section (Bank Image and Name) */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            width: '50%',
                            height: '100%',
                            backgroundColor: 'rgb(25,59,200)',
                            transition: 'left 0.6s ease-in-out',
                            zIndex: 2,
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default ResetPasswordConfirm;
