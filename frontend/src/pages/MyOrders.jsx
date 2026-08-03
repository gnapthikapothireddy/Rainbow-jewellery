import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Package, MessageSquare, Download, RotateCcw, AlertTriangle, Search, Filter, SlidersHorizontal, ChevronDown, ChevronUp, Clock, Calendar } from 'lucide-react';

export default function MyOrders() {
  const { user, loading: authLoading } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Expanded card state
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Search & Filter & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.getMyOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, authLoading]);

  // Cancel order handler
  const handleCancelOrder = async (id, orderIdStr) => {
    if (!window.confirm(`Are you sure you want to cancel order #${orderIdStr}?`)) return;
    try {
      const res = await api.cancelOrder(id);
      if (res.success) {
        alert('Order has been cancelled.');
        // Reload list
        const reloadRes = await api.getMyOrders();
        if (reloadRes.success) setOrders(reloadRes.data);
      } else {
        alert(res.message || 'Error cancelling order');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // WhatsApp Contact query builder
  const handleContactWhatsApp = (order) => {
    const ownerNumber = '918919590533';
    const message = `Hello Rainbow Jewelry,

I have a question regarding my order.

Order ID:
${order.orderId}

Customer:
${order.customerName}

Phone:
${order.phone}`;

    const url = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Reorder helper
  const handleReorder = (order) => {
    if (!order.OrderItems || order.OrderItems.length === 0) return;
    order.OrderItems.forEach(item => {
      // Re-fetch product detail structure or pass basic mapping
      addToCart({
        id: item.productId,
        name: item.productName,
        price: parseFloat(item.price),
        discount: 0, // already included in final price
        makingCharges: 0, // already calculated
        images: item.productImage ? [item.productImage] : []
      }, item.quantity);
    });
    alert('Products from this order have been added to your cart.');
    navigate('/cart');
  };

  // Print invoice simulation helper
  const handleDownloadInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    const itemsHtml = order.OrderItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.productName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${parseFloat(item.price).toLocaleString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${parseFloat(item.subtotal).toLocaleString()}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - #${order.orderId}</title>
          <style>
            body { font-family: sans-serif; color: #333; padding: 40px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #111; letter-spacing: 2px; }
            .invoice-title { font-size: 28px; color: #D4AF37; }
            .details { display: flex; justify-content: space-between; margin-bottom: 40px; font-size: 13px; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { background: #f8f8f8; padding: 10px; border-bottom: 2px solid #ddd; font-size: 13px; text-align: left; }
            .total-section { text-align: right; font-size: 15px; line-height: 1.8; }
            .total-amount { font-size: 20px; font-weight: bold; color: #D4AF37; }
            .footer { margin-top: 60px; text-align: center; font-size: 11px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">RAINBOW JEWELRY</div>
              <p>Timeless Luxury Heritage</p>
            </div>
            <div class="invoice-title">INVOICE</div>
          </div>
          
          <div class="details">
            <div>
              <strong>Billed To:</strong><br/>
              Name: ${order.customerName}<br/>
              Phone: ${order.phone}<br/>
              Email: ${order.email || 'N/A'}<br/>
              Address: ${order.address}
            </div>
            <div style="text-align: right;">
              <strong>Invoice Details:</strong><br/>
              Order ID: #${order.orderId}<br/>
              Date: ${new Date(order.created_at || order.createdAt).toLocaleDateString()}<br/>
              Payment Method: ${order.paymentMethod}<br/>
              Status: ${order.status}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="total-section">
            <p>Subtotal: ₹${parseFloat(order.totalAmount).toLocaleString()}</p>
            <p>VAT/GST (Included): 3%</p>
            <p class="total-amount">Total Charged: ₹${parseFloat(order.totalAmount).toLocaleString()}</p>
          </div>

          <div class="footer">
            <p>Thank you for choosing Rainbow Jewelry. Hallmark Certified 22K Gold & Certified VVS Diamonds.</p>
            <p>&copy; ${new Date().getFullYear()} Rainbow Jewelry. All Rights Reserved.</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Status mapping to color badges
  const getStatusBadge = (status) => {
    let bg = 'bg-gray-800 text-gray-300 border-gray-700';
    
    if (status.includes('Pending')) {
      bg = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    } else if (status === 'Confirmed') {
      bg = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    } else if (status === 'Preparing' || status === 'Ready for Dispatch') {
      bg = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    } else if (status === 'Shipped' || status === 'Out for Delivery') {
      bg = 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    } else if (status === 'Delivered') {
      bg = 'bg-green-500/10 text-green-400 border-green-500/20';
    } else if (status === 'Cancelled') {
      bg = 'bg-red-500/10 text-red-400 border-red-500/20';
    }

    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${bg} uppercase tracking-wider`}>
        {status}
      </span>
    );
  };

  // 3. Filtering & Sorting computation
  const filteredOrders = orders
    .filter(order => {
      // Status Filter
      if (statusFilter !== 'All') {
        const orderStatusLower = (order.status || '').toLowerCase();
        const filterLower = statusFilter.toLowerCase();
        
        if (filterLower === 'pending') {
          if (!orderStatusLower.includes('pending')) return false;
        } else if (filterLower === 'shipped') {
          if (orderStatusLower !== 'shipped' && orderStatusLower !== 'out for delivery' && orderStatusLower !== 'ready for dispatch' && orderStatusLower !== 'preparing') return false;
        } else {
          if (orderStatusLower !== filterLower) return false;
        }
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesId = (order.orderId || '').toLowerCase().includes(q);
        const matchesProduct = order.OrderItems && order.OrderItems.some(item => 
          (item.productName || '').toLowerCase().includes(q)
        );
        return matchesId || matchesProduct;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at || a.createdAt) - new Date(b.created_at || b.createdAt);
      }
      if (sortBy === 'highest') {
        return parseFloat(b.totalAmount) - parseFloat(a.totalAmount);
      }
      if (sortBy === 'lowest') {
        return parseFloat(a.totalAmount) - parseFloat(b.totalAmount);
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-10 bg-charcoal w-1/4 rounded"></div>
        {[1, 2].map(i => (
          <div key={i} className="h-44 bg-charcoal rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-playfair font-bold text-white tracking-wide">My Orders</h1>
        <p className="text-xs text-gray-400 mt-1">Track your jewelry orders and view your purchase history.</p>
      </div>

      {/* Control Actions Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by Order ID or Product Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-charcoal border border-gray-800 rounded-xl py-2 px-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold"
          />
        </div>

        {/* Status Filters */}
        <div className="md:col-span-4 flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(filterName => (
            <button
              key={filterName}
              onClick={() => setStatusFilter(filterName)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider transition-all border whitespace-nowrap ${statusFilter === filterName ? 'gold-gradient-bg text-charcoal-dark border-gold' : 'border-gray-800 text-gray-400 hover:text-white bg-charcoal-dark'}`}
            >
              {filterName === 'All' ? 'All Orders' : filterName}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="md:col-span-3 flex items-center justify-end gap-2 text-xs">
          <SlidersHorizontal size={12} className="text-gold" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-charcoal border border-gray-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-gold"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>

      </div>

      {/* Main orders list display */}
      {filteredOrders.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center border border-gray-800 max-w-lg mx-auto space-y-4">
          <div className="text-5xl">📦</div>
          <h3 className="text-lg font-playfair font-bold text-white tracking-wider">No Orders Yet</h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Start shopping to place your first jewelry order.
          </p>
          <div className="pt-2">
            <Link 
              to="/shop" 
              className="inline-block gold-gradient-bg text-charcoal-dark font-bold px-6 py-2.5 rounded-full text-xs hover:scale-105 transition-transform shadow-gold-glow"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => {
            const isExpanded = expandedOrderId === order.id;
            const orderDate = new Date(order.created_at || order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            const orderTime = new Date(order.created_at || order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

            const isOrderPending = (order.status || '').toLowerCase().includes('pending');

            return (
              <div 
                key={order.id} 
                className="glass-card rounded-2xl overflow-hidden border border-gray-800 hover:border-gold/20 transition-all duration-300"
              >
                
                {/* Header card metrics summary */}
                <div className="bg-charcoal-dark/50 px-6 py-4 border-b border-gray-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Order ID</span>
                    <span className="text-white font-semibold text-sm">#{order.orderId}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Placed On</span>
                    <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                      <Calendar size={12} className="text-gold" /> {orderDate}
                      <Clock size={12} className="text-gold ml-1" /> {orderTime}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Grand Total</span>
                    <span className="text-gold font-bold text-sm">₹{parseFloat(order.totalAmount).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-end items-center md:col-span-1 col-span-2">
                    {getStatusBadge(order.status || 'Pending Confirmation')}
                  </div>
                </div>

                {/* Sub-Card Details block */}
                <div className="p-6 space-y-4">
                  
                  {/* Shipping & Payment summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-300 border-b border-gray-850 pb-4">
                    <div>
                      <span className="text-gray-500 block font-semibold mb-1 uppercase text-[9px] tracking-wider">Customer Details</span>
                      <p className="text-white font-medium">{order.customerName}</p>
                      <p className="mt-0.5">{order.phone}</p>
                      {order.email && <p className="text-gray-400 mt-0.5">{order.email}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <span className="text-gray-500 block font-semibold mb-1 uppercase text-[9px] tracking-wider">Delivery Address</span>
                      <p className="leading-relaxed">{order.address}</p>
                      <div className="flex items-center gap-1.5 mt-2 text-gray-400">
                        <span className="font-semibold text-gray-500 uppercase text-[9px] tracking-wider">Payment Method:</span>
                        <span className="text-white font-medium">{order.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  {/* Products Grid list breakdown */}
                  <div className="space-y-4 pt-1">
                    <h4 className="text-[10px] font-bold text-gold uppercase tracking-wider">Ordered Articles</h4>
                    
                    <div className="divide-y divide-gray-850">
                      {order.OrderItems && order.OrderItems.map(item => (
                        <div key={item.id} className="py-3 flex items-center gap-4 text-xs justify-between flex-wrap sm:flex-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg bg-charcoal-dark border border-gray-800 overflow-hidden flex-shrink-0">
                              {item.productImage ? (
                                <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-600 font-bold text-xs">💍</div>
                              )}
                            </div>
                            <div>
                              <p className="text-white font-semibold leading-snug">{item.productName}</p>
                              <p className="text-gray-400 text-[10px] mt-0.5">Quantity: <span className="text-white font-medium">{item.quantity}</span></p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-white font-semibold">₹{parseFloat(item.subtotal).toLocaleString()}</p>
                            <p className="text-gray-500 text-[10px] mt-0.5">@ ₹{parseFloat(item.price).toLocaleString()} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions buttons container bar */}
                  <div className="flex justify-between items-center border-t border-gray-850 pt-4 flex-wrap gap-4 text-xs">
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadInvoice(order)}
                        className="bg-charcoal text-white hover:text-gold border border-gray-800 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download size={13} /> Invoice
                      </button>
                      <button
                        onClick={() => handleContactWhatsApp(order)}
                        className="bg-charcoal text-white hover:text-green-400 border border-gray-800 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MessageSquare size={13} /> Contact WhatsApp
                      </button>
                      <button
                        onClick={() => handleReorder(order)}
                        className="bg-charcoal text-white hover:text-gold border border-gray-800 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw size={13} /> Reorder
                      </button>
                    </div>

                    <div>
                      {isOrderPending && (
                        <button
                          onClick={() => handleCancelOrder(order.id, order.orderId)}
                          className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 font-semibold"
                        >
                          <AlertTriangle size={13} /> Cancel Order
                        </button>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
