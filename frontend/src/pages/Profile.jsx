import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosi } from '../config/Axios';
import { Box, Card, CardContent, Typography, TextField, CircularProgress, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';
import LoadingSpinner from "../components/LoadingSpinner";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [editedUser, setEditedUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    // Fetch user profile info
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axiosi.get('/account/info');
                setUser(response.data);
                setEditedUser(response.data); // Set initial values for editing
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch user info');
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const handleEdit = (field) => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditedUser(user); // Reset to original user data
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            await axiosi.put('/account/info', editedUser); // Send updated info to the server
            setUser(editedUser); // Update local state with the new user data
            setIsEditing(false);
        } catch (err) {
            setError('Failed to save changes');
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            await axiosi.post('/auth/change-password', { currentPassword, newPassword });
            setOpenDialog(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            alert('Password changed successfully. Please log in again.');
            handleCloseDialog();
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        }
    };

    const handleChange = (e) => {
        setEditedUser({
            ...editedUser,
            [e.target.name]: e.target.value,
        });
    };

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    if (loading) return <LoadingSpinner />;

    return (
        <Box sx={{ padding: 2 }}>
            {error && (
                <Typography color="error" variant="body1" sx={{ marginBottom: 2 }}>
                    {error}
                </Typography>
            )}
            {user ? (
                <Card sx={{ padding: 3, boxShadow: 3, backgroundColor: '#f9f9f9' }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                            Profile Information
                        </Typography>

                        {/* Name Field */}
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                            <Typography variant="body1" sx={{ width: '25%', fontWeight: 'bold' }}>
                                Name:
                            </Typography>
                            {isEditing ? (
                                <TextField
                                    name="name"
                                    value={editedUser.name}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    sx={{ marginRight: 1 }}
                                />
                            ) : (
                                <Typography variant="body1" sx={{ width: '60%' }}>
                                    {user.name}
                                </Typography>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton
                                    onClick={isEditing ? handleSave : () => handleEdit('name')}
                                    color="primary"
                                    sx={{ marginLeft: 1 }}
                                >
                                    {isEditing ? <CheckIcon /> : <EditIcon />}
                                </IconButton>
                                {isEditing && (
                                    <IconButton onClick={handleCancel} color="error" sx={{ marginLeft: 1 }}>
                                        <CancelIcon />
                                    </IconButton>
                                )}
                            </Box>
                        </Box>

                        {/* Email Field - Non-Editable */}
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                            <Typography variant="body1" sx={{ width: '25%', fontWeight: 'bold' }}>
                                Email:
                            </Typography>
                            <Typography variant="body1" sx={{ width: '60%' }}>
                                {user.email}
                            </Typography>
                        </Box>

                        {/* Phone Field */}
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                            <Typography variant="body1" sx={{ width: '25%', fontWeight: 'bold' }}>
                                Phone:
                            </Typography>
                            {isEditing ? (
                                <TextField
                                    name="phone"
                                    value={editedUser.phone || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    sx={{ marginRight: 1 }}
                                />
                            ) : (
                                <Typography variant="body1" sx={{ width: '60%' }}>
                                    {user.phone || 'Not provided'}
                                </Typography>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton
                                    onClick={isEditing ? handleSave : () => handleEdit('phone')}
                                    color="primary"
                                    sx={{ marginLeft: 1 }}
                                >
                                    {isEditing ? <CheckIcon /> : <EditIcon />}
                                </IconButton>
                                {isEditing && (
                                    <IconButton onClick={handleCancel} color="error" sx={{ marginLeft: 1 }}>
                                        <CancelIcon />
                                    </IconButton>
                                )}
                            </Box>
                        </Box>

                        {/* Address Field */}
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                            <Typography variant="body1" sx={{ width: '25%', fontWeight: 'bold' }}>
                                Address:
                            </Typography>
                            {isEditing ? (
                                <TextField
                                    name="address"
                                    value={editedUser.address || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    sx={{ marginRight: 1 }}
                                />
                            ) : (
                                <Typography variant="body1" sx={{ width: '60%' }}>
                                    {user.address || 'Not provided'}
                                </Typography>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton
                                    onClick={isEditing ? handleSave : () => handleEdit('address')}
                                    color="primary"
                                    sx={{ marginLeft: 1 }}
                                >
                                    {isEditing ? <CheckIcon /> : <EditIcon />}
                                </IconButton>
                                {isEditing && (
                                    <IconButton onClick={handleCancel} color="error" sx={{ marginLeft: 1 }}>
                                        <CancelIcon />
                                    </IconButton>
                                )}
                            </Box>
                        </Box>

                        {/* Change Password Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleOpenDialog}
                                startIcon={<LockIcon />}
                            >
                                Change Password
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Change Password Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Current Password"
                        type="password"
                        fullWidth
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    {error && <Typography color="error">{error}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleChangePassword} color="primary">
                        Change Password
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Profile;
