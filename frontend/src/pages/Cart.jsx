import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight, Gift, Ticket, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const { 
    cartItems, removeFromCart, updateQuantity, 
    coupon, applyCouponCode, removeCoupon, giftWrapping, setGiftWrapping,
    getSubtotal, getDiscountAmount, getGstAmount, getShippingCharges, getGiftWrappingCharges, getCartTotal 
  } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;

    const res = await applyCouponCode(couponCode);
    if (res.success) {
      setCouponCode('');
    } else {
      setCouponError(res.message || 'Failed to apply coupon');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="flex justify-center text-gray-600">
          <ShoppingCart size={64} className="stroke-1" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-playfair font-bold text-white tracking-wide">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-gray-400">Discover hand-crafted jewelry and add items to purchase.</p>
        </div>
        <Link 
          to="/shop" 
          className="inline-block gold-gradient-bg text-charcoal-dark font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-gold-glow"
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-playfair font-bold text-white tracking-wide">Shopping Bag</h1>
        <p className="text-xs text-gray-400 mt-1">Review your bag items and proceed to secure billing checkout.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left pane: items list */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => {
            const prod = item.product;
            const singleDiscount = prod.price * (prod.discount / 100);
            const discountedSinglePrice = prod.price - singleDiscount + parseFloat(prod.makingCharges || 0);

            return (
              <div 
                key={prod.id} 
                className="glass-card rounded-2xl p-4 border border-gray-800 flex gap-4 items-center justify-between flex-wrap md:flex-nowrap"
              >
                
                {/* Photo & title */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <img src={prod.images[0]} alt={prod.name} className="w-20 h-20 object-cover rounded-xl border border-gray-800" />
                  <div>
                    <h3 className="font-semibold text-sm text-white">{prod.name}</h3>
                    <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5">{prod.purity} | Weight: {prod.weight}g</p>
                    <span className="text-xs font-bold text-gold mt-1 block">₹{discountedSinglePrice.toLocaleString()} each</span>
                  </div>
                </div>

                {/* Adjuster & Delete */}
                <div className="flex items-center gap-6 justify-between w-full md:w-auto mt-4 md:mt-0">
                  
                  {/* Quantity Controller */}
                  <div className="flex items-center border border-gray-700 bg-charcoal rounded-xl overflow-hidden text-xs">
                    <button 
                      onClick={() => updateQuantity(prod.id, item.quantity - 1)}
                      className="px-3 py-1.5 text-gray-400 hover:text-white"
                    >
                      -
                    </button>
                    <span className="px-3 text-white font-semibold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(prod.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-gray-400 hover:text-white"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal column */}
                  <div className="text-right">
                    <span className="text-sm font-bold text-white block">₹{(discountedSinglePrice * item.quantity).toLocaleString()}</span>
                  </div>

                  {/* Delete button */}
                  <button 
                    onClick={() => removeFromCart(prod.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>
            );
          })}

          {/* Gift Wrapping Selection Box */}
          <div className="glass-card rounded-2xl p-5 border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="text-gold" size={24} />
              <div>
                <h4 className="text-sm font-semibold text-white">Add Premium Gift Wrapping</h4>
                <p className="text-[10px] text-gray-400">Insured luxury velvet pouch box with personalized greeting card (+₹100)</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={giftWrapping} 
                onChange={(e) => setGiftWrapping(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-charcoal rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
            </label>
          </div>

        </div>

        {/* Right pane: receipt summaries */}
        <div className="space-y-6">
          
          {/* Coupon codes panel */}
          <div className="glass-card rounded-2xl p-5 border border-gray-800 space-y-4">
            <h3 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
              <Ticket size={14} /> Promotional Coupon
            </h3>

            {coupon ? (
              <div className="flex justify-between items-center bg-gold/10 border border-gold/30 rounded-xl p-3 text-xs">
                <div>
                  <span className="font-bold text-gold block">{coupon.code} Applied</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    Discount: {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                  </span>
                </div>
                <button 
                  onClick={removeCoupon}
                  className="text-red-400 hover:text-red-500 font-semibold focus:outline-none"
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code (e.g. WELCOME10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-grow bg-charcoal-dark border border-gray-700 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-gray-500 focus:outline-none focus:border-gold"
                  />
                  <button type="submit" className="gold-gradient-bg text-charcoal-dark font-bold px-4 rounded-xl text-xs hover:scale-102 transition-transform">
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[10px] text-red-500 font-semibold pl-1">{couponError}</p>}
              </form>
            )}
          </div>

          {/* Receipt Summaries Box */}
          <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4 text-sm">
            <h3 className="text-sm font-semibold text-white tracking-wide border-b border-gray-800 pb-3">Order Receipt</h3>
            
            <div className="space-y-2.5">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal amount:</span>
                <span className="text-white">₹{getSubtotal().toLocaleString()}</span>
              </div>
              
              {coupon && (
                <div className="flex justify-between text-green-400">
                  <span>Promo discount:</span>
                  <span>- ₹{getDiscountAmount().toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-400">
                <span>Tax (3% GST):</span>
                <span className="text-white">₹{getGstAmount().toLocaleString()}</span>
              </div>

              {giftWrapping && (
                <div className="flex justify-between text-gray-400">
                  <span>Gift wrapping charges:</span>
                  <span className="text-white">₹{getGiftWrappingCharges().toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-400">
                <span>Shipping charges:</span>
                <span className="text-white">
                  {getShippingCharges() === 0 ? <span className="text-green-500 font-semibold">FREE</span> : `₹${getShippingCharges()}`}
                </span>
              </div>

              <div className="border-t border-gray-800 pt-3 flex justify-between items-end">
                <span className="text-gold font-bold uppercase tracking-wider text-xs">Grand Total:</span>
                <span className="text-2xl font-bold text-white font-playfair">₹{getCartTotal().toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-4 gold-gradient-bg text-charcoal-dark font-bold py-3 rounded-xl hover:scale-103 transition-transform flex items-center justify-center gap-2 text-sm shadow-gold-glow"
            >
              Secure Checkout <ArrowRight size={16} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
