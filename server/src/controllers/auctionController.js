const Auction = require('../models/Auction');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const path = require('path');

// Configure Multer for image upload
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
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed'));
    }
}).array('photos', 5); // Allow up to 5 photos

// @desc    Create new auction
// @route   POST /api/auctions
// @access  Private (Driver)
const createAuction = asyncHandler(async (req, res) => {
    console.log('Request to create auction received');
    upload(req, res, async function (err) {
        if (err) {
            console.log('Multer error:', err);
            return res.status(400).json({ message: err.message });
        }
        console.log('Multer processing complete. Files:', req.files?.length);
        console.log('Auction data:', req.body);

        const { make, model, year, drivable, description } = req.body;

        // Ensure user is authorized (check middleware if needed, here Assuming req.user exists)
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const photoPaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        // Set endsAt to 7 days from now by default if not provided
        const endsAt = new Date();
        endsAt.setDate(endsAt.getDate() + 7);

        const auction = await Auction.create({
            user: req.user._id,
            vehicle: {
                make,
                model,
                year,
                drivable: drivable === 'true' // Convert string 'true' which comes from form-data to boolean
            },
            description,
            photos: photoPaths,
            endsAt
        });

        res.status(201).json(auction);
    });
});

// @desc    Get all auctions
// @route   GET /api/auctions
// @access  Private
const getAuctions = asyncHandler(async (req, res) => {
    const auctions = await Auction.find({ status: 'Active' })
        .populate('user', 'name avatarUrl')
        .sort('-createdAt');
    res.json(auctions);
});

// @desc    Get single auction
// @route   GET /api/auctions/:id
// @access  Private
const getAuctionById = asyncHandler(async (req, res) => {
    const auction = await Auction.findById(req.params.id)
        .populate('user', 'name avatarUrl phone')
        .populate('bids.bidder', 'name avatarUrl');

    if (auction) {
        res.json(auction);
    } else {
        res.status(404);
        throw new Error('Auction not found');
    }
});

// @desc    Place a bid
// @route   POST /api/auctions/:id/bid
// @access  Private (Garage/Mechanic)
const placeBid = asyncHandler(async (req, res) => {
    console.log(`Bid request for ${req.params.id}`, req.body);
    const { amount, estimatedTime, note } = req.body;
    const auction = await Auction.findById(req.params.id);

    if (auction) {
        if (req.user._id.toString() === auction.user.toString()) {
            res.status(400);
            throw new Error('You cannot bid on your own auction');
        }

        const bid = {
            bidder: req.user._id,
            amount: Number(amount),
            estimatedTime,
            note
        };

        auction.bids.push(bid);
        await auction.save();
        res.status(201).json(auction);
    } else {
        res.status(404);
        throw new Error('Auction not found');
    }
});

// @desc    Get logged-in driver's auctions
// @route   GET /api/auctions/driver
// @access  Private (Driver)
const getDriverAuctions = asyncHandler(async (req, res) => {
    const auctions = await Auction.find({ user: req.user._id })
        .sort('-createdAt');
    res.json(auctions);
});

module.exports = {
    createAuction,
    getAuctions,
    getAuctionById,
    placeBid,
    getDriverAuctions
};
