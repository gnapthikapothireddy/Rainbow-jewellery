const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Address = require('../models/Address');
const Notification = require('../models/Notification');
const Payment = require('../models/Payment');
const User = require('../models/User');

const generateTrackingNumber = () => 'TRK' + Math.floor(100000000 + Math.random() * 900000000);

// @desc    Create a new order (Checkout)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { 
      items, 
      addressId, 
      paymentMethod, 
      couponCode, 
      giftWrapping,
      customerName,
      phone,
      email,
      address
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in the order' });
    }

    let subTotal = 0;
    const orderItemsToCreate = [];

    // 1. Verify product inventory & calculate prices
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ID ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}. Only ${product.stock} left.` });
      }

      // Calculate discount-adjusted price
      const discountPercent = parseFloat(product.discount || 0);
      const originalPrice = parseFloat(product.price);
      const discountValue = originalPrice * (discountPercent / 100);
      const itemPrice = originalPrice - discountValue;

      // Add making charges
      const finalItemPrice = itemPrice + parseFloat(product.makingCharges || 0);

      subTotal += finalItemPrice * item.quantity;

      orderItemsToCreate.push({
        productId: product.id,
        productName: product.name,
        productImage: product.images && product.images.length > 0 ? product.images[0] : '',
        quantity: item.quantity,
        price: finalItemPrice,
        discount: discountPercent,
        productInstance: product // save temporarily to update stock later
      });
    }

    // 2. Validate and apply coupon discount
    let discountAmount = 0;
    let couponId = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ where: { code: couponCode, isActive: true } });
      if (coupon) {
        const currentDate = new Date().toISOString().split('T')[0];
        if (coupon.expiryDate >= currentDate && subTotal >= parseFloat(coupon.minimumOrder)) {
          couponId = coupon.id;
          if (coupon.discountType === 'percentage') {
            discountAmount = subTotal * (parseFloat(coupon.discountValue) / 100);
          } else {
            discountAmount = parseFloat(coupon.discountValue);
          }
        }
      }
    }

    // 3. Taxes & Shipping
    const gstAmount = (subTotal - discountAmount) * 0.03;
    const shippingCharges = (subTotal - discountAmount) > 5000 ? 0 : 150;
    const giftWrappingCharges = giftWrapping ? 100 : 0;

    const totalAmount = (subTotal - discountAmount) + gstAmount + shippingCharges + giftWrappingCharges;

    // 4. Update Product Stock Levels
    for (const item of orderItemsToCreate) {
      const product = item.productInstance;
      product.stock -= item.quantity;
      await product.save();

      // Trigger alerts if stock is low or out of stock
      if (product.stock === 0) {
        await Notification.create({
          userId: null,
          title: 'Out of Stock Warning',
          message: `Product ${product.name} (SKU: ${product.sku}) is now out of stock.`,
          type: 'stock'
        });
      } else if (product.stock < 5) {
        await Notification.create({
          userId: null,
          title: 'Low Stock Alert',
          message: `Product ${product.name} (SKU: ${product.sku}) stock is falling low (${product.stock} items left).`,
          type: 'stock'
        });
      }
    }

    // Get final address string
    let finalAddressText = address;
    if (!finalAddressText && addressId) {
      const addr = await Address.findByPk(addressId);
      if (addr) {
        finalAddressText = `${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}, ${addr.city}, ${addr.state} - ${addr.postalCode}`;
      }
    }
    if (!finalAddressText) {
      finalAddressText = 'Jaipur Store Pickup';
    }

    // Generate unique order ID (ORD-XXXXXX)
    const customOrderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    // 5. Create the Order in table `orders`
    const order = await Order.create({
      orderId: customOrderId,
      userId: req.user ? req.user.id : 99,
      customerName: customerName || (req.user ? req.user.name : 'Customer'),
      phone: phone || (req.user ? req.user.phone : ''),
      email: email || (req.user ? req.user.email : ''),
      address: finalAddressText,
      paymentMethod: paymentMethod || 'Stripe',
      totalAmount: totalAmount.toFixed(2),
      status: 'Pending Confirmation'
    });

    // 6. Create Order Items in table `order_items`
    for (const item of orderItemsToCreate) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      });
    }

    // 7. Add loyalty points (1 point per 100 INR spent)
    if (req.user) {
      const pointsEarned = Math.floor(totalAmount / 100);
      const user = await User.findByPk(req.user.id);
      if (user) {
        user.loyaltyPoints = (user.loyaltyPoints || 0) + pointsEarned;
        await user.save();
      }
    }

    // 8. Create Customer Notification
    if (req.user) {
      await Notification.create({
        userId: req.user.id,
        title: 'Order Placed (Pending)',
        message: `Your order #${order.orderId} for ₹${order.totalAmount} has been placed. Complete confirmation via WhatsApp.`,
        type: 'order'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: order.orderId,
        trackingNumber: generateTrackingNumber(),
        totalAmount: order.totalAmount,
        transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user orders (History)
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: OrderItem
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id },
      include: [OrderItem]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id },
      include: [OrderItem]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (order.status !== 'Pending Confirmation' && order.status !== 'Pending' && order.status !== 'Confirmed') {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled in its current state' });
    }

    order.status = 'Cancelled';
    await order.save();

    // Revert stock
    for (const item of order.OrderItems) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Create Notification
    await Notification.create({
      userId: order.userId,
      title: 'Order Cancelled',
      message: `Your order #${order.orderId} has been cancelled successfully.`,
      type: 'order'
    });

    res.json({ success: true, message: 'Order cancelled successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [OrderItem],
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = orderStatus;
    await order.save();

    // Trigger customer notification
    await Notification.create({
      userId: order.userId,
      title: `Order Status: ${orderStatus}`,
      message: `Your order #${order.orderId} status has been updated to "${orderStatus}".`,
      type: 'order'
    });

    res.json({ success: true, message: 'Order status updated successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an order (Admin only)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    await order.destroy();
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
};
