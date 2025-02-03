const User = require('../models/User');
const Transaction = require('../models/Transaction');
const sanitizeUser = require('../utils/sanitizeUser');

exports.getBalance = async function (req, res)  {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ balance: user.balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactions = await Transaction.find({
            $or: [{sender: userId}, {receiver: userId}]
        }).sort({timestamp: -1}).limit(50); // Sort by most recent

        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getAccountInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const sanitizedUser = sanitizeUser(user);
        res.status(200).json(sanitizedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.changeAccountInfo = async (req, res) => {
    try {
        const accountId = req.user.id;
        const {name, phone, address} = req.body;
        console.log(accountId);
        const updatedUser = await User.findByIdAndUpdate(
            accountId,
            {name, phone, address},
            {new: true, runValidators: true} // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({user: sanitizeUser(updatedUser)});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}