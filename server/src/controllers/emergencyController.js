const asyncHandler = require('express-async-handler');
const EmergencyRequest = require('../models/EmergencyRequest');
const Mechanic = require('../models/Mechanic');

// @desc    Create emergency request
// @route   POST /api/emergency
// @access  Private (User)
const createRequest = asyncHandler(async (req, res) => {
    const { location, vehicleDetails, issueDescription } = req.body;

    if (!location || !location.coordinates) {
        res.status(400);
        throw new Error('Location is required');
    }

    const request = await EmergencyRequest.create({
        requester: req.user.id,
        location,
        vehicleDetails,
        issueDescription,
        status: 'pending'
    });

    // TODO: Emit socket event to nearby mechanics

    res.status(201).json(request);
});

// @desc    Get nearby requests for mechanics
// @route   GET /api/emergency/nearby
// @access  Private (Mechanic)
const getNearbyRequests = asyncHandler(async (req, res) => {
    // Get mechanic's location from their profile
    const mechanicProfile = await Mechanic.findOne({ user: req.user.id });

    if (!mechanicProfile || !mechanicProfile.location) {
        res.status(404);
        throw new Error('Mechanic profile or location not found');
    }

    const { coordinates } = mechanicProfile.location;
    const radius = mechanicProfile.serviceRadius * 1000; // to meters

    const requests = await EmergencyRequest.find({
        status: 'pending',
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: coordinates
                },
                $maxDistance: radius
            }
        }
    }).populate('requester', 'name phone');

    res.json(requests);
});

// @desc    Accept a request
// @route   PUT /api/emergency/:id/accept
// @access  Private (Mechanic)
const acceptRequest = asyncHandler(async (req, res) => {
    const request = await EmergencyRequest.findById(req.params.id);

    if (!request) {
        res.status(404);
        throw new Error('Request not found');
    }

    if (request.status !== 'pending') {
        res.status(400);
        throw new Error('Request already accepted or cancelled');
    }

    request.mechanic = req.user.id;
    request.status = 'accepted';
    request.acceptedAt = Date.now();

    const updatedRequest = await request.save();

    // TODO: Notify user via socket

    res.json(updatedRequest);
});

// @desc    Update request status
// @route   PUT /api/emergency/:id/status
// @access  Private (Mechanic/User)
const updateStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const request = await EmergencyRequest.findById(req.params.id);

    if (!request) {
        res.status(404);
        throw new Error('Request not found');
    }

    // Verification logic (is user the requester or mechanic?)
    if (request.requester.toString() !== req.user.id && request.mechanic?.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    request.status = status;
    if (status === 'completed') {
        request.completedAt = Date.now();
    }

    const updatedRequest = await request.save();
    res.json(updatedRequest);
});

module.exports = {
    createRequest,
    getNearbyRequests,
    acceptRequest,
    updateStatus
};
