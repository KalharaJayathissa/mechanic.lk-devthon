const express = require('express');
const router = express.Router();
const {
    createAuction,
    getAuctions,
    getAuctionById,
    placeBid,
    getDriverAuctions,
    acceptBid,
    updateAuctionStatus
} = require('../controllers/auctionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getAuctions)
    .post(protect, authorize('Driver'), createAuction);

router.get('/garage', protect, getAuctions);
router.get('/driver', protect, authorize('Driver'), getDriverAuctions);

router.route('/:id')
    .get(protect, getAuctionById);

router.route('/:id/bid')
    .post(protect, placeBid);

router.route('/:id/accept-bid')
    .put(protect, authorize('Driver'), acceptBid);

router.route('/:id/status')
    .put(protect, authorize('Driver'), updateAuctionStatus);

module.exports = router;
