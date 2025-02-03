import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Card, CardContent, IconButton, Tooltip } from '@mui/material';
import { axiosi } from "../config/Axios";
import Profile from "./Profile";

// Import Material UI icons
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

// Import Deposit, Withdrawal, and Transfer components
import Deposit from './Deposit';
import Withdrawal from "./Withdrawal";
import Transfer from './Transfer';
import LoadingSpinner from "../components/LoadingSpinner"; // Import Transfer component

const AccountPage = () => {
    const [accountInfo, setAccountInfo] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDepositDialog, setOpenDepositDialog] = useState(false); // Manage the state for dialog visibility
    const [openWithdrawalDialog, setOpenWithdrawalDialog] = useState(false);
    const [openTransferDialog, setOpenTransferDialog] = useState(false); // Manage the state for Transfer dialog
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                // Fetch account info
                const accountRes = await axiosi.get("/account/info");
                setAccountInfo(accountRes.data);
                // Fetch transaction history
                const transactionsRes = await axiosi.get('/account/transactions');
                setTransactions(transactionsRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching account data:', err);
                setLoading(false);
                navigate('/login');
            }
        };
        fetchAccountData().then(() => console.log("Account Data loaded"));
    }, [navigate]);

    const handleOpenDepositDialog = () => {
        setOpenDepositDialog(true); // Open the deposit dialog when the icon is clicked
    };

    const handleCloseDepositDialog = () => {
        setOpenDepositDialog(false); // Close the dialog
    };

    const handleOpenWithdrawalDialog = () => {
        setOpenWithdrawalDialog(true); // Open the withdrawal dialog when the icon is clicked
    };

    const handleCloseWithdrawalDialog = () => {
        setOpenWithdrawalDialog(false); // Close the dialog
    };

    const handleOpenTransferDialog = () => {
        setOpenTransferDialog(true); // Open the transfer dialog when the icon is clicked
    };

    const handleCloseTransferDialog = () => {
        setOpenTransferDialog(false); // Close the transfer dialog
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 3,
                padding: 3,
                minHeight: '100vh',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                background: '#f4f7fc', // Light background color for the page
            }}
        >
            {/* Left Column */}
            <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Balance Section */}
                    <Card
                        sx={{
                            flex: 1,
                            borderRadius: 2,
                            boxShadow: 3,
                            background: 'linear-gradient(145deg, #2F80ED, #56CCF2)', // Gradient background for the balance card
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '33%',
                            padding: 2,
                            marginBottom: 2
                        }}
                    >
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 1, color: 'white' }}>
                                Your Balance
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                ${accountInfo.balance.toFixed(2)}
                            </Typography>
                        </CardContent>

                        {/* Action Buttons Below Balance */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: 5,
                                paddingBottom: 2,
                            }}
                        >
                            {/* Deposit Icon */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Tooltip title="Deposit" arrow>
                                    <IconButton color="success" onClick={handleOpenDepositDialog} sx={{ fontSize: 40 }}>
                                        <AddCircleIcon />
                                    </IconButton>
                                </Tooltip>
                                <Typography variant="body2" sx={{ marginTop: 0.3, fontWeight: 'bold', color: 'white' }}>
                                    Deposit
                                </Typography>
                            </Box>

                            {/* Withdraw Icon */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Tooltip title="Withdraw" arrow>
                                    <IconButton color="error" onClick={handleOpenWithdrawalDialog} sx={{ fontSize: 40 }}>
                                        <MoneyOffIcon />
                                    </IconButton>
                                </Tooltip>
                                <Typography variant="body2" sx={{ marginTop: 0.3, fontWeight: 'bold', color: 'white' }}>
                                    Withdraw
                                </Typography>
                            </Box>

                            {/* Transfer Icon */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Tooltip title="Transfer" arrow>
                                    <IconButton color="black" onClick={handleOpenTransferDialog} sx={{ fontSize: 40 }}>
                                        <SwapHorizIcon />
                                    </IconButton>
                                </Tooltip>
                                <Typography variant="body2" sx={{ marginTop: 0.3, fontWeight: 'bold', color: 'white' }}>
                                    Transfer
                                </Typography>
                            </Box>
                        </Box>
                    </Card>

                    {/* User Info Section */}
                    <Card
                        sx={{
                            flex: 2,
                            borderRadius: 2,
                            boxShadow: 3,
                            background: 'linear-gradient(145deg, #2F80ED, #56CCF2)', // Soft light background for user info
                        }}
                    >
                        <CardContent sx={{ padding: 3 }}>
                            <Profile />
                        </CardContent>
                    </Card>
                </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                <Box sx={{ padding: 2, background: 'linear-gradient(145deg, #2F80ED, #56CCF2)', borderRadius: 2, flexGrow: 1, boxShadow: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white', marginBottom: 1 }}>
                        Transaction History
                    </Typography>
                    <Box sx={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: 1 }}>
                        {transactions.map((transaction) => {
                            const isIncome = transaction.type === 'Deposit' || (transaction.receiver === accountInfo._id && transaction.type === 'Transfer');
                            return (
                                <Box key={transaction._id} sx={{ padding: 2, marginBottom: 2, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 1 }}>
                                    <Typography variant="body2">
                                        <strong>Date:</strong> {new Date(transaction.timestamp).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Description:</strong> {transaction.type}{' '}
                                        {transaction.type === 'Transfer'
                                            ? isIncome
                                                ? 'From ' + transaction.senderName || 'System'
                                                : 'To ' + transaction.receiverName || 'System'
                                            : ''}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: isIncome ? 'green' : 'red' }}>
                                        {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Status:</strong> {transaction.status}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Grid>

            {/* Deposit Dialog */}
            <Deposit openDepositDialog={openDepositDialog} handleCloseDepositDialog={handleCloseDepositDialog} />
            {/* Withdrawal Dialog */}
            <Withdrawal open={openWithdrawalDialog} handleClose={handleCloseWithdrawalDialog} />
            {/* Transfer Dialog */}
            <Transfer openTransferDialog={openTransferDialog} handleCloseTransferDialog={handleCloseTransferDialog} />
        </Box>
    );
};

export default AccountPage;

