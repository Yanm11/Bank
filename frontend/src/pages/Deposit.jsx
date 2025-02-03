import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { axiosi } from '../config/Axios'; // Axios instance for API requests

const Deposit = ({ openDepositDialog, handleCloseDepositDialog }) => {
    const [amount, setAmount] = useState(''); // State to store the deposit amount
    const [loading, setLoading] = useState(false); // Loading state for submit
    const [error, setError] = useState(''); // State for error messages
    const [success, setSuccess] = useState(''); // State for success messages

    const handleAmountChange = (e) => {
        setAmount(e.target.value); // Update the amount state
    };

    const handleSubmitDeposit = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setError('Please enter a valid amount to deposit.');
            return;
        }

        setLoading(true);
        try {
            const response = await axiosi.post('transaction/deposit', { amount }); // Send deposit request to backend
            setSuccess(response.data.message); // On success, display success message
            setAmount(''); // Clear the amount input
            setTimeout(() => window.location.reload(), 1000); // Close dialog after a short delay
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred while processing the deposit.');
        } finally {
            setLoading(false); // End loading state
        }
    };

    return (
        <Dialog open={openDepositDialog} onClose={handleCloseDepositDialog}>
            <DialogTitle>Deposit Money</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Amount"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={amount}
                    onChange={handleAmountChange}
                    error={Boolean(error)}
                    helperText={error}
                    disabled={loading}
                />
                {success && (
                    <Typography variant="body1" color="primary" sx={{ marginTop: 2 }}>
                        {success}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDepositDialog} color="secondary" disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={handleSubmitDeposit} color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} color="secondary" /> : 'Deposit'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Deposit;
