const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mechanic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Assigned mechanic user (or Mechanic model ref)
    },
    // Location of the breakdown
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere'
        },
        address: String
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'en_route', 'arrived', 'completed', 'cancelled'],
        default: 'pending'
    },
    vehicleDetails: {
        make: String,
        model: String,
        year: Number,
        color: String,
        plateNumber: String
    },
    issueDescription: {
        type: String,
        required: [true, 'Please describe the issue']
    },
    images: [String],
    acceptedAt: Date,
    completedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
