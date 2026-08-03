const express = require('express');
const router = express.Router();
const {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/validate', protect, validateCoupon);

router.route('/')
  .get(protect, adminOnly, getAllCoupons)
  .post(protect, adminOnly, createCoupon);

router.route('/:id')
  .delete(protect, adminOnly, deleteCoupon);

module.exports = router;
