const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a title for the spot'],
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: 500
    },
    // GeoJSON Point
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number]
        },
        address: {
            type: String,
            required: [true, 'Please provide an address']
        },
        streetAddress: String,
        city: String,
        zipCode: String
    },
    pricePerHour: {
        type: Number,
        required: [true, 'Please add a price per hour']
    },
    dailyMaxRate: {
        type: Number
    },
    isPeakPricingActive: {
        type: Boolean,
        default: false
    },
    vehicleTypes: [{
        type: String,
        enum: ['Sedan', 'SUV', 'Truck', 'Motorcycle', 'Van']
    }],
    availability: {
        days: [{
            type: String,
            enum: ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su']
        }],
        startTime: String,
        endTime: String,
        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    features: [{
        type: String,
        enum: ['Covered', 'CCTV', 'Gated', 'EV Charging', '24/7 Access', 'Lighting', 'Paved']
    }],
    images: [String],
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }]
}, { timestamps: true });

parkingSpotSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('ParkingSpot', parkingSpotSchema);
