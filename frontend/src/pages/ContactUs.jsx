import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us! Our team will get back to you shortly.');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-4xl font-playfair font-bold text-white tracking-wide">Connect With Us</h1>
        <div className="h-0.5 w-16 bg-gold mx-auto"></div>
        <p className="text-xs text-gray-400">
          Have queries about custom jewelry, diamond certifications, or order shipments? Contact our advisors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column: Form */}
        <div className="glass-card rounded-3xl p-6 border border-gray-800 space-y-6">
          <h3 className="text-sm font-semibold text-white tracking-wider uppercase flex items-center gap-2">
            <Send size={16} className="text-gold" /> Write to Our Advisors
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-gray-400">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 px-3 text-white focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-gray-400">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 px-3 text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 px-3 text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400">Detailed Message</label>
              <textarea
                rows="4"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-charcoal border border-gray-700 rounded-xl py-2.5 px-3 text-white focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full gold-gradient-bg text-charcoal-dark font-bold py-3 rounded-xl hover:scale-102 transition-transform text-sm cursor-pointer shadow-md"
            >
              Submit Message
            </button>

          </form>
        </div>

        {/* Right Column: Store directions & Phone */}
        <div className="space-y-6">
          
          <div className="glass-card rounded-3xl p-5 border border-gray-800 space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase flex items-center gap-2">
              <MapPin size={16} className="text-gold" /> Store locator
            </h3>

            <div className="w-full h-64 rounded-2xl overflow-hidden border border-gray-800">
              <iframe
                title="Google Maps Locator frame"
                src="https://maps.google.com/maps?q=YV%20St,%20YV%20Street,%20Ganagapeta,%20Kadapa,%20Andhra%20Pradesh%20516001&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 grayscale invert opacity-70"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex flex-col bg-charcoal p-3.5 rounded-xl border border-gray-850 gap-3">
                <div className="flex items-start gap-3">
                  <MapPin className="text-gold mt-0.5" size={16} />
                  <div>
                    <h4 className="font-bold text-white uppercase text-[10px] tracking-wider mb-1">📍 Rainbow Jewelry</h4>
                    <p className="text-gray-400 mt-0.5 leading-relaxed font-semibold">
                      YV St,<br/>
                      YV Street,<br/>
                      Ganagapeta,<br/>
                      Kadapa,<br/>
                      Andhra Pradesh – 516001
                    </p>
                  </div>
                </div>
                
                <a
                  href="https://www.google.com/maps/search/?api=1&query=YV+St,+YV+Street,+Ganagapeta,+Kadapa,+Andhra+Pradesh+516001"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-block text-center gold-gradient-bg text-charcoal-dark font-semibold py-2.5 rounded-xl hover:scale-102 transition-transform text-xs shadow-gold-glow cursor-pointer mt-1"
                >
                  Open in Google Maps
                </a>
              </div>

              <div className="flex items-start gap-3 bg-charcoal p-3.5 rounded-xl border border-gray-850">
                <Phone className="text-gold mt-0.5" size={16} />
                <div>
                  <h4 className="font-bold text-white uppercase text-[10px]">Tele-Assistance Support</h4>
                  <p className="text-gray-400 mt-0.5">+91 141 236 4820</p>
                  <p className="text-gray-400">+91 99999 99999</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-charcoal p-3.5 rounded-xl border border-gray-850">
                <Mail className="text-gold mt-0.5" size={16} />
                <div>
                  <h4 className="font-bold text-white uppercase text-[10px]">Electronic Mail</h4>
                  <p className="text-gray-400 mt-0.5">info@rainbowjewelry.com</p>
                  <p className="text-gray-400">concierge@rainbowjewelry.com</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
