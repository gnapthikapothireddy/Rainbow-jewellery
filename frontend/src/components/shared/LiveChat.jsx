import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Namaste! Welcome to Rainbow Jewelry. I am Aurora, your personal concierge. How may I assist you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // AI Concierge response simulation after 1.2s
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "Thank you for reaching out! Our consultants are available. You can also book a bridal consultation or ring size test directly from our Appointments page.";
      
      const query = userMsg.text.toLowerCase();
      if (query.includes('ring') || query.includes('size')) {
        replyText = "We offer free ring sizers! Go to 'Book Appointment' and choose the Ring Size purpose so our specialists can guide you, or checkout our size chart in product specifications.";
      } else if (query.includes('gold') || query.includes('rate') || query.includes('price')) {
        replyText = "Today's gold rate for 22K Gold is ₹6,850/gram. Note that we currently offer a discount on making charges for our Bridal Necklaces!";
      } else if (query.includes('delivery') || query.includes('track') || query.includes('order')) {
        replyText = "All orders are shipped via secure, fully insured logistics. You can view your real-time tracking number in the 'Order History' tab in your profile menu.";
      }

      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full gold-gradient-bg text-charcoal-dark font-bold flex items-center justify-center shadow-gold-glow-lg hover:scale-110 transition-transform cursor-pointer"
        >
          <MessageCircle size={26} />
        </button>
      )}

      {/* Concierge Chat Widget */}
      {isOpen && (
        <div className="w-80 h-96 glass-card rounded-2xl shadow-gold-glow flex flex-col overflow-hidden border border-gold border-opacity-35 animate-fade-in">
          
          {/* Header */}
          <div className="bg-charcoal p-4 flex justify-between items-center border-b border-gray-800">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
              <div>
                <h4 className="text-xs font-semibold text-white">Aurora Concierge</h4>
                <p className="text-[10px] text-gray-400">Jewelry Assistant (Online)</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-2.5 rounded-2xl max-w-[85%] text-xs ${m.sender === 'user' ? 'bg-gold text-charcoal-dark font-medium rounded-tr-none' : 'bg-charcoal text-gray-200 rounded-tl-none border border-gray-800'}`}>
                  {m.text}
                </div>
                <span className="text-[9px] text-gray-500 mt-1">{m.time}</span>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 pl-1">
                <span>Aurora is writing</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </div>
            )}
            <div ref={scrollRef}></div>
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 bg-charcoal-dark border-t border-gray-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask about ring sizes, gold rate..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-charcoal border border-gray-700 rounded-full px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold"
            />
            <button type="submit" className="w-8 h-8 rounded-full gold-gradient-bg text-charcoal-dark flex items-center justify-center hover:scale-105 transition-transform">
              <Send size={12} />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
