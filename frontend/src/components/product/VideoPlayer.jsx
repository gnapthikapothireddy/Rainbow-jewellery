import React, { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

export default function VideoPlayer({ videoUrl }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!videoUrl) return null;

  return (
    <div className="relative border border-gray-800 rounded-2xl overflow-hidden bg-black group max-w-full">
      <video
        ref={videoRef}
        src={videoUrl}
        loop
        muted
        onClick={togglePlay}
        className="w-full h-80 object-cover"
      />
      
      {/* Control Overlay */}
      <div 
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-50 cursor-pointer transition-all"
      >
        <button className="w-16 h-16 rounded-full gold-gradient-bg flex items-center justify-center text-charcoal-dark font-bold hover:scale-115 transition-transform shadow-gold-glow-lg">
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
      </div>

      <div className="absolute bottom-4 left-4 bg-charcoal-dark bg-opacity-70 px-3 py-1.5 rounded-full text-xs text-gold border border-gold border-opacity-30">
        Showcase Video
      </div>
    </div>
  );
}
