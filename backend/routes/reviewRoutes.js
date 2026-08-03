const express = require('express');
const router = express.Router();
const {
  createReview,
  updateReview,
  deleteReview,
  getAllReviews
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createReview)
  .get(protect, adminOnly, getAllReviews);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
