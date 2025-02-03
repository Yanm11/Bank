const { errorMiddleware, loggingMiddleware} = require('./middlewares/middles');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const verifyToken = require("./middlewares/verifyToken");

// Middlewares
// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true, // Allow cookies and credentials
}));
app.use(loggingMiddleware); // Middleware to log HTTP request
app.use(express.json()); // Middleware to parse JSON
app.use(cookieParser()); // Middleware to parse cookies

// Routes
app.use("/auth", authRoutes);
app.use("/account", accountRoutes);
app.use("/transaction", transactionRoutes);

// Default route
app.get('/', verifyToken, (req, res) => {
    console.log(req.user);
    res.status(200).send(`Welcome to bank API`);
});

// Error-handling middleware (typically last)
app.use(errorMiddleware);

module.exports = app;
