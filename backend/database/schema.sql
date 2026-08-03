-- Rainbow Jewelry Database Schema (MySQL)

CREATE DATABASE IF NOT EXISTS rainbow_jewelry;
USE rainbow_jewelry;

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NULL,
  role ENUM('customer', 'admin') DEFAULT 'customer',
  phone VARCHAR(255) NULL,
  googleId VARCHAR(255) NULL,
  loyaltyPoints INT DEFAULT 0,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- Addresses Table
CREATE TABLE IF NOT EXISTS Addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  addressLine1 VARCHAR(255) NOT NULL,
  addressLine2 VARCHAR(255) NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  postalCode VARCHAR(255) NOT NULL,
  country VARCHAR(255) DEFAULT 'India',
  isDefault BOOLEAN DEFAULT FALSE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Categories Table
CREATE TABLE IF NOT EXISTS Categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  image VARCHAR(255) NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- Products Table
CREATE TABLE IF NOT EXISTS Products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(255) NOT NULL UNIQUE,
  categoryId INT NOT NULL,
  description TEXT NULL,
  price DECIMAL(12, 2) NOT NULL,
  discount DECIMAL(5, 2) DEFAULT 0.00,
  weight DECIMAL(8, 3) NOT NULL,
  purity VARCHAR(255) NOT NULL,
  stoneDetails VARCHAR(255) NULL,
  makingCharges DECIMAL(10, 2) DEFAULT 0.00,
  gst DECIMAL(5, 2) DEFAULT 3.00,
  stock INT DEFAULT 0,
  images JSON NULL,
  videoUrl VARCHAR(255) NULL,
  isFeatured BOOLEAN DEFAULT FALSE,
  isNewArrival BOOLEAN DEFAULT FALSE,
  isBestSeller BOOLEAN DEFAULT FALSE,
  isTrending BOOLEAN DEFAULT FALSE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (categoryId) REFERENCES Categories(id) ON DELETE CASCADE
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS Coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(255) NOT NULL UNIQUE,
  discountType ENUM('percentage', 'flat') NOT NULL,
  discountValue DECIMAL(10, 2) NOT NULL,
  minimumOrder DECIMAL(10, 2) DEFAULT 0.00,
  expiryDate DATE NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- Orders Table
CREATE TABLE IF NOT EXISTS Orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  addressId INT NULL,
  totalAmount DECIMAL(12, 2) NOT NULL,
  discountAmount DECIMAL(12, 2) DEFAULT 0.00,
  gstAmount DECIMAL(12, 2) DEFAULT 0.00,
  shippingCharges DECIMAL(10, 2) DEFAULT 0.00,
  paymentMethod VARCHAR(255) NOT NULL,
  paymentStatus ENUM('Pending', 'Paid', 'Failed') DEFAULT 'Pending',
  orderStatus ENUM('Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled') DEFAULT 'Confirmed',
  couponId INT NULL,
  giftWrapping BOOLEAN DEFAULT FALSE,
  trackingNumber VARCHAR(255) NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (addressId) REFERENCES Addresses(id) ON DELETE SET NULL,
  FOREIGN KEY (couponId) REFERENCES Coupons(id) ON DELETE SET NULL
);

-- OrderItems Table
CREATE TABLE IF NOT EXISTS OrderItems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(12, 2) NOT NULL,
  discount DECIMAL(5, 2) DEFAULT 0.00,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE
);

-- Wishlist Table
CREATE TABLE IF NOT EXISTS Wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  productId INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE
);

-- Cart Table
CREATE TABLE IF NOT EXISTS Cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS Reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  productId INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NULL,
  images JSON NULL,
  video VARCHAR(255) NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS Appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  branch VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(255) NOT NULL,
  purpose ENUM('Bridal Consultation', 'Jewelry Purchase', 'Ring Size', 'Custom Design', 'Jewelry Repair') NOT NULL,
  status ENUM('Pending', 'Approved', 'Rejected', 'Rescheduled') DEFAULT 'Pending',
  notes TEXT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE SET NULL
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS Notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  isRead BOOLEAN DEFAULT FALSE,
  type VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Payments Table
CREATE TABLE IF NOT EXISTS Payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL,
  paymentGateway VARCHAR(255) NOT NULL,
  transactionId VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE
);
