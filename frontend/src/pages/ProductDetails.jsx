import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, Heart, ShoppingBag, Eye, Share2, 
  Sparkles, CheckCircle2, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ImageZoom from '../components/product/ImageZoom';
import ThreeSixtyViewer from '../components/product/ThreeSixtyViewer';
import VideoPlayer from '../components/product/VideoPlayer';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [activeMedia, setActiveMedia] = useState('image'); // image, 360, video
  const [selectedImage, setSelectedImage] = useState('');
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        const res = await api.getProductById(id);
        if (res.success) {
          setData(res.data);
          setSelectedImage(res.data.product.images[0]);
          setActiveMedia('image');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-charcoal rounded-2xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-charcoal w-3/4 rounded"></div>
            <div className="h-6 bg-charcoal w-1/4 rounded"></div>
            <div className="h-24 bg-charcoal rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400">Product details could not be loaded.</p>
        <Link to="/shop" className="text-gold underline mt-2 block">Back to Catalog</Link>
      </div>
    );
  }

  const { product, reviews, averageRating, reviewCount, relatedProducts } = data;
  const hasWish = isInWishlist(product.id);

  // Price Breakdown Calculations
  const discountPercent = parseFloat(product.discount || 0);
  const basePrice = parseFloat(product.price);
  const discountAmount = basePrice * (discountPercent / 100);
  const finalMetalPrice = basePrice - discountAmount;
  const makingCharges = parseFloat(product.makingCharges || 0);
  const gstAmount = (finalMetalPrice + makingCharges) * 0.03; // 3% GST on jewelry
  const estimatedTotal = finalMetalPrice + makingCharges + gstAmount;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Shareable product details link copied to clipboard!');
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit product reviews.');
      navigate('/login');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.createReview({
        productId: product.id,
        rating,
        comment
      });
      if (res.success) {
        alert('Review added successfully!');
        setComment('');
        // Reload data
        const reloadRes = await api.getProductById(id);
        if (reloadRes.success) setData(reloadRes.data);
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Breadcrumb */}
      <div className="text-xs text-gray-400">
        <Link to="/" className="hover:text-gold">Home</Link> / <Link to="/shop" className="hover:text-gold">Shop</Link> / <span className="text-white font-medium">{product.name}</span>
      </div>

      {/* Grid: Media + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column: Media Display */}
        <div className="space-y-4">
          
          {/* Media Player Pane */}
          {activeMedia === 'image' && (
            <ImageZoom src={selectedImage} alt={product.name} />
          )}

          {activeMedia === '360' && (
            <ThreeSixtyViewer image={selectedImage} />
          )}

          {activeMedia === 'video' && (
            <VideoPlayer videoUrl={product.videoUrl} />
          )}

          {/* Media Mode Selectors */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setActiveMedia('image')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${activeMedia === 'image' ? 'gold-gradient-bg text-charcoal-dark font-bold' : 'bg-charcoal text-gray-300 hover:bg-charcoal-light'}`}
            >
              Gallery View
            </button>
            <button
              onClick={() => setActiveMedia('360')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${activeMedia === '360' ? 'gold-gradient-bg text-charcoal-dark font-bold' : 'bg-charcoal text-gray-300 hover:bg-charcoal-light'}`}
            >
              360° Rotator
            </button>
            {product.videoUrl && (
              <button
                onClick={() => setActiveMedia('video')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${activeMedia === 'video' ? 'gold-gradient-bg text-charcoal-dark font-bold' : 'bg-charcoal text-gray-300 hover:bg-charcoal-light'}`}
              >
                Video Showcase
              </button>
            )}
          </div>

          {/* Thumbnail Gallery (only for images mode) */}
          {activeMedia === 'image' && product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-2 justify-center">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Thumbnail ${i}`}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer border hover:border-gold transition-colors ${selectedImage === img ? 'border-gold shadow-gold-glow' : 'border-gray-800'}`}
                />
              ))}
            </div>
          )}

        </div>

        {/* Right Column: Spec Sheet & Checkout */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs text-gold font-bold tracking-widest uppercase flex items-center gap-1">
              <Sparkles size={12} /> {product.purity} Hallmarked
            </span>
            <h1 className="text-3xl font-playfair font-bold text-white tracking-wide">{product.name}</h1>
            
            {/* Review Average Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(averageRating) ? "#D4AF37" : "none"} stroke="#D4AF37" />
                ))}
              </div>
              <span className="text-xs text-gray-300">
                {averageRating} ({reviewCount} verified audits)
              </span>
            </div>
          </div>

          {/* Luxury Valuation & Price Calculator Breakdown */}
          <div className="glass-card rounded-2xl p-5 border border-gray-800 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Metal Base Price:</span>
              <span className="text-white font-semibold">₹{basePrice.toLocaleString()}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-red-400">
                <span>Festival discount ({discountPercent}%):</span>
                <span>- ₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Making Charges:</span>
              <span className="text-white">₹{makingCharges.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Jewelry Tax (3% GST):</span>
              <span className="text-white">₹{gstAmount.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-800 pt-3 flex justify-between items-end">
              <span className="text-gold font-bold uppercase tracking-wider">Estimated Total Price:</span>
              <span className="text-2xl font-bold text-white font-playfair">₹{estimatedTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Product Description */}
          {product.description && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Product Description</h3>
              <p className="text-xs text-gray-300 leading-relaxed bg-charcoal p-4 rounded-xl border border-gray-800">
                {product.description}
              </p>
            </div>
          )}

          {/* Specifications Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Jewelry Specifications</h3>
            <div className="grid grid-cols-2 gap-4 text-xs bg-charcoal p-4 rounded-xl border border-gray-800">
              <div><span className="text-gray-500 block">SKU Code</span><span className="text-white font-medium">{product.sku}</span></div>
              <div><span className="text-gray-500 block">Metal Purity</span><span className="text-white font-medium">{product.purity}</span></div>
              <div><span className="text-gray-500 block">Jewelry Net Weight</span><span className="text-white font-medium">{product.weight} grams</span></div>
              <div><span className="text-gray-500 block">Stone Specifications</span><span className="text-white font-medium">{product.stoneDetails || 'No stone settings'}</span></div>
            </div>
          </div>

          {/* Additional Bulleted Specifications */}
          {product.specifications && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Details & Specifications</h3>
              <div className="bg-charcoal p-4 rounded-xl border border-gray-800 text-xs text-gray-300 space-y-1.5">
                {product.specifications.split('\n').map((spec, index) => (
                  <div key={index} className="flex items-start gap-1.5">
                    <span className="text-gold font-bold">•</span>
                    <span>{spec.replace(/^[•\-\*]\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stock Availability indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span>Availability:</span>
            {product.stock === 0 ? (
              <span className="text-red-500 font-bold uppercase flex items-center gap-1"><AlertTriangle size={12} /> Out of Stock</span>
            ) : product.stock < 5 ? (
              <span className="text-amber-500 font-bold uppercase flex items-center gap-1"><AlertTriangle size={12} /> Low Stock (Only {product.stock} items left)</span>
            ) : (
              <span className="text-green-500 font-bold uppercase flex items-center gap-1"><CheckCircle2 size={12} /> In Stock (Ready for Dispatch)</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            {product.stock > 0 ? (
              <>
                <div className="flex items-center border border-gray-700 bg-charcoal rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3.5 py-2 text-gray-400 hover:text-white">-</button>
                  <span className="px-3 text-sm text-white font-semibold">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3.5 py-2 text-gray-400 hover:text-white">+</button>
                </div>

                <button
                  onClick={() => {
                    addToCart(product, qty);
                    alert(`${qty} x ${product.name} added to cart!`);
                  }}
                  className="flex-grow gold-gradient-bg text-charcoal-dark font-bold py-3 px-6 rounded-xl hover:scale-103 transition-transform flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full border border-gold hover:bg-gold/10 text-gold font-bold py-3 px-6 rounded-xl hover:scale-103 transition-transform flex items-center justify-center gap-2"
                >
                  Buy Now
                </button>
              </>
            ) : (
              <button 
                onClick={() => alert(`We will notify you when ${product.name} is back in stock!`)}
                className="w-full bg-charcoal border border-gray-700 hover:border-gold hover:text-gold text-white font-bold py-3 rounded-xl transition-all"
              >
                Notify Me When In Stock
              </button>
            )}

            <button
              onClick={() => toggleWishlist(product)}
              className="p-3 border border-gray-700 hover:border-gold rounded-xl hover:text-gold transition-colors text-white"
              title="Add to Wishlist"
            >
              <Heart size={18} fill={hasWish ? "#D4AF37" : "none"} stroke={hasWish ? "#D4AF37" : "currentColor"} />
            </button>

            <button
              onClick={handleShare}
              className="p-3 border border-gray-700 hover:border-gold rounded-xl hover:text-gold transition-colors text-white"
              title="Share Design"
            >
              <Share2 size={18} />
            </button>
          </div>

          <div className="flex gap-4 text-[10px] text-gray-500 border-t border-gray-800 pt-4">
            <div className="flex items-center gap-1"><ShieldCheck size={12} className="text-gold" /> Hallmarked stamp certification</div>
            <div className="flex items-center gap-1"><ShieldCheck size={12} className="text-gold" /> Fully insured nationwide transit</div>
          </div>

        </div>

      </div>

      {/* Reviews registry & Submission */}
      <section className="border-t border-gray-800 pt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left pane: submit review */}
        <div className="space-y-4">
          <h2 className="text-xl font-playfair font-bold text-white tracking-wide">Write a Verified Review</h2>
          <p className="text-xs text-gray-400">Share your rating and comments about this piece.</p>
          
          <form onSubmit={handleReviewSubmit} className="glass-card rounded-2xl p-5 border border-gray-800 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400">Star Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="w-full bg-charcoal-dark border border-gray-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-gold"
              >
                <option value="5">★★★★★ Outstanding (5/5)</option>
                <option value="4">★★★★ Excellent (4/5)</option>
                <option value="3">★★★ Average (3/5)</option>
                <option value="2">★★ Disappointing (2/5)</option>
                <option value="1">★ Poor (1/5)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400">Review Commentary</label>
              <textarea
                rows="4"
                placeholder="Write detail comments..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="w-full bg-charcoal-dark border border-gray-800 rounded-xl py-2 px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="w-full gold-gradient-bg text-charcoal-dark font-bold py-2 rounded-xl text-xs hover:scale-102 transition-transform"
            >
              {submittingReview ? 'Submitting...' : 'Submit Rating'}
            </button>
          </form>
        </div>

        {/* Right pane: list reviews */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-playfair font-bold text-white tracking-wide">Customer Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-xs text-gray-500 italic py-6">Be the first to review this hallmarked article.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="bg-charcoal p-4 rounded-2xl border border-gray-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gold">{r.User ? r.User.name : 'Verified Customer'}</span>
                    <span className="text-[10px] text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} fill={i < r.rating ? "#D4AF37" : "none"} stroke="#D4AF37" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="border-t border-gray-800 pt-12 space-y-6">
          <h2 className="text-2xl font-playfair font-bold text-white tracking-wide">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <Link 
                key={p.id} 
                to={`/product/${p.id}`}
                className="glass-card rounded-2xl p-4 border border-gray-800 hover:border-gold/30 hover:scale-102 transition-all flex flex-col"
              >
                <img src={p.images[0]} alt={p.name} className="w-full h-44 object-cover rounded-xl border border-gray-800 mb-3" />
                <h3 className="font-semibold text-xs text-white truncate">{p.name}</h3>
                <span className="text-xs text-gold font-bold mt-1">₹{p.price.toLocaleString()}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
