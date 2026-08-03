import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';

// Layout Wrappers
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Categories from './pages/Categories';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import CustomerProfile from './pages/CustomerProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import BookAppointment from './pages/BookAppointment';
import ContactUs from './pages/ContactUs';
import Reviews from './pages/Reviews';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ReturnPolicy from './pages/ReturnPolicy';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <NotificationProvider>
              <Routes>
                
                {/* Public Shop routes inside MainLayout */}
                <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                <Route path="/shop" element={<MainLayout><Shop /></MainLayout>} />
                <Route path="/categories" element={<MainLayout><Categories /></MainLayout>} />
                <Route path="/product/:id" element={<MainLayout><ProductDetails /></MainLayout>} />
                <Route path="/wishlist" element={<MainLayout><Wishlist /></MainLayout>} />
                <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
                <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
                <Route path="/order-success" element={<MainLayout><OrderSuccess /></MainLayout>} />
                <Route path="/my-orders" element={<MainLayout><MyOrders /></MainLayout>} />
                <Route path="/order-history" element={<MainLayout><MyOrders /></MainLayout>} />
                <Route path="/profile" element={<MainLayout><CustomerProfile /></MainLayout>} />
                <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
                <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
                <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
                <Route path="/book-appointment" element={<MainLayout><BookAppointment /></MainLayout>} />
                <Route path="/contact" element={<MainLayout><ContactUs /></MainLayout>} />
                <Route path="/reviews" element={<MainLayout><Reviews /></MainLayout>} />
                <Route path="/faq" element={<MainLayout><FAQ /></MainLayout>} />
                <Route path="/privacy-policy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
                <Route path="/return-policy" element={<MainLayout><ReturnPolicy /></MainLayout>} />

                {/* Admin Auth Route */}
                <Route path="/admin-login" element={<AdminLogin />} />

                {/* Admin Control Panel Routes inside AdminLayout */}
                <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard activeTab="overview" /></AdminLayout>} />
                <Route path="/admin/products" element={<AdminLayout><AdminDashboard activeTab="products" /></AdminLayout>} />
                <Route path="/admin/orders" element={<AdminLayout><AdminDashboard activeTab="orders" /></AdminLayout>} />
                <Route path="/admin/appointments" element={<AdminLayout><AdminDashboard activeTab="appointments" /></AdminLayout>} />
                <Route path="/admin/coupons" element={<AdminLayout><AdminDashboard activeTab="coupons" /></AdminLayout>} />
                <Route path="/admin/reviews" element={<AdminLayout><AdminDashboard activeTab="reviews" /></AdminLayout>} />

              </Routes>
            </NotificationProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
