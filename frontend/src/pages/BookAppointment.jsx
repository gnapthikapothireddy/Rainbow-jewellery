import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, Phone, ShieldCheck, Mail } from 'lucide-react';

export default function BookAppointment() {
  const { user } = useAuth();
  
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState(user ? user.phone || '' : '');
  const [branch, setBranch] = useState('Cuddapah Flagship');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [purpose, setPurpose] = useState('Bridal Consultation');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.bookAppointment({
        name,
        email,
        phone,
        branch,
        date,
        time,
        purpose,
        notes
      });

      if (res.success) {
        alert('Your consultation appointment has been requested! Our branch manager will contact you.');
        // Reset
        setDate('');
        setTime('');
        setNotes('');
      } else {
        alert(res.message || 'Booking failed');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-3xl font-playfair font-bold text-white tracking-wide">Bespoke In-Store Consultations</h1>
        <div className="h-0.5 w-16 bg-gold mx-auto mt-3 mb-2"></div>
        <p className="text-xs text-gray-400">
          Book private viewing sessions with jewelry design specialists and certified gemologists.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left column: Scheduler Form */}
        <div className="glass-card rounded-3xl p-6 border border-gray-800 space-y-6">
          <h3 className="text-sm font-semibold text-white tracking-wider uppercase flex items-center gap-2">
            <Calendar size={16} className="text-gold" /> Consultation Scheduler
          </h3>

          <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-gray-400">Your Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 px-3 text-white focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-gray-400">Contact Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91..."
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 px-3 text-white focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-gray-400">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 px-3 text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400">Select Store Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 px-3 text-white focus:outline-none"
              >
                <option value="Cuddapah Flagship">Cuddapah (YV Street Store)</option>
                <option value="Delhi Connaught">Delhi (Connaught Place)</option>
                <option value="Mumbai Colaba">Mumbai (Colaba showroom)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-gray-400">Purpose of Visit</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 px-3 text-white focus:outline-none"
              >
                <option value="Bridal Consultation">Bridal Consultation</option>
                <option value="Jewelry Purchase">Jewelry Purchase</option>
                <option value="Ring Size">Ring Size Test</option>
                <option value="Custom Design">Bespoke Jewelry Design</option>
                <option value="Jewelry Repair">Polishing & Repairs</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-gray-400">Choose Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400">Preferred Time Slot</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 px-3 text-white focus:outline-none"
              >
                <option value="">Choose Slot</option>
                <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
                <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM</option>
                <option value="05:00 PM - 07:00 PM">05:00 PM - 07:00 PM</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-gray-400">Specific Requirements or Gemstone Requests</label>
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention ring sizes or specific jewelry styles you wish to explore..."
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 px-3 text-white focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 gold-gradient-bg text-charcoal-dark font-bold py-3 rounded-xl hover:scale-102 transition-transform text-sm cursor-pointer shadow-md mt-2"
            >
              {loading ? 'Submitting Schedule...' : 'Submit Appointment Request'}
            </button>

          </form>
        </div>

        {/* Right column: Store Locators & Maps */}
        <div className="space-y-6">
          
          {/* Store Maps Locator */}
          <div className="glass-card rounded-3xl p-5 border border-gray-800 space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase flex items-center gap-2">
              <MapPin size={16} className="text-gold" /> Find Our Store Location
            </h3>
            
            {/* Embedded Iframe representing responsive maps locator */}
            <div className="w-full h-72 rounded-2xl overflow-hidden border border-gray-800 relative">
              <iframe
                title="Rainbow Jewelry Store locator"
                src="https://maps.google.com/maps?q=Rainbow%20Jewelry,%20YV%20St,%20Cuddapah,%20Andhra%20Pradesh,%20India&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 grayscale invert opacity-80"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
            
            <div className="space-y-4 pt-2">
              {[
                { name: 'Cuddapah Flagship Showroom', addr: 'YV St, Cuddapah, Andhra Pradesh, India', tel: '+91 89195 90533' },
                { name: 'Delhi Connaught Boutique', addr: 'Regal Building, Connaught Place, New Delhi 110001', tel: '+91 11 4350 2000' }
              ].map(store => (
                <div key={store.name} className="text-xs bg-charcoal p-4 rounded-2xl border border-gray-850 space-y-1">
                  <h4 className="font-bold text-white uppercase text-[11px]">{store.name}</h4>
                  <p className="text-gray-400">{store.addr}</p>
                  <p className="text-gold font-medium mt-1 flex items-center gap-1"><Phone size={12} /> {store.tel}</p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
