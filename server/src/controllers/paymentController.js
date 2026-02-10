const asyncHandler = require('express-async-handler');
const fetch = require('node-fetch');
const PaymentMethod = require('../models/PaymentMethod');
const PaymentTransaction = require('../models/PaymentTransaction');

let cachedToken = null;
let tokenExpiresAt = 0;

const getPayHereBaseUrl = () => {
    return process.env.PAYHERE_MODE === 'live'
        ? 'https://www.payhere.lk'
        : 'https://sandbox.payhere.lk';
};

const getAccessToken = async () => {
    const now = Date.now();
    if (cachedToken && tokenExpiresAt > now + 10000) {
        return cachedToken;
    }

    const appId = process.env.PAYHERE_APP_ID;
    const appSecret = process.env.PAYHERE_APP_SECRET;

    if (!appId || !appSecret) {
        throw new Error('PayHere credentials are missing');
    }

    const auth = Buffer.from(`${appId}:${appSecret}`).toString('base64');
    const res = await fetch(`${getPayHereBaseUrl()}/merchant/v1/oauth/token`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error_description || 'Failed to get access token');
    }

    cachedToken = data.access_token;
    tokenExpiresAt = now + (data.expires_in || 0) * 1000;
    return cachedToken;
};

const mapStatus = (statusCode) => {
    if (statusCode === 2) return 'success';
    if (statusCode === 0) return 'pending';
    if (statusCode === -1) return 'cancelled';
    return 'failed';
};

// @desc    Add payment method (store customer token)
// @route   POST /api/payments/methods
// @access  Private
const addPaymentMethod = asyncHandler(async (req, res) => {
    const { customerToken, label, isDefault } = req.body;

    if (!customerToken) {
        res.status(400);
        throw new Error('Customer token is required');
    }

    const existingDefault = await PaymentMethod.findOne({ user: req.user.id, isDefault: true });
    const method = await PaymentMethod.create({
        user: req.user.id,
        customerToken,
        label: label || 'PayHere Token',
        isDefault: isDefault || !existingDefault
    });

    if (method.isDefault) {
        await PaymentMethod.updateMany(
            { user: req.user.id, _id: { $ne: method._id } },
            { $set: { isDefault: false } }
        );
    }

    res.status(201).json(method);
});

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Private
const getPaymentMethods = asyncHandler(async (req, res) => {
    const methods = await PaymentMethod.find({ user: req.user.id }).sort('-createdAt');
    res.json(methods);
});

// @desc    Charge a saved customer token
// @route   POST /api/payments/charge
// @access  Private
const chargeCustomer = asyncHandler(async (req, res) => {
    const { paymentMethodId, amount, currency, items, type, sourceType, sourceId } = req.body;

    if (!paymentMethodId || !amount) {
        res.status(400);
        throw new Error('Payment method and amount are required');
    }

    const method = await PaymentMethod.findOne({ _id: paymentMethodId, user: req.user.id });
    if (!method) {
        res.status(404);
        throw new Error('Payment method not found');
    }

    const accessToken = await getAccessToken();
    const orderId = `ORD-${Date.now()}`;

    const resCharge = await fetch(`${getPayHereBaseUrl()}/merchant/v1/payment/charge`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: type || 'PAYMENT',
            order_id: orderId,
            items: items || 'Mechanic.LK charge',
            currency: currency || 'LKR',
            amount: Number(amount),
            customer_token: method.customerToken
        })
    });

    const chargeData = await resCharge.json();

    const statusCode = chargeData?.data?.status_code ?? chargeData?.status ?? -2;
    const transaction = await PaymentTransaction.create({
        user: req.user.id,
        provider: 'payhere',
        paymentMethod: method._id,
        orderId,
        items: items || 'Mechanic.LK charge',
        currency: currency || 'LKR',
        amount: Number(amount),
        status: mapStatus(statusCode),
        statusCode,
        paymentId: chargeData?.data?.payment_id,
        sourceType: sourceType || 'wallet',
        sourceId: sourceId || undefined,
        paymentMode: 'payhere',
        rawResponse: chargeData
    });

    res.status(resCharge.ok ? 200 : 400).json({
        transaction,
        gateway: chargeData
    });
});

// @desc    Wallet summary
// @route   GET /api/payments/wallet
// @access  Private
const getWalletSummary = asyncHandler(async (req, res) => {
    const [methods, transactions] = await Promise.all([
        PaymentMethod.find({ user: req.user.id }).sort('-createdAt'),
        PaymentTransaction.find({ user: req.user.id }).sort('-createdAt').limit(20)
    ]);

    const totalSpent = transactions
        .filter((t) => t.status === 'success')
        .reduce((sum, t) => sum + t.amount, 0);

    res.json({
        balance: 0,
        totalSpent,
        methods,
        transactions
    });
});

// @desc    Record a cash payment
// @route   POST /api/payments/cash
// @access  Private
const recordCashPayment = asyncHandler(async (req, res) => {
    const { amount, currency, items, sourceType, sourceId } = req.body;

    if (!amount) {
        res.status(400);
        throw new Error('Amount is required');
    }

    const transaction = await PaymentTransaction.create({
        user: req.user.id,
        provider: 'payhere',
        paymentMethod: undefined,
        orderId: `CASH-${Date.now()}`,
        items: items || 'Cash payment',
        currency: currency || 'LKR',
        amount: Number(amount),
        status: 'success',
        statusCode: 2,
        paymentId: undefined,
        sourceType: sourceType || 'wallet',
        sourceId: sourceId || undefined,
        paymentMode: 'cash',
        rawResponse: { status: 2, msg: 'Cash payment recorded' }
    });

    res.status(201).json({ transaction });
});

module.exports = {
    addPaymentMethod,
    getPaymentMethods,
    chargeCustomer,
    getWalletSummary,
    recordCashPayment
};
