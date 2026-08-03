import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, ShoppingCart, Gem, CalendarDays, 
  Ticket, Star, FileText, ArrowLeft, LogOut, ShieldCheck 
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Wait for session status to load
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-dark text-gold font-semibold text-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin h-8 w-8 border-2 border-gold border-t-transparent rounded-full"></div>
          <span>Authenticating Administrative Session...</span>
        </div>
      </div>
    );
  }

  // Role Based Route Guard Verification
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-dark px-4">
        <div className="glass-card max-w-md w-full p-8 text-center rounded-2xl shadow-gold-glow border border-red-500/20">
          <h2 className="text-xl font-playfair font-bold text-red-500 mb-3">Unauthorized Access</h2>
          <p className="text-sm text-gray-400 mb-6">
            You do not have administrative privileges to access this area.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/admin-login" className="gold-gradient-bg text-charcoal-dark px-5 py-2.5 rounded-lg text-sm font-semibold hover:scale-105 transition-transform">
              Admin Login
            </Link>
            <Link to="/" className="border border-gray-700 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-charcoal transition-colors">
              Main Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products & Stock', path: '/admin/products', icon: Gem },
    { name: 'Order Logs', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Appointments', path: '/admin/appointments', icon: CalendarDays },
    { name: 'Coupons Control', path: '/admin/coupons', icon: Ticket },
    { name: 'Reviews Moderate', path: '/admin/reviews', icon: Star }
  ];

  return (
    <div className="min-h-screen flex bg-charcoal-dark text-gray-100 font-inter">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-charcoal border-r border-gray-800 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-gold" size={24} />
            <span className="font-playfair font-bold text-lg tracking-wider text-white">ADMIN PORTAL</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {sidebarLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'gold-gradient-bg text-charcoal-dark font-bold' : 'text-gray-400 hover:text-white hover:bg-charcoal-light'}`}
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            <span>Return to Shop</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-20 border-b border-gray-800 flex items-center justify-between px-6 md:px-8 bg-charcoal">
          <h2 className="text-lg font-semibold text-white">
            Administrative Control Panel
          </h2>
          <div className="text-xs text-gray-400 flex items-center gap-2">
            <span>Operator:</span>
            <span className="font-semibold text-gold bg-charcoal-dark px-2.5 py-1 rounded-full border border-gold/25">
              {user.name}
            </span>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-grow">
          {children}
        </main>
      </div>

    </div>
  );
}
