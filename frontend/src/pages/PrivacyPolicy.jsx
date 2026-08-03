import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-6 text-xs text-gray-300 leading-relaxed">
      <div className="text-center space-y-2">
        <Shield className="text-gold mx-auto" size={32} />
        <h1 className="text-3xl font-playfair font-bold text-white tracking-wide">Privacy Registry</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Effective Date: August 2, 2026</p>
      </div>

      <div className="glass-card rounded-3xl p-8 border border-gray-800 space-y-6">
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">1. Data Capture</h3>
          <p>
            We capture and archive essential identity metrics (Name, Contact numbers, email targets, shipping destinations) when you register profiles, place orders, or schedule salon consultations. Payment credentials details processed by Stripe or Razorpay are processed directly under PCI-DSS encrypted layers and are never stored on our database node.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">2. Use of Information</h3>
          <p>
            The captured metrics are utilised to complete order settlements, configure dynamic transit tracking status indicators, send stock warning alerts, and transmit promotional catalog details. We do not sell or lease user databases to third-party advertising registries.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">3. Security Defences</h3>
          <p>
            We implement secure cryptographic defenses, including JWT session keys, password hashing operations, input validation algorithms (preventing SQL injections), and cross-site scripting (XSS) blockers.
          </p>
        </section>
      </div>
    </div>
  );
}
