// src/components/Footer.jsx
import React, { useState } from 'react';
import { 
  Facebook, Instagram, Twitter, MapPin, Phone, Mail, 
  ArrowUp, ShieldCheck, Leaf, Send 
} from 'lucide-react';

const Footer = ({ setActiveTab }) => {
  const [email, setEmail] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = () => {
    if(email) {
      alert("Thanks for subscribing! We'll keep you updated.");
      setEmail('');
    }
  };

  return (
    <footer className="bg-emerald-950 text-white pt-20 pb-10 relative overflow-hidden mt-auto">
      
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 border-b border-emerald-900 pb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveTab('home'); scrollToTop(); }}>
                <div className="bg-emerald-500 p-2 rounded-lg">
                    <Leaf className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Green Gold</h2>
            </div>
            <p className="text-emerald-200/80 text-sm leading-relaxed">
              Cultivating serene spaces and delivering nature's best to your doorstep. Your partner in sustainable living.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialIcon href="https://facebook.com" icon={<Facebook className="w-5 h-5"/>} />
              <SocialIcon href="https://instagram.com" icon={<Instagram className="w-5 h-5"/>} />
              <SocialIcon href="https://twitter.com" icon={<Twitter className="w-5 h-5"/>} />
            </div>
          </div>

          {/* Quick Links (NOW WORKING) */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-emerald-100">Explore</h3>
            <ul className="space-y-4 text-emerald-200/70 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => { setActiveTab('home'); scrollToTop(); }}>Home</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => { setActiveTab('catalog'); scrollToTop(); }}>Our Catalog</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => { setActiveTab('services'); scrollToTop(); }}>Services</li>
              <li className="hover:text-white cursor-pointer transition-colors" onClick={() => { setActiveTab('gallery'); scrollToTop(); }}>Gallery</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-emerald-100">Contact</h3>
            <ul className="space-y-4 text-emerald-200/70 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Efua Sutherland Road,<br/>Accra, Ghana</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>053 609 8146</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>hello@greengold.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter (NOW WORKING) */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-emerald-100">Stay Growing</h3>
            <p className="text-emerald-200/70 text-sm mb-4">Get plant care tips and discounts sent to your inbox.</p>
            <div className="flex bg-emerald-900 rounded-lg p-1 border border-emerald-800 focus-within:border-emerald-500 transition-colors">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-transparent w-full p-2 outline-none text-sm text-white placeholder-emerald-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={handleSubscribe} className="bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-2 rounded-md text-xs font-bold transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-800">
          <p>© 2025 Green Gold Gardens. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <span className="cursor-pointer hover:text-emerald-500">Privacy Policy</span>
            <span className="cursor-pointer hover:text-emerald-500">Terms of Service</span>
            
            {/* --- ADMIN CORE BUTTON (NOW WORKING) --- */}
            <button 
                onClick={() => { setActiveTab('admin'); scrollToTop(); }} 
                className="flex items-center gap-1 opacity-50 hover:opacity-100 hover:text-emerald-400 transition-all font-bold"
            >
                <ShieldCheck className="w-3 h-3" /> Admin Core
            </button>
            {/* --------------------------------------- */}
          </div>

          <button 
            onClick={scrollToTop} 
            className="bg-emerald-900 p-3 rounded-full hover:bg-emerald-800 transition-all text-emerald-300"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer shadow-lg hover:-translate-y-1"
  >
    {icon}
  </a>
);

export default Footer;