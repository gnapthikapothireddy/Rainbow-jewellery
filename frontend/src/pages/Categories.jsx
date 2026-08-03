import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.getCategories();
        if (res.success) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-4xl font-playfair font-bold text-white tracking-wide">Signature Collections</h1>
        <div className="h-0.5 w-16 bg-gold mx-auto mt-4 mb-3"></div>
        <p className="text-xs text-gray-400">
          Discover a curated registry of pure hallmarked jewelry, from traditional bridal sets to modern platinum.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-60 bg-charcoal rounded-2xl border border-gray-800"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group glass-card rounded-2xl overflow-hidden p-4 hover:border-gold/40 hover:shadow-gold-glow transition-all duration-300 flex flex-col"
            >
              <div className="w-full h-48 rounded-xl overflow-hidden mb-4 border border-gray-800">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-grow flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-white group-hover:text-gold transition-colors tracking-wide uppercase">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-gray-500 font-medium">HALLMARK CERTIFIED</span>
                </div>
                <span className="text-gold text-sm group-hover:translate-x-1.5 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
