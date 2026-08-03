import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { User, ShieldAlert, Award, MapPin, Trash2, Check } from 'lucide-react';

export default function CustomerProfile() {
  const { user, loading: authLoading, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Profile Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Address Book state
  const [addresses, setAddresses] = useState([]);
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const loadData = async () => {
    try {
      const res = await api.getProfile();
      if (res.success) {
        setName(res.data.user.name);
        setPhone(res.data.user.phone || '');
        setAddresses(res.data.addresses);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, authLoading]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    const payload = { name, phone };
    if (password) payload.password = password;

    const res = await updateProfile(payload);
    setSavingProfile(false);
    if (res.success) {
      alert('Profile updated successfully!');
      setPassword('');
    } else {
      alert(res.message);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const res = await api.saveAddress({
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        isDefault
      });
      if (res.success) {
        alert('Address added successfully!');
        setAddressLine1('');
        setAddressLine2('');
        setCity('');
        setState('');
        setPostalCode('');
        setIsDefault(false);
        loadData();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const res = await api.deleteAddress(id);
      if (res.success) {
        alert('Address removed!');
        loadData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-playfair font-bold text-white tracking-wide">My Profile Registry</h1>
        <p className="text-xs text-gray-400 mt-1">Manage address registries, security passwords, and loyalty rankings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile settings & Loyalty */}
        <div className="space-y-6">
          
          {/* Loyalty ranking */}
          <div className="gold-gradient-bg rounded-2xl p-6 text-charcoal-dark shadow-gold-glow relative overflow-hidden">
            <Award size={90} className="absolute right-0 bottom-0 opacity-10" />
            <h3 className="text-sm font-bold uppercase tracking-widest mb-1">Loyalty Privilege</h3>
            <div className="h-0.5 w-10 bg-charcoal-dark mb-4"></div>
            <div className="space-y-1">
              <span className="text-3xl font-bold font-playfair block">
                {user?.loyaltyPoints || 0} PTS
              </span>
              <p className="text-[10px] font-medium text-charcoal-light leading-relaxed">
                You receive 1 loyalty point for every ₹100 settled. Collect points to claim anniversary vouchers and custom making charge waivers.
              </p>
            </div>
          </div>

          {/* Profile settings */}
          <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4">
            <h3 className="text-xs font-semibold text-white tracking-wider uppercase flex items-center gap-1.5">
              <User size={14} className="text-gold" /> Personal Details
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-charcoal-dark border border-gray-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Mobile Number</label>
                <input
                  type="text"
                  placeholder="+91..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-charcoal-dark border border-gray-800 rounded-xl py-2 px-3 text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Update Password (Optional)</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-charcoal-dark border border-gray-800 rounded-xl py-2 px-3 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full gold-gradient-bg text-charcoal-dark font-bold py-2 rounded-xl text-xs hover:scale-102 transition-transform"
              >
                {savingProfile ? 'Saving Details...' : 'Save Settings'}
              </button>
            </form>
          </div>

        </div>

        {/* Right column: Address book management */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-6">
            <h3 className="text-xs font-semibold text-white tracking-wider uppercase flex items-center gap-1.5 border-b border-gray-850 pb-3">
              <MapPin size={14} className="text-gold" /> Address Registry
            </h3>

            {/* List addresses */}
            {addresses.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-2">No addresses saved yet. Fill in the form below to save an address.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map(addr => (
                  <div key={addr.id} className="bg-charcoal p-4 rounded-xl border border-gray-800 flex justify-between items-start text-xs">
                    <div>
                      {addr.isDefault && (
                        <span className="bg-gold/10 text-gold border border-gold/30 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-2 inline-block">
                          Primary Delivery
                        </span>
                      )}
                      <p className="text-white font-medium">{addr.addressLine1}</p>
                      {addr.addressLine2 && <p className="text-gray-400">{addr.addressLine2}</p>}
                      <p className="text-gray-400 mt-0.5">{addr.city}, {addr.state} - {addr.postalCode}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-gray-500 hover:text-red-500 transition-colors p-1"
                      title="Remove Address"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Address Form */}
            <div className="border-t border-gray-850 pt-6">
              <h4 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Save New Address</h4>
              
              <form onSubmit={handleSaveAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-gray-400">Address Line 1</label>
                  <input
                    type="text"
                    required
                    placeholder="Suite, Apartment, Building name"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full bg-charcoal-dark border border-gray-800 rounded-xl py-2 px-3 text-white focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-gray-400">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    placeholder="Floor, Land mark"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="w-full bg-charcoal-dark border border-gray-800 rounded-xl py-2 px-3 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">City</label>
                  <input
                    type="text"
                    required
                    placeholder="City name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-charcoal-dark border border-gray-800 rounded-xl py-2 px-3 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">State</label>
                  <input
                    type="text"
                    required
                    placeholder="State name"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-charcoal-dark border border-gray-800 rounded-xl py-2 px-3 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-gray-400">Postal / PIN Code</label>
                  <input
                    type="text"
                    required
                    placeholder="ZIP Code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-charcoal-dark border border-gray-800 rounded-xl py-2 px-3 text-white focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="isDefaultSelect"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="text-gold focus:ring-0 rounded bg-charcoal"
                  />
                  <label htmlFor="isDefaultSelect" className="text-gray-400">Set as primary delivery address</label>
                </div>

                <button
                  type="submit"
                  disabled={savingAddress}
                  className="md:col-span-2 gold-gradient-bg text-charcoal-dark font-bold py-2.5 rounded-xl text-xs hover:scale-102 transition-transform cursor-pointer"
                >
                  {savingAddress ? 'Saving Address...' : 'Register Address'}
                </button>

              </form>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
