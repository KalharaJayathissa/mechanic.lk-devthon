const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
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
    label: {
        type: String,
        default: 'PayHere Token'
    },
    customerToken: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
