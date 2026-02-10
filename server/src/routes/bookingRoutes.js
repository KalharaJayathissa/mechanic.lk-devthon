const express = require('express');
const router = express.Router();
const {
    createParkingBooking,
    getMyBookings,
    updateBookingStatus
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/parking', protect, authorize('Driver'), createParkingBooking);
router.get('/my', protect, authorize('Driver'), getMyBookings);
router.put('/:id/status', protect, authorize('Driver'), updateBookingStatus);

module.exports = router;
