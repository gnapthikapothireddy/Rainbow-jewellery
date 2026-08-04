import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Heart, ShoppingBag, Sparkles, Gift } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const prodRes = await api.getProducts('?limit=8');
        const catRes = await api.getCategories();
        if (prodRes.success) setProducts(prodRes.data.products);
        if (catRes.success) setCategories(catRes.data.slice(0, 6));
      } catch (err) {
        console.error('Home Page loading failed:', err);
      }
    };
    loadHomeData();
  }, []);

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Luxury Hero Banner */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center bg-cover bg-center overflow-hidden border-b border-gold/15" style={{ backgroundImage: `url('/assets/royal-ruby-necklace.jpg')` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold/40 bg-gold/10 text-gold text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={12} className="animate-spin" /> Elegant & Timeless Craftsmanship
            </div>
            <h1 className="text-4xl sm:text-6xl font-playfair font-bold text-white leading-tight tracking-wide">
              Adorn Yourself with <br />
              <span className="gold-gradient-text">Pure Royalty</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-lg leading-relaxed font-light">
              Discover our exclusive bridal necklaces, conflict-free solitaire diamonds, and premium 22K gold jewelry designed to make your celebrations unforgettable.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/shop" className="gold-gradient-bg text-charcoal-dark font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-gold-glow">
                Explore Collections <ArrowRight size={16} />
              </Link>
              <Link to="/book-appointment" className="border border-gold text-gold font-semibold px-8 py-3 rounded-full hover:bg-gold/10 transition-colors">
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Premium Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-3xl font-playfair font-bold text-white tracking-wide">Browse by Collections</h2>
          <div className="h-0.5 w-16 bg-gold mx-auto mt-3"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link 
              key={cat.id} 
              to={`/shop?category=${cat.slug}`}
              className="group glass-card rounded-2xl overflow-hidden p-3 hover:border-gold/50 transition-all text-center"
            >
              <div className="w-full h-32 rounded-xl overflow-hidden mb-3">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <h3 className="text-xs font-semibold text-white tracking-wider uppercase group-hover:text-gold transition-colors truncate">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Festival Offers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gold-gradient-bg rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center shadow-gold-glow-lg text-charcoal-dark relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-20 -translate-y-20 opacity-10">
            <Gift size={320} />
          </div>
          
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-block bg-charcoal-dark text-gold font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Limited Festival Special
            </div>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold">Celebrate the Golden Season</h2>
            <p className="font-medium text-charcoal-light text-sm md:text-base">
              Apply code <span className="font-bold border-b border-charcoal-dark">FESTIVAL15</span> to secure 15% discount on checkout for all premium jewelry and bridal bookings. Free home shipping is included.
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex flex-col items-center">
            <Link 
              to="/shop?category=bridal-collection" 
              className="bg-charcoal-dark text-gold font-bold px-8 py-3.5 rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              Claim Your Offer
            </Link>
            <span className="text-xs text-charcoal-light font-medium mt-2">Valid till Dec 31, 2026</span>
          </div>
        </div>
      </section>

      {/* 4. Trending & Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-playfair font-bold text-white tracking-wide">Featured Jewelry</h2>
            <p className="text-xs text-gray-400 mt-1">Our best-selling and most curated hand-crafted designs</p>
          </div>
          <Link to="/shop" className="text-gold text-sm hover:underline flex items-center gap-1.5">
            View All Shop <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(prod => {
            const hasWish = isInWishlist(prod.id);
            return (
              <div 
                key={prod.id} 
                onClick={() => navigate(`/product/${prod.id}`)}
                className="glass-card rounded-2xl overflow-hidden p-4 flex flex-col hover:border-gold/40 transition-all group pulse-glow-hover cursor-pointer"
              >
                
                {/* Product Media */}
                <div className="relative h-60 rounded-xl overflow-hidden bg-charcoal-dark mb-4 border border-gray-800">
                  <img 
                    src={prod.images[0]} 
                    alt={prod.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Wishlist toggle */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(prod);
                    }}
                    className="absolute top-3 right-3 p-2 bg-charcoal-dark/70 rounded-full hover:bg-charcoal text-white hover:text-gold transition-colors focus:outline-none border border-gray-700/50 z-10"
                  >
                    <Heart size={16} fill={hasWish ? "#D4AF37" : "none"} stroke={hasWish ? "#D4AF37" : "currentColor"} />
                  </button>

                  {prod.discount > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {prod.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Specs */}
                <div className="flex-grow space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] text-gray-400">
                    <span>{prod.purity}</span>
                    <span>{prod.weight}g</span>
                  </div>
                  <h3 className="font-semibold text-white hover:text-gold transition-colors truncate">
                    {prod.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="flex text-gold">
                      <Star size={12} fill="#D4AF37" />
                      <Star size={12} fill="#D4AF37" />
                      <Star size={12} fill="#D4AF37" />
                      <Star size={12} fill="#D4AF37" />
                      <Star size={12} fill="#D4AF37" stroke="none" />
                    </div>
                    <span className="text-[10px] text-gray-500">(24)</span>
                  </div>
                </div>

                {/* Buy Section */}
                <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center">
                  <div>
                    <span className="text-base font-bold text-white">₹{(prod.price - (prod.price * (prod.discount / 100))).toLocaleString()}</span>
                    {prod.discount > 0 && (
                      <span className="text-xs text-gray-500 line-through block">₹{prod.price.toLocaleString()}</span>
                    )}
                  </div>

                  {prod.stock > 0 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(prod, 1);
                        alert(`${prod.name} added to cart!`);
                      }}
                      className="p-2.5 rounded-full gold-gradient-bg text-charcoal-dark font-semibold hover:scale-105 transition-transform z-10"
                      title="Add to Shopping Cart"
                    >
                      <ShoppingBag size={14} />
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-red-500 uppercase">Out of Stock</span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Customer Testimonials Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-3xl font-playfair font-bold text-white tracking-wide">Client Testimonials</h2>
          <div className="h-0.5 w-16 bg-gold mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Kiran Sharma', review: 'Bought my wedding necklace here. The filigree gold work is absolutely masterclass. HALLMARK stamp verified. Highly recommend!', rating: 5 },
            { name: 'Aman Singhal', review: 'Bought a customized platinum solitaire band. Drag rotation 360 viewer helped me lock down the ring. Aurora chat assistant was helpful.', rating: 5 },
            { name: 'Priyanka Sen', review: 'Outstanding customer care. Booked an in-store bridal consultation slot. Smooth experience and premium collection.', rating: 5 }
          ].map((t, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4">
              <div className="flex text-gold">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="#D4AF37" />
                ))}
              </div>
              <p className="text-xs italic text-gray-300 leading-relaxed">"{t.review}"</p>
              <h4 className="font-semibold text-xs text-gold uppercase tracking-wider">— {t.name} (Verified Purchase)</h4>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Instagram Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-3xl font-playfair font-bold text-white tracking-wide">Share Your Style #RainbowVibe</h2>
          <p className="text-xs text-gray-400 mt-1">Tag us on Instagram to get featured in our customer lookbook</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            '/assets/royal-red-bangles.jpg',
            '/assets/royal-green-necklace.jpg',
            '/assets/royal-ruby-necklace.jpg',
            '/assets/emerald-layered-necklace.jpg'
          ].map((url, idx) => (
            <div key={idx} className="relative rounded-2xl overflow-hidden h-64 border border-gray-800 group">
              <img src={url} alt="Instagram lookbook" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-xs font-semibold text-white tracking-wider">@RainbowJewelry</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
