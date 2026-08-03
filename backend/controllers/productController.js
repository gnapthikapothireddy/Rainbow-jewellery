const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const User = require('../models/User');
const { Op } = require('sequelize');

// @desc    Get all products with filters & search
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      gender,
      occasion,
      stoneType,
      sort,
      limit,
      page
    } = req.query;

    const queryOptions = { where: {} };

    // Search filter (handles smart search and voice keywords)
    if (search) {
      queryOptions.where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { purity: { [Op.like]: `%${search}%` } },
        { collection: { [Op.like]: `%${search}%` } }
      ];
    }

    // Category filter
    if (category) {
      const cat = await Category.findOne({ where: { slug: category } });
      if (cat) {
        queryOptions.where.categoryId = cat.id;
      }
    }

    // Collection filter
    if (req.query.collection) {
      queryOptions.where.collection = req.query.collection;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      queryOptions.where.price = {};
      if (minPrice) queryOptions.where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) queryOptions.where.price[Op.lte] = parseFloat(maxPrice);
    }

    // Occasion / Stone / Gender filters
    if (stoneType) {
      queryOptions.where.stoneDetails = { [Op.like]: `%${stoneType}%` };
    }

    // Sorting options
    if (sort) {
      if (sort === 'price-low') {
        queryOptions.order = [['price', 'ASC']];
      } else if (sort === 'price-high') {
        queryOptions.order = [['price', 'DESC']];
      } else if (sort === 'newest') {
        queryOptions.order = [['createdAt', 'DESC']];
      } else if (sort === 'popular') {
        queryOptions.order = [['isBestSeller', 'DESC'], ['isTrending', 'DESC']];
      }
    } else {
      queryOptions.order = [['createdAt', 'DESC']];
    }

    // Pagination
    const pg = parseInt(page) || 1;
    const lm = parseInt(limit) || 12;
    queryOptions.offset = (pg - 1) * lm;
    queryOptions.limit = lm;

    const { count, rows: products } = await Product.findAndCountAll(queryOptions);

    res.json({
      success: true,
      data: {
        products,
        total: count,
        page: pg,
        pages: Math.ceil(count / lm)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get autocomplete search suggestions
// @route   GET /api/products/suggestions
// @access  Public
const getSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === '') {
      return res.json({ success: true, data: [] });
    }

    const products = await Product.findAll({
      where: {
        name: { [Op.like]: `%${query}%` }
      },
      attributes: ['id', 'name', 'price', 'images'],
      limit: 6
    });

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get product details by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch reviews & ratings
    const reviews = await Review.findAll({
      where: { productId: product.id },
      include: [{ model: User, attributes: ['name'] }],
      order: [['createdAt', 'DESC']]
    });

    const averageRating = reviews.length > 0
      ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1)
      : parseFloat(product.rating || 4.5);

    // AI recommendation calculations (fetch related products)
    const relatedProducts = await Product.findAll({
      where: {
        categoryId: product.categoryId,
        id: { [Op.ne]: product.id }
      },
      limit: 4
    });

    res.json({
      success: true,
      data: {
        product,
        reviews,
        averageRating: parseFloat(averageRating),
        reviewCount: reviews.length,
        relatedProducts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI personalized recommendations
// @route   GET /api/products/recommendations/personalized
// @access  Public
const getAIRecommendations = async (req, res) => {
  try {
    const { categoryIds } = req.query; // optional category IDs currently viewed
    let queryOptions = { limit: 6 };

    if (categoryIds) {
      const ids = categoryIds.split(',').map(id => parseInt(id));
      queryOptions.where = { categoryId: { [Op.in]: ids } };
    } else {
      queryOptions.where = {
        [Op.or]: [
          { isFeatured: true },
          { isTrending: true }
        ]
      };
    }

    const recommendations = await Product.findAll(queryOptions);
    res.json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { 
      name, sku, categoryId, description, price, discount, 
      weight, purity, stoneDetails, makingCharges, gst, stock, 
      images, videoUrl, isFeatured, isNewArrival, isBestSeller, isTrending,
      collection, rating, specifications
    } = req.body;

    const skuExists = await Product.findOne({ where: { sku } });
    if (skuExists) {
      return res.status(400).json({ success: false, message: 'A product with this SKU already exists' });
    }

    const product = await Product.create({
      name, sku, categoryId, description, price, discount,
      weight, purity, stoneDetails, makingCharges, gst, stock,
      images: images || [], videoUrl, isFeatured, isNewArrival,
      isBestSeller, isTrending,
      collection, rating: rating || 4.5, specifications
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product details (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Track original stock to log and verify inventory warning status
    const oldStock = product.stock;

    await product.update(req.body);

    // Dynamic warning notifications for low/zero stock
    if (product.stock === 0 && oldStock > 0) {
      console.log(`[Inventory Alert] Product ${product.name} (SKU: ${product.sku}) is now OUT OF STOCK.`);
    } else if (product.stock < 5 && oldStock >= 5) {
      console.log(`[Inventory Alert] Product ${product.name} (SKU: ${product.sku}) is now LOW STOCK (${product.stock} left).`);
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.destroy();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/products/categories/list
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a category (Admin only)
// @route   POST /api/products/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const catExists = await Category.findOne({ where: { slug } });
    if (catExists) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({ name, slug, image });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getSuggestions,
  getProductById,
  getAIRecommendations,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory
};
