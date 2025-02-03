import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, CircularProgress, Typography } from '@mui/material';
import { axiosi } from '../config/Axios'; // Axios instance for API requests

const Transfer = ({ openTransferDialog, handleCloseTransferDialog }) => {
    const [amount, setAmount] = useState('');
    const [receiverEmail, setReceiverEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state for the transfer process

    const handleAmountChange = (e) => setAmount(e.target.value);
    const handleReceiverEmailChange = (e) => setReceiverEmail(e.target.value);

    const handleTransfer = async () => {
        if (!amount || amount <= 0 || !receiverEmail) {
            setMessage('Please provide both a valid amount and a receiver email.');
            return;
        }

        setLoading(true);
        try {
            const response = await axiosi.post('/transaction/transfer', { receiverEmail, amount });
            setMessage(`Transfer successful. New balance: ${response.data.balance}`);
            setAmount(''); // Clear input fields
            setReceiverEmail('');
            setTimeout(() => window.location.reload(), 1000); // Close dialog after 2 seconds
        } catch (err) {
            setMessage(err.response?.data?.message || 'Server error');
        } finally {
            setLoading(false); // End loading state
        }
    };

    return (
        <Dialog open={openTransferDialog} onClose={handleCloseTransferDialog}>
            <DialogTitle>Transfer Money</DialogTitle>
            <DialogContent>
                <TextField
                    label="Receiver's Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={receiverEmail}
                    onChange={handleReceiverEmailChange}
                    margin="dense"
                    required
                    disabled={loading}
                />
                <TextField
                    label="Amount"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={amount}
                    onChange={handleAmountChange}
                    margin="dense"
                    required
                    disabled={loading}
                    helperText={message && message}
                    error={Boolean(message)}
                />
                {message && (
                    <Typography variant="body2" color={message.includes('successful') ? 'green' : 'red'} sx={{ marginTop: 1 }}>
                        {message}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseTransferDialog} color="secondary" disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={handleTransfer} color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} color="secondary" /> : 'Transfer'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Transfer;
