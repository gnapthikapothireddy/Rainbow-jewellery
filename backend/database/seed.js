const { sequelize } = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');

const categoriesData = [
  { name: 'Bangles', slug: 'bangles', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400' },
  { name: 'Gold Plated Bangles', slug: 'gold-plated-bangles', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400' },
  { name: 'Necklaces', slug: 'necklaces', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Long Chains', slug: 'long-chains', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Pearl Chains', slug: 'pearl-chains', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Black Bead Chains', slug: 'black-bead-chains', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Chokers', slug: 'chokers', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Rings', slug: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Earrings', slug: 'earrings', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=400' },
  { name: 'Ear Side Chains', slug: 'ear-side-chains', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=400' },
  { name: 'Pendants', slug: 'pendants', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Hair Ornaments', slug: 'hair-ornaments', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Bracelets', slug: 'bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400' }
];

const couponsData = [
  { code: 'WELCOME10', discountType: 'percentage', discountValue: 10.00, minimumOrder: 5000.00, expiryDate: '2027-12-31', isActive: true },
  { code: 'FESTIVAL15', discountType: 'percentage', discountValue: 15.00, minimumOrder: 15000.00, expiryDate: '2027-12-31', isActive: true },
  { code: 'DIWALI2000', discountType: 'flat', discountValue: 2000.00, minimumOrder: 30000.00, expiryDate: '2027-12-31', isActive: true },
  { code: 'FIRSTORDER', discountType: 'flat', discountValue: 1000.00, minimumOrder: 10000.00, expiryDate: '2027-12-31', isActive: true }
];

const productsData = [
  {
    name: 'Elegant Silver Designer Bangles',
    sku: 'BG-SV-007',
    categoryId: 13, // Mapped to Bangles in finalProducts
    description: 'Enhance your style with these Elegant Silver Designer Bangles featuring a beautiful lattice floral design. Made with a premium silver finish, these bangles are lightweight, durable, and comfortable for all-day wear. Their elegant craftsmanship makes them suitable for casual wear, festivals, weddings, parties, and special occasions. A perfect combination of traditional beauty and modern elegance.',
    price: 150.00,
    discount: 0.00,
    weight: 18.000,
    purity: 'Premium Silver Finish',
    stoneDetails: 'None',
    makingCharges: 0.00,
    gst: 0.00,
    stock: 50,
    images: [
      '/assets/silver-bangles.jpg'
    ],
    videoUrl: '',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    collection: 'Silver Bangles',
    rating: 4.9,
    specifications: 'Material: Premium Silver Finish\nProduct Type: Bangles\nStyle: Traditional & Modern\nPattern: Lattice Floral Design\nColor: Silver\nOccasion: Daily Wear, Party Wear, Wedding, Festival\nSkin Friendly\nLightweight\nComfortable Fit\nHigh Quality Finish'
  },
  {
    name: 'Royal Red Bridal Bangle Set',
    sku: 'BG-SV-008',
    categoryId: 13,
    description: 'Enhance your bridal look with this stunning Royal Red Bridal Bangle Set. Featuring elegant red, gold, and crystal detailing, this beautifully crafted set is perfect for weddings, festive occasions, and traditional celebrations. Designed with premium-quality materials, these bangles provide both comfort and timeless elegance.',
    price: 1010.00,
    discount: 0.00,
    weight: 22.000,
    purity: 'Premium Quality Materials',
    stoneDetails: 'Gold & Crystal Detailing',
    makingCharges: 0.00,
    gst: 0.00,
    stock: 25,
    images: [
      '/assets/royal-red-bangles.jpg'
    ],
    videoUrl: '',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    collection: 'Bangles',
    rating: 4.9,
    specifications: 'Material: Premium Quality Materials\nProduct Type: Bridal Bangle Set\nStyle: Traditional & Bridal\nPattern: Red, Gold & Crystal Detailing\nColor: Royal Red\nOccasion: Weddings, Festive Occasions, Traditional Celebrations\nComfortable Fit\nTimeless Elegance'
  },
  {
    name: 'Emerald Green Bridal Bangle Set',
    sku: 'BG-SV-009',
    categoryId: 13,
    description: 'Celebrate every special occasion with this elegant Emerald Green Bridal Bangle Set. Adorned with sparkling stones, pearl accents, and hanging jhumka charms, this luxurious set beautifully complements bridal and festive attire while adding a royal touch to your look.',
    price: 1350.00,
    discount: 0.00,
    weight: 28.000,
    purity: 'Premium Quality Materials',
    stoneDetails: 'Sparkling Stones & Pearl Accents',
    makingCharges: 0.00,
    gst: 0.00,
    stock: 30,
    images: [
      '/assets/emerald-green-bangles.jpg'
    ],
    videoUrl: '',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    collection: 'Bangles',
    rating: 4.9,
    specifications: 'Material: Premium Quality Materials\nProduct Type: Bangle Set with Hanging Jhumkas\nStyle: Luxurious Bridal\nPattern: Sparkling Stones & Pearl Accents\nColor: Emerald Green\nOccasion: Bridal Attire, Festive Attire, Weddings\nSpecial Feature: Hanging Jhumka Charms'
  },
  {
    name: 'Royal Black Designer Bangle Set',
    sku: 'BG-SV-010',
    categoryId: 13,
    description: 'Make a bold fashion statement with the Royal Black Designer Bangle Set. Featuring an elegant combination of black beads, intricate gold detailing, and pearl jhumka charms, this premium set is ideal for weddings, parties, festive occasions, and ethnic wear.',
    price: 940.00,
    discount: 0.00,
    weight: 26.000,
    purity: 'Premium Quality Materials',
    stoneDetails: 'Black Beads & Pearl Jhumkas',
    makingCharges: 0.00,
    gst: 0.00,
    stock: 20,
    images: [
      '/assets/royal-black-bangles.jpg'
    ],
    videoUrl: '',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    collection: 'Bangles',
    rating: 4.8,
    specifications: 'Material: Premium Quality Materials\nProduct Type: Designer Bangle Set with Jhumkas\nStyle: Bold & Ethnic\nPattern: Black Beads & Intricate Gold Detailing\nColor: Royal Black\nOccasion: Weddings, Parties, Festive Occasions, Ethnic Wear\nSpecial Feature: Pearl Jhumka Charms'
  },
  {
    name: 'Elegant Pink Bridal Bangle Set',
    sku: 'BG-SV-011',
    categoryId: 13,
    description: 'Bring elegance to your jewelry collection with this Elegant Pink Bridal Bangle Set. Crafted with sparkling stones and beautifully arranged pink bangles, this premium set is perfect for bridal wear, festivals, engagement ceremonies, and special celebrations.',
    price: 1370.00,
    discount: 0.00,
    weight: 24.000,
    purity: 'Premium Quality Materials',
    stoneDetails: 'Sparkling Stones',
    makingCharges: 0.00,
    gst: 0.00,
    stock: 15,
    images: [
      '/assets/elegant-pink-bangles.jpg'
    ],
    videoUrl: '',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    collection: 'Bangles',
    rating: 4.9,
    specifications: 'Material: Premium Quality Materials\nProduct Type: Bridal Bangle Set\nStyle: Elegant Bridal\nPattern: Sparkling Stones & Pink Accents\nColor: Pink & Gold\nOccasion: Bridal Wear, Festivals, Engagement Ceremonies, Celebrations\nIntricate Setting'
  },
  {
    name: 'Crystal Green Glass Bangle Set',
    sku: 'BG-SV-012',
    categoryId: 13,
    description: 'Add a graceful touch to your outfit with the Crystal Green Glass Bangle Set. Designed with premium glass bangles and sparkling crystal-studded borders, this lightweight and stylish set is perfect for daily wear, traditional functions, festive occasions, and gifting.',
    price: 350.00,
    discount: 0.00,
    weight: 15.000,
    purity: 'Premium Quality Glass',
    stoneDetails: 'Crystal borders',
    makingCharges: 0.00,
    gst: 0.00,
    stock: 40,
    images: [
      '/assets/crystal-green-bangles.jpg'
    ],
    videoUrl: '',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    collection: 'Bangles',
    rating: 4.8,
    specifications: 'Material: Premium Glass & Crystal Borders\nProduct Type: Glass Bangle Set\nStyle: Graceful & Lightweight\nPattern: Sparkling Crystal-Studded Borders\nColor: Crystal Green\nOccasion: Daily Wear, Traditional Functions, Festive Occasions, Gifting\nLightweight Design'
  },
  {
    name: 'Royal Green Bridal Necklace Set',
    sku: 'NC-SV-001',
    categoryId: 14, // Mapped to Chokers in finalProducts
    description: 'Make every celebration unforgettable with this Royal Green Bridal Necklace Set. Featuring intricate antique gold craftsmanship, elegant green bead drops, sparkling stones, and matching jhumka earrings, this luxurious set is perfect for weddings, receptions, festivals, and traditional occasions. Designed to add a royal touch to every outfit.',
    price: 4450.00,
    discount: 0.00,
    weight: 45.000,
    purity: 'Antique Gold Craftsmanship',
    stoneDetails: 'Green Bead Drops & Sparkling Stones',
    makingCharges: 0.00,
    gst: 3.00,
    stock: 10,
    images: [
      '/assets/royal-green-necklace.jpg'
    ],
    videoUrl: '',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    collection: 'Chokers',
    rating: 4.9,
    specifications: 'Material: Antique Gold Craftsmanship\nProduct Type: Necklace & Matching Jhumka Earrings\nStyle: Luxurious Bridal\nPattern: Intricate Peacock Motifs & Green Bead Drops\nColor: Green & Antique Gold\nOccasion: Weddings, Receptions, Festivals, Traditional Occasions\nRoyal Touch'
  },
  {
    name: 'Elegant Pink Stone Necklace Set',
    sku: 'NC-SV-002',
    categoryId: 14,
    description: 'Enhance your jewelry collection with this Elegant Pink Stone Necklace Set. Crafted with premium-quality stones and intricate floral detailing, this beautiful set includes a stylish necklace and matching earrings. Its timeless design makes it ideal for weddings, engagements, parties, festive celebrations, and special occasions.',
    price: 2980.00,
    discount: 0.00,
    weight: 38.000,
    purity: 'Premium Quality Stones',
    stoneDetails: 'Intricate Floral Detailing',
    makingCharges: 0.00,
    gst: 3.00,
    stock: 12,
    images: [
      '/assets/elegant-pink-necklace.jpg'
    ],
    videoUrl: '',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    collection: 'Chokers',
    rating: 4.8,
    specifications: 'Material: Premium Quality Pink Stones\nProduct Type: Necklace & Matching Earrings\nStyle: Floral Elegant Detailing\nPattern: Intricate Floral Settings\nColor: Pink & Gold\nOccasion: Weddings, Engagements, Parties, Festive Celebrations, Special Occasions\nTimeless Design'
  },
  {
    name: 'Sapphire Blue Crystal Necklace Set',
    sku: 'NC-SV-003',
    categoryId: 14,
    description: 'Shine with elegance in this Sapphire Blue Crystal Necklace Set. Featuring dazzling blue crystal stones, sparkling floral motifs, and matching designer earrings, this premium jewelry set is perfect for receptions, evening parties, weddings, and festive occasions. Its sophisticated design beautifully complements both traditional and modern outfits.',
    price: 3990.00,
    discount: 0.00,
    weight: 42.000,
    purity: 'Dazzling Blue Crystal Stones',
    stoneDetails: 'Sparkling Floral Motifs',
    makingCharges: 0.00,
    gst: 3.00,
    stock: 8,
    images: [
      '/assets/sapphire-blue-necklace.jpg'
    ],
    videoUrl: '',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    collection: 'Chokers',
    rating: 4.9,
    specifications: 'Material: Dazzling Blue Crystal Stones\nProduct Type: Necklace & Matching Designer Earrings\nStyle: Sophisticated Modern & Traditional\nPattern: Sparkling Floral Motifs\nColor: Sapphire Blue & Silver\nOccasion: Receptions, Evening Parties, Weddings, Festive Occasions\nSophisticated Design'
  },
  {
    name: 'Royal Ruby Stone Necklace Set',
    sku: 'NC-SV-004',
    categoryId: 1, // Mapped to Necklaces in finalProducts
    description: 'Add timeless elegance to your jewelry collection with this Royal Ruby Stone Necklace Set. Designed with sparkling white stones and beautiful ruby-red teardrop accents, this premium set includes a matching necklace and elegant drop earrings. Perfect for weddings, receptions, festive celebrations, engagements, and special occasions, it beautifully complements both traditional and party wear.',
    price: 2480.00,
    discount: 0.00,
    weight: 32.000,
    purity: 'Premium Quality Stones',
    stoneDetails: 'Sparkling White Stones & Ruby Red Accents',
    makingCharges: 0.00,
    gst: 3.00,
    stock: 15,
    images: [
      '/assets/royal-ruby-necklace.jpg'
    ],
    videoUrl: '',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    collection: 'Necklaces',
    rating: 4.9,
    specifications: 'Material: Premium Quality Stones\nProduct Type: Necklace & Matching Drop Earrings\nStyle: Timeless Elegance\nPattern: Sparkling White Stones & Ruby-Red Teardrops\nColor: Ruby Red & Silver\nOccasion: Weddings, Receptions, Festive Celebrations, Engagements, Special Occasions\nHigh Brilliance'
  },
  {
    name: 'Crystal White Designer Necklace Set',
    sku: 'NC-SV-005',
    categoryId: 1,
    description: 'Enhance your look with this Crystal White Designer Necklace Set, featuring dazzling crystal stones arranged in an elegant floral pattern. The matching designer earrings complete the sophisticated look, making it an excellent choice for weddings, parties, receptions, festivals, and evening events. Lightweight, stylish, and crafted for lasting brilliance, this set adds grace to every occasion.',
    price: 1750.00,
    discount: 0.00,
    weight: 28.000,
    purity: 'Dazzling Crystal Stones',
    stoneDetails: 'Floral Pattern Crystals',
    makingCharges: 0.00,
    gst: 3.00,
    stock: 20,
    images: [
      '/assets/crystal-white-necklace.jpg'
    ],
    videoUrl: '',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    collection: 'Necklaces',
    rating: 4.8,
    specifications: 'Material: Dazzling Crystal Stones\nProduct Type: Necklace & Matching Designer Earrings\nStyle: Sophisticated Graceful\nPattern: Elegant Floral Pattern\nColor: Crystal White & Gold\nOccasion: Weddings, Parties, Receptions, Festivals, Evening Events\nLightweight Design'
  },
  {
    name: 'Royal Green Temple Long Necklace Set',
    sku: 'LC-SV-001',
    categoryId: 15, // Mapped to Long Chains in finalProducts
    description: 'Enhance your traditional look with this Royal Green Temple Long Necklace Set. Featuring intricate antique gold craftsmanship, elegant green bead accents, and matching designer earrings, this premium set is perfect for weddings, festive occasions, cultural celebrations, and bridal wear. Its timeless design adds elegance and grace to every outfit.',
    price: 2450.00,
    discount: 0.00,
    weight: 60.000,
    purity: 'Antique Gold Craftsmanship',
    stoneDetails: 'Green Bead Accents & Sparkling Stones',
    makingCharges: 0.00,
    gst: 3.00,
    stock: 8,
    images: [
      '/assets/royal-green-long-necklace.jpg'
    ],
    videoUrl: '',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    collection: 'Long Chains',
    rating: 4.9,
    specifications: 'Material: Antique Gold Craftsmanship\nProduct Type: Long Necklace & Matching Earrings\nStyle: Temple Traditional\nPattern: Intricate Gold Work & Green Bead Accents\nColor: Green & Antique Gold\nOccasion: Weddings, Festive Occasions, Cultural Celebrations, Bridal Wear\nTimeless Design'
  },
  {
    name: 'Emerald Floral Layered Necklace Set',
    sku: 'LC-SV-002',
    categoryId: 15,
    description: 'Make a grand statement with this Emerald Floral Layered Necklace Set. Designed with beautiful floral motifs, sparkling green stones, and elegant layered chains, this luxurious jewelry set includes matching earrings and is ideal for weddings, receptions, festive celebrations, and special occasions.',
    price: 4960.00,
    discount: 0.00,
    weight: 75.000,
    purity: 'Premium Gold Craftsmanship',
    stoneDetails: 'Sparkling Green Stones & Floral Motifs',
    makingCharges: 0.00,
    gst: 3.00,
    stock: 5,
    images: [
      '/assets/emerald-layered-necklace.jpg'
    ],
    videoUrl: '',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    collection: 'Long Chains',
    rating: 5.0,
    specifications: 'Material: Premium Gold Craftsmanship\nProduct Type: Layered Long Necklace & Matching Earrings\nStyle: Luxurious Bridal\nPattern: Floral Motifs & Layered Chains\nColor: Emerald Green & Gold\nOccasion: Weddings, Receptions, Festive Celebrations, Special Occasions\nGrand Look'
  },
  {
    name: 'Classic Gold Temple Haram Set',
    sku: 'LC-SV-003',
    categoryId: 15,
    description: 'Celebrate tradition with this Classic Gold Temple Haram Set. Featuring a beautifully detailed Lakshmi-inspired pendant, intricate gold craftsmanship, and matching earrings, this elegant set is perfect for bridal wear, religious ceremonies, weddings, and festive occasions.',
    price: 2750.00,
    discount: 0.00,
    weight: 65.000,
    purity: 'Antique Gold Finish',
    stoneDetails: 'Lakshmi-inspired Pendant',
    makingCharges: 0.00,
    gst: 3.00,
    stock: 10,
    images: [
      '/assets/gold-temple-haram.jpg'
    ],
    videoUrl: '',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    collection: 'Long Chains',
    rating: 4.9,
    specifications: 'Material: Antique Gold Finish\nProduct Type: Haram Necklace & Matching Earrings\nStyle: Traditional Temple\nPattern: Beautifully Detailed Lakshmi Pendant\nColor: Gold\nOccasion: Bridal Wear, Religious Ceremonies, Weddings, Festive Occasions\nSacred Craftsmanship'
  },
  {
    name: 'Elegant Gold Pendant Necklace Set',
    sku: 'LC-SV-004',
    categoryId: 15,
    description: 'Add timeless beauty to your jewelry collection with this Elegant Gold Pendant Necklace Set. Designed with dual-layer gold chains, a beautifully crafted pendant, and matching earrings, this premium set is perfect for weddings, festivals, traditional events, and family celebrations.',
    price: 3580.00,
    discount: 0.00,
    weight: 55.000,
    purity: 'Premium Gold Polish',
    stoneDetails: 'Intricate Gold Work',
    makingCharges: 0.00,
    gst: 3.00,
    stock: 12,
    images: [
      '/assets/gold-pendant-necklace.jpg'
    ],
    videoUrl: '',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    collection: 'Long Chains',
    rating: 4.8,
    specifications: 'Material: Premium Gold Polish\nProduct Type: Pendant Long Necklace & Matching Earrings\nStyle: Elegant Dual Layer\nPattern: Dual-layer chains with detailed pendant\nColor: Gold\nOccasion: Weddings, Festivals, Traditional Events, Family Celebrations\nTimeless Beauty'
  },
  {
    name: 'Royal Heritage Gold Long Necklace Set',
    sku: 'LC-SV-005',
    categoryId: 15,
    description: 'Experience royal elegance with this Royal Heritage Gold Long Necklace Set. Crafted with intricate traditional patterns, colorful stone embellishments, and matching statement earrings, this luxurious jewelry set is perfect for bridal wear, weddings, receptions, festivals, and other grand occasions. Its classic craftsmanship offers a rich and sophisticated look.',
    price: 3850.00,
    discount: 0.00,
    weight: 70.000,
    purity: 'Luxurious Heritage Gold',
    stoneDetails: 'Colorful Stone Embellishments',
    makingCharges: 0.00,
    gst: 3.00,
    stock: 6,
    images: [
      '/assets/royal-heritage-necklace.jpg'
    ],
    videoUrl: '',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    collection: 'Long Chains',
    rating: 4.9,
    specifications: 'Material: Luxurious Heritage Gold\nProduct Type: Heritage Long Necklace & Matching Statement Earrings\nStyle: Grand Royal\nPattern: Intricate Traditional Patterns & colorful stones\nColor: Gold with Multi-color Accents\nOccasion: Bridal Wear, Weddings, Receptions, Festivals, Grand Occasions\nRich Heritage Look'
  }
];

const seedDatabase = async () => {
  try {
    console.log('Seeding database with records...');

    // Clear existing data (in order of relations)
    await Review.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });
    await Coupon.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Seed User
    const admin = await User.create({
      name: 'Rainbow Admin',
      email: 'admin@rainbow.com',
      password: 'adminpassword123',
      role: 'admin',
      phone: '+918919590533',
      loyaltyPoints: 0
    });
    console.log('Admin account seeded: admin@rainbow.com / adminpassword123');

    const customer = await User.create({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'password123',
      role: 'customer',
      phone: '+919876543210',
      loyaltyPoints: 120
    });
    console.log('Customer account seeded: john@gmail.com / password123');

    // Seed Categories
    const categoriesMap = {};
    for (const cat of categoriesData) {
      const createdCat = await Category.create(cat);
      categoriesMap[cat.name] = createdCat.id;
    }
    console.log('Categories seeded.');

    // Seed Coupons
    await Coupon.bulkCreate(couponsData);
    console.log('Coupons seeded.');

    // Seed Products (map the categoryId dynamically based on seed database IDs)
    const finalProducts = productsData.map(p => {
      // Map temporary category id placeholder to new collection names
      let catName = 'Bangles';
      if (p.categoryId === 1) catName = 'Necklaces';
      else if (p.categoryId === 2) catName = 'Rings';
      else if (p.categoryId === 3) catName = 'Bracelets';
      else if (p.categoryId === 4) catName = 'Rings';
      else if (p.categoryId === 7) catName = 'Earrings';
      else if (p.categoryId === 12) catName = 'Bangles';
      else if (p.categoryId === 13) catName = 'Bangles';
      else if (p.categoryId === 14) catName = 'Chokers';
      else if (p.categoryId === 15) catName = 'Long Chains';

      p.categoryId = categoriesMap[catName];
      return p;
    });

    await Product.bulkCreate(finalProducts);
    console.log('Products catalog seeded.');

    // Seed a review for the new Elegant Silver Designer Bangles
    const banglesProduct = await Product.findOne({ where: { sku: 'BG-SV-007' } });
    if (banglesProduct) {
      await Review.create({
        productId: banglesProduct.id,
        userId: customer.id,
        rating: 5,
        comment: 'Enhance your style with these Elegant Silver Designer Bangles! Crafted with a beautiful lattice floral pattern, they offer a stylish and comfortable fit. Absolutely love them!'
      });
      console.log('Sample review for Elegant Silver Designer Bangles seeded.');
    }

    // Seed reviews for new product list entries
    const redBangles = await Product.findOne({ where: { sku: 'BG-SV-008' } });
    if (redBangles) {
      await Review.create({ productId: redBangles.id, userId: customer.id, rating: 5, comment: 'Absolutely beautiful bridal red bangles! The crystal borders are very shiny.' });
    }

    const greenBangles = await Product.findOne({ where: { sku: 'BG-SV-009' } });
    if (greenBangles) {
      await Review.create({ productId: greenBangles.id, userId: customer.id, rating: 5, comment: 'The emerald green color is rich and elegant. Love the hanging jhumka details!' });
    }

    const blackBangles = await Product.findOne({ where: { sku: 'BG-SV-010' } });
    if (blackBangles) {
      await Review.create({ productId: blackBangles.id, userId: customer.id, rating: 5, comment: 'Outstanding look and finish. Perfectly complements ethnic wear!' });
    }

    const pinkBangles = await Product.findOne({ where: { sku: 'BG-SV-011' } });
    if (pinkBangles) {
      await Review.create({ productId: pinkBangles.id, userId: customer.id, rating: 5, comment: 'Beautiful pink and gold arrangement. Very high quality finish!' });
    }

    const glassBangles = await Product.findOne({ where: { sku: 'BG-SV-012' } });
    if (glassBangles) {
      await Review.create({ productId: glassBangles.id, userId: customer.id, rating: 5, comment: 'Very lightweight glass set. The crystal studded borders add the perfect shimmer!' });
    }

    const greenNecklace = await Product.findOne({ where: { sku: 'NC-SV-001' } });
    if (greenNecklace) {
      await Review.create({ productId: greenNecklace.id, userId: customer.id, rating: 5, comment: 'Gorgeous traditional green necklace set. Perfect wedding accessory.' });
    }

    const pinkNecklace = await Product.findOne({ where: { sku: 'NC-SV-002' } });
    if (pinkNecklace) {
      await Review.create({ productId: pinkNecklace.id, userId: customer.id, rating: 5, comment: 'Intricate floral pink detail is stunning. High craftsmanship!' });
    }

    const blueNecklace = await Product.findOne({ where: { sku: 'NC-SV-003' } });
    if (blueNecklace) {
      await Review.create({ productId: blueNecklace.id, userId: customer.id, rating: 5, comment: 'Sparkling sapphire crystals. Beautifully matches evening dresses!' });
    }

    const rubyNecklace = await Product.findOne({ where: { sku: 'NC-SV-004' } });
    if (rubyNecklace) {
      await Review.create({ productId: rubyNecklace.id, userId: customer.id, rating: 5, comment: 'Simply stunning! The ruby red teardrops add a rich royal charm.' });
    }

    const whiteNecklace = await Product.findOne({ where: { sku: 'NC-SV-005' } });
    if (whiteNecklace) {
      await Review.create({ productId: whiteNecklace.id, userId: customer.id, rating: 5, comment: 'Very lightweight yet dazzling! Matches almost everything.' });
    }

    const lc1 = await Product.findOne({ where: { sku: 'LC-SV-001' } });
    if (lc1) {
      await Review.create({ productId: lc1.id, userId: customer.id, rating: 5, comment: 'Intricate temple gold and green bead drops are simply breathtaking.' });
    }

    const lc2 = await Product.findOne({ where: { sku: 'LC-SV-002' } });
    if (lc2) {
      await Review.create({ productId: lc2.id, userId: customer.id, rating: 5, comment: 'Layered chains give a very grand and royal statement. Highly recommended!' });
    }

    const lc3 = await Product.findOne({ where: { sku: 'LC-SV-003' } });
    if (lc3) {
      await Review.create({ productId: lc3.id, userId: customer.id, rating: 5, comment: 'Lakshmi pendant is beautifully crafted. Gold finish is premium.' });
    }

    const lc4 = await Product.findOne({ where: { sku: 'LC-SV-004' } });
    if (lc4) {
      await Review.create({ productId: lc4.id, userId: customer.id, rating: 5, comment: 'Very elegant dual-layer design. Fits comfortably and shines bright.' });
    }

    const lc5 = await Product.findOne({ where: { sku: 'LC-SV-005' } });
    if (lc5) {
      await Review.create({ productId: lc5.id, userId: customer.id, rating: 5, comment: 'Luxurious heritage pattern with colorful stone work. Beautiful set!' });
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding database failed:', error.message);
  }
};

// Run directly if script is called
if (require.main === module) {
  const { setupAssociations } = require('../models/associations');
  setupAssociations();
  sequelize.sync({ force: true }).then(() => {
    seedDatabase().then(() => process.exit(0));
  });
}

module.exports = seedDatabase;
