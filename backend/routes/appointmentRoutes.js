const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus
} = require('../controllers/appointmentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Optional protect middleware for booking, so guest users can book as well
const optionalProtect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.route('/')
  .post(optionalProtect, bookAppointment)
  .get(protect, adminOnly, getAllAppointments);

router.route('/mybookings')
  .get(protect, getMyAppointments);

router.route('/:id/status')
  .put(protect, adminOnly, updateAppointmentStatus);

module.exports = router;
