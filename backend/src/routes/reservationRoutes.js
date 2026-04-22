const express = require('express');
const router = express.Router();
const { getAvailableTables, createReservation, getMyReservations } = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/available-tables', getAvailableTables);
router.post('/', createReservation);
router.get('/my', protect, getMyReservations);

module.exports = router;