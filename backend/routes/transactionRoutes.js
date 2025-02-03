const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionControllers');
const verifyToken = require('../middlewares/verifyToken');

router.use(verifyToken);

router
    .post('/deposit', transactionController.deposit)
    .post('/transfer', transactionController.transfer)
    .post('/withdraw', transactionController.withdrawal);

module.exports = router;