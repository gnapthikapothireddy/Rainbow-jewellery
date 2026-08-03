const Review = require('../models/Review');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');

// Helper: Check if user has purchased the product (to flag "Verified Purchase")
const checkIsVerifiedPurchase = async (userId, productId) => {
  const orders = await Order.findAll({
    where: { userId, paymentStatus: 'Paid' },
    include: [{ model: OrderItem, where: { productId } }]
  });
  return orders.length > 0;
};

// @desc    Create a product review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, images, video } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Please provide a rating between 1 and 5' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if review already exists
    const reviewExists = await Review.findOne({
      where: { userId: req.user.id, productId }
    });

    if (reviewExists) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const verified = await checkIsVerifiedPurchase(req.user.id, productId);

    const review = await Review.create({
      userId: req.user.id,
      productId,
      rating,
      comment,
      images: images || [],
      video: video || null
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        ...review.toJSON(),
        verified,
        User: { name: req.user.name }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const { rating, comment, images, video } = req.body;
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    review.rating = rating || review.rating;
    review.comment = comment !== undefined ? comment : review.comment;
    review.images = images || review.images;
    review.video = video !== undefined ? video : review.video;

    await review.save();
    res.json({ success: true, message: 'Review updated successfully', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    await review.destroy();
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews (Admin only)
// @route   GET /api/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: Product, attributes: ['id', 'name', 'images', 'sku'] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getAllReviews
};
