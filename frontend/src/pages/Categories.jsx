import React from 'react';
import { Link } from 'react-router-dom';

const signatureCollections = [
  {
    id: 'bangles',
    name: 'Bangles',
    slug: 'bangles',
    image: '/assets/royal-red-bangles.jpg',
    description: 'Explore elegant bridal, designer, glass, and traditional bangles crafted for every occasion.'
  },
  {
    id: 'chokers',
    name: 'Chokers',
    slug: 'chokers',
    image: '/assets/royal-green-necklace.jpg',
    description: 'Discover premium bridal chokers with intricate craftsmanship and luxurious traditional designs.'
  },
  {
    id: 'necklaces',
    name: 'Necklace Sets',
    slug: 'necklaces',
    image: '/assets/royal-ruby-necklace.jpg',
    description: 'Browse stunning necklace sets featuring matching earrings for weddings, festivals, and celebrations.'
  },
  {
    id: 'long-chains',
    name: 'Long Chains',
    slug: 'long-chains',
    image: '/assets/emerald-layered-necklace.jpg',
    description: 'Explore traditional long harams and layered chains designed for timeless elegance.'
  }
];

export default function Categories() {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {signatureCollections.map(cat => (
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

    </div>
  );
}
