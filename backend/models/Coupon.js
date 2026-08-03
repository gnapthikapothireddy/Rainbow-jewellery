const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'flat'),
    allowNull: false
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  minimumOrder: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = Coupon;
