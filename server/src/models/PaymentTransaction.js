const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    provider: {
        type: String,
        enum: ['payhere'],
        default: 'payhere'
    },
    paymentMethod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentMethod'
    },
    orderId: {
        type: String,
        required: true
    },
    items: {
        type: String,
        default: ''
    },
    currency: {
        type: String,
        default: 'LKR'
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'pending', 'failed', 'cancelled'],
        default: 'pending'
    },
    statusCode: {
        type: Number,
        default: 0
    },
    paymentId: {
        type: Number
    },
    sourceType: {
        type: String,
        enum: ['auction', 'service', 'parking', 'wallet'],
        default: 'wallet'
    },
    sourceId: {
        type: mongoose.Schema.Types.ObjectId
    },
    paymentMode: {
        type: String,
        enum: ['payhere', 'cash'],
        default: 'payhere'
    },
    rawResponse: {
        type: Object
    }
}, { timestamps: true });

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
