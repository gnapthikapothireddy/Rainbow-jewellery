const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    field: 'order_id',
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    field: 'product_id',
    allowNull: false
  },
  productName: {
    type: DataTypes.STRING,
    field: 'product_name',
    allowNull: false
  },
  productImage: {
    type: DataTypes.STRING,
    field: 'product_image',
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  }
}, {
  tableName: 'order_items',
  timestamps: false
});

module.exports = OrderItem;
