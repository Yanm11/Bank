const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PasswordResetToken = require('../models/PasswordResetToken');
const sanitizeUser = require('../utils/sanitizeUser');
const sendEmail = require('../utils/emails');

exports.registerUser = async (req, res) => {
    try {
        const {name, email, password, phone, address} = req.body;

        // check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: 'Email already in use'});
        }

        // Hash the password
        req.body.password = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User(req.body);

        await newUser.save();

        // Create JWT
        const token = jwt.sign(
            {id: newUser._id},
            process.env.SECRET_TOKEN_KEY,
            {expiresIn: process.env.JWT_EXPIRATION}
        );

        // Send token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: true
        });

        const body = `
            <p>${name}, We're excited to have you as part of our family.<br>
            As a warm welcome, we've credited your account with $500 to help you get started on your financial journey.<br>
            Whether you're saving for the future, managing your expenses, or investing, we're here to support you every step of the way.<br>
            Thank you for trusting us with your financial needs. <br>
            We're committed to providing you with the best tools and services to help you achieve your goals.</p>
            <p><a href="http://localhost:3000">Log in to your account here</a></p>
            <p>Welcome aboard, and here's to a prosperous future together!</p>
        `;

        await sendEmail(email, 'Welcome to Or & Sons Finances!', body);

        res.status(201).json({message: 'User successfully registered', user: sanitizeUser(newUser)});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
}

exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.SECRET_TOKEN_KEY,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        // Send token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 60 * 60 * 1000
        });

        res.status(200).json({ message: 'Logged in successfully', user: sanitizeUser(user) });
    } catch (error) {

        res.status(500).json({ message: 'Server error' });
    }
}

exports.logoutUser = async (req, res) => {
    res.clearCookie('token'); // Clear the JWT cookie
    res.status(200).json({ message: 'Logged out successfully' });
}

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        // Ensure the user is authenticated
        const user = await User.findById(req.user.id); // req.user is set by the `verifyToken` middleware
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate the current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash and update the new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.clearCookie('token'); // Force log in
        res.status(200).json({ message: 'Password changed successfully, please log in again' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.resetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await PasswordResetToken.deleteMany({userId:user._id})

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set expiration time (10 minutes)
        const expiresAt = Date.now() + 10 * 60 * 1000;

        // Save the token in the database
        const passwordResetToken = new PasswordResetToken({
            userId: user._id,
            token: hashedToken,
            expiresAt
        });
        await passwordResetToken.save();

        // Generate reset password URL
        const resetPasswordUrl = `http://localhost:3000/reset-password/confirm/${resetToken}`;

        const body = `
            <h1>Password Reset</h1>
            <p>You requested to reset your password. Please click the link below to reset your password:</p>
            <p><a href="${resetPasswordUrl}">Reset your password</a></p>
            <p>If you did not request this, please ignore this email.</p>
        `;
        await sendEmail(user.email,'Password Reset Link for Your Bank Account', body);

        res.status(200).json({
            message: 'Password reset token has sent to your email. Use it to reset your password.'
        });
    } catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.changePasswordResetToken = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Hash the token and find it in the database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const resetTokenRecord = await PasswordResetToken.findOne({
            token: hashedToken,
            expiresAt: { $gt: Date.now() }, // Ensure the token has not expired
        });

        if (!resetTokenRecord) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Find the user associated with the token
        const user = await User.findById(resetTokenRecord.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password and update the user's password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        // Delete the token record after successful password reset
        await PasswordResetToken.deleteOne({ _id: resetTokenRecord._id });

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.checkAuth = async (req, res) => {
    res.status(200).json({ message: 'User is logged in' });
}