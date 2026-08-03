const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Address = require('../models/Address');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'rainbowsecret123', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'customer' // default role is customer
    });

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        loyaltyPoints: user.loyaltyPoints,
        token: generateToken(user.id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          loyaltyPoints: user.loyaltyPoints,
          token: generateToken(user.id)
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google Sign-In
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { googleId, name, email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required from Google response' });
    }

    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Create user since they do not exist
      user = await User.create({
        name,
        email,
        googleId,
        password: null, // no password for oauth users
        role: 'customer'
      });
    } else if (!user.googleId) {
      // Link Google ID to existing account
      user.googleId = googleId;
      await user.save();
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        loyaltyPoints: user.loyaltyPoints,
        token: generateToken(user.id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    const addresses = await Address.findAll({ where: { userId: req.user.id } });

    if (user) {
      res.json({
        success: true,
        data: {
          user,
          addresses
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          phone: updatedUser.phone,
          loyaltyPoints: updatedUser.loyaltyPoints
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save customer address
// @route   POST /api/auth/address
// @access  Private
const saveAddress = async (req, res) => {
  try {
    const { addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;

    if (isDefault) {
      // Set all other addresses for this user to default = false
      await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    }

    const address = await Address.create({
      userId: req.user.id,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country: country || 'India',
      isDefault: isDefault || false
    });

    res.status(201).json({ success: true, data: address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete customer address
// @route   DELETE /api/auth/address/:id
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found or unauthorized' });
    }

    await address.destroy();
    res.json({ success: true, message: 'Address removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot password request
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User with this email does not exist' });
    }

    // Generate simulated recovery code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // In a production server, send email. Here, return it so the mock UI can demonstrate functionality.
    res.json({
      success: true,
      message: 'Password reset code generated and sent to email',
      devResetCode: resetCode // returned for ease of testing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = password;
    await user.save();

    res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  getProfile,
  updateProfile,
  saveAddress,
  deleteAddress,
  forgotPassword,
  resetPassword
};
