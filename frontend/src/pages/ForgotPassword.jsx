import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, KeyRound, Check } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Send email, 2: Verify & reset
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.forgotPassword({ email });
      if (res.success) {
        // Capture simulation code for instant demo ease
        setResetCode(res.devResetCode || '123456');
        setStep(2);
      } else {
        setError(res.message || 'Email not found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (enteredCode !== resetCode) {
      setError('Invalid verification code');
      return;
    }

    setLoading(true);
    try {
      const res = await api.resetPassword({ email, password });
      if (res.success) {
        alert('Password has been reset successfully! Redirecting to login...');
        navigate('/login');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="glass-card max-w-md w-full p-8 rounded-3xl shadow-gold-glow border border-gold/15 space-y-6">
        
        <div className="text-center">
          <h2 className="text-3xl font-playfair font-bold text-white tracking-wide">Reset Passwords</h2>
          <p className="text-xs text-gray-400 mt-1">Recover administrative or customer profiles</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-gray-400">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold"
                />
                <Mail size={14} className="absolute left-3 top-3.5 text-gray-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient-bg text-charcoal-dark font-bold py-3 rounded-xl hover:scale-102 transition-transform text-sm cursor-pointer"
            >
              {loading ? 'Transmitting code...' : 'Transmit Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
            
            {/* Visual simulation alert helper */}
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-3 text-[10px] text-gold leading-relaxed">
              <span className="font-bold">System Simulation:</span> We generated a recovery key: <span className="font-bold font-mono border border-gold bg-charcoal-dark px-2 py-0.5 rounded">{resetCode}</span>. In production, this code is emailed.
            </div>

            <div className="space-y-1">
              <label className="text-gray-400">Verification Code</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Enter recovery key"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-gray-600 focus:outline-none"
                />
                <KeyRound size={14} className="absolute left-3 top-3.5 text-gray-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-400">New Password</label>
              <input
                type="password"
                required
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 px-3 text-white placeholder-gray-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient-bg text-charcoal-dark font-bold py-3 rounded-xl hover:scale-102 transition-transform text-sm cursor-pointer"
            >
              {loading ? 'Applying reset...' : 'Confirm Reset Password'}
            </button>
          </form>
        )}

        <div className="text-center">
          <Link to="/login" className="text-xs text-gray-500 hover:text-white transition-colors">Return to login</Link>
        </div>

      </div>
    </div>
  );
}
