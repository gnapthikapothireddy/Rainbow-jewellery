import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function ReturnPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-6 text-xs text-gray-300 leading-relaxed">
      <div className="text-center space-y-2">
        <RotateCcw className="text-gold mx-auto" size={32} />
        <h1 className="text-3xl font-playfair font-bold text-white tracking-wide">Return & Buyback Policy</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Effective Date: August 2, 2026</p>
      </div>

      <div className="glass-card rounded-3xl p-8 border border-gray-800 space-y-6">
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">1. 14-Day Return Window</h3>
          <p>
            We guarantee a 14-day return window for items bought via our online boutique. To be eligible for returns, jewelry articles must remain unused, unaltered, and carry the original BIS Hallmark certificate, packaging, and invoices intact.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">2. Exclusions</h3>
          <p>
            Custom bespoke jewelry design orders, engraved rings, and customized bridal sets are not eligible for direct refunds. However, they remain eligible under our Lifetime Exchange & Buyback policy.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">3. Buyback Rates</h3>
          <p>
            Lifetime exchanges and buyback processes are valued based on the active gold/platinum rate on the date of return, deducting making charges and taxes. Diamonds are valued at 100% of their active market price.
          </p>
        </section>
      </div>
    </div>
  );
}
