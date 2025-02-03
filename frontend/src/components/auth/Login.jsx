import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Link, Grid } from '@mui/material';
import { axiosi } from "../../config/Axios";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axiosi.get('/auth/check-auth');
                navigate('/account');
            } catch {
                // Stay on the login page
            }
        };

        checkAuth();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axiosi.post('/auth/login', { email, password });
            if (response.status === 200) {
                const userName = response.data.user.name;
                localStorage.setItem('username', userName);
                navigate('/account');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid login credentials');
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
                {/* Left Section (Login Form) */}
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
                            Login
                        </Typography>
                        <form onSubmit={handleLogin}>
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
                                Login
                            </Button>
                        </form>
                        <Typography variant="body2" sx={{ marginTop: 2, textAlign: 'center' }}>
                            Don't have an account?{' '}
                            <Link href="/register" underline="hover">
                                Register here
                            </Link>
                        </Typography>
                        {/* Forgot Password Link */}
                        <Typography variant="body2" sx={{ marginTop: 1, textAlign: 'center' }}>
                            <Link href="/reset-password" underline="hover">
                                Forgot your password?
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
                            backgroundColor: 'rgba(0,0,0,0.87)',
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
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS9y-hBJS7leDjIyOeFmOdaIQklTmA60XHhA&s"
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

export default Login;
