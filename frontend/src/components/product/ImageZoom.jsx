import React, { useState } from 'react';

export default function ImageZoom({ src, alt }) {
  const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');
  const [showMagnifier, setShowMagnifier] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <div
      className="relative overflow-hidden cursor-zoom-in border border-gray-800 rounded-2xl w-full h-[400px] md:h-[500px] bg-charcoal flex items-center justify-center"
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      {!showMagnifier ? (
        <img src={src} alt={alt} className="w-full h-full object-cover rounded-2xl" />
      ) : (
        <div
          className="w-full h-full rounded-2xl transition-shadow duration-300"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: backgroundPosition,
            backgroundSize: '200%',
            backgroundRepeat: 'no-repeat'
          }}
        />
      )}
    </div>
  );
}
