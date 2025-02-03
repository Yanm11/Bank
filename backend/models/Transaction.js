const mongoose = require('mongoose');
const {Schema} = mongoose;

const TransactionSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderName: {
      type: String,
      required: true
    },
    receiverName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    },
    type: {
        type: String,
        enum: ['Deposit', 'Withdrawal', 'Transfer'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now // Automatically sets the current date and time
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);