const asyncHandler = require('express-async-handler');
const Mechanic = require('../models/Mechanic');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed'));
    }
}).array('images', 5);

// @desc    Create or update mechanic profile
// @route   POST /api/mechanics
// @access  Private (Garage Owner)
const updateProfile = asyncHandler(async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const { businessName, description, isOnline, serviceRadius } = req.body;
        // Location and services might come as JSON strings if using FormData needed for file upload
        // We need to parse them if they are strings.

        let location = req.body.location;
        let services = req.body.services;

        try {
            if (typeof location === 'string') location = JSON.parse(location);
            if (typeof services === 'string') services = JSON.parse(services);
        } catch (e) {
            return res.status(400).json({ message: 'Invalid JSON format for location or services' });
        }

        const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const mechanicFields = {
            user: req.user.id,
            businessName,
            description,
            isOnline: isOnline === 'true' || isOnline === true,
            location,
            services,
            serviceRadius: Number(serviceRadius)
        };

        if (imagePaths.length > 0) {
            mechanicFields.images = imagePaths;
        }

        let mechanic = await Mechanic.findOne({ user: req.user.id });

        if (mechanic) {
            // Update
            // If new images provided, append or replace? Let's append for now or replace. 
            // The prompt implies "add their spot". 
            // If updating, we might want to keep old images if no new ones, or replace.
            // Let's strictly replace if new ones are uploaded, otherwise keep old? 
            // actually mechanicFields.images is only set if imagePaths > 0.
            // However, findOneAndUpdate with $set will overwrite if key exists.

            // If we want to merge, we need to fetch, push, save.
            // But specific requirement isn't detailed. I'll stick to Replace if new provided, else keep existing (by not adding to $set).

            if (imagePaths.length === 0) {
                delete mechanicFields.images;
            }

            mechanic = await Mechanic.findOneAndUpdate(
                { user: req.user.id },
                { $set: mechanicFields },
                { new: true }
            );
            res.json(mechanic);
        } else {
            // Create
            mechanic = await Mechanic.create(mechanicFields);
            res.status(201).json(mechanic);
        }
    });
});

// @desc    Get nearest mechanics
// @route   GET /api/mechanics/nearest
// @access  Public or Private
const getNearestMechanics = asyncHandler(async (req, res) => {
    const { long, lat, radius } = req.query;

    if (!long || !lat) {
        res.status(400);
        throw new Error('Please provide longitude and latitude');
    }

    // Radius in meters (default 10km)
    const maxDistance = radius ? (parseInt(radius) * 1000) : 10000;

    const mechanics = await Mechanic.find({
        isOnline: true, // Only online mechanics
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(long), parseFloat(lat)]
                },
                $maxDistance: maxDistance
            }
        }
    }).populate('user', 'name phone avatarUrl');

    res.json({
        count: mechanics.length,
        data: mechanics
    });
});

// @desc    Get all mechanics (with filtering)
// @route   GET /api/mechanics
// @access  Public
// @desc    Get all mechanics (with filtering)
// @route   GET /api/mechanics
// @access  Public
const getMechanics = asyncHandler(async (req, res) => {
    const { lat, lng, long, radius } = req.query;
    const longitude = lng || long;

    console.log(`[getMechanics] Request received. Lat: ${lat}, Lng: ${longitude}, Radius: ${radius}`);

    try {
        if (lat && longitude) {
            const maxDistance = radius ? (parseInt(radius) * 1000) : 10000;
            console.log(`[getMechanics] Querying near [${longitude}, ${lat}] maxDistance: ${maxDistance}`);

            const mechanics = await Mechanic.find({
                isOnline: true,
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(longitude), parseFloat(lat)]
                        },
                        $maxDistance: maxDistance
                    }
                }
            }).populate('user', 'name phone avatarUrl');

            console.log(`[getMechanics] Found ${mechanics.length} mechanics nearby.`);
            res.json(mechanics);
        } else {
            console.log(`[getMechanics] Fetching all mechanics (no geo query).`);
            const mechanics = await Mechanic.find().populate('user', 'name phone avatarUrl');
            console.log(`[getMechanics] Found ${mechanics.length} mechanics total.`);
            res.json(mechanics);
        }
    } catch (error) {
        console.error(`[getMechanics] Error:`, error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// @desc    Get mechanic by ID
// @route   GET /api/mechanics/:id
// @access  Public
const getMechanicById = asyncHandler(async (req, res) => {
    const mechanic = await Mechanic.findById(req.params.id).populate('user', 'name email phone');

    if (mechanic) {
        res.json(mechanic);
    } else {
        res.status(404);
        throw new Error('Mechanic not found');
    }
});

module.exports = {
    updateProfile,
    getNearestMechanics,
    getMechanics,
    getMechanicById
};
