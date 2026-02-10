const express = require('express');
const router = express.Router();
const {
    addPaymentMethod,
    getPaymentMethods,
    chargeCustomer,
    getWalletSummary,
    recordCashPayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/wallet', protect, getWalletSummary);
router.get('/methods', protect, getPaymentMethods);
router.post('/methods', protect, addPaymentMethod);
router.post('/charge', protect, chargeCustomer);
router.post('/cash', protect, recordCashPayment);

module.exports = router;
