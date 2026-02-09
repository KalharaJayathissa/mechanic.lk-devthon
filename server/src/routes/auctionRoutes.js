const express = require('express');
const router = express.Router();
const {
    createAuction,
    getAuctions,
    getAuctionById,
    placeBid,
    getDriverAuctions
} = require('../controllers/auctionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getAuctions)
    .post(protect, createAuction);

router.get('/garage', protect, getAuctions);
router.get('/driver', protect, getDriverAuctions);

router.route('/:id')
    .get(protect, getAuctionById);

router.route('/:id/bid')
    .post(protect, placeBid);

module.exports = router;
