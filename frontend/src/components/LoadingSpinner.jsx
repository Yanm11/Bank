// src/components/LoadingSpinner.jsx
import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const LoadingSpinner = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent background
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999, // Ensures it's always on top
            }}
        >
            <Box sx={{ textAlign: 'center' }}>
                <CircularProgress size={50} color="primary" />
                <Typography variant="h6" sx={{ marginTop: 2 }}>
                    Loading...
                </Typography>
            </Box>
        </Box>
    );
};

export default LoadingSpinner;
