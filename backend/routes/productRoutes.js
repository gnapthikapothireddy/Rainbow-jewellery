const express = require('express');
const router = express.Router();
const {
  getProducts,
  getSuggestions,
  getProductById,
  getAIRecommendations,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

router.get('/suggestions', getSuggestions);
router.get('/recommendations/personalized', getAIRecommendations);

router.route('/categories/list')
  .get(getCategories);

router.route('/categories')
  .post(protect, adminOnly, createCategory);

router.route('/:id')
  .get(getProductById)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

module.exports = router;
