const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    businessName: {
        type: String,
        required: [true, 'Please provide a business name']
    },
    description: {
        type: String,
        maxlength: 500
    },
    isOnline: {
        type: Boolean,
        default: false,
        index: true // Important for quick availability queries
    },
    // GeoJSON Point
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere' // 2dsphere index for geospatial queries
        },
        address: String
    },
    services: [{
        name: { type: String, required: true },
        price: { type: Number, required: true }, // Base price
        estimatedTime: { type: Number, required: true }, // in minutes
        category: {
            type: String,
            enum: ['Routine Maintenance', 'Repair', 'Inspection', 'Towing', 'Other'],
            default: 'Other'
        }
    }],
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    serviceRadius: {
        type: Number,
        default: 10 // km
    },
    images: [String]
}, { timestamps: true });

// Cascade delete if needed, or methods to calculate availability

module.exports = mongoose.model('Mechanic', mechanicSchema);
