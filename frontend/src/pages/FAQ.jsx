import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { q: "Is all your jewelry Hallmark certified?", a: "Yes, every single piece of gold jewelry at Rainbow Jewelry is 22K (916) Hallmark certified by the Bureau of Indian Standards (BIS). All diamond jewelry is accompanied by certifications from reputable laboratories like IGI or GIA." },
    { q: "How do I calculate the final price of gold jewelry?", a: "The final jewelry price is computed as follows: (Gold Weight * Today's Gold Rate) + Making Charges + 3% GST. Any active festival discount code is applied directly to the metal value or making charges." },
    { q: "How long does shipping take and is it insured?", a: "We provide fully insured shipping across India. Orders are dispatched in tamper-proof boxes within 3-5 business days. Transit is entirely covered by insurance, so you have zero liability until delivery is completed." },
    { q: "Can I customize a design I saw online?", a: "Absolutely! You can schedule a consultation with our bespoke designers. Book an appointment online, choose the 'Custom Design' purpose, and our gemologists will assist you via video call or at the store." },
    { q: "What is your return and refund policy?", a: "We offer a 14-day money-back guarantee for unused jewelry articles in their original hallmarked condition. Custom designs or engraved products are eligible for buyback exchanges but not direct refunds." }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center">
        <HelpCircle className="text-gold mx-auto mb-3" size={32} />
        <h1 className="text-3xl font-playfair font-bold text-white tracking-wide">Frequently Asked Questions</h1>
        <p className="text-xs text-gray-400 mt-1">Quick answers to gold rates, custom designs, and transit safety.</p>
      </div>

      <div className="space-y-4 pt-4">
        {faqs.map((faq, idx) => {
          const isOpen = activeIndex === idx;
          return (
            <div 
              key={idx} 
              className="glass-card rounded-2xl border border-gray-800 overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveIndex(isOpen ? null : idx)}
                className="w-full p-5 flex justify-between items-center text-xs font-semibold text-white hover:text-gold transition-colors text-left focus:outline-none"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {isOpen && (
                <div className="p-5 pt-0 border-t border-gray-850 text-xs text-gray-300 leading-relaxed animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
