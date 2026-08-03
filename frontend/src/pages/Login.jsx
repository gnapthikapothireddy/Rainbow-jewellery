import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

export default function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Invalid email or credentials');
    }
  };

  // Google OAuth verification mockup flow
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const res = await googleLogin({
      googleId: 'G-OAUTH-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      name: 'Google Guest Client',
      email: 'googleclient@gmail.com'
    });
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="glass-card max-w-md w-full p-8 rounded-3xl shadow-gold-glow border border-gold/15 space-y-6">
        
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-playfair font-bold text-white tracking-wide">Welcome Back</h2>
          <p className="text-xs text-gray-400 mt-1">Sign in to your premium catalog registry</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-gray-400">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="operator@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold"
              />
              <Mail size={14} className="absolute left-3 top-3.5 text-gray-500" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-gray-400">Security Password</label>
              <Link to="/forgot-password" className="text-[10px] text-gold hover:underline">Forgot password?</Link>
            </div>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient-bg text-charcoal-dark font-bold py-3 rounded-xl hover:scale-102 transition-transform text-sm cursor-pointer shadow-md"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="relative flex py-2 items-center text-xs">
          <div className="flex-grow border-t border-gray-800"></div>
          <span className="flex-shrink mx-4 text-gray-500">or continue with</span>
          <div className="flex-grow border-t border-gray-800"></div>
        </div>

        {/* Google sign-in */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-charcoal hover:bg-charcoal-light border border-gray-850 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 hover:scale-102 transition-transform cursor-pointer"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.65 1.4 7.56l3.85 2.99C6.18 7.37 8.87 5.04 12 5.04z" />
            <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.03 3.67-5.01 3.67-8.64z" />
            <path fill="#FBBC05" d="M5.25 14.75a7.16 7.16 0 0 1 0-4.3l-3.85-2.99a11.96 11.96 0 0 0 0 10.28l3.85-2.99z" />
            <path fill="#34A853" d="M12 18.96c-3.13 0-5.82-2.33-6.75-5.51l-3.85 2.99C3.37 20.35 7.35 23 12 23c2.97 0 5.67-1.01 7.56-2.75l-3.76-2.91c-1.07.72-2.45 1.62-3.8 1.62z" />
          </svg>
          Google Authentication
        </button>

        <p className="text-[11px] text-gray-500 text-center">
          Don't have an account? <Link to="/register" className="text-gold hover:underline">Register now</Link>
        </p>

        <div className="flex justify-center items-center gap-1.5 text-[10px] text-gray-500 border-t border-gray-850 pt-4">
          <ShieldCheck size={12} className="text-gold" /> Secure Hallmarked Auth Node
        </div>

      </div>
    </div>
  );
}
