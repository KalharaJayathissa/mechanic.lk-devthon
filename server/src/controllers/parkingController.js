const asyncHandler = require('express-async-handler');
const ParkingSpot = require('../models/ParkingSpot');

// @desc    List a parking spot
// @route   POST /api/parking
// @access  Private (Parking Owner)
const createSpot = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        location,
        pricePerHour,
        dailyMaxRate,
        vehicleTypes,
        availability,
        features,
        images
    } = req.body;

    const spot = await ParkingSpot.create({
        owner: req.user.id,
        title,
        description,
        location, // Expecting { coordinates: [long, lat], address, streetAddress, city, zipCode }
        pricePerHour,
        dailyMaxRate,
        vehicleTypes,
        availability,
        features,
        images
    });

    res.status(201).json(spot);
});

// @desc    Get nearby parking spots
// @route   GET /api/parking/nearby
// @access  Public
const getNearbySpots = asyncHandler(async (req, res) => {
    const { long, lat, radius } = req.query;

    if (!long || !lat) {
        res.status(400);
        throw new Error('Please provide longitude and latitude');
    }

    const maxDistance = radius ? (parseInt(radius) * 1000) : 5000; // default 5km

    const spots = await ParkingSpot.find({
        'availability.isAvailable': true,
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(long), parseFloat(lat)]
                },
                $maxDistance: maxDistance
            }
        }
    }).populate('owner', 'name');

    res.json({
        count: spots.length,
        data: spots
    });
});

// @desc    Get parking dashboard stats
// @route   GET /api/parking/stats
// @access  Private (Parking Owner)
const getParkingDashboardStats = asyncHandler(async (req, res) => {
    const spots = await ParkingSpot.find({ owner: req.user.id });

    // Calculate dummy stats for now since booking logic isn't fully connected
    const totalSpots = spots.length;
    const occupiedSpots = spots.filter(spot => !spot.isAvailable).length;
    const revenue = 12500; // Dummy revenue

    res.json({
        totalSpots,
        occupiedSpots,
        revenue,
        occupancyRate: totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0
    });
});

// @desc    Get logged in user's parking spots
// @route   GET /api/parking/my-spots
// @access  Private (Parking Owner)
const getMySpots = asyncHandler(async (req, res) => {
    const spots = await ParkingSpot.find({ owner: req.user.id }).sort('-createdAt');
    res.json(spots);
});

// @desc    Update a parking spot
// @route   PUT /api/parking/:id
// @access  Private (Parking Owner)
const updateSpot = asyncHandler(async (req, res) => {
    const spot = await ParkingSpot.findOne({ _id: req.params.id, owner: req.user.id });

    if (!spot) {
        res.status(404);
        throw new Error('Parking spot not found or not authorized');
    }

    const updatedSpot = await ParkingSpot.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.json(updatedSpot);
});

module.exports = {
    createSpot,
    getNearbySpots,
    getParkingDashboardStats,
    getMySpots,
    updateSpot
};
