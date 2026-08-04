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
    { id: 2, name: 'Gold Plated Bangles', slug: 'gold-plated-bangles', image: '/assets/silver-bangles.jpg' },
    { id: 3, name: 'Necklaces', slug: 'necklaces', image: '/assets/royal-ruby-necklace.jpg' },
    { id: 4, name: 'Long Chains', slug: 'long-chains', image: '/assets/emerald-layered-necklace.jpg' },
    { id: 5, name: 'Pearl Chains', slug: 'pearl-chains', image: '/assets/classic-pearl-necklace.jpg' },
    { id: 6, name: 'Black Bead Chains', slug: 'black-bead-chains', image: '/assets/royal-green-long-necklace.jpg' },
    { id: 7, name: 'Chokers', slug: 'chokers', image: '/assets/royal-green-necklace.jpg' },
    { id: 8, name: 'Rings', slug: 'rings', image: '/assets/royal-red-bangles.jpg' },
    { id: 9, name: 'Earrings', slug: 'earrings', image: '/assets/royal-ruby-necklace.jpg' },
    { id: 10, name: 'Ear Side Chains', slug: 'ear-side-chains', image: '/assets/royal-ruby-necklace.jpg' },
    { id: 11, name: 'Pendants', slug: 'pendants', image: '/assets/royal-green-necklace.jpg' },
    { id: 12, name: 'Hair Ornaments', slug: 'hair-ornaments', image: '/assets/emerald-layered-necklace.jpg' },
    { id: 13, name: 'Bracelets', slug: 'bracelets', image: '/assets/silver-bangles.jpg' }
  ],
  products: [
    {
      id: 1,
      name: 'Elegant Silver Designer Bangles',
      sku: 'BG-SV-007',
      categoryId: 1,
      description: 'Enhance your style with these Elegant Silver Designer Bangles featuring a beautiful lattice floral design. Made with a premium silver finish, these bangles are lightweight, durable, and comfortable for all-day wear. Their elegant craftsmanship makes them suitable for casual wear, festivals, weddings, parties, and special occasions. A perfect combination of traditional beauty and modern elegance.',
      price: 150.00,
      discount: 0.00,
      weight: 18.000,
      purity: 'Premium Silver Finish',
      stoneDetails: 'None',
      makingCharges: 0.00,
      gst: 0.00,
      stock: 50,
      images: ['/assets/silver-bangles.jpg'],
      videoUrl: '',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      collection: 'Silver Bangles',
      rating: 4.9
    },
    {
      id: 2,
      name: 'Royal Red Bridal Bangle Set',
      sku: 'BG-SV-008',
      categoryId: 1,
      description: 'Enhance your bridal look with this stunning Royal Red Bridal Bangle Set. Featuring elegant red, gold, and crystal detailing, this beautifully crafted set is perfect for weddings, festive occasions, and traditional celebrations. Designed with premium-quality materials, these bangles provide both comfort and timeless elegance.',
      price: 1010.00,
      discount: 0.00,
      weight: 22.000,
      purity: 'Premium Quality Materials',
      stoneDetails: 'Gold & Crystal Detailing',
      makingCharges: 0.00,
      gst: 0.00,
      stock: 25,
      images: ['/assets/royal-red-bangles.jpg'],
      videoUrl: '',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      collection: 'Bangles',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Emerald Green Bridal Bangle Set',
      sku: 'BG-SV-009',
      categoryId: 1,
      description: 'Celebrate every special occasion with this elegant Emerald Green Bridal Bangle Set. Adorned with sparkling stones, pearl accents, and hanging jhumka charms, this luxurious set beautifully complements bridal and festive attire while adding a royal touch to your look.',
      price: 1350.00,
      discount: 0.00,
      weight: 28.000,
      purity: 'Premium Quality Materials',
      stoneDetails: 'Sparkling Stones & Pearl Accents',
      makingCharges: 0.00,
      gst: 0.00,
      stock: 30,
      images: ['/assets/emerald-green-bangles.jpg'],
      videoUrl: '',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      collection: 'Bangles',
      rating: 4.9
    },
    {
      id: 4,
      name: 'Royal Black Designer Bangle Set',
      sku: 'BG-SV-010',
      categoryId: 1,
      description: 'Make a bold fashion statement with the Royal Black Designer Bangle Set. Featuring an elegant combination of black beads, intricate gold detailing, and pearl jhumka charms, this premium set is ideal for weddings, parties, festive occasions, and ethnic wear.',
      price: 940.00,
      discount: 0.00,
      weight: 26.000,
      purity: 'Premium Quality Materials',
      stoneDetails: 'Black Beads & Pearl Jhumkas',
      makingCharges: 0.00,
      gst: 0.00,
      stock: 20,
      images: ['/assets/royal-black-bangles.jpg'],
      videoUrl: '',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      collection: 'Bangles',
      rating: 4.8
    },
    {
      id: 5,
      name: 'Elegant Pink Bridal Bangle Set',
      sku: 'BG-SV-011',
      categoryId: 1,
      description: 'Bring elegance to your jewelry collection with this Elegant Pink Bridal Bangle Set. Crafted with sparkling stones and beautifully arranged pink bangles, this premium set is perfect for bridal wear, festivals, engagement ceremonies, and special celebrations.',
      price: 1370.00,
      discount: 0.00,
      weight: 24.000,
      purity: 'Premium Quality Materials',
      stoneDetails: 'Sparkling Stones',
      makingCharges: 0.00,
      gst: 0.00,
      stock: 15,
      images: ['/assets/elegant-pink-bangles.jpg'],
      videoUrl: '',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      collection: 'Bangles',
      rating: 4.9
    },
    {
      id: 6,
      name: 'Crystal Green Glass Bangle Set',
      sku: 'BG-SV-012',
      categoryId: 1,
      description: 'Add a graceful touch to your outfit with the Crystal Green Glass Bangle Set. Designed with premium glass bangles and sparkling crystal-studded borders, this lightweight and stylish set is perfect for daily wear, traditional functions, festive occasions, and gifting.',
      price: 350.00,
      discount: 0.00,
      weight: 15.000,
      purity: 'Premium Quality Glass',
      stoneDetails: 'Crystal borders',
      makingCharges: 0.00,
      gst: 0.00,
      stock: 40,
      images: ['/assets/crystal-green-bangles.jpg'],
      videoUrl: '',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      collection: 'Bangles',
      rating: 4.8
    },
    {
      id: 7,
      name: 'Royal Green Bridal Necklace Set',
      sku: 'NC-SV-001',
      categoryId: 7,
      description: 'Make every celebration unforgettable with this Royal Green Bridal Necklace Set. Featuring intricate antique gold craftsmanship, elegant green bead drops, sparkling stones, and matching jhumka earrings, this luxurious set is perfect for weddings, receptions, festivals, and traditional occasions. Designed to add a royal touch to every outfit.',
      price: 4450.00,
      discount: 0.00,
      weight: 45.000,
      purity: 'Antique Gold Craftsmanship',
      stoneDetails: 'Green Bead Drops & Sparkling Stones',
      makingCharges: 0.00,
      gst: 3.00,
      stock: 10,
      images: ['/assets/royal-green-necklace.jpg'],
      videoUrl: '',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      collection: 'Chokers',
      rating: 4.9
    },
    {
      id: 8,
      name: 'Elegant Pink Stone Necklace Set',
      sku: 'NC-SV-002',
      categoryId: 7,
      description: 'Enhance your jewelry collection with this Elegant Pink Stone Necklace Set. Crafted with premium-quality stones and intricate floral detailing, this beautiful set includes a stylish necklace and matching earrings. Its timeless design makes it ideal for weddings, engagements, parties, festive celebrations, and special occasions.',
      price: 2980.00,
      discount: 0.00,
      weight: 38.000,
      purity: 'Premium Quality Stones',
      stoneDetails: 'Intricate Floral Detailing',
      makingCharges: 0.00,
      gst: 3.00,
      stock: 12,
      images: ['/assets/elegant-pink-necklace.jpg'],
      videoUrl: '',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      collection: 'Chokers',
      rating: 4.8
    },
    {
      id: 9,
      name: 'Sapphire Blue Crystal Necklace Set',
      sku: 'NC-SV-003',
      categoryId: 7,
      description: 'Shine with elegance in this Sapphire Blue Crystal Necklace Set. Featuring dazzling blue crystal stones, sparkling floral motifs, and matching designer earrings, this premium jewelry set is perfect for receptions, evening parties, weddings, and festive occasions. Its sophisticated design beautifully complements both traditional and modern outfits.',
      price: 3990.00,
      discount: 0.00,
      weight: 42.000,
      purity: 'Dazzling Blue Crystal Stones',
      stoneDetails: 'Sparkling Floral Motifs',
      makingCharges: 0.00,
      gst: 3.00,
      stock: 8,
      images: ['/assets/sapphire-blue-necklace.jpg'],
      videoUrl: '',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      collection: 'Chokers',
      rating: 4.9
    },
    {
      id: 10,
      name: 'Royal Ruby Stone Necklace Set',
      sku: 'NC-SV-004',
      categoryId: 3,
      description: 'Add timeless elegance to your jewelry collection with this Royal Ruby Stone Necklace Set. Designed with sparkling white stones and beautiful ruby-red teardrop accents, this premium set includes a matching necklace and elegant drop earrings. Perfect for weddings, receptions, festive celebrations, engagements, and special occasions, it beautifully complements both traditional and party wear.',
      price: 2480.00,
      discount: 0.00,
      weight: 32.000,
      purity: 'Premium Quality Stones',
      stoneDetails: 'Sparkling White Stones & Ruby Red Accents',
      makingCharges: 0.00,
      gst: 3.00,
      stock: 15,
      images: ['/assets/royal-ruby-necklace.jpg'],
      videoUrl: '',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      collection: 'Necklaces',
      rating: 4.9
    },
    {
      id: 11,
      name: 'Crystal White Designer Necklace Set',
      sku: 'NC-SV-005',
      categoryId: 3,
      description: 'Enhance your look with this Crystal White Designer Necklace Set, featuring dazzling crystal stones arranged in an elegant floral pattern. The matching designer earrings complete the sophisticated look, making it an excellent choice for weddings, parties, receptions, festivals, and evening events. Lightweight, stylish, and crafted for lasting brilliance, this set adds grace to every occasion.',
      price: 1750.00,
      discount: 0.00,
      weight: 28.000,
      purity: 'Dazzling Crystal Stones',
      stoneDetails: 'Floral Pattern Crystals',
      makingCharges: 0.00,
      gst: 3.00,
      stock: 20,
      images: ['/assets/crystal-white-necklace.jpg'],
      videoUrl: '',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      collection: 'Necklaces',
      rating: 4.8
    },
    {
      id: 12,
      name: 'Royal Green Temple Long Necklace Set',
      sku: 'LC-SV-001',
      categoryId: 4,
      description: 'Enhance your traditional look with this Royal Green Temple Long Necklace Set. Featuring intricate antique gold craftsmanship, elegant green bead accents, and matching designer earrings, this premium set is perfect for weddings, festive occasions, cultural celebrations, and bridal wear. Its timeless design adds elegance and grace to every outfit.',
      price: 2450.00,
      discount: 0.00,
      weight: 60.000,
      purity: 'Antique Gold Craftsmanship',
      stoneDetails: 'Green Bead Accents & Sparkling Stones',
      makingCharges: 0.00,
      gst: 3.00,
      stock: 8,
      images: ['/assets/royal-green-long-necklace.jpg'],
      videoUrl: '',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      collection: 'Long Chains',
      rating: 4.9
    },
    {
      id: 13,
      name: 'Emerald Floral Layered Necklace Set',
      sku: 'LC-SV-002',
      categoryId: 4,
      description: 'Make a grand statement with this Emerald Floral Layered Necklace Set. Designed with beautiful floral motifs, sparkling green stones, and elegant layered chains, this luxurious jewelry set includes matching earrings and is ideal for weddings, receptions, festive celebrations, and special occasions.',
      price: 4960.00,
      discount: 0.00,
      weight: 75.000,
      purity: 'Premium Gold Craftsmanship',
      stoneDetails: 'Sparkling Green Stones & Floral Motifs',
      makingCharges: 0.00,
      gst: 3.00,
      stock: 5,
      images: ['/assets/emerald-layered-necklace.jpg'],
      videoUrl: '',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      collection: 'Long Chains',
      rating: 5.0
    },
    {
      id: 14,
      name: 'Classic Gold Temple Haram Set',
      sku: 'LC-SV-003',
      categoryId: 4,
      description: 'Celebrate tradition with this Classic Gold Temple Haram Set. Featuring a beautifully detailed Lakshmi-inspired pendant, intricate gold craftsmanship, and matching earrings, this elegant set is perfect for bridal wear, religious ceremonies, weddings, and festive occasions.',
      price: 2750.00,
      discount: 0.00,
      weight: 65.000,
      purity: 'Antique Gold Finish',
      stoneDetails: 'Lakshmi-inspired Pendant',
      makingCharges: 0.00,
      gst: 3.00,
      stock: 10,
      images: ['/assets/gold-temple-haram.jpg'],
      videoUrl: '',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      collection: 'Long Chains',
      rating: 4.9
    },
    {
      id: 15,
      name: 'Elegant Gold Pendant Necklace Set',
      sku: 'LC-SV-004',
      categoryId: 4,
      description: 'Add timeless beauty to your jewelry collection with this Elegant Gold Pendant Necklace Set. Designed with dual-layer gold chains, a beautifully crafted pendant, and matching earrings, this premium set is perfect for weddings, festivals, traditional events, and family celebrations.',
      price: 3580.00,
      discount: 0.00,
      weight: 55.000,
      purity: 'Premium Gold Polish',
      stoneDetails: 'Intricate Gold Work',
      makingCharges: 0.00,
      gst: 3.00,
      stock: 12,
      images: ['/assets/gold-pendant-necklace.jpg'],
      videoUrl: '',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      collection: 'Long Chains',
      rating: 4.8
    },
    {
      id: 16,
      name: 'Royal Heritage Gold Long Necklace Set',
      sku: 'LC-SV-005',
      categoryId: 4,
      description: 'Experience royal elegance with this Royal Heritage Gold Long Necklace Set. Crafted with intricate traditional patterns, colorful stone embellishments, and matching statement earrings, this luxurious jewelry set is perfect for bridal wear, weddings, receptions, festivals, and other grand occasions. Its classic craftsmanship offers a rich and sophisticated look.',
      price: 3850.00,
      discount: 0.00,
      weight: 70.000,
      purity: 'Luxurious Heritage Gold',
      stoneDetails: 'Colorful Stone Embellishments',
      makingCharges: 0.00,
      gst: 3.00,
      stock: 6,
      images: ['/assets/royal-heritage-necklace.jpg'],
      videoUrl: '',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      collection: 'Long Chains',
      rating: 4.9
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
    let products = getMockItem('mock_products') || [];
    
    // Parse query parameters
    const queryIndex = endpoint.indexOf('?');
    if (queryIndex !== -1) {
      const queryString = endpoint.slice(queryIndex + 1);
      const params = new URLSearchParams(queryString);
      
      const category = params.get('category');
      const search = params.get('search');
      const sort = params.get('sort');
      const minPrice = params.get('minPrice');
      const maxPrice = params.get('maxPrice');
      
      // 1. Filter by category
      if (category) {
        const categories = getMockItem('mock_categories') || [];
        const matchedCat = categories.find(c => c.slug === category);
        if (matchedCat) {
          products = products.filter(p => p.categoryId === matchedCat.id);
        }
      }
      
      // 2. Filter by search query
      if (search) {
        const query = search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.description.toLowerCase().includes(query) ||
          (p.sku && p.sku.toLowerCase().includes(query))
        );
      }
      
      // 3. Filter by price range
      if (minPrice) {
        products = products.filter(p => p.price >= parseFloat(minPrice));
      }
      if (maxPrice) {
        products = products.filter(p => p.price <= parseFloat(maxPrice));
      }
      
      // 4. Sort products
      if (sort) {
        if (sort === 'price-low') {
          products.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
          products.sort((a, b) => b.price - a.price);
        } else if (sort === 'popular') {
          products.sort((a, b) => b.rating - a.rating);
        }
      }
    }
    
    return {
      success: true,
      data: {
        products: products,
        total: products.length,
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
