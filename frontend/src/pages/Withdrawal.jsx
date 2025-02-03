import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { axiosi } from '../config/Axios'; // Axios instance for API requests

const Withdrawal = ({ open, handleClose }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleSubmitWithdrawal = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setError('Please enter a valid amount to withdraw.');
            return;
        }

        setLoading(true);
        try {
            const response = await axiosi.post('transaction/withdraw', { amount });
            setSuccess(response.data.message); // On success, display success message
            setAmount('');
            setTimeout(() => window.location.reload(), 1000); // Close dialog after a short delay
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred while processing the withdrawal.');
        } finally {
            setLoading(false); // End loading state
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Withdraw Money</DialogTitle>
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
                {success && <Typography color="green" sx={{ marginTop: 2 }}>{success}</Typography>}
                {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary" disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={handleSubmitWithdrawal} color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} color="secondary" /> : 'Withdraw'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Withdrawal;
