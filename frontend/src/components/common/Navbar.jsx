import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingBag, Heart, User, Calendar, 
  Mic, MicOff, Menu, X, Bell, Award 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotifications } from '../../context/NotificationContext';
import logoImg from '../../assets/logo.png';
import { api } from '../../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { notifications, markAsRead } = useNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const searchRef = useRef(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const clickHandler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', clickHandler);
    return () => document.removeEventListener('mousedown', clickHandler);
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const res = await api.getSuggestions(searchQuery);
          if (res.success) {
            setSuggestions(res.data);
            setShowSuggestions(true);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Voice Search Web Speech API trigger
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice Search is not supported on this browser. Please try Chrome/Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (e) => {
      console.error('Speech recognition error:', e.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setShowSuggestions(false);
      navigate(`/shop?search=${encodeURIComponent(transcript)}`);
    };

    recognition.start();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="glass-nav sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src={logoImg} 
                alt="Rainbow Jewelry Logo" 
                className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px] rounded-full object-cover border border-gold/10 mr-[10px] md:mr-[12px] bg-transparent"
                style={{
                  display: 'inline-block',
                  verticalAlign: 'middle'
                }}
              />
              <span className="text-xl sm:text-2xl font-playfair font-bold tracking-wider gold-gradient-text leading-none">
                RAINBOW JEWELRY
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <Link to="/" className="text-gray-300 hover:text-gold transition-colors">Home</Link>
            <Link to="/shop" className="text-gray-300 hover:text-gold transition-colors">Shop</Link>
            <Link to="/categories" className="text-gray-300 hover:text-gold transition-colors">Collections</Link>
            <Link to="/my-orders" className="text-gray-300 hover:text-gold transition-colors">My Orders</Link>
            <Link to="/contact" className="text-gray-300 hover:text-gold transition-colors">Contact</Link>
          </div>

          {/* Search & Icons Container */}
          <div className="flex items-center space-x-5">
            
            {/* Smart Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative hidden lg:block w-64" ref={searchRef}>
              <input
                type="text"
                placeholder="Search bridal, diamonds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-charcoal-dark border border-gray-700 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-gold text-white placeholder-gray-400"
              />
              <button type="submit" className="absolute right-7 top-2 text-gray-400 hover:text-gold">
                <Search size={16} />
              </button>
              <button 
                type="button" 
                onClick={handleVoiceSearch} 
                className={`absolute right-2 top-2 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-gold'}`}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 mt-2 w-72 glass-card rounded-xl shadow-gold-glow overflow-hidden z-50">
                  {suggestions.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSearchQuery('');
                        setShowSuggestions(false);
                        navigate(`/product/${p.id}`);
                      }}
                      className="p-3 flex items-center gap-3 cursor-pointer hover:bg-charcoal border-b border-gray-800 last:border-0"
                    >
                      <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-md border border-gray-700" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-medium text-white truncate">{p.name}</p>
                        <p className="text-xs text-gold font-semibold">₹{p.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>

            {/* Voice Search (Mobile screen trigger icon) */}
            <button onClick={handleVoiceSearch} className="lg:hidden text-gray-300 hover:text-gold">
              <Mic size={20} />
            </button>

            {/* Appointment Booking Icon */}
            <Link to="/book-appointment" className="text-gray-300 hover:text-gold relative group" title="Book Salon Appointment">
              <Calendar size={20} />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-charcoal border border-gold text-[10px] text-gold py-0.5 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Consultation
              </span>
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="text-gray-300 hover:text-gold relative">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-charcoal-dark font-bold text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="text-gray-300 hover:text-gold relative">
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-charcoal-dark font-bold text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="text-gray-300 hover:text-gold mt-1">
                <Bell size={20} />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-2 w-2"></span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-3 w-80 glass-card rounded-xl p-4 shadow-gold-glow z-50">
                  <h4 className="text-xs font-bold text-gold uppercase tracking-wider mb-2">Alerts & Updates</h4>
                  {notifications.length === 0 ? (
                    <p className="text-xs text-gray-400 py-3 text-center">No alerts at this moment</p>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`p-2 rounded text-xs cursor-pointer transition-colors ${n.isRead ? 'bg-transparent text-gray-400' : 'bg-charcoal text-white font-medium border-l-2 border-gold'}`}
                        >
                          <p className="font-semibold text-gold">{n.title}</p>
                          <p className="mt-0.5">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Customer profile / Admin Gate */}
            <div className="relative">
              <button onClick={() => setShowProfileDropdown(!showProfileDropdown)} className="text-gray-300 hover:text-gold mt-1">
                <User size={20} />
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-3 w-48 glass-card rounded-xl py-2 shadow-gold-glow z-50 text-sm">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-800 text-xs text-gray-400">
                        Hello, <span className="font-semibold text-gold">{user.name}</span>
                      </div>
                      <Link to="/profile" onClick={() => setShowProfileDropdown(false)} className="block px-4 py-2 hover:bg-charcoal text-gray-200">My Profile</Link>
                      <Link to="/my-orders" onClick={() => setShowProfileDropdown(false)} className="block px-4 py-2 hover:bg-charcoal text-gray-200">My Orders</Link>
                      {user.role === 'admin' && (
                        <Link to="/admin/dashboard" onClick={() => setShowProfileDropdown(false)} className="block px-4 py-2 hover:bg-charcoal text-gold font-semibold">Admin Panel</Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setShowProfileDropdown(false);
                          navigate('/login');
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-charcoal text-red-400"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setShowProfileDropdown(false)} className="block px-4 py-2 hover:bg-charcoal text-gray-200">Login</Link>
                      <Link to="/register" onClick={() => setShowProfileDropdown(false)} className="block px-4 py-2 hover:bg-charcoal text-gray-200">Register</Link>
                      <Link to="/admin-login" onClick={() => setShowProfileDropdown(false)} className="block px-4 py-2 hover:bg-charcoal text-gold font-semibold">Admin Portal</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Icon */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-300 hover:text-gold">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-charcoal border-b border-gray-800 px-4 pt-2 pb-4 space-y-1">
           <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded text-base font-medium text-gray-300 hover:text-gold">Home</Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded text-base font-medium text-gray-300 hover:text-gold">Shop</Link>
          <Link to="/categories" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded text-base font-medium text-gray-300 hover:text-gold">Collections</Link>
          <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded text-base font-medium text-gray-300 hover:text-gold">My Orders</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded text-base font-medium text-gray-300 hover:text-gold">Contact</Link>
        </div>
      )}
    </nav>
  );
}
