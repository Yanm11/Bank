const express=require('express');
const router=express.Router();
const authController=require("../controllers/authControllers");
const verifyToken=require("../middlewares/verifyToken");

router
    .post("/register",authController.registerUser)
    .post("/login",authController.loginUser)
    .post("/logout",authController.logoutUser)
    .post("/change-password", verifyToken, authController.changePassword)
    .post("/reset-password", authController.resetPassword)
    .post("/reset-password/confirm", authController.changePasswordResetToken)
    .get("/check-auth", verifyToken, authController.checkAuth);

module.exports = router;
