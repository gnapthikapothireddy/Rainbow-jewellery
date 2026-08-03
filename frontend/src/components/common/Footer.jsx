import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing to our premium updates newsletter!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-charcoal-dark border-t border-gray-800 text-gray-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-playfair font-bold text-white tracking-widest gold-gradient-text">RAINBOW JEWELRY</h3>
            <p className="leading-relaxed">
              Crafting premium luxury and bridal jewelry since 1998. Experience the timeless heritage of pure gold, platinum, and certified diamonds.
            </p>
            <div className="flex space-x-4 text-xs">
              <span className="text-gold font-semibold">★ Hallmark Certified</span>
              <span className="text-gold font-semibold">★ Insured Delivery</span>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 tracking-wider">Customer Care</h4>
            <ul className="space-y-2.5">
              <li><Link to="/book-appointment" className="hover:text-gold transition-colors">Book Consultation</Link></li>
              <li><Link to="/faq" className="hover:text-gold transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/return-policy" className="hover:text-gold transition-colors">Return & Refund Policy</Link></li>
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 tracking-wider">Quick Collections</h4>
            <ul className="space-y-2.5">
              <li><Link to="/shop?category=gold-jewelry" className="hover:text-gold transition-colors">Gold Jewelry</Link></li>
              <li><Link to="/shop?category=diamond-jewelry" className="hover:text-gold transition-colors">Diamond Collection</Link></li>
              <li><Link to="/shop?category=platinum-jewelry" className="hover:text-gold transition-colors">Platinum Bands</Link></li>
              <li><Link to="/shop?category=bridal-collection" className="hover:text-gold transition-colors">Bridal Specials</Link></li>
            </ul>
          </div>

          {/* Newsletter / Address */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-base tracking-wider">Subscribe to Catalog</h4>
            <p className="text-xs">Receive updates on gold rate discounts, new arrivals, and anniversary specials.</p>
            
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-charcoal border border-gray-700 text-white rounded-l-md px-3 py-2 text-xs focus:outline-none focus:border-gold"
              />
              <button type="submit" className="gold-gradient-bg text-charcoal-dark font-semibold px-4 rounded-r-md hover:bg-gold transition-all">
                <Send size={14} />
              </button>
            </form>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gold" />
                <span>+91 89195 90533 (Support)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gold" />
                <span>support@rainbowjewelry.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gold" />
                <span>YV St, Cuddapah, Andhra Pradesh, India</span>
              </div>
            </div>

          </div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} Rainbow Jewelry. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="https://wa.me/918919590533" target="_blank" rel="noreferrer" className="text-green-500 hover:underline">WhatsApp Support</a>
            <Link to="/contact" className="hover:text-gold transition-colors">Store Locator</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
