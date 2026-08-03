import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ShieldCheck } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await register(name, email, password, phone);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="glass-card max-w-md w-full p-8 rounded-3xl shadow-gold-glow border border-gold/15 space-y-6">
        
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-playfair font-bold text-white tracking-wide">Join Our Heritage</h2>
          <p className="text-xs text-gray-400 mt-1">Register a luxury client profile today</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-gray-400">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold"
              />
              <User size={14} className="absolute left-3 top-3.5 text-gray-500" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-gray-400">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold"
              />
              <Mail size={14} className="absolute left-3 top-3.5 text-gray-500" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-gray-400">Phone Number</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="+91..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-gray-600 focus:outline-none"
              />
              <Phone size={14} className="absolute left-3 top-3.5 text-gray-500" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-gray-400">Security Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold"
              />
              <Lock size={14} className="absolute left-3 top-3.5 text-gray-500" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-gray-400">Confirm Security Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold"
              />
              <Lock size={14} className="absolute left-3 top-3.5 text-gray-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient-bg text-charcoal-dark font-bold py-3 rounded-xl hover:scale-102 transition-transform text-sm cursor-pointer shadow-md"
          >
            {loading ? 'Registering...' : 'Register Profile'}
          </button>
        </form>

        <p className="text-[11px] text-gray-500 text-center">
          Already have a client login? <Link to="/login" className="text-gold hover:underline">Sign in</Link>
        </p>

        <div className="flex justify-center items-center gap-1.5 text-[10px] text-gray-500 border-t border-gray-850 pt-4">
          <ShieldCheck size={12} className="text-gold" /> HALMARK Certified Customer Protection
        </div>

      </div>
    </div>
  );
}
