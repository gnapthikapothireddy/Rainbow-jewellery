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
          // Keep only these 4 categories
          const allowedNames = ['Bangles', 'Chokers', 'Necklaces', 'Necklace Sets', 'Long Chains'];
          const filtered = res.data.filter(cat => allowedNames.includes(cat.name));
          
          // Rename 'Necklaces' to 'Necklace Sets' and attach custom descriptions
          const mapped = filtered.map(cat => {
            let desc = '';
            let name = cat.name;
            if (cat.name === 'Bangles') {
              desc = 'Explore elegant bridal, designer, glass, and traditional bangles crafted for every occasion.';
            } else if (cat.name === 'Chokers') {
              desc = 'Discover premium bridal chokers with intricate craftsmanship and luxurious traditional designs.';
            } else if (cat.name === 'Necklaces' || cat.name === 'Necklace Sets') {
              name = 'Necklace Sets';
              desc = 'Browse stunning necklace sets featuring matching earrings for weddings, festivals, and celebrations.';
            } else if (cat.name === 'Long Chains') {
              desc = 'Explore traditional long harams and layered chains designed for timeless elegance.';
            }
            return {
              ...cat,
              name,
              description: desc
            };
          });
          
          // De-duplicate if needed
          const unique = [];
          const seen = new Set();
          for (const item of mapped) {
            if (!seen.has(item.name)) {
              seen.add(item.name);
              unique.push(item);
            }
          }
          
          setCategories(unique);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-60 bg-charcoal rounded-2xl border border-gray-800"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group glass-card rounded-2xl overflow-hidden p-4 hover:border-gold/40 hover:shadow-gold-glow transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-48 rounded-xl overflow-hidden mb-4 border border-gray-800">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-2 mb-4">
                  <h3 className="font-semibold text-sm text-white group-hover:text-gold transition-colors tracking-wide uppercase">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-800 border-opacity-30">
                <span className="text-[10px] text-gray-500 font-medium">HALLMARK CERTIFIED</span>
                <span className="text-gold text-sm group-hover:translate-x-1.5 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
