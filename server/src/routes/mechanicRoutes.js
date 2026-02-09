const express = require('express');
const router = express.Router();
const {
    updateProfile,
    getNearestMechanics,
    getMechanics,
    getMechanicById
} = require('../controllers/mechanicController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Garage Owner', 'Admin'), updateProfile)
    .get(getMechanics);

router.get('/nearest', getNearestMechanics);
router.get('/:id', getMechanicById);

module.exports = router;
