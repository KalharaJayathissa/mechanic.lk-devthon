const express = require('express');
const router = express.Router();
const {
    createRequest,
    getNearbyRequests,
    acceptRequest,
    updateStatus,
    getMyRequests
} = require('../controllers/emergencyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.get('/my', protect, getMyRequests);
router.get('/nearby', protect, authorize('Garage Owner'), getNearbyRequests);
router.put('/:id/accept', protect, authorize('Garage Owner'), acceptRequest);
router.put('/:id/status', protect, updateStatus);

module.exports = router;
