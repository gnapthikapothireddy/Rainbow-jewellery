import React from 'react';
import { Instagram } from 'lucide-react';

export default function InstagramBubble() {
  const url = "https://www.instagram.com/rainbow_collection_india?igsh=aWxzNTVnZWF4azdo";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-40 w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 hover:shadow-pink-500/20"
      style={{
        background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)'
      }}
      title="Follow us on Instagram"
    >
      <Instagram className="w-7 h-7 text-white" />
    </a>
  );
}
