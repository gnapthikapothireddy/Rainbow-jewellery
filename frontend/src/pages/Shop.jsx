import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Shop() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  // Card Quantity selector states
  const [cardQuantities, setCardQuantities] = useState({});

  const getProductQty = (prodId) => {
    return cardQuantities[prodId] || 1;
  };

  const setProductQty = (prodId, val) => {
    setCardQuantities(prev => ({
      ...prev,
      [prodId]: val
    }));
  };

  const handleCardAddToCart = (e, prod) => {
    e.stopPropagation();
    const qty = getProductQty(prod.id);
    addToCart(prod, qty);
    alert(`Success: Added ${qty} x "${prod.name}" to Cart.`);
  };

  const handleCardBuyNow = (e, prod) => {
    e.stopPropagation();
    const qty = getProductQty(prod.id);
    addToCart(prod, qty);
    navigate('/checkout');
  };

  const handleNotifyMe = (e, prod) => {
    e.stopPropagation();
    alert(`Roster request logged. We will notify you via email when "${prod.name}" is restocked.`);
  };

  // Filter & Search states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStone, setSelectedStone] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load URL queries initially
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlSearch = params.get('search');
    const urlCat = params.get('category');
    const urlWishlistIds = params.get('wishlistIds');

    if (urlSearch) setSearch(urlSearch);
    if (urlCat) setSelectedCategory(urlCat);
    
    // Handles opening a shared wishlist
    if (urlWishlistIds) {
      // In developer fallback, load selected items
      console.log('Loading shared wishlist IDs:', urlWishlistIds);
    }

    const initCategories = async () => {
      try {
        const catRes = await api.getCategories();
        if (catRes.success) setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    initCategories();
  }, [location.search]);

  // Query database on filter adjustments
  useEffect(() => {
    const fetchShopProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = `?sort=${sortBy}`;
        if (search) query += `&search=${encodeURIComponent(search)}`;
        if (selectedCategory) query += `&category=${encodeURIComponent(selectedCategory)}`;
        if (selectedStone) query += `&stoneType=${encodeURIComponent(selectedStone)}`;
        if (minPrice) query += `&minPrice=${minPrice}`;
        if (maxPrice) query += `&maxPrice=${maxPrice}`;

        const res = await api.getProducts(query);
        if (res.success) {
          setProducts(res.data.products);
        } else {
          setError(res.message || 'Failed to load catalog');
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'API connection failed');
      } finally {
        setLoading(false);
      }
    };
    fetchShopProducts();
  }, [search, selectedCategory, selectedStone, minPrice, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedStone('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-playfair font-bold text-white tracking-wide">Jewelry Catalog</h1>
        <p className="text-xs text-gray-400 mt-1">Explore hallmarked creations customized for every celebration.</p>
      </div>

      {/* Grid: Filters Sidebar + Catalog Display */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Filter Panel */}
        <aside className="glass-card rounded-2xl p-6 border border-gray-800 space-y-6 h-fit">
          <div className="flex justify-between items-center pb-4 border-b border-gray-800">
            <h3 className="font-semibold text-sm tracking-wider uppercase text-white flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-gold" /> Filter Settings
            </h3>
            <button 
              onClick={resetFilters}
              className="text-xs text-gray-500 hover:text-gold flex items-center gap-1 focus:outline-none"
            >
              <RotateCcw size={12} /> Clear
            </button>
          </div>

          {/* Search bar */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Search Keyword</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Rings, SKU, metal..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-charcoal-dark border border-gray-800 rounded-xl py-2 pl-3 pr-8 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold"
              />
              <Search size={14} className="absolute right-3 top-2.5 text-gray-500" />
            </div>
          </div>

          {/* Category selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Collections</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-charcoal-dark border border-gray-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-gold"
            >
              <option value="">All Collections</option>
              {categories && Array.isArray(categories) && categories.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Price Range (₹)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2 bg-charcoal-dark border border-gray-800 rounded-xl py-2 px-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2 bg-charcoal-dark border border-gray-800 rounded-xl py-2 px-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

        </aside>

        {/* Right Column: Catalog Grid */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Sorting Header */}
          <div className="flex justify-between items-center bg-charcoal p-4 rounded-2xl border border-gray-800">
            <span className="text-xs text-gray-400 font-medium">
              Showing <span className="text-white font-bold">{products.length}</span> luxury articles
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-charcoal-dark border border-gray-800 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-gold"
              >
                <option value="newest">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Best Sellers</option>
              </select>
            </div>
          </div>

          {/* Products listings */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold"></div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold animate-pulse">Loading Catalog...</p>
            </div>
          ) : error ? (
            <div className="glass-card rounded-2xl p-8 border border-red-500/20 text-center space-y-3">
              <p className="text-sm font-semibold text-red-400">Connection Error</p>
              <p className="text-xs text-gray-450 max-w-md mx-auto leading-relaxed">{error}</p>
              <button 
                onClick={() => resetFilters()} 
                className="gold-gradient-bg text-charcoal-dark font-bold text-xs py-2 px-6 rounded-xl hover:scale-102 transition-transform cursor-pointer mt-2"
              >
                Retry Connection
              </button>
            </div>
          ) : (() => {
            const displayCards = [...products];
            while (displayCards.length < 3) {
              displayCards.push(null);
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {displayCards.map((prod, index) => {
                  if (!prod) {
                    return (
                      <div 
                        key={`empty-${index}`}
                        className="glass-card rounded-2xl overflow-hidden p-4 flex flex-col border border-gray-850 space-y-3 min-h-[380px]"
                      >
                        <div className="relative h-56 rounded-xl overflow-hidden bg-charcoal-dark/20 border border-dashed border-gray-800/60 flex items-center justify-center">
                          <span className="text-[10px] text-gray-550 uppercase tracking-widest font-semibold">Image Placeholder</span>
                        </div>
                        <div className="flex-grow"></div>
                      </div>
                    );
                  }

                  const hasWish = isInWishlist(prod.id);
                  const discountedPrice = prod.price - (prod.price * (prod.discount / 100)) + parseFloat(prod.makingCharges || 0);

                  return (
                    <div 
                      key={prod.id} 
                      onClick={() => navigate(`/product/${prod.id}`)}
                      className="glass-card rounded-2xl overflow-hidden p-4 flex flex-col hover:border-gold/40 hover:shadow-lg transition-all group duration-300 cursor-pointer space-y-3"
                    >
                      
                      {/* Media */}
                      <div className="relative h-56 rounded-xl overflow-hidden bg-charcoal-dark border border-gray-800">
                        <img 
                          src={prod.images[0]} 
                          alt={prod.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />

                        {/* Wishlist Icon */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(prod);
                          }}
                          className="absolute top-3 right-3 p-2 bg-charcoal-dark/70 rounded-full hover:bg-charcoal text-white hover:text-gold transition-colors focus:outline-none border border-gray-700/50 z-10"
                        >
                          <Heart size={14} fill={hasWish ? "#D4AF37" : "none"} stroke={hasWish ? "#D4AF37" : "currentColor"} />
                        </button>

                        {prod.discount > 0 && (
                          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {prod.discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Specifications */}
                      <div className="flex-grow space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-gray-500">
                          <span>{prod.collection || prod.purity}</span>
                          <span>{prod.weight}g</span>
                        </div>
                        
                        <h3 className="font-semibold text-sm text-white hover:text-gold transition-colors truncate">
                          {prod.name}
                        </h3>
                        
                        <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                          {prod.description}
                        </p>

                        {/* Rating (★★★★★) */}
                        <div className="flex items-center gap-1 text-gold py-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${i < Math.floor(prod.rating || 4.5) ? 'text-gold' : 'text-gray-600'}`}>★</span>
                          ))}
                          <span className="text-[9px] text-gray-500 ml-1">({parseFloat(prod.rating || 4.5).toFixed(1)})</span>
                        </div>

                        {/* Stock Status Badge */}
                        <div className="pt-1">
                          {prod.stock === 0 ? (
                            <span className="text-[9px] font-bold text-red-500 uppercase bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">Out of Stock</span>
                          ) : prod.stock < 5 ? (
                            <span className="text-[9px] font-bold text-amber-500 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Low Stock ({prod.stock})</span>
                          ) : (
                            <span className="text-[9px] font-bold text-green-500 uppercase bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">In Stock</span>
                          )}
                        </div>
                      </div>

                      {/* Valuation & Prices */}
                      <div className="pt-2 border-t border-gray-800 flex justify-between items-end">
                        <div>
                          <span className="text-gray-500 text-[10px] block font-medium">Estimated Price</span>
                          <span className="text-base font-bold text-white">₹{discountedPrice.toLocaleString()}</span>
                          {prod.discount > 0 && (
                            <span className="text-[10px] text-gray-500 line-through block">₹{prod.price.toLocaleString()}</span>
                          )}
                        </div>
                      </div>

                      {/* Interactive Selector & Buttons panel */}
                      <div className="space-y-2 pt-2 border-t border-gray-800" onClick={(e) => e.stopPropagation()}>
                        {prod.stock > 0 ? (
                          <>
                            {/* Quantity Selector */}
                            <div className="flex justify-between items-center bg-charcoal-dark border border-gray-800 rounded-xl p-1 text-[11px]">
                              <span className="text-gray-400 pl-2">Quantity</span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setProductQty(prod.id, Math.max(1, getProductQty(prod.id) - 1)); }}
                                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white bg-charcoal hover:bg-charcoal-light rounded border border-gray-700"
                                >
                                  -
                                </button>
                                <span className="w-4 text-center font-bold text-white">{getProductQty(prod.id)}</span>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setProductQty(prod.id, Math.min(prod.stock, getProductQty(prod.id) + 1)); }}
                                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white bg-charcoal hover:bg-charcoal-light rounded border border-gray-700"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Action Buttons: Add to Cart & Buy Now */}
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-wide">
                              <button
                                onClick={(e) => handleCardAddToCart(e, prod)}
                                className="bg-charcoal border border-gold/40 text-gold py-2 rounded-xl hover:bg-gold hover:text-charcoal-dark transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <ShoppingBag size={12} /> Add to Cart
                              </button>
                              <button
                                onClick={(e) => handleCardBuyNow(e, prod)}
                                className="gold-gradient-bg text-charcoal-dark py-2 rounded-xl hover:scale-102 transition-transform flex items-center justify-center gap-1 cursor-pointer"
                              >
                                Buy Now
                              </button>
                            </div>
                          </>
                        ) : (
                          <button
                            onClick={(e) => handleNotifyMe(e, prod)}
                            className="w-full bg-charcoal border border-red-500/30 text-red-400 py-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-[10px] font-bold uppercase transition-colors cursor-pointer"
                          >
                            Notify Me
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            );
          })()}

        </main>

      </div>

    </div>
  );
}
