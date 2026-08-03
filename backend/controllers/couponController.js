const Coupon = require('../models/Coupon');

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
    }

    const coupon = await Coupon.findOne({ where: { code, isActive: true } });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    // Check expiry
    const currentDate = new Date().toISOString().split('T')[0];
    if (coupon.expiryDate < currentDate) {
      return res.status(400).json({ success: false, message: 'Coupon code has expired' });
    }

    // Check minimum order criteria
    if (parseFloat(cartTotal) < parseFloat(coupon.minimumOrder)) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minimumOrder} is required for this coupon`
      });
    }

    res.json({
      success: true,
      message: 'Coupon applied successfully!',
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: parseFloat(coupon.discountValue)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all coupons (Admin only)
// @route   GET /api/coupons
// @access  Private/Admin
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      order: [['expiryDate', 'ASC']]
    });
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new coupon (Admin only)
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minimumOrder, expiryDate, isActive } = req.body;

    const couponExists = await Coupon.findOne({ where: { code } });
    if (couponExists) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minimumOrder: minimumOrder || 0,
      expiryDate,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a coupon (Admin only)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    await coupon.destroy();
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  deleteCoupon
};
