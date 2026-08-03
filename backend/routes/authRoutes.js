const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
  getProfile,
  updateProfile,
  saveAddress,
  deleteAddress,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.route('/address')
  .post(protect, saveAddress);

router.route('/address/:id')
  .delete(protect, deleteAddress);

module.exports = router;
