import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LiveChat from '../components/shared/LiveChat';
import WhatsAppBubble from '../components/shared/WhatsAppBubble';
import InstagramBubble from '../components/shared/InstagramBubble';

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-charcoal-dark text-gray-100">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      
      {/* Dynamic Overlay Utilities */}
      <InstagramBubble />
      <LiveChat />
      <WhatsAppBubble />
    </div>
  );
}
