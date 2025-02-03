const mongoose = require('mongoose');
const { Schema } = mongoose;

const PasswordResetTokenSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User', // References the User model
        required: true
    },
    token:{
        type: String,
        required: true
    },
    expiresAt:{
        type: Date,
        required: true
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('PasswordResetToken', PasswordResetTokenSchema);