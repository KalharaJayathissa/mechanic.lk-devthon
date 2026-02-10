const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicle: {
        make: { type: String, required: true },
        model: { type: String, required: true },
        year: { type: Number, required: true },
        drivable: { type: Boolean, default: false }
    },
    description: {
        type: String,
        required: [true, 'Please provide a description of the issue']
    },
    photos: [{
        type: String // URL/path to the image
    }],
    status: {
        type: String,
        enum: ['Active', 'Accepted', 'Completed', 'Expired', 'Cancelled'],
        default: 'Active'
    },
    acceptedBid: {
        type: mongoose.Schema.Types.ObjectId
    },
    endsAt: {
        type: Date,
        required: true
    },
    bids: [{
        bidder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        amount: { type: Number, required: true },
        estimatedTime: { type: String, required: true },
        note: String,
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Auction', auctionSchema);
