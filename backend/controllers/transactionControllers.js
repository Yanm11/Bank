const User = require("../models/User");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

exports.deposit = async (req, res) => {
    try {
        const userId = req.user.id;
        let { amount } = req.body;

        // Convert amount to a number
        amount = parseFloat(amount);

        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than zero.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        user.balance += amount;
        await user.save();

        // Record transaction
        await Transaction.create({
            sender: userId,
            receiver: userId,
            senderName: user.name,
            receiverName: user.name,
            amount,
            type: "Deposit"
        });

        res.status(200).json({ message: 'Deposit successful.', balance: user.balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
}

exports.withdrawal = async (req, res) => {
    try {
        const userId = req.user.id;
        let { amount } = req.body;

        // Convert amount to a number
        amount = parseFloat(amount);

        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than zero.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance.' });
        }

        user.balance -= amount;
        await user.save();

        // Record transaction
        await Transaction.create({
            sender: userId,
            receiver: userId,
            senderName: user.name,
            receiverName: user.name,
            amount,
            type: 'Withdrawal'
        });

        res.status(200).json({ message: 'Withdrawal successful.', balance: user.balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
}

exports.transfer = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const senderId = req.user.id;
        const senderEmail = req.user.email;
        let { receiverEmail, amount } = req.body;

        // Convert amount to a number
        amount = parseFloat(amount);

        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than zero.' });
        }

        if (senderEmail === receiverEmail) {
            return res.status(400).json({ message: 'Cannot transfer money to your bank account' });
        }

        const sender = await User.findById(senderId).session(session);
        if (!sender) {
            return res.status(404).json({ message: 'Sender not found.' });
        }

        if (sender.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance.' });
        }

        const receiver = await User.findOne({ email: receiverEmail }).session(session);
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found.' });
        }

        // Perform updates
        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save({ session });
        await receiver.save({ session });

        // Record transaction
        await Transaction.create(
            [
                {
                    sender: senderId,
                    receiver: receiver._id,
                    senderName: sender.name,
                    receiverName: receiver.name,
                    amount,
                    type: 'Transfer'
                },
            ],
            { session }
        );

        // commit the transaction
        await session.commitTransaction();
        await session.endSession();

        res.status(200).json({ message: 'Transfer successful.', balance: sender.balance });
    } catch (error) {
        // Abort transaction in case of error
        await session.abortTransaction();
        await session.endSession();
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}