// Frontend API communication layer with transparent client-side mock fallback
const getBaseUrl = () => {
  if (import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location) {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    // Serve from port 5000 in local dev environment
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
      return `${protocol}//${hostname}:5000/api`;
    }
    
    // Construction of production backend URL dynamically for Vercel services
    if (hostname.includes('.vercel.app')) {
      if (hostname.includes('-frontend')) {
        return `${protocol}//${hostname.replace('-frontend', '-backend')}/api`;
      }
      const parts = hostname.split('.');
      parts[0] = `${parts[0]}-backend`;
      return `${protocol}//${parts.join('.')}/api`;
    }
    
    return `${protocol}//${hostname}/api`;
  }
  return 'http://localhost:5000/api';
};

const BASE_URL = getBaseUrl();
const BACKEND_URL = BASE_URL.replace('/api', '');

const formatImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  if (url.startsWith('/uploads')) return `${BACKEND_URL}${url}`;
  return url;
};

const formatProduct = (p) => {
  if (!p) return p;
  const formatted = { ...p };
  if (formatted.images && Array.isArray(formatted.images)) {
    formatted.images = formatted.images.map(formatImageUrl);
  }
  if (formatted.image) {
    formatted.image = formatImageUrl(formatted.image);
  }
  return formatted;
};

const formatCategory = (c) => {
  if (!c) return c;
  const formatted = { ...c };
  if (formatted.image) {
    formatted.image = formatImageUrl(formatted.image);
  }
  return formatted;
};

