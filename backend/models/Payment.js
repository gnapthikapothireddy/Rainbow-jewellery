const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  paymentGateway: {
    type: DataTypes.STRING, // e.g. "Stripe", "Razorpay"
    allowNull: false
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING, // e.g. "succeeded", "failed"
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Payment;
