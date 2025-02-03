const loggingMiddleware = (req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.url}`);
    next();
}

const errorMiddleware = (err, req, res, next) => {
    console.log(`Error in request ${req.method} ${req.url}`);
    console.error(err.stack);
    res.status(500).send('Something broke!');
}

module.exports = { loggingMiddleware, errorMiddleware };
