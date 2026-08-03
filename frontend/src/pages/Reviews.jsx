import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Star, Award, HeartHandshake } from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await api.getAllReviews();
        if (res.success) {
          setReviews(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllReviews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 text-xs">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <HeartHandshake className="text-gold mx-auto" size={32} />
        <h1 className="text-3xl font-playfair font-bold text-white tracking-wide">Client Testimonials Registry</h1>
        <p className="text-[10px] text-gray-400">Discover ratings and feedback from verified purchasers.</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map(i => (
            <div key={i} className="h-28 bg-charcoal rounded-2xl border border-gray-800"></div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-gray-800 space-y-2">
          <p className="text-sm text-gray-500 italic">No reviews compiled yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map(r => (
            <div key={r.id} className="glass-card rounded-2xl p-6 border border-gray-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-white text-sm uppercase tracking-wide">
                    {r.Product ? r.Product.name : 'Luxury Article'}
                  </h4>
                  {r.Product && <span className="text-[10px] text-gray-500 block">SKU: {r.Product.sku}</span>}
                </div>
                <span className="text-[9px] text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill={i < r.rating ? "#D4AF37" : "none"} stroke="#D4AF37" />
                  ))}
                </div>
                <span className="text-gray-400 font-medium">({r.rating}/5 rating)</span>
              </div>

              <p className="text-gray-300 leading-relaxed text-[11px] italic">
                "{r.comment}"
              </p>

              <div className="flex justify-between items-center border-t border-gray-850 pt-3 text-[10px]">
                <span className="font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                  <Award size={12} /> Verified Buyer: {r.User ? r.User.name : 'John Doe'}
                </span>
                <span className="text-green-500 font-semibold uppercase">Hallmark Certified Purchase</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
