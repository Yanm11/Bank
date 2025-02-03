import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Link, Grid } from '@mui/material';
import { axiosi } from "../../config/Axios";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axiosi.post("/auth/register", { name, email, password, phone, address });
            if (response.status === 201) {
                navigate('/login'); // Redirect to login page on success
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Registration failed');
            } else {
                setError('Server error. Please try again later.');
            }
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                backgroundImage: 'url(https://source.unsplash.com/random/1600x900?banking)', // Background image for the whole screen
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Grid container sx={{ width: '100%' }}>
                {/* Left Section (Registration Form) */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 400,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
                            padding: 4,
                            borderRadius: 3,
                            boxShadow: 5,
                        }}
                    >
                        <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center' }}>
                            Register
                        </Typography>
                        <form onSubmit={handleRegister}>
                            <TextField
                                label="Full Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <TextField
                                label="Password"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <TextField
                                label="Confirm Password"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <TextField
                                label="Phone"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                            <TextField
                                label="Address"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                            {error && (
                                <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
                                    {error}
                                </Typography>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ marginTop: 2 }}
                            >
                                Register
                            </Button>
                        </form>
                        <Typography variant="body2" sx={{ marginTop: 2, textAlign: 'center' }}>
                            Already have an account?{' '}
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
                            textAlign: 'center',
                            color: 'white',
                            padding: 4,
                            backgroundColor: 'rgba(0,0,0,0.87)', // Semi-transparent background to enhance text visibility
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant="h2" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                            Or & Sons Finances
                        </Typography>
                        <Typography variant="h6" sx={{ marginBottom: 3 }}>
                            Empowering your financial future
                        </Typography>
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS9y-hBJS7leDjIyOeFmOdaIQklTmA60XHhA&s" // Add a relevant bank or finance logo/image here
                            alt="Bank Logo"
                            style={{
                                width: '80%',
                                maxWidth: 400,
                                borderRadius: 10,
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Register;
