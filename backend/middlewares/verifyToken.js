require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
    try {
        // extract the token from request cookies
        const token = req.cookies.token;

        // if token is not there, return 401 response
        if(!token){
            return res.status(401).json({message:"Token missing, please login again"});
        }

        // verifies the token
        const decodedInfo = jwt.verify(token, process.env.SECRET_TOKEN_KEY);

        // checks if decoded info contains legit details, then set that info in req.user and calls next
        if (decodedInfo && decodedInfo.id){
            req.user = await User.findOne({_id: decodedInfo.id});
            next();
        } else {
            return res.status(401).json({message:"Invalid Token, please login again"});
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token expired, please login again" });
        }
        else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid Token, please login again" });
        }
        else {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = verifyToken;