import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Copy, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccess() {
  const location = useLocation();

  // Retrieve checkout state variables passed from router state
  const { 
    orderId = '1004', 
    trackingNumber = 'TRK827364129', 
    totalAmount = '1,25,000.00', 
    transactionId = 'TXN-A8B9C0D1E' 
  } = location.state || {};

  useEffect(() => {
    // Confetti explosion on mounts
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#D4AF37', '#F3E5AB', '#AA7C11']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#D4AF37', '#F3E5AB', '#AA7C11']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-8">
      
      {/* Visual Indicator */}
      <div className="flex flex-col items-center gap-3">
        <CheckCircle2 size={64} className="text-gold animate-bounce" />
        <h1 className="text-3xl font-playfair font-bold text-white tracking-wide">Purchase Completed!</h1>
        <p className="text-xs text-gray-400">
          Your payment has been successfully authorized and the order is confirmed.
        </p>
      </div>

      {/* Audit Box */}
      <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4 text-xs text-left">
        <h3 className="text-sm font-semibold text-white tracking-wider border-b border-gray-800 pb-2 flex items-center gap-1">
          <Award size={14} className="text-gold" strokeWidth={2.5} /> Summary & Tracking
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Order Reference ID:</span>
            <span className="text-white font-semibold">#{orderId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Transit Tracking:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-gold font-bold">{trackingNumber}</span>
              <button 
                onClick={() => handleCopyCode(trackingNumber)} 
                className="text-gray-400 hover:text-white"
                title="Copy tracking number"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Gateway Transaction ID:</span>
            <span className="text-white font-mono">{transactionId}</span>
          </div>

          <div className="flex justify-between items-center border-t border-gray-850 pt-2.5">
            <span className="text-gray-500">Amount Charged:</span>
            <span className="text-sm font-bold text-white">₹{parseFloat(totalAmount).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Customer instructions */}
      <div className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
        A copy of your hallmark certificate, invoice, and real-time package dispatch alerts has been transmitted to your email.
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center pt-2">
        <Link 
          to="/shop" 
          className="gold-gradient-bg text-charcoal-dark font-bold px-6 py-2.5 rounded-full text-xs hover:scale-105 transition-transform"
        >
          Continue Shopping
        </Link>
        <Link 
          to="/my-orders" 
          className="border border-gray-700 text-white px-6 py-2.5 rounded-full text-xs hover:bg-charcoal transition-colors flex items-center gap-1"
        >
          My Orders <ChevronRight size={14} />
        </Link>
      </div>

    </div>
  );
}