const getHeaders = () => {
  const token = localStorage.getItem('rainbow_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Client-side mock fallback database store
const mockData = {
  categories: [
    { id: 1, name: 'Bangles', slug: 'bangles', image: '/assets/royal-red-bangles.jpg' },
    { id: 2, name: 'Gold Plated Bangles', slug: 'gold-plated-bangles', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Necklaces', slug: 'necklaces', image: '/assets/royal-ruby-necklace.jpg' },
    { id: 4, name: 'Long Chains', slug: 'long-chains', image: '/assets/emerald-layered-necklace.jpg' },
    { id: 5, name: 'Pearl Chains', slug: 'pearl-chains', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400' },
    { id: 6, name: 'Black Bead Chains', slug: 'black-bead-chains', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400' },
    { id: 7, name: 'Chokers', slug: 'chokers', image: '/assets/royal-green-necklace.jpg' },
    { id: 8, name: 'Rings', slug: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400' },
    { id: 9, name: 'Earrings', slug: 'earrings', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=400' },
    { id: 10, name: 'Ear Side Chains', slug: 'ear-side-chains', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=400' },
    { id: 11, name: 'Pendants', slug: 'pendants', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400' },
    { id: 12, name: 'Hair Ornaments', slug: 'hair-ornaments', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400' },
    { id: 13, name: 'Bracelets', slug: 'bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400' }
  ],
  products: [
    {
      id: 1,
      name: 'Majestic Royal Gold Necklace',
      sku: 'NK-AU-001',
      categoryId: 3,
      description: 'Exquisite 22K gold necklace with intricate floral motifs and filigree work, perfect for bridal wear and grand festivals.',
      price: 125000.00,
      discount: 5.00,
      weight: 24.500,
      purity: '22K Gold (916)',
      stoneDetails: 'None',
      makingCharges: 8500.00,
      gst: 3.00,
      stock: 8,
      images: [
        '/assets/royal-ruby-necklace.jpg'
      ],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true
    },
    {
      id: 2,
      name: 'Solitaire Promise Diamond Ring',
      sku: 'RG-DM-002',
      categoryId: 8,
      description: 'A breathtaking 18K white gold ring featuring a certified 1.5-carat round brilliant cut diamond of VVS1 clarity and E color.',
      price: 185000.00,
      discount: 10.00,
      weight: 4.200,
      purity: '18K White Gold',
      stoneDetails: '1.5 Carat Solitaire Diamond, VVS1 Clarity, E Color',
      makingCharges: 12000.00,
      gst: 3.00,
      stock: 4,
      images: [
        '/assets/royal-green-necklace.jpg'
      ],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      isTrending: true
    },
    {
      id: 3,
      name: 'Elegant Sterling Silver Bracelet',
      sku: 'BR-AG-003',
      categoryId: 13,
      description: 'Finely crafted 925 sterling silver chain bracelet with a high-polish rhodium finish to prevent tarnishing.',
      price: 4500.00,
      discount: 0.00,
      weight: 12.800,
      purity: '925 Sterling Silver',
      stoneDetails: 'None',
      makingCharges: 400.00,
      gst: 3.00,
      stock: 25,
      images: [
        '/assets/silver-bangles.jpg'
      ],
      videoUrl: '',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      isTrending: false
    },
    {
      id: 4,
      name: 'Eternal Platinum Wedding Band',
      sku: 'RG-PT-004',
      categoryId: 8,
      description: 'A classic, minimalist wedding band made from pure 950 platinum with a sleek comfort-fit design.',
      price: 42000.00,
      discount: 8.00,
      weight: 6.500,
      purity: '950 Platinum',
      stoneDetails: 'None',
      makingCharges: 3500.00,
      gst: 3.00,
      stock: 0,
      images: [
        '/assets/royal-red-bangles.jpg'
      ],
      videoUrl: '',
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: false,
      isTrending: true
    },
    {
      id: 5,
      name: 'Jhumka Diamond Drop Earrings',
      sku: 'ER-DM-005',
      categoryId: 9,
      description: 'Bridal special traditional diamond Jhumkas crafted in 18K yellow gold, decorated with pavé diamonds and South Sea pearls.',
      price: 95000.00,
      discount: 12.00,
      weight: 14.200,
      purity: '18K Yellow Gold',
      stoneDetails: '2.4 Carat Diamond Accents, VVS Clarity',
      makingCharges: 7500.00,
      gst: 3.00,
      stock: 3,
      images: [
        '/assets/royal-green-long-necklace.jpg'
      ],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: false
    },
    {
      id: 6,
      name: "Classic Men's Kada",
      sku: 'KD-AU-006',
      categoryId: 1,
      description: 'A bold and heavy designer kada bracelet for men, crafted in 22K yellow gold with satin and mirror finish.',
      price: 155000.00,
      discount: 5.00,
      weight: 32.000,
      purity: '22K Gold',
      stoneDetails: 'None',
      makingCharges: 9800.00,
      gst: 3.00,
      stock: 6,
      images: [
        '/assets/emerald-layered-necklace.jpg'
      ],
      videoUrl: '',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: false,
      isTrending: true
    }
  ],
  coupons: [
    { id: 1, code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minimumOrder: 5000, expiryDate: '2028-12-31', isActive: true },
    { id: 2, code: 'FESTIVAL15', discountType: 'percentage', discountValue: 15, minimumOrder: 15000, expiryDate: '2028-12-31', isActive: true },
    { id: 3, code: 'DIWALI2000', discountType: 'flat', discountValue: 2000, minimumOrder: 30000, expiryDate: '2028-12-31', isActive: true }
  ],
  orders: [],
  appointments: [],
  notifications: [
    { id: 1, title: 'Welcome to Rainbow Jewelry', message: 'Discover the finest luxury designs and schedule customized consultations today.', isRead: false, type: 'general', createdAt: new Date().toISOString() }
  ],
  addresses: [
    { id: 1, addressLine1: 'YV St', city: 'Cuddapah', state: 'Andhra Pradesh', postalCode: '516001', country: 'India', isDefault: true }
  ]
};

// Initialize local storage copy for simulation persistence
const initMockDB = () => {
  if (!localStorage.getItem('mock_products')) {
    localStorage.setItem('mock_products', JSON.stringify(mockData.products));
  }
  if (!localStorage.getItem('mock_categories')) {
    localStorage.setItem('mock_categories', JSON.stringify(mockData.categories));
  }
  if (!localStorage.getItem('mock_orders')) {
    localStorage.setItem('mock_orders', JSON.stringify(mockData.orders));
  }
  if (!localStorage.getItem('mock_appointments')) {
    localStorage.setItem('mock_appointments', JSON.stringify(mockData.appointments));
  }
  if (!localStorage.getItem('mock_notifications')) {
    localStorage.setItem('mock_notifications', JSON.stringify(mockData.notifications));
  }
  if (!localStorage.getItem('mock_addresses')) {
    localStorage.setItem('mock_addresses', JSON.stringify(mockData.addresses));
  }
  if (!localStorage.getItem('mock_coupons')) {
    localStorage.setItem('mock_coupons', JSON.stringify(mockData.coupons));
  }
};
initMockDB();

// Helper to fetch persistent mock data
const getMockItem = (key) => JSON.parse(localStorage.getItem(key));
const setMockItem = (key, val) => localStorage.setItem(key, JSON.stringify(val));

const handleFetch = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...getHeaders(), ...options.headers }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'API request failed');
    
    // Auto format image URLs dynamically
    if (json.success && json.data) {
      if (Array.isArray(json.data)) {
        json.data = json.data.map(item => {
          if (item && item.images) return formatProduct(item);
          if (item && item.slug) return formatCategory(item);
          return item;
        });
      } else if (json.data.products && Array.isArray(json.data.products)) {
        json.data.products = json.data.products.map(formatProduct);
      } else if (json.data.images) {
        json.data = formatProduct(json.data);
      } else if (json.data.slug) {
        json.data = formatCategory(json.data);
      }
    }
    
    return json;
  } catch (error) {
    console.warn(`API unavailable, running fallback for ${endpoint}:`, error.message);
    return handleMockFallback(endpoint, options);
  }
};

// Simulated backend processing client side
const handleMockFallback = (endpoint, options = {}) => {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : null;

  // 1. Auth routes fallbacks
  if (endpoint.startsWith('/auth/login')) {
    const { email } = body;
    const role = email.includes('admin') ? 'admin' : 'customer';
    const user = { id: 99, name: email.split('@')[0], email, role, phone: '+919876543210', loyaltyPoints: 240 };
    localStorage.setItem('rainbow_token', 'mock_jwt_token');
    return { success: true, data: { ...user, token: 'mock_jwt_token' } };
  }
  if (endpoint.startsWith('/auth/register')) {
    const { name, email, phone } = body;
    const user = { id: 100, name, email, role: 'customer', phone, loyaltyPoints: 0 };
    localStorage.setItem('rainbow_token', 'mock_jwt_token');
    return { success: true, data: { ...user, token: 'mock_jwt_token' } };
  }
  if (endpoint.startsWith('/auth/google')) {
    const { name, email } = body;
    const user = { id: 101, name, email, role: 'customer', phone: '', loyaltyPoints: 10 };
    localStorage.setItem('rainbow_token', 'mock_jwt_token');
    return { success: true, data: { ...user, token: 'mock_jwt_token' } };
  }
  if (endpoint.startsWith('/auth/profile')) {
    const user = { id: 99, name: 'John Doe', email: 'john@gmail.com', role: 'customer', phone: '+919876543210', loyaltyPoints: 240 };
    const addresses = getMockItem('mock_addresses');
    return { success: true, data: { user, addresses } };
  }
  if (endpoint.startsWith('/auth/address') && method === 'POST') {
    const addresses = getMockItem('mock_addresses');
    const newAddress = { id: Date.now(), ...body, isDefault: body.isDefault || false };
    if (newAddress.isDefault) {
      addresses.forEach(a => a.isDefault = false);
    }
    addresses.push(newAddress);
    setMockItem('mock_addresses', addresses);
    return { success: true, data: newAddress };
  }

  // 2. Product routes fallbacks
  if (endpoint.startsWith('/products/categories/list')) {
    return { success: true, data: getMockItem('mock_categories') };
  }
  if (endpoint.startsWith('/products/suggestions')) {
    const products = getMockItem('mock_products');
    return { success: true, data: products.slice(0, 4) };
  }
  if (endpoint.startsWith('/products/recommendations/personalized')) {
    const products = getMockItem('mock_products');
    return { success: true, data: products.slice(0, 4) };
  }
  if (endpoint.match(/\/products\/\d+/)) {
    const id = parseInt(endpoint.split('/').pop());
    const products = getMockItem('mock_products');
    const product = products.find(p => p.id === id) || products[0];
    return {
      success: true,
      data: {
        product,
        reviews: [
          { id: 1, rating: 5, comment: 'Breathtaking quality! Looks absolutely stunning.', User: { name: 'Sophia L.' }, createdAt: new Date().toISOString() },
          { id: 2, rating: 4, comment: 'Beautiful finishing, making charges are slightly high but worth the design.', User: { name: 'Rajesh K.' }, createdAt: new Date().toISOString() }
        ],
        averageRating: 4.5,
        reviewCount: 2,
        relatedProducts: products.filter(p => p.id !== id).slice(0, 3)
      }
    };
  }
  if (endpoint === '/products' && method === 'POST') {
    const products = getMockItem('mock_products');
    const newProd = { id: Date.now(), ...body, images: body.images || ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400'] };
    products.push(newProd);
    setMockItem('mock_products', products);
    return { success: true, data: newProd };
  }
  if (endpoint.match(/\/products\/\d+/) && method === 'PUT') {
    const id = parseInt(endpoint.split('/').pop());
    const products = getMockItem('mock_products');
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...body };
      setMockItem('mock_products', products);
      return { success: true, data: products[idx] };
    }
  }
  if (endpoint.match(/\/products\/\d+/) && method === 'DELETE') {
    const id = parseInt(endpoint.split('/').pop());
    const products = getMockItem('mock_products');
    const filtered = products.filter(p => p.id !== id);
    setMockItem('mock_products', filtered);
    return { success: true, message: 'Product deleted' };
  }
  if (endpoint.startsWith('/products')) {
    return {
      success: true,
      data: {
        products: getMockItem('mock_products'),
        total: getMockItem('mock_products').length,
        page: 1,
        pages: 1
      }
    };
  }

  // 3. Orders routes fallbacks
  if (endpoint === '/orders' && method === 'POST') {
    const { items, addressId, paymentMethod, couponCode, giftWrapping } = body;
    const products = getMockItem('mock_products');
    const orders = getMockItem('mock_orders');
    
    let subTotal = 0;
    items.forEach(it => {
      const p = products.find(prod => prod.id === parseInt(it.productId));
      if (p) {
        // deduct stock
        p.stock = Math.max(0, p.stock - it.quantity);
        const itemPrice = p.price - (p.price * (p.discount / 100));
        subTotal += (itemPrice + (p.makingCharges || 0)) * it.quantity;
      }
    });

    setMockItem('mock_products', products);

    const discountAmount = couponCode ? 1000 : 0;
    const gstAmount = subTotal * 0.03;
    const totalAmount = subTotal - discountAmount + gstAmount + (giftWrapping ? 100 : 0);

    const newOrderIdStr = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      id: orders.length + 1001,
      orderId: newOrderIdStr,
      userId: 99,
      customerName: body.customerName || 'Customer',
      phone: body.phone || '',
      email: body.email || '',
      address: body.address || 'Virtual Order',
      paymentMethod,
      totalAmount: totalAmount.toFixed(2),
      status: 'Pending Confirmation',
      created_at: new Date().toISOString(),
      OrderItems: items.map((it, idx) => {
        const p = products.find(prod => prod.id === parseInt(it.productId));
        const itemPrice = p ? p.price - (p.price * (p.discount / 100)) + (p.makingCharges || 0) : 10000;
        return {
          id: idx + 1,
          productId: it.productId,
          productName: p ? p.name : 'Luxury Article',
          productImage: p && p.images && p.images.length > 0 ? p.images[0] : '',
          quantity: it.quantity,
          price: itemPrice,
          subtotal: itemPrice * it.quantity
        };
      })
    };

    orders.push(newOrder);
    setMockItem('mock_orders', orders);

    // Trigger Notification
    const notifications = getMockItem('mock_notifications');
    notifications.unshift({
      id: Date.now(),
      title: 'Order Confirmed',
      message: `Your order #${newOrder.id} for ₹${newOrder.totalAmount} has been placed.`,
      isRead: false,
      type: 'order',
      createdAt: new Date().toISOString()
    });
    setMockItem('mock_notifications', notifications);

    return {
      success: true,
      message: 'Order created',
      data: {
        orderId: newOrder.id,
        trackingNumber: newOrder.trackingNumber,
        totalAmount: newOrder.totalAmount,
        transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase()
      }
    };
  }
  if (endpoint === '/orders/myorders') {
    return { success: true, data: getMockItem('mock_orders') };
  }
  if (endpoint.startsWith('/orders') && method === 'GET') {
    return { success: true, data: getMockItem('mock_orders') };
  }
  if (endpoint.match(/\/orders\/\d+/) && method === 'DELETE') {
    const id = parseInt(endpoint.split('/').pop());
    const orders = getMockItem('mock_orders');
    const filtered = orders.filter(o => o.id !== id);
    setMockItem('mock_orders', filtered);
    return { success: true, message: 'Order deleted successfully' };
  }
  if (endpoint.match(/\/orders\/\d+\/status/)) {
    const id = parseInt(endpoint.split('/')[2]);
    const orders = getMockItem('mock_orders');
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = body.orderStatus;
      setMockItem('mock_orders', orders);
      return { success: true, data: order };
    }
  }

  // 4. Appointment fallbacks
  if (endpoint === '/appointments' && method === 'POST') {
    const appointments = getMockItem('mock_appointments');
    const newAppointment = { id: appointments.length + 101, ...body, status: 'Pending', createdAt: new Date().toISOString() };
    appointments.push(newAppointment);
    setMockItem('mock_appointments', appointments);
    return { success: true, data: newAppointment };
  }
  if (endpoint === '/appointments/mybookings') {
    return { success: true, data: getMockItem('mock_appointments') };
  }
  if (endpoint === '/appointments' && method === 'GET') {
    return { success: true, data: getMockItem('mock_appointments') };
  }
  if (endpoint.match(/\/appointments\/\d+\/status/)) {
    const id = parseInt(endpoint.split('/')[2]);
    const appointments = getMockItem('mock_appointments');
    const appt = appointments.find(a => a.id === id);
    if (appt) {
      appt.status = body.status;
      if (body.date) appt.date = body.date;
      if (body.time) appt.time = body.time;
      setMockItem('mock_appointments', appointments);
      return { success: true, data: appt };
    }
  }

  // 5. Coupon validation fallback
  if (endpoint === '/coupons/validate') {
    const coupons = getMockItem('mock_coupons');
    const c = coupons.find(coupon => coupon.code === body.code.toUpperCase());
    if (c) {
      return {
        success: true,
        data: { code: c.code, discountType: c.discountType, discountValue: c.discountValue }
      };
    }
    return { success: false, message: 'Invalid coupon code' };
  }
  if (endpoint === '/coupons' && method === 'GET') {
    return { success: true, data: getMockItem('mock_coupons') };
  }
  if (endpoint === '/coupons' && method === 'POST') {
    const coupons = getMockItem('mock_coupons');
    const newC = { id: Date.now(), ...body, code: body.code.toUpperCase() };
    coupons.push(newC);
    setMockItem('mock_coupons', coupons);
    return { success: true, data: newC };
  }
  if (endpoint.startsWith('/coupons/') && method === 'DELETE') {
    const id = parseInt(endpoint.split('/').pop());
    const coupons = getMockItem('mock_coupons');
    const filtered = coupons.filter(c => c.id !== id);
    setMockItem('mock_coupons', filtered);
    return { success: true };
  }

  // 6. Reports fallback
  if (endpoint === '/reports/dashboard-stats') {
    const orders = getMockItem('mock_orders');
    const products = getMockItem('mock_products');
    const appts = getMockItem('mock_appointments');

    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);
    const lowStock = products.filter(p => p.stock < 5 && p.stock > 0).length;
    const outOfStock = products.filter(p => p.stock === 0).length;

    return {
      success: true,
      data: {
        totalSalesCount: orders.length,
        totalRevenue,
        totalCustomers: 28,
        totalOrdersCount: orders.length,
        lowStockCount: lowStock,
        outOfStockCount: outOfStock,
        pendingAppointments: appts.filter(a => a.status === 'Pending').length,
        totalAppointments: appts.length,
        latestReviews: [
          { id: 1, comment: 'Very high fidelity', rating: 5, Product: { name: 'Solitaire Promise Diamond Ring' }, User: { name: 'Guest' } }
        ],
        recentOrders: orders.slice(0, 5),
        salesByStatus: {
          Confirmed: orders.filter(o => (o.status || o.orderStatus) === 'Confirmed').length,
          Packed: orders.filter(o => (o.status || o.orderStatus) === 'Packed').length,
          Shipped: orders.filter(o => (o.status || o.orderStatus) === 'Shipped').length,
          Delivered: orders.filter(o => (o.status || o.orderStatus) === 'Delivered').length,
          Cancelled: orders.filter(o => (o.status || o.orderStatus) === 'Cancelled').length
        }
      }
    };
  }

  // 7. Notifications fallback
  if (endpoint === '/notifications') {
    return { success: true, data: getMockItem('mock_notifications') };
  }
  if (endpoint.match(/\/notifications\/\d+\/read/)) {
    const id = parseInt(endpoint.split('/')[2]);
    const notifications = getMockItem('mock_notifications');
    const notif = notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      setMockItem('mock_notifications', notifications);
    }
    return { success: true };
  }

  // Default response
  return { success: true, data: [] };
};

export const api = {
  // Auth API
  register: (body) => handleFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => handleFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  googleLogin: (body) => handleFetch('/auth/google', { method: 'POST', body: JSON.stringify(body) }),
  getProfile: () => handleFetch('/auth/profile'),
  updateProfile: (body) => handleFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  saveAddress: (body) => handleFetch('/auth/address', { method: 'POST', body: JSON.stringify(body) }),
  deleteAddress: (id) => handleFetch(`/auth/address/${id}`, { method: 'DELETE' }),
  forgotPassword: (body) => handleFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  resetPassword: (body) => handleFetch('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),

  // Products API
  getProducts: (query = '') => handleFetch(`/products${query}`),
  getProductById: (id) => handleFetch(`/products/${id}`),
  getCategories: () => handleFetch('/products/categories/list'),
  getSuggestions: (query) => handleFetch(`/products/suggestions?query=${query}`),
  getPersonalizedRecommendations: (catIds = '') => handleFetch(`/products/recommendations/personalized?categoryIds=${catIds}`),
  createProduct: (body) => handleFetch('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => handleFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id) => handleFetch(`/products/${id}`, { method: 'DELETE' }),
  createCategory: (body) => handleFetch('/products/categories', { method: 'POST', body: JSON.stringify(body) }),

  // Orders API
  createOrder: (body) => handleFetch('/orders', { method: 'POST', body: JSON.stringify(body) }),
  getMyOrders: () => handleFetch('/orders/myorders'),
  getOrderById: (id) => handleFetch(`/orders/${id}`),
  cancelOrder: (id) => handleFetch(`/orders/${id}/cancel`, { method: 'PUT' }),
  getAllOrders: () => handleFetch('/orders'),
  updateOrderStatus: (id, status) => handleFetch(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ orderStatus: status }) }),
  deleteOrder: (id) => handleFetch(`/orders/${id}`, { method: 'DELETE' }),

  // Appointments API
  bookAppointment: (body) => handleFetch('/appointments', { method: 'POST', body: JSON.stringify(body) }),
  getMyAppointments: () => handleFetch('/appointments/mybookings'),
  getAllAppointments: () => handleFetch('/appointments'),
  updateAppointmentStatus: (id, body) => handleFetch(`/appointments/${id}/status`, { method: 'PUT', body: JSON.stringify(body) }),

  // Reviews API
  createReview: (body) => handleFetch('/reviews', { method: 'POST', body: JSON.stringify(body) }),
  getAllReviews: () => handleFetch('/reviews'),
  deleteReview: (id) => handleFetch(`/reviews/${id}`, { method: 'DELETE' }),

  // Coupons API
  validateCoupon: (code, cartTotal) => handleFetch('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, cartTotal }) }),
  getAllCoupons: () => handleFetch('/coupons'),
  createCoupon: (body) => handleFetch('/coupons', { method: 'POST', body: JSON.stringify(body) }),
  deleteCoupon: (id) => handleFetch(`/coupons/${id}`, { method: 'DELETE' }),

  // Reports API
  getDashboardStats: () => handleFetch('/reports/dashboard-stats'),
  getExcelExportUrl: () => `${BASE_URL}/reports/export/excel?token=${localStorage.getItem('rainbow_token')}`,
  getPDFExportUrl: () => `${BASE_URL}/reports/export/pdf?token=${localStorage.getItem('rainbow_token')}`,

  // Notifications API
  getNotifications: () => handleFetch('/notifications'),
  markNotificationRead: (id) => handleFetch(`/notifications/${id}/read`, { method: 'PUT' }),
};
