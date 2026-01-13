import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Leaf, Search, Heart } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, cartCount, onOpenCart, config }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. Config Defaults
  const logoUrl = config?.logoUrl;
  const primaryColor = config?.primaryColor || '#064e3b'; // Deep Emerald
  
  // 2. Dynamic Text Color Logic
  // When scrolled: Use brand color.
  // When at top: Use White (always readable against the new dark emerald gradient).
  const textColor = isScrolled ? primaryColor : '#ffffff';

  useEffect(() => {
    const handleScroll = () => {
      // Trigger the shrink effect slightly later for a smoother feel
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'catalog', label: 'Shop Plants' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'Our Roots' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg py-3' // COMPACT & SOLID
          : 'bg-gradient-to-b from-emerald-950/90 via-emerald-900/40 to-transparent py-10' // EXPANDED & READABLE
          // Note: The gradient above is now Green-tinted, not just black, for a friendlier look.
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-full">
        
        {/* =======================
            LOGO AREA (THE HERO) 
           ======================= */}
        <div 
          className="flex items-center gap-4 cursor-pointer group transition-all duration-500" 
          onClick={() => setActiveTab('home')}
        >
          {logoUrl ? (
            <img 
                src={logoUrl} 
                alt="Green Gold Gardens" 
                className={`object-contain drop-shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isScrolled 
                    ? 'h-12 w-12 md:h-14 md:w-14' 
                    : 'h-24 w-24 md:h-40 md:w-40 origin-left hover:scale-105'
                }`} 
            />
          ) : (
            // Fallback Leaf Icon
            <div className={`rounded-2xl transition-all duration-500 flex items-center justify-center shadow-lg ${
                isScrolled 
                ? 'p-2 bg-emerald-100' 
                : 'p-4 bg-white/20 backdrop-blur-md border border-white/20'
            }`}>
              <Leaf 
                className={`transform transition-all duration-700 ${
                    isScrolled ? 'w-6 h-6' : 'w-16 h-16 rotate-12'
                }`} 
                style={{ color: isScrolled ? primaryColor : 'white' }} 
              />
            </div>
          )}
          
          {/* Brand Name */}
          <div className="flex flex-col justify-center">
            <h1 
              className={`font-black tracking-tighter leading-none drop-shadow-lg transition-all duration-700 ${
                isScrolled 
                    ? 'text-xl md:text-2xl' 
                    : 'text-2xl md:text-5xl' 
              }`}
              style={{ color: textColor }}
            >
              Green Gold
            </h1>
            <span 
              className={`font-medium transition-all duration-700 drop-shadow-md ${
                  isScrolled 
                    ? 'text-sm opacity-90' 
                    : 'text-lg md:text-xl opacity-100 tracking-[0.2em] uppercase mt-1'
              }`}
              style={{ color: textColor }}
            >
              Gardens
            </span>
          </div>
        </div>

        {/* =======================
            DESKTOP NAVIGATION 
           ======================= */}
        <div className={`hidden md:flex items-center gap-8 transition-all duration-700 ${!isScrolled && 'mt-4'}`}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`text-sm font-bold tracking-wide transition-all hover:-translate-y-0.5 relative group py-2 ${
                activeTab === link.id ? 'opacity-100' : 'opacity-90 hover:opacity-100'
              }`}
              style={{ 
                  color: textColor,
                  textShadow: isScrolled ? 'none' : '0 2px 4px rgba(0,0,0,0.3)' // Improves readability on video/img
              }}
            >
              {link.label}
              {/* Animated Underline */}
              <span className={`absolute bottom-0 left-0 h-[2px] bg-current transition-all duration-300 ${
                  activeTab === link.id ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </button>
          ))}
        </div>

        {/* =======================
            ACTIONS (Icons)
           ======================= */}
        <div className={`flex items-center gap-3 transition-all duration-700 ${!isScrolled && 'mt-4'}`}>
          
          {/* Search (New) */}
          <button className={`p-3 rounded-full transition-all ${isScrolled ? 'hover:bg-emerald-50' : 'hover:bg-white/20'}`}>
             <Search className="w-5 h-5" style={{ color: textColor }} />
          </button>

          {/* Cart */}
          <button 
            onClick={onOpenCart}
            className={`relative p-3 rounded-full transition-all shadow-sm group ${
              isScrolled ? 'hover:bg-emerald-50' : 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10'
            }`}
          >
            <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" style={{ color: textColor }} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-bounce-slow border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 rounded-lg transition-transform active:scale-95"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ color: textColor }}
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8 drop-shadow-md" />}
          </button>
        </div>
      </div>

      {/* =======================
            MOBILE MENU
           ======================= */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-2xl p-6 flex flex-col gap-3 animate-fade-in-down">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left p-4 rounded-2xl text-lg font-bold transition-all flex justify-between items-center ${
                  activeTab === link.id 
                  ? 'bg-emerald-50 text-emerald-800 translate-x-2' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {link.label}
              {activeTab === link.id && <Leaf className="w-5 h-5 text-emerald-600" />}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;