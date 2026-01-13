// src/components/AIChatBot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, User, Smile } from 'lucide-react';

const AIChatBot = ({ isOpen, onClose, plants = [] }) => {
  // --- STATE ---
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      text: "Hello! I'm Gardenia 🌸, your virtual gardening assistant. I can help you check prices, find care tips, or just chat about nature! How can I help?" 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // --- WORKER DATA (The AI's "Rolodex") ---
  const workers = [
    { name: 'Madam Rosaline', role: 'Owner & Head Landscaper', keywords: ['owner', 'boss', 'ceo', 'manager', 'rosaline'] },
    { name: 'Kojo', role: 'Sales Manager', keywords: ['sales', 'buy', 'discount', 'bulk', 'price'] },
    { name: 'Ama', role: 'Plant Doctor', keywords: ['sick', 'yellow', 'dying', 'leaves', 'bugs', 'pest'] },
    { name: 'Yaw', role: 'Logistics', keywords: ['delivery', 'shipping', 'accra', 'location'] }
  ];

  // --- AUTO SCROLL ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [messages, isOpen, isTyping]);

  // --- THE BRAIN 🧠 (Logic Engine) ---
  const generateResponse = (text) => {
    const lower = text.toLowerCase();

    // 1. GREETINGS & SMALL TALK
    if (['hi', 'hello', 'hey', 'sup'].some(w => lower.includes(w))) {
      const greetings = [
        "Hey there! 🌿 Ready to grow something green?",
        "Hello! The sun is shining (digitally) and I'm ready to help! ☀️",
        "Hi! Welcome to Green Gold. What's growing on?"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // 2. SEARCHING FOR PLANTS (Real-time Data Lookup)
    // We scan the user's sentence to see if they mentioned any plant in your database.
    const foundPlant = plants.find(p => lower.includes(p.name.toLowerCase()));
    
    if (foundPlant) {
      if (lower.includes('price') || lower.includes('cost') || lower.includes('much')) {
        return `The ${foundPlant.name} is currently going for GH₵${foundPlant.price}. It's a steal! 🏷️`;
      }
      if (lower.includes('stock') || lower.includes('have')) {
        return foundPlant.inStock 
          ? `Yes! We have healthy ${foundPlant.name}s ready for a new home. 🌱` 
          : `Oh no! The ${foundPlant.name} is currently sold out. Shall I recommend something else?`;
      }
      if (lower.includes('care') || lower.includes('water') || lower.includes('light')) {
        return `Top tip for the ${foundPlant.name}: ${foundPlant.care || "It loves bright indirect light and moderate watering."} 💧`;
      }
      // Default plant info
      return `Ah, the ${foundPlant.name}! excellent choice. It's a ${foundPlant.category} plant known for its beauty. Currently GH₵${foundPlant.price}.`;
    }

    // 3. STAFF ROUTING (Connecting to Humans)
    const foundWorker = workers.find(w => w.keywords.some(k => lower.includes(k)));
    if (foundWorker) {
      if (foundWorker.name === 'Madam Rosaline') {
        return "Madam Rosaline handles our VIP landscaping projects. 🏡 I can flag your request for her review!";
      }
      return `For that, you should speak to ${foundWorker.name}, our ${foundWorker.role}. Should I leave a note for them? 📝`;
    }

    // 4. PERSONALITY & JOVIAL RESPONSES
    if (lower.includes('joke')) {
      const jokes = [
        "Why did the gardener plant a light bulb? He wanted to grow a power plant! 💡",
        "What is a plant's favorite drink? Root beer! 🍺",
        "I tried to tell a joke about a tree, but it was too sappy. 🌳"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }
    if (lower.includes('marry me') || lower.includes('love you')) {
      return "I'm flattered! But my heart belongs to Photosynthesis. 💚💍";
    }
    if (lower.includes('stupid') || lower.includes('dumb') || lower.includes('bot')) {
      return "I'm doing my best! I'm just a seedling AI, still growing my roots. 🌱 Be nice!";
    }

    // 5. GENERAL KNOWLEDGE (Simulated)
    if (lower.includes('weather') || lower.includes('rain')) {
      return "I don't have windows, but if it rains in Accra today, remember to bring your succulents inside! 🌧️";
    }
    if (lower.includes('football') || lower.includes('chelsea') || lower.includes('united')) {
      return "I only watch matches played on grass because... well, I love grass! ⚽🌿";
    }
    if (lower.includes('politics')) {
      return "I stay out of politics. I prefer to focus on things that actually grow and produce fruit! 🍎";
    }

    // 6. BUSINESS INFO
    if (lower.includes('location') || lower.includes('where')) return "We are located at Efua Sutherland Road, Accra. Come see our showroom! 📍";
    if (lower.includes('phone') || lower.includes('contact')) return "You can reach the team at 055-123-4567. ☎️";

    // 7. FALLBACK (Smart Deflection)
    return "That's an interesting thought! 🤔 I'm more of a plant expert, but I can ask Madam Rosaline to get back to you on that. Would you like to see our Catalog instead?";
  };

  // --- HANDLER ---
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    
    // 1. Add User Message
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: userText }]);
    setIsTyping(true);

    // 2. Simulate "Thinking" Delay (0.8s - 1.5s)
    setTimeout(() => {
      const response = generateResponse(userText);
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: response }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[60] w-[90vw] md:w-[400px] animate-scale-in origin-bottom-right font-sans">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[500px] md:h-[600px]">
        
        {/* HEADER */}
        <div className="bg-emerald-900 p-4 flex justify-between items-center relative overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                <Sparkles className="w-5 h-5 text-yellow-300 fill-current animate-pulse" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-emerald-900 rounded-full"></span>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg leading-tight">Gardenia AI</h3>
              <p className="text-xs text-emerald-200 font-medium">Always Online • Replies Instantly</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors relative z-10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-4 bg-stone-50 space-y-4">
          <div className="text-center text-xs text-gray-400 my-4">Today</div>
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.type === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-2 text-emerald-700 shrink-0 border border-emerald-200">
                  <Bot className="w-5 h-5"/>
                </div>
              )}
              
              <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.type === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
              }`}>
                {msg.text}
              </div>

              {msg.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-2 text-gray-500 shrink-0">
                  <User className="w-5 h-5"/>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start items-end">
               <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-2 text-emerald-700 mb-1">
                 <Bot className="w-5 h-5"/>
               </div>
               <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
          <input 
            className="flex-1 bg-gray-50 text-gray-800 text-sm rounded-full px-5 py-3.5 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/50 border border-transparent focus:border-emerald-200 transition-all placeholder:text-gray-400 font-medium"
            placeholder="Ask about plants, prices, or fun..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="bg-emerald-600 text-white p-3.5 rounded-full hover:bg-emerald-500 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 flex items-center justify-center"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default AIChatBot;