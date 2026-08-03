const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  discount: {
    type: DataTypes.DECIMAL(5, 2), // Percentage, e.g., 10.00 for 10%
    defaultValue: 0.00
  },
  weight: {
    type: DataTypes.DECIMAL(8, 3), // in grams
    allowNull: false
  },
  purity: {
    type: DataTypes.STRING, // e.g., "22K", "18K", "950 Platinum"
    allowNull: false
  },
  stoneDetails: {
    type: DataTypes.STRING, // e.g., "1.2 Carat VVS1 Diamond"
    allowNull: true
  },
  makingCharges: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  gst: {
    type: DataTypes.DECIMAL(5, 2), // e.g., 3.00 for 3%
    defaultValue: 3.00
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  images: {
    type: DataTypes.JSON, // JSON array of urls
    defaultValue: []
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isNewArrival: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isBestSeller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isTrending: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  collection: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 4.50
  },
  specifications: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Product;
