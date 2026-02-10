const express = require('express');
const router = express.Router();
const {
    createServiceRequest,
    getMyServiceRequests,
    getAssignedServiceRequests,
    acceptServiceRequest,
    updateServiceRequestStatus
} = require('../controllers/serviceRequestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Driver'), createServiceRequest);
router.get('/my', protect, authorize('Driver'), getMyServiceRequests);
router.get('/assigned', protect, authorize('Garage Owner'), getAssignedServiceRequests);
router.put('/:id/accept', protect, authorize('Garage Owner'), acceptServiceRequest);
router.put('/:id/status', protect, updateServiceRequestStatus);

module.exports = router;
