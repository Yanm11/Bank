import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Link,
} from '@mui/material';
import {useLocation, useNavigate} from 'react-router-dom';
import { axiosi } from '../../config/Axios';

const AuthPage = () => {
    // Toggle between Login (false) and Register (true)
    const [showRegister, setShowRegister] = useState(false);
    // State to control the fade in of the forms
    const [fadeIn, setFadeIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check the URL on mount (and when it changes) to determine which panel to show
    useEffect(() => {
        if (location.pathname === '/register') {
            setShowRegister(true);
        } else {
            setShowRegister(false);
        }
    }, [location]);

    // ----- Login State -----
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // ----- Register State -----
    const [name, setName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [registerError, setRegisterError] = useState('');

    // When the component mounts, delay the fade in of the forms
    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeIn(true);
        }, 500); // Adjust delay as needed (here, 500ms)
        return () => clearTimeout(timer);
    }, []);

    // Handlers remain unchanged
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            const response = await axiosi.post('/auth/login', {
                email: loginEmail,
                password: loginPassword,
            });
            if (response.status === 200) {
                localStorage.setItem('username', response.data.user.name);
                navigate('/account');
            }
        } catch (err) {
            setLoginError(err.response?.data?.message || 'Invalid login credentials');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegisterError('');
        if (password !== confirmPassword) {
            setRegisterError('Passwords do not match');
            return;
        }
        try {
            const response = await axiosi.post('/auth/register', {
                name,
                email: regEmail,
                password,
                phone,
                address,
            });
            if (response.status === 201) {
                navigate('/login'); // Or switch panels as needed
            }
        } catch (err) {
            setRegisterError(err.response?.data?.message || 'Registration failed');
        }
    };

    const togglePanel = () => {
        setShowRegister((prev) => !prev);
    };

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                minHeight: '100vh',
                backgroundImage: 'url(https://source.unsplash.com/random/1600x900?banking)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Container for forms with fade-in transition */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: fadeIn ? 1 : 0,
                    transition: 'opacity 0.6s ease-in-out',
                }}
            >
                {/* Container for the two fixed panels */}
                <Box sx={{ display: 'flex', height: '100%'}}>
                    {/* ----- Login Panel (Left) ----- */}
                    <Box
                        sx={{
                            width: '50%',
                            position: 'relative',
                            zIndex: showRegister ? 1 : 3,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            transition: 'opacity 10s ease-in-out',
                        }}
                    >
                        <Box
                            sx={{
                                width: '80%',
                                maxWidth: 400,
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                p: 4,
                                borderRadius: 3,
                                boxShadow: 5,
                                transition: 'opacity 10s ease-in-out',
                            }}
                        >
                            <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
                                Login
                            </Typography>
                            <form onSubmit={handleLogin}>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    type="email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    required
                                />
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    type="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                />
                                {loginError && (
                                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                                        {loginError}
                                    </Typography>
                                )}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                >
                                    Login
                                </Button>
                            </form>
                            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                                Don't have an account?{' '}
                                <Link onClick={togglePanel} sx={{ cursor: 'pointer' }}>
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
                    </Box>

                    {/* ----- Register Panel (Right) ----- */}
                    <Box
                        sx={{
                            width: '50%',
                            position: 'relative',
                            zIndex: showRegister ? 3 : 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                width: '80%',
                                maxWidth: 400,
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                p: 4,
                                borderRadius: 3,
                                boxShadow: 5,
                            }}
                        >
                            <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
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
                                    value={regEmail}
                                    onChange={(e) => setRegEmail(e.target.value)}
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
                                {registerError && (
                                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                                        {registerError}
                                    </Typography>
                                )}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                >
                                    Register
                                </Button>
                            </form>
                            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                                Already have an account?{' '}
                                <Link onClick={togglePanel} sx={{ cursor: 'pointer' }}>
                                    Login here
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* ----- Blue Overlay Panel (Fades in with the rest) ----- */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: showRegister ? 0 : '50%',
                        width: '50%',
                        height: '100%',
                        backgroundColor: 'blue',
                        transition: 'left 0.6s ease-in-out',
                        zIndex: 2,
                        display: 'flex',             // Enable Flexbox
                        justifyContent: 'center',    // Center horizontally
                        alignItems: 'center',        // Center vertically
                        textAlign: 'center',         // Center text inside the Typography
                    }}
                >
                    <Box
                        sx={{
                            border: '5px solid white',
                            borderRadius: '100px',
                            p: 1, // Inner frame padding
                        }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                                m: 0,  // Remove any default margin
                                p: 5, // padding for inner spacing
                                border: '5px solid white', // creates the frame border
                                borderRadius: '100px', // rounds the corners of the border
                            }}
                        >
                            Meiri Bank
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AuthPage;
