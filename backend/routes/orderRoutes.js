const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createOrder)
  .get(protect, adminOnly, getAllOrders);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById)
  .delete(protect, adminOnly, deleteOrder);

router.route('/:id/cancel')
  .put(protect, cancelOrder);

router.route('/:id/status')
  .put(protect, adminOnly, updateOrderStatus);

module.exports = router;
