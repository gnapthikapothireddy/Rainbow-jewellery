import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@rainbow.com'); // Pre-fill default admin details for testing
  const [password, setPassword] = useState('adminpassword123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.message || 'Administrative verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal-dark px-4 font-inter text-xs">
      <div className="glass-card max-w-md w-full p-8 rounded-3xl shadow-gold-glow border border-gold/20 space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <ShieldAlert className="text-gold mx-auto mb-2" size={36} />
          <h2 className="text-2xl font-playfair font-bold text-white tracking-widest uppercase">Admin Terminal</h2>
          <p className="text-[10px] text-gray-500 mt-1">Authorized operations center login only</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-gray-400 font-medium">Administrator Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-gold"
              />
              <Mail size={14} className="absolute left-3 top-3.5 text-gray-500" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-gray-400 font-medium">Operational Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-gold"
              />
              <Lock size={14} className="absolute left-3 top-3.5 text-gray-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient-bg text-charcoal-dark font-bold py-3 rounded-xl hover:scale-102 transition-transform text-sm cursor-pointer shadow-md"
          >
            {loading ? 'Verifying access...' : 'Authorize Terminal'}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/" className="text-[10px] text-gray-500 hover:text-white hover:underline transition-all">
            Return to store catalog
          </Link>
        </div>

      </div>
    </div>
  );
}
