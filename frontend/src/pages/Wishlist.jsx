import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { Trash2, ShoppingBag, Share2, HeartCrack } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, moveToCart, shareWishlist } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="flex justify-center text-gray-600">
          <HeartCrack size={64} className="stroke-1" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-playfair font-bold text-white tracking-wide">Your Wishlist is Empty</h2>
          <p className="text-xs text-gray-400">Save items you like here to review or buy them later.</p>
        </div>
        <Link 
          to="/shop" 
          className="inline-block gold-gradient-bg text-charcoal-dark font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-gold-glow"
        >
          Discover Jewelry
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-800">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white tracking-wide">Saved Designs</h1>
          <p className="text-xs text-gray-400 mt-1">Review your saved articles and purchase when ready.</p>
        </div>

        <button
          onClick={shareWishlist}
          className="border border-gold text-gold hover:bg-gold/10 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 focus:outline-none"
        >
          <Share2 size={12} /> Share Wishlist
        </button>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map(p => {
          const itemPrice = p.price - (p.price * (p.discount / 100)) + parseFloat(p.makingCharges || 0);

          return (
            <div key={p.id} className="glass-card rounded-2xl p-4 flex flex-col hover:border-gold/30 hover:shadow-gold-glow transition-all duration-300 group">
              <div className="relative h-56 rounded-xl overflow-hidden bg-charcoal-dark border border-gray-800 mb-4">
                <Link to={`/product/${p.id}`}>
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </Link>
                {p.discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {p.discount}% OFF
                  </span>
                )}
              </div>

              <div className="flex-grow space-y-1">
                <span className="text-[10px] text-gray-500 font-semibold">{p.purity}</span>
                <h3 className="font-semibold text-sm text-white hover:text-gold truncate">
                  <Link to={`/product/${p.id}`}>{p.name}</Link>
                </h3>
                <span className="text-sm font-bold text-white block">₹{itemPrice.toLocaleString()}</span>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800 flex gap-2">
                {p.stock > 0 ? (
                  <button
                    onClick={() => moveToCart(p)}
                    className="flex-1 gold-gradient-bg text-charcoal-dark font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 hover:scale-102 transition-transform"
                  >
                    <ShoppingBag size={12} /> Move to Cart
                  </button>
                ) : (
                  <span className="flex-grow text-center text-xs font-semibold text-red-500 bg-red-500/10 py-2 rounded-xl uppercase">Out of Stock</span>
                )}

                <button
                  onClick={() => removeFromWishlist(p.id)}
                  className="p-2 border border-gray-700 hover:border-red-500 hover:text-red-500 text-gray-400 rounded-xl transition-colors"
                  title="Remove from Saved"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
