import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, Receipt, Shield, Landmark, User, Award, ArrowLeft, X } from 'lucide-react';

export default function Checkout() {
  const { 
    cartItems, coupon, giftWrapping, clearCart,
    getSubtotal, getDiscountAmount, getGstAmount, getShippingCharges, getGiftWrappingCharges, getCartTotal 
  } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Selected Payment Gateway state
  const [paymentMethod, setPaymentMethod] = useState('Stripe');

  // Delivery details modal state
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Delivery form fields states
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');

  // Field validation errors state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      alert('Please login to complete your order checkout.');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    // Pre-populate fields from profile
    setFullName(user.name || '');
    setMobileNumber(user.phone || '');
    setEmailAddress(user.email || '');
  }, [user, authLoading, cartItems]);

  const handlePlaceOrderClick = (e) => {
    e.preventDefault();
    // Open the Delivery Details modal
    setShowDeliveryModal(true);
  };

  const handleContinueToWhatsApp = async (e) => {
    e.preventDefault();
    setErrors({});

    // 1. Validation
    const validationErrors = {};
    if (!fullName.trim()) validationErrors.fullName = 'Full Name is required';
    if (!mobileNumber.trim()) validationErrors.mobileNumber = 'Mobile Number is required';
    if (!houseNo.trim()) validationErrors.houseNo = 'House / Flat No. is required';
    if (!street.trim()) validationErrors.street = 'Street / Area is required';
    if (!village.trim()) validationErrors.village = 'Village / City is required';
    if (!district.trim()) validationErrors.district = 'District is required';
    if (!state.trim()) validationErrors.state = 'State is required';
    if (!pinCode.trim()) validationErrors.pinCode = 'PIN Code is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      alert('Please fill in all mandatory fields (*) inside the Delivery Details form.');
      return;
    }

    // 2. Process Order placement
    setShowDeliveryModal(false);
    setIsProcessing(true);

    try {
      // Save address to database
      const addrRes = await api.saveAddress({
        addressLine1: `${houseNo}, ${street}`,
        addressLine2: village,
        city: district,
        state: state,
        postalCode: pinCode,
        isDefault: false
      });

      let addressId = null;
      if (addrRes.success) {
        addressId = addrRes.data.id;
      }

      // Save order record (Status defaults to 'Pending Confirmation' in backend)
      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        addressId,
        paymentMethod,
        couponCode: coupon ? coupon.code : null,
        giftWrapping
      };

      const orderRes = await api.createOrder(orderPayload);
      if (orderRes.success) {
        
        // 3. Format WhatsApp template message
        const currentDate = new Date().toLocaleDateString('en-IN');
        const currentTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        const productsListStr = cartItems.map((item, index) => {
          const discountPercent = parseFloat(item.product.discount || 0);
          const originalPrice = parseFloat(item.product.price);
          const finalItemPrice = originalPrice - (originalPrice * (discountPercent / 100)) + parseFloat(item.product.makingCharges || 0);
          const subTotalAmount = finalItemPrice * item.quantity;
          
          return `${index + 1}.\n\nProduct:\n${item.product.name}\n\nQuantity:\n${item.quantity}\n\nPrice:\n₹${finalItemPrice.toLocaleString()}\n\nSubtotal:\n₹${subTotalAmount.toLocaleString()}`;
        }).join('\n\n━━━━━━━━━━━━━━━━━━\n\n');

        const whatsappMessage = `🛍️ *New Order - Rainbow Jewelry*

👤 Customer Details

Name: ${fullName}

Phone: ${mobileNumber}

Email: ${emailAddress || 'N/A'}

🏠 Delivery Address

House/Flat:
${houseNo}

Street:
${street}

Village/City:
${village}

District:
${district}

State:
${state}

PIN Code:
${pinCode}

━━━━━━━━━━━━━━━━━━

💍 Ordered Products

${productsListStr}

━━━━━━━━━━━━━━━━━━

💰 Grand Total

₹${getCartTotal().toLocaleString()}

━━━━━━━━━━━━━━━━━━

💳 Selected Payment Method

${paymentMethod}

━━━━━━━━━━━━━━━━━━

📅 Order Date

${currentDate}

🕒 Time

${currentTime}

Thank you.`;

        // Redirect to owner's WhatsApp in a new tab
        const ownerWhatsAppNumber = '918919590533';
        const whatsappUrl = `https://wa.me/${ownerWhatsAppNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        window.open(whatsappUrl, '_blank');

        // Clear cart
        clearCart();

        // Navigate to success screen
        navigate('/order-success', { 
          state: { 
            orderId: orderRes.data.orderId,
            trackingNumber: orderRes.data.trackingNumber,
            totalAmount: orderRes.data.totalAmount,
            transactionId: orderRes.data.transactionId
          } 
        });
      } else {
        alert(orderRes.message || 'Error generating order record in database.');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-dark text-gold font-semibold text-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin h-8 w-8 border-2 border-gold border-t-transparent rounded-full"></div>
          <span>Loading Checkout Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <div className="text-xs text-gray-400">
        <Link to="/cart" className="hover:text-gold flex items-center gap-1.5"><ArrowLeft size={12} /> Return to Cart</Link>
      </div>

      <div>
        <h1 className="text-3xl font-playfair font-bold text-white tracking-wide">Checkout Settlement</h1>
        <p className="text-xs text-gray-400 mt-1">Review contact credentials, shipping lines, and complete transaction.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Payment Options */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase flex items-center gap-2">
              <CreditCard size={16} className="text-gold" /> Payment Gateways
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-semibold text-center">
              {[
                { name: 'COD', desc: 'Cash On Delivery', icon: Truck },
                { name: 'UPI', desc: 'Instant UPI simulator', icon: CreditCard },
                { name: 'Razorpay', desc: 'Razorpay Netbanking', icon: Landmark },
                { name: 'Stripe', desc: 'Stripe Sandbox mode', icon: CreditCard },
                { name: 'Credit Card', desc: 'Pay via Credit Card', icon: CreditCard },
                { name: 'Debit Card', desc: 'Pay via Debit Card', icon: CreditCard }
              ].map(gate => {
                const Icon = gate.icon;
                return (
                  <label
                    key={gate.name}
                    className={`flex flex-col items-center p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === gate.name ? 'border-gold bg-gold/5 text-gold font-bold shadow-gold-glow' : 'border-gray-800 bg-charcoal text-gray-300'}`}
                  >
                    <input
                      type="radio"
                      name="paymentSelect"
                      value={gate.name}
                      checked={paymentMethod === gate.name}
                      onChange={() => setPaymentMethod(gate.name)}
                      className="sr-only"
                    />
                    <Icon size={24} className="mb-2" />
                    <span>{gate.name}</span>
                    <span className="text-[9px] text-gray-500 font-normal mt-1 leading-normal">{gate.desc}</span>
                  </label>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Summaries review */}
        <div className="space-y-6">
          
          <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4 text-sm">
            <h3 className="text-sm font-semibold text-white tracking-wide border-b border-gray-850 pb-3 flex items-center gap-1.5">
              <Receipt size={16} className="text-gold" /> Settlement Summary
            </h3>

            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal amount:</span>
                <span className="text-white font-medium">₹{getSubtotal().toLocaleString()}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-green-400">
                  <span>Promo discount:</span>
                  <span>- ₹{getDiscountAmount().toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (3% GST):</span>
                <span className="text-white font-medium">₹{getGstAmount().toLocaleString()}</span>
              </div>
              {giftWrapping && (
                <div className="flex justify-between">
                  <span>Gift wrapping:</span>
                  <span className="text-white font-medium">₹{getGiftWrappingCharges().toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping charges:</span>
                <span className="text-white font-medium">
                  {getShippingCharges() === 0 ? <span className="text-green-500 font-semibold">FREE</span> : `₹${getShippingCharges()}`}
                </span>
              </div>

              <div className="border-t border-gray-800 pt-3 flex justify-between items-end">
                <span className="text-gold font-bold uppercase tracking-wider text-[10px]">Grand Total:</span>
                <span className="text-xl font-bold text-white font-playfair">₹{getCartTotal().toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrderClick}
              className="w-full mt-4 gold-gradient-bg text-charcoal-dark font-bold py-3 rounded-xl hover:scale-103 transition-transform flex items-center justify-center gap-2 text-sm shadow-gold-glow cursor-pointer"
            >
              Place Secure Order
            </button>
          </div>

          <div className="flex justify-center items-center gap-2 text-[10px] text-gray-500 text-center">
            <Shield size={12} className="text-gold" />
            <span>Secure order placement routing via WhatsApp.</span>
          </div>

        </div>

      </div>

      {/* ================= DELIVERY DETAILS MODAL ================= */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-lg w-full p-6 rounded-3xl shadow-gold-glow border border-gold/20 space-y-5 text-xs text-gray-300 relative my-8">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowDeliveryModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="text-center pb-2 border-b border-gray-800">
              <h3 className="text-base font-playfair font-bold text-white tracking-widest uppercase">
                Delivery Details
              </h3>
              <p className="text-[10px] text-gray-500 mt-1 uppercase">Please provide shipping destination details</p>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-gray-400">Full Name *</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full bg-charcoal border ${errors.fullName ? 'border-red-500' : 'border-gray-750'} p-2.5 rounded-xl text-white focus:outline-none`} 
                />
                {errors.fullName && <p className="text-[9px] text-red-500">{errors.fullName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Mobile Number *</label>
                <input 
                  type="text" 
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className={`w-full bg-charcoal border ${errors.mobileNumber ? 'border-red-500' : 'border-gray-750'} p-2.5 rounded-xl text-white focus:outline-none`} 
                />
                {errors.mobileNumber && <p className="text-[9px] text-red-500">{errors.mobileNumber}</p>}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-gray-400">Email Address (Optional)</label>
                <input 
                  type="email" 
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full bg-charcoal border border-gray-750 p-2.5 rounded-xl text-white focus:outline-none" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">House / Flat No. *</label>
                <input 
                  type="text" 
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  className={`w-full bg-charcoal border ${errors.houseNo ? 'border-red-500' : 'border-gray-750'} p-2.5 rounded-xl text-white focus:outline-none`} 
                />
                {errors.houseNo && <p className="text-[9px] text-red-500">{errors.houseNo}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Street / Area *</label>
                <input 
                  type="text" 
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className={`w-full bg-charcoal border ${errors.street ? 'border-red-500' : 'border-gray-750'} p-2.5 rounded-xl text-white focus:outline-none`} 
                />
                {errors.street && <p className="text-[9px] text-red-500">{errors.street}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Village / City *</label>
                <input 
                  type="text" 
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className={`w-full bg-charcoal border ${errors.village ? 'border-red-500' : 'border-gray-750'} p-2.5 rounded-xl text-white focus:outline-none`} 
                />
                {errors.village && <p className="text-[9px] text-red-500">{errors.village}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">District *</label>
                <input 
                  type="text" 
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className={`w-full bg-charcoal border ${errors.district ? 'border-red-500' : 'border-gray-750'} p-2.5 rounded-xl text-white focus:outline-none`} 
                />
                {errors.district && <p className="text-[9px] text-red-500">{errors.district}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">State *</label>
                <input 
                  type="text" 
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={`w-full bg-charcoal border ${errors.state ? 'border-red-500' : 'border-gray-750'} p-2.5 rounded-xl text-white focus:outline-none`} 
                />
                {errors.state && <p className="text-[9px] text-red-500">{errors.state}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">PIN Code *</label>
                <input 
                  type="text" 
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className={`w-full bg-charcoal border ${errors.pinCode ? 'border-red-500' : 'border-gray-750'} p-2.5 rounded-xl text-white focus:outline-none`} 
                />
                {errors.pinCode && <p className="text-[9px] text-red-500">{errors.pinCode}</p>}
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={handleContinueToWhatsApp}
              className="w-full gold-gradient-bg text-charcoal-dark font-bold py-3 rounded-xl hover:scale-102 transition-transform cursor-pointer text-center block mt-2"
            >
              Continue to WhatsApp
            </button>

          </div>
        </div>
      )}

      {/* Redirect toast loader overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-sm w-full p-8 text-center rounded-2xl shadow-gold-glow border border-gold/20 space-y-4">
            <div className="animate-spin h-10 w-10 border-4 border-gold border-t-transparent rounded-full mx-auto"></div>
            <h3 className="font-playfair font-bold text-white text-lg">Connecting with WhatsApp</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Redirecting to WhatsApp to complete your order...
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
