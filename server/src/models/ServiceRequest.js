const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mechanicUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    vehicleDetails: {
        make: String,
        model: String,
        year: Number
    },
    issueDescription: {
        type: String,
        required: [true, 'Please describe the issue']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
