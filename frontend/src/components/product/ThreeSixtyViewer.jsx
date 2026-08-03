import React, { useState, useRef } from 'react';
import { RotateCw } from 'lucide-react';

export default function ThreeSixtyViewer({ image }) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startX.current = e.pageX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = e.pageX - startX.current;
    // Map drag difference to degrees (e.g. 1px = 1deg)
    setRotation(prev => (prev + diff) % 360);
    startX.current = e.pageX;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX.current;
    setRotation(prev => (prev + diff) % 360);
    startX.current = e.touches[0].clientX;
  };

  return (
    <div className="border border-gray-800 rounded-2xl p-6 bg-charcoal flex flex-col items-center justify-center relative select-none">
      <h3 className="text-sm font-semibold text-gold mb-3 flex items-center gap-1.5 uppercase tracking-wider">
        <RotateCw size={14} className="animate-spin" /> Drag to Rotate 360°
      </h3>
      
      {/* 3D perspective showcase */}
      <div 
        className="w-full h-80 flex items-center justify-center cursor-ew-resize perspective"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <div
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
          className="relative w-64 h-64 flex items-center justify-center shadow-gold-glow rounded-full p-2 bg-charcoal-dark border border-gray-800"
        >
          <img
            src={image}
            alt="360 View product"
            className="max-w-[85%] max-h-[85%] object-contain pointer-events-none drop-shadow-[0_15px_15px_rgba(212,175,55,0.4)]"
          />
        </div>
      </div>
      
      <p className="text-[11px] text-gray-500 mt-2">Use mouse or touch sweep to spin the showcase</p>
    </div>
  );
}
