const User = require('./User');
const Address = require('./Address');
const Product = require('./Product');
const Category = require('./Category');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Wishlist = require('./Wishlist');
const Cart = require('./Cart');
const Review = require('./Review');
const Appointment = require('./Appointment');
const Coupon = require('./Coupon');
const Notification = require('./Notification');
const Payment = require('./Payment');

const setupAssociations = () => {
  // User & Address
  User.hasMany(Address, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Address.belongsTo(User, { foreignKey: 'userId' });

  // User & Order
  User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Order.belongsTo(User, { foreignKey: 'userId' });

  // Order & Address
  Address.hasMany(Order, { foreignKey: 'addressId', onDelete: 'SET NULL' });
  Order.belongsTo(Address, { foreignKey: 'addressId' });

  // Order & OrderItem
  Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

  // Product & OrderItem
  Product.hasMany(OrderItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
  OrderItem.belongsTo(Product, { foreignKey: 'productId' });

  // Category & Product
  Category.hasMany(Product, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
  Product.belongsTo(Category, { foreignKey: 'categoryId' });

  // User & Review
  User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Review.belongsTo(User, { foreignKey: 'userId' });

  // Product & Review
  Product.hasMany(Review, { foreignKey: 'productId', onDelete: 'CASCADE' });
  Review.belongsTo(Product, { foreignKey: 'productId' });

  // User & Appointment
  User.hasMany(Appointment, { foreignKey: 'userId', onDelete: 'SET NULL' });
  Appointment.belongsTo(User, { foreignKey: 'userId' });

  // User & Wishlist
  User.hasMany(Wishlist, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Wishlist.belongsTo(User, { foreignKey: 'userId' });

  // Product & Wishlist
  Product.hasMany(Wishlist, { foreignKey: 'productId', onDelete: 'CASCADE' });
  Wishlist.belongsTo(Product, { foreignKey: 'productId' });

  // User & Cart
  User.hasMany(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Cart.belongsTo(User, { foreignKey: 'userId' });

  // Product & Cart
  Product.hasMany(Cart, { foreignKey: 'productId', onDelete: 'CASCADE' });
  Cart.belongsTo(Product, { foreignKey: 'productId' });

  // User & Notification
  User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Notification.belongsTo(User, { foreignKey: 'userId' });

  // Order & Payment
  Order.hasOne(Payment, { foreignKey: 'orderId', onDelete: 'CASCADE' });
  Payment.belongsTo(Order, { foreignKey: 'orderId' });

  // Order & Coupon
  Coupon.hasMany(Order, { foreignKey: 'couponId', onDelete: 'SET NULL' });
  Order.belongsTo(Coupon, { foreignKey: 'couponId' });
};

module.exports = {
  setupAssociations,
  User,
  Address,
  Product,
  Category,
  Order,
  OrderItem,
  Wishlist,
  Cart,
  Review,
  Appointment,
  Coupon,
  Notification,
  Payment
};
