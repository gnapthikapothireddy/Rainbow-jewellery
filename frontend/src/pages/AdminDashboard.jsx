import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  TrendingUp, Users, ShoppingBag, AlertTriangle, 
  Trash2, Plus, Calendar, Ticket, Check, X, FileSpreadsheet, FileText 
} from 'lucide-react';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement 
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend, ArcElement
);

export default function AdminDashboard({ activeTab }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Products Tab states
  const [products, setProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '', sku: '', categoryId: 1, description: '', price: '', discount: 0,
    weight: '', purity: '22K Gold', stoneDetails: '', makingCharges: 0, stock: 10,
    images: ['/assets/royal-red-bangles.jpg'], videoUrl: ''
  });

  // Coupons Tab states
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: '', discountType: 'percentage', discountValue: '', minimumOrder: 0, expiryDate: '2027-12-31'
  });

  // Booking states
  const [appointments, setAppointments] = useState([]);
  const [rescheduleData, setRescheduleData] = useState({ id: null, date: '', time: '' });

  // Reviews states
  const [reviews, setReviews] = useState([]);

  // Orders states
  const [orders, setOrders] = useState([]);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.getDashboardStats();
      if (statsRes.success) setStats(statsRes.data);

      const prodRes = await api.getProducts('?limit=50');
      if (prodRes.success) setProducts(prodRes.data.products);

      const appRes = await api.getAllAppointments();
      if (appRes.success) setAppointments(appRes.data);

      const coupRes = await api.getAllCoupons();
      if (coupRes.success) setCoupons(coupRes.data);

      const revRes = await api.getAllReviews();
      if (revRes.success) setReviews(revRes.data);

      const ordRes = await api.getAllOrders();
      if (ordRes.success) setOrders(ordRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  // Product actions
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createProduct(newProd);
      if (res.success) {
        alert('Product created successfully!');
        setShowAddProduct(false);
        setNewProd({
          name: '', sku: '', categoryId: 1, description: '', price: '', discount: 0,
          weight: '', purity: '22K Gold', stoneDetails: '', makingCharges: 0, stock: 10,
          images: ['/assets/royal-red-bangles.jpg'], videoUrl: ''
        });
        loadDashboardData();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        alert('Product deleted!');
        loadDashboardData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateStock = async (id, addedStock) => {
    const p = products.find(prod => prod.id === id);
    if (!p) return;
    const newStock = Math.max(0, p.stock + addedStock);
    try {
      const res = await api.updateProduct(id, { stock: newStock });
      if (res.success) {
        loadDashboardData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Coupon actions
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createCoupon(newCoupon);
      if (res.success) {
        alert('Coupon created!');
        setNewCoupon({ code: '', discountType: 'percentage', discountValue: '', minimumOrder: 0, expiryDate: '2027-12-31' });
        loadDashboardData();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete coupon?')) return;
    try {
      const res = await api.deleteCoupon(id);
      if (res.success) {
        alert('Coupon deleted!');
        loadDashboardData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Appointment actions
  const handleUpdateAppointment = async (id, status) => {
    try {
      const res = await api.updateAppointmentStatus(id, { status });
      if (res.success) {
        alert(`Appointment status updated to ${status}`);
        loadDashboardData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.updateAppointmentStatus(rescheduleData.id, {
        status: 'Rescheduled',
        date: rescheduleData.date,
        time: rescheduleData.time
      });
      if (res.success) {
        alert('Appointment rescheduled!');
        setRescheduleData({ id: null, date: '', time: '' });
        loadDashboardData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Review actions
  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete review comment?')) return;
    try {
      const res = await api.deleteReview(id);
      if (res.success) {
        alert('Review deleted!');
        loadDashboardData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Order status actions
  const handleOrderStatusUpdate = async (id, status) => {
    try {
      const res = await api.updateOrderStatus(id, status);
      if (res.success) {
        alert(`Order status updated to ${status}`);
        loadDashboardData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this order record?')) return;
    try {
      const res = await api.deleteOrder(id);
      if (res.success) {
        alert('Order deleted successfully!');
        loadDashboardData();
      } else {
        alert(res.message || 'Error deleting order');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading admin controllers...</div>;
  }

  // Chart configs
  const doughnutData = {
    labels: ['Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [{
      data: [
        stats.salesByStatus.Confirmed,
        stats.salesByStatus.Packed,
        stats.salesByStatus.Shipped,
        stats.salesByStatus.Delivered,
        stats.salesByStatus.Cancelled
      ],
      backgroundColor: ['#D4AF37', '#AA7C11', '#8C6208', '#22C55E', '#EF4444'],
      borderWidth: 0
    }]
  };

  return (
    <div className="space-y-8 text-xs text-gray-300">
      
      {/* ================= OVERVIEW TAB ================= */}
      {activeTab === 'overview' && (
        <>
          {/* Dashboard Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-5 rounded-2xl border border-gray-800 flex justify-between items-center">
              <div><span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Total Sales Revenue</span><span className="text-xl font-bold text-white mt-1 block">₹{stats.totalRevenue.toLocaleString()}</span></div>
              <div className="p-3 rounded-full bg-gold/10 text-gold"><TrendingUp size={20} /></div>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-gray-800 flex justify-between items-center">
              <div><span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Unique Customers</span><span className="text-xl font-bold text-white mt-1 block">{stats.totalCustomers}</span></div>
              <div className="p-3 rounded-full bg-gold/10 text-gold"><Users size={20} /></div>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-gray-800 flex justify-between items-center">
              <div><span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Order Logs Count</span><span className="text-xl font-bold text-white mt-1 block">{stats.totalOrdersCount}</span></div>
              <div className="p-3 rounded-full bg-gold/10 text-gold"><ShoppingBag size={20} /></div>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-gray-800 flex justify-between items-center">
              <div><span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Stock Warning Alerts</span><span className="text-xl font-bold text-amber-500 mt-1 block">{stats.lowStockCount + stats.outOfStockCount}</span></div>
              <div className="p-3 rounded-full bg-amber-500/10 text-amber-500"><AlertTriangle size={20} /></div>
            </div>
          </div>

          {/* Grid: Charts & Warnings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center">
              <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Orders Distribution</h4>
              <div className="h-48"><Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
            </div>

            <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-gray-800 space-y-4">
              <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Administrative Audit Reports</h4>
              <p>Select format to extract revenue audits, customer rosters, and ledger logs.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href={api.getExcelExportUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-800 hover:border-gold bg-charcoal hover:bg-charcoal-light transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="text-green-500" size={24} />
                  <div>
                    <span className="font-semibold text-white block">Download Excel Spreadsheet</span>
                    <span className="text-[10px] text-gray-500">Order registries, addresses, and calculations</span>
                  </div>
                </a>

                <a 
                  href={api.getPDFExportUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-800 hover:border-gold bg-charcoal hover:bg-charcoal-light transition-all cursor-pointer"
                >
                  <FileText className="text-red-500" size={24} />
                  <div>
                    <span className="font-semibold text-white block">Download PDF Document</span>
                    <span className="text-[10px] text-gray-500">Formatted invoice and sales summary report</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================= PRODUCTS TAB ================= */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold text-white tracking-wide uppercase">Store Catalog Catalog</h3>
            <button 
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="gold-gradient-bg text-charcoal-dark font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 hover:scale-103 transition-transform cursor-pointer"
            >
              <Plus size={14} /> Add Product
            </button>
          </div>

          {/* Add Product Form dropdown drawer */}
          {showAddProduct && (
            <form onSubmit={handleCreateProduct} className="glass-card rounded-2xl p-6 border border-gray-850 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-gray-400">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProd.name}
                  onChange={(e) => setNewProd({...newProd, name: e.target.value})}
                  className="w-full bg-charcoal border border-gray-800 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">SKU Code</label>
                <input
                  type="text"
                  required
                  value={newProd.sku}
                  onChange={(e) => setNewProd({...newProd, sku: e.target.value})}
                  className="w-full bg-charcoal border border-gray-800 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Base Metal Price (₹)</label>
                <input
                  type="number"
                  required
                  value={newProd.price}
                  onChange={(e) => setNewProd({...newProd, price: parseFloat(e.target.value)})}
                  className="w-full bg-charcoal border border-gray-800 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Weight (grams)</label>
                <input
                  type="number"
                  step="0.001"
                  required
                  value={newProd.weight}
                  onChange={(e) => setNewProd({...newProd, weight: parseFloat(e.target.value)})}
                  className="w-full bg-charcoal border border-gray-800 rounded-lg p-2 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Making Charges (₹)</label>
                <input
                  type="number"
                  value={newProd.makingCharges}
                  onChange={(e) => setNewProd({...newProd, makingCharges: parseFloat(e.target.value)})}
                  className="w-full bg-charcoal border border-gray-800 rounded-lg p-2 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Purity Rating</label>
                <input
                  type="text"
                  value={newProd.purity}
                  onChange={(e) => setNewProd({...newProd, purity: e.target.value})}
                  className="w-full bg-charcoal border border-gray-800 rounded-lg p-2 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Inventory Stock Level</label>
                <input
                  type="number"
                  value={newProd.stock}
                  onChange={(e) => setNewProd({...newProd, stock: parseInt(e.target.value)})}
                  className="w-full bg-charcoal border border-gray-800 rounded-lg p-2 text-white"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-gray-400">Stone Specifications / Diamonds details</label>
                <input
                  type="text"
                  placeholder="e.g. 1 Carat Solitaire VVS1"
                  value={newProd.stoneDetails}
                  onChange={(e) => setNewProd({...newProd, stoneDetails: e.target.value})}
                  className="w-full bg-charcoal border border-gray-800 rounded-lg p-2 text-white"
                />
              </div>
              <div className="md:col-span-3 space-y-1">
                <label className="text-gray-400">Product Summary Description</label>
                <textarea
                  rows="3"
                  value={newProd.description}
                  onChange={(e) => setNewProd({...newProd, description: e.target.value})}
                  className="w-full bg-charcoal border border-gray-800 rounded-lg p-2 text-white focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="md:col-span-3 gold-gradient-bg text-charcoal-dark font-bold py-2.5 rounded-xl hover:scale-102 transition-transform cursor-pointer"
              >
                Register Product
              </button>
            </form>
          )}

          {/* Product Listing Table */}
          <div className="glass-card rounded-2xl overflow-x-auto border border-gray-850">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-charcoal border-b border-gray-850">
                  <th className="p-4 font-semibold text-gold uppercase tracking-wider">Product Info</th>
                  <th className="p-4 font-semibold text-gold uppercase tracking-wider">SKU</th>
                  <th className="p-4 font-semibold text-gold uppercase tracking-wider">Valuation</th>
                  <th className="p-4 font-semibold text-gold uppercase tracking-wider">Stock Levels</th>
                  <th className="p-4 font-semibold text-gold uppercase tracking-wider">Adjust stock</th>
                  <th className="p-4 font-semibold text-gold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-gray-850 last:border-0 hover:bg-charcoal/30">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-md border border-gray-800" />
                      <div>
                        <span className="font-semibold text-white block truncate w-48">{p.name}</span>
                        <span className="text-[10px] text-gray-500">{p.purity}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono">{p.sku}</td>
                    <td className="p-4 font-bold text-white">₹{p.price.toLocaleString()}</td>
                    <td className="p-4">
                      {p.stock === 0 ? (
                        <span className="text-red-500 font-bold uppercase bg-red-500/10 px-2 py-0.5 rounded">Out of Stock</span>
                      ) : p.stock < 5 ? (
                        <span className="text-amber-500 font-bold uppercase bg-amber-500/10 px-2 py-0.5 rounded">Low Stock ({p.stock})</span>
                      ) : (
                        <span className="text-green-500 font-bold uppercase bg-green-500/10 px-2 py-0.5 rounded">In Stock ({p.stock})</span>
                      )}
                    </td>
                    <td className="p-4 flex gap-1.5 items-center">
                      <button onClick={() => handleUpdateStock(p.id, 5)} className="bg-charcoal hover:bg-charcoal-light border border-gray-700 px-2 py-1 rounded text-[10px] font-bold text-white">+5</button>
                      <button onClick={() => handleUpdateStock(p.id, -5)} className="bg-charcoal hover:bg-charcoal-light border border-gray-700 px-2 py-1 rounded text-[10px] font-bold text-white">-5</button>
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleDeleteProduct(p.id)} className="text-red-400 hover:text-red-500"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= ORDER LOGS TAB ================= */}
      {activeTab === 'orders' && (() => {
        // Local print invoice helper
        const printOrderInvoice = (order) => {
          const printWindow = window.open('', '_blank');
          const itemsHtml = (order.OrderItems || []).map(item => `
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
                    <p>Timeless Luxury Heritage - Admin Panel</p>
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

        // Filter and search
        const filteredAdminOrders = orders.filter(o => {
          // Status filter
          if (orderStatusFilter !== 'All') {
            const filterLower = orderStatusFilter.toLowerCase();
            const orderStatusLower = (o.status || '').toLowerCase();
            if (filterLower === 'pending') {
              if (!orderStatusLower.includes('pending')) return false;
            } else {
              if (orderStatusLower !== filterLower) return false;
            }
          }

          // Search query
          if (orderSearchQuery.trim() !== '') {
            const q = orderSearchQuery.toLowerCase();
            const matchesId = (o.orderId || '').toLowerCase().includes(q) || String(o.id).includes(q);
            const matchesCustomer = (o.customerName || '').toLowerCase().includes(q) || (o.phone || '').includes(q);
            const matchesProducts = o.OrderItems && o.OrderItems.some(item => 
              (item.productName || '').toLowerCase().includes(q)
            );
            return matchesId || matchesCustomer || matchesProducts;
          }

          return true;
        });

        const getStatusColorClass = (status = '') => {
          if (status.includes('Pending')) return 'text-yellow-500 font-bold';
          if (status === 'Confirmed') return 'text-blue-400 font-bold';
          if (status === 'Preparing' || status === 'Ready for Dispatch') return 'text-purple-400 font-bold';
          if (status === 'Shipped' || status === 'Out for Delivery') return 'text-orange-400 font-bold';
          if (status === 'Delivered') return 'text-green-400 font-bold';
          if (status === 'Cancelled') return 'text-red-400 font-bold';
          return 'text-gray-400';
        };

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h3 className="text-base font-semibold text-white tracking-wide uppercase">Client Purchase Orders</h3>
              
              {/* Controls */}
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="bg-charcoal border border-gray-800 rounded-xl py-1.5 px-3 text-[11px] text-white focus:outline-none focus:border-gold w-48"
                />

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-charcoal border border-gray-800 rounded-xl py-1.5 px-3 text-[11px] text-white focus:outline-none focus:border-gold"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Ready for Dispatch">Ready for Dispatch</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="glass-card rounded-2xl overflow-x-auto border border-gray-850">
              <table className="w-full text-left border-collapse min-w-[1000px] text-xs">
                <thead>
                  <tr className="bg-charcoal border-b border-gray-850 text-gold uppercase tracking-wider text-[10px]">
                    <th className="p-4">ID / Reference</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Address</th>
                    <th className="p-4">Charged Amount</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Order Status</th>
                    <th className="p-4">Adjust Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdminOrders.map(o => (
                    <tr key={o.id} className="border-b border-gray-850 last:border-0 hover:bg-charcoal/30">
                      <td className="p-4">
                        <span className="font-bold text-white block">#{o.orderId}</span>
                        <span className="text-[10px] text-gray-500">{new Date(o.created_at || o.createdAt).toLocaleString('en-IN')}</span>
                      </td>
                      <td className="p-4 leading-normal">
                        <p className="text-white font-medium">{o.customerName}</p>
                        <p className="text-gray-400">{o.phone}</p>
                        {o.email && <p className="text-gray-500 text-[10px]">{o.email}</p>}
                      </td>
                      <td className="p-4 max-w-xs truncate leading-normal" title={o.address}>
                        {o.address}
                      </td>
                      <td className="p-4 font-bold text-white">₹{parseFloat(o.totalAmount).toLocaleString()}</td>
                      <td className="p-4">
                        <span className="bg-charcoal px-2 py-0.5 rounded text-gray-400 font-semibold">{o.paymentMethod}</span>
                      </td>
                      <td className="p-4">
                        <span className={getStatusColorClass(o.status)}>
                          {o.status || 'Pending Confirmation'}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={o.status || 'Pending Confirmation'}
                          onChange={(e) => handleOrderStatusUpdate(o.id, e.target.value)}
                          className="bg-charcoal border border-gray-700 rounded p-1 text-white focus:outline-none text-[10px]"
                        >
                          <option value="Pending Confirmation">Pending Confirmation</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready for Dispatch">Ready for Dispatch</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => printOrderInvoice(o)}
                            className="text-gold hover:text-white"
                            title="Print Invoice"
                          >
                            <FileText size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteOrder(o.id)}
                            className="text-red-400 hover:text-red-500"
                            title="Delete Order"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAdminOrders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-500">
                        No purchase orders matching current query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* ================= APPOINTMENTS APPOINTMENTS TAB ================= */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <h3 className="text-base font-semibold text-white tracking-wide uppercase">Client Consultations</h3>

          {/* Reschedule Calendar overlay box */}
          {rescheduleData.id && (
            <form onSubmit={handleRescheduleSubmit} className="glass-card p-4 rounded-xl border border-gold/30 bg-gold/5 flex flex-wrap gap-4 items-end animate-fade-in text-[10px]">
              <div>
                <label className="text-gray-400 block mb-1">Reschedule Date</label>
                <input type="date" required value={rescheduleData.date} onChange={(e) => setRescheduleData({...rescheduleData, date: e.target.value})} className="bg-charcoal border border-gray-700 rounded p-1.5 text-white" />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Time slot</label>
                <input type="text" required placeholder="e.g. 11:00 AM - 01:00 PM" value={rescheduleData.time} onChange={(e) => setRescheduleData({...rescheduleData, time: e.target.value})} className="bg-charcoal border border-gray-700 rounded p-1.5 text-white" />
              </div>
              <button type="submit" className="gold-gradient-bg text-charcoal-dark font-bold px-4 py-2 rounded-lg">Confirm Reschedule</button>
              <button type="button" onClick={() => setRescheduleData({ id: null, date: '', time: '' })} className="border border-gray-750 text-white px-4 py-2 rounded-lg">Cancel</button>
            </form>
          )}

          <div className="glass-card rounded-2xl overflow-x-auto border border-gray-850">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-charcoal border-b border-gray-850">
                  <th className="p-4 font-semibold text-gold uppercase tracking-wider">Client info</th>
                  <th className="p-4 font-semibold text-gold uppercase tracking-wider">Store Branch</th>
                  <th className="p-4 font-semibold text-gold uppercase tracking-wider">Schedule Info</th>
                  <th className="p-4 font-semibold text-gold uppercase tracking-wider">Purpose</th>
                  <th className="p-4 font-semibold text-gold uppercase tracking-wider">Status</th>
                  <th className="p-4 font-semibold text-gold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a.id} className="border-b border-gray-850 last:border-0 hover:bg-charcoal/30">
                    <td className="p-4">
                      <span className="font-semibold text-white block">{a.name}</span>
                      <span className="text-[10px] text-gray-500">{a.email} | {a.phone}</span>
                    </td>
                    <td className="p-4">{a.branch}</td>
                    <td className="p-4">
                      <span className="font-semibold text-white block">{a.date}</span>
                      <span className="text-[10px] text-gray-500">{a.time}</span>
                    </td>
                    <td className="p-4 font-medium text-white">{a.purpose}</td>
                    <td className="p-4">
                      <span className={`font-bold text-[10px] uppercase ${a.status === 'Approved' ? 'text-green-500' : a.status === 'Rejected' ? 'text-red-500' : 'text-amber-500'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-1.5 items-center">
                      <button onClick={() => handleUpdateAppointment(a.id, 'Approved')} className="p-1 rounded bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white" title="Approve booking"><Check size={14} /></button>
                      <button onClick={() => handleUpdateAppointment(a.id, 'Rejected')} className="p-1 rounded bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white" title="Reject booking"><X size={14} /></button>
                      <button onClick={() => setRescheduleData({ id: a.id, date: a.date, time: a.time })} className="bg-charcoal border border-gray-700 px-2 py-1 rounded text-[10px] text-white">Reschedule</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= COUPONS TAB ================= */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coupon creation form */}
          <div className="glass-card rounded-2xl p-6 border border-gray-800 h-fit space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase flex items-center gap-1.5">
              <Ticket size={16} className="text-gold" /> Create Discount Coupon
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-400">Coupon Code</label>
                <input type="text" required placeholder="e.g. FESTIVAL20" value={newCoupon.code} onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} className="w-full bg-charcoal border border-gray-700 rounded-lg p-2 text-white focus:outline-none uppercase" />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Type</label>
                <select value={newCoupon.discountType} onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value})} className="w-full bg-charcoal border border-gray-700 rounded-lg p-2 text-white focus:outline-none">
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Cash Discount (₹)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Value</label>
                <input type="number" required placeholder="e.g. 15" value={newCoupon.discountValue} onChange={(e) => setNewCoupon({...newCoupon, discountValue: parseFloat(e.target.value)})} className="w-full bg-charcoal border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Minimum Order Requirements (₹)</label>
                <input type="number" value={newCoupon.minimumOrder} onChange={(e) => setNewCoupon({...newCoupon, minimumOrder: parseFloat(e.target.value)})} className="w-full bg-charcoal border border-gray-700 rounded-lg p-2 text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Expiry Date</label>
                <input type="date" required value={newCoupon.expiryDate} onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})} className="w-full bg-charcoal border border-gray-700 rounded-lg p-2 text-white focus:outline-none" />
              </div>

              <button type="submit" className="w-full gold-gradient-bg text-charcoal-dark font-bold py-2.5 rounded-xl hover:scale-102 transition-transform">Create Promo Code</button>
            </form>
          </div>

          {/* Coupon listings */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-gray-800 space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Active Store Coupons</h3>
            
            <div className="space-y-3">
              {coupons.map(c => (
                <div key={c.id} className="bg-charcoal p-4 rounded-xl border border-gray-850 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-gold text-sm block">{c.code}</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">
                      Discount: {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`} | Minimum Order: ₹{c.minimumOrder} | Expiry: {c.expiryDate}
                    </span>
                  </div>
                  <button onClick={() => handleDeleteCoupon(c.id)} className="text-red-400 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ================= REVIEWS MODERATE TAB ================= */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <h3 className="text-base font-semibold text-white tracking-wide uppercase">Audit Reviews & Feedbacks</h3>

          <div className="glass-card rounded-2xl overflow-x-auto border border-gray-850">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-charcoal border-b border-gray-850">
                  <th className="p-4 font-semibold text-gold uppercase tracking-wider">Product Info</th>
                  <th className="p-4 font-semibold text-gold uppercase tracking-wider">Customer</th>
                  <th className="p-4 font-semibold text-gold uppercase tracking-wider">Comment</th>
                  <th className="p-4 font-semibold text-gold uppercase tracking-wider">Rating</th>
                  <th className="p-4 font-semibold text-gold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(r => (
                  <tr key={r.id} className="border-b border-gray-850 last:border-0 hover:bg-charcoal/30">
                    <td className="p-4 font-semibold text-white">{r.Product ? r.Product.name : 'Luxury Article'}</td>
                    <td className="p-4">{r.User ? r.User.name : 'Verified customer'}</td>
                    <td className="p-4 max-w-xs truncate">{r.comment}</td>
                    <td className="p-4 text-gold font-bold">{r.rating}/5</td>
                    <td className="p-4">
                      <button onClick={() => handleDeleteReview(r.id)} className="text-red-400 hover:text-red-500"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
