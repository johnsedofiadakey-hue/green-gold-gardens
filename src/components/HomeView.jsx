// src/components/HomeView.jsx
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Leaf, 
  ShieldCheck, 
  Sun, 
  Star, 
  Wind, 
  Droplets, 
  MapPin, 
  MoveRight, 
  Sprout 
} from 'lucide-react';
import ReviewsSection from './ReviewsSection';

const HomeView = ({ setActiveTab, config }) => {
  // --- Configuration (Connected to Admin) ---
  const primaryColor = config?.primaryColor || '#064e3b';    
  const secondaryColor = config?.secondaryColor || '#059669'; 
  const accentColor = config?.accentColor || '#f59e0b';      
  const subtext = config?.heroSubtext || 'Green Gold Gardens connects you with premium flora, expert landscaping, and the serenity of nature in Accra.';

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Base Wrapper
    <div className="font-sans overflow-x-hidden w-full selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* === GLOBAL STYLE INJECTION (The White Line Killer) === 
         This forces the browser's main background to match your theme 
         instantly, removing any white strips at the top or bottom.
      */}
      <style>{`
        body, html, #root {
          background-color: #022c22 !important; /* Force Dark Green Background */
          overscroll-behavior-y: none; /* Prevents "bounce" revealing white background */
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}</style>

      {/* ================= HERO SECTION ================= */}
      {/* -mt-24 pulls this section UP behind the navbar to cover any gaps */}
      <div className="relative min-h-screen flex items-center justify-center -mt-24 pt-48 md:pt-80 pb-20 px-6 lg:px-12 overflow-hidden">
        
        {/* Dynamic Background */}
        <div 
            className="absolute inset-0 z-0"
            style={{ 
                // We use your Admin Config 'primaryColor' here.
                // It blends from a hard-coded dark base (#022c22) into your custom color.
                background: `linear-gradient(to bottom, #022c22 0%, #022c22 15%, ${primaryColor} 50%, #064e3b 100%)` 
            }}
        >
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            
            {/* Ambient Lighting Blobs (Colors from Admin) */}
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 animate-pulse" 
                 style={{ backgroundColor: secondaryColor }}></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-15" 
                 style={{ backgroundColor: accentColor }}></div>
        </div>

        <div className="relative z-10 max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Text Content */}
            <div className="text-left space-y-10">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-emerald-50 text-sm font-semibold tracking-wide shadow-2xl hover:bg-white/10 transition-colors cursor-default">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> Now Delivering in Accra
                    </span>
                </div>
                
                <div className="space-y-4">
                    <h1 className="text-5xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight drop-shadow-2xl">
                        Nature, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-400">
                            Curated.
                        </span>
                    </h1>
                    
                    <p className="text-xl text-emerald-100/90 leading-relaxed max-w-xl font-medium border-l-[3px] border-emerald-500/50 pl-6 py-2 drop-shadow-md">
                        {subtext}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 pt-2">
                    <button 
                        onClick={() => setActiveTab('catalog')}
                        className="group relative px-10 py-5 bg-white text-emerald-950 rounded-full font-bold text-lg shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition-all transform hover:-translate-y-1 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            Explore Catalog 
                            <Leaf className="w-5 h-5 transition-transform group-hover:rotate-45" style={{ color: secondaryColor }} />
                        </span>
                        <div className="absolute inset-0 bg-emerald-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('services')}
                        className="group px-10 py-5 rounded-full font-bold text-lg text-white border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-md flex items-center gap-3"
                    >
                        Design Services 
                        <MoveRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>

            {/* Right: Hero Image Composition */}
            <div className="relative hidden lg:block perspective-[1000px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/20 rounded-[3rem] rotate-6 transform translate-y-6 translate-x-6 border border-white/10 backdrop-blur-[2px]"></div>
                
                <img 
                    src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80" 
                    alt="Luxury Garden" 
                    className="relative z-10 rounded-[3rem] shadow-2xl object-cover h-[650px] w-full border border-white/10 hover:scale-[1.01] transition-transform duration-700"
                />
                
                <div className="absolute top-10 -left-12 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.2)] flex items-center gap-4 animate-float z-20 max-w-[280px]">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-white shrink-0 shadow-inner" style={{ backgroundColor: secondaryColor }}>
                        <Sprout className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 leading-tight">New Arrivals</p>
                        <p className="text-emerald-700 text-sm font-medium">Rare Monsteras in stock</p>
                    </div>
                </div>

                <div 
                    className="absolute -bottom-8 -right-8 bg-gray-900 p-6 rounded-3xl shadow-2xl flex items-center gap-4 animate-float z-20"
                    style={{ animationDelay: '1s' }}
                >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: accentColor }}>
                        <Star className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                        <p className="font-bold text-white text-lg">4.9/5 Rating</p>
                        <p className="text-gray-400 text-sm">Based on 500+ reviews</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* ================= INFINITE TICKER ================= */}
      <div className="relative bg-emerald-900 border-t border-white/10 overflow-hidden py-4 z-20">
        <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-16 items-center px-8">
                    <TickerItem text="Sustainable Sourcing" />
                    <TickerItem text="Local Ghanaian Grown" />
                    <TickerItem text="7-Day Freshness Guarantee" />
                    <TickerItem text="Expert Landscape Design" />
                    <TickerItem text="Organic Fertilizers" />
                    <TickerItem text="Corporate Events" />
                    <TickerItem text="Pest-Free Assurance" />
                </div>
            ))}
        </div>
      </div>

      {/* ================= FEATURES STRIP ================= */}
      <div className="relative z-30 -mt-8 mx-4 lg:mx-12">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-3xl p-8 lg:p-12 grid md:grid-cols-3 gap-8 lg:gap-12 transform hover:-translate-y-1 transition-transform duration-500">
            <FeatureCard 
                icon={<Wind className="w-7 h-7" />} 
                title="Air Purification" 
                desc="Plants scientifically proven to remove toxins and purify your indoor air naturally."
                color={primaryColor}
            />
            <FeatureCard 
                icon={<ShieldCheck className="w-7 h-7" />} 
                title="Lifetime Guidance" 
                desc="We don't just sell plants; we teach you how to keep them thriving forever."
                color={secondaryColor}
            />
            <FeatureCard 
                icon={<Sun className="w-7 h-7" />} 
                title="Landscape Arch." 
                desc="From balconies to estates, our design team transforms spaces into sanctuaries."
                color={accentColor}
            />
        </div>
      </div>

      {/* ================= FEATURED COLLECTIONS ================= */}
      <div className="py-24 px-6 lg:px-12 bg-stone-50">
        <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-extrabold text-gray-900">Curated Collections</h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">Find the perfect greenery to match your lifestyle and lighting conditions.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 h-[500px] md:h-[400px]">
                <CollectionCard 
                    title="Indoor Oasis" 
                    image="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80"
                    count="42 Items"
                    onClick={() => setActiveTab('catalog')}
                />
                <CollectionCard 
                    title="Outdoor & Patio" 
                    image="https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80"
                    count="28 Items"
                    onClick={() => setActiveTab('catalog')}
                />
                <CollectionCard 
                    title="Rare & Exotic" 
                    image="https://images.unsplash.com/photo-1599598425947-d352b577e983?auto=format&fit=crop&q=80"
                    count="15 Items"
                    onClick={() => setActiveTab('catalog')}
                />
            </div>
        </div>
      </div>

      {/* ================= ABOUT SECTION ================= */}
      <div className="py-24 px-6 lg:px-12 relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] z-0 opacity-10">
                    <path fill={secondaryColor} d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.2,-19.2,95.8,-5.3C93.5,8.6,82,21.5,70.6,32.3C59.2,43.1,47.8,51.8,35.8,59.3C23.8,66.8,11.2,73.1,-0.7,74.3C-12.6,75.5,-24.5,71.6,-36.3,64.8C-48.1,58,-59.8,48.3,-68.9,36.3C-78,24.3,-84.5,10,-83.4,-3.8C-82.3,-17.6,-73.6,-30.9,-63.3,-41.8C-53,-52.7,-41.1,-61.2,-28.9,-69.4C-16.7,-77.6,-4.2,-85.5,6.1,-86.1C16.4,-86.7,30.5,-90.1,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
                <div className="relative z-10 grid grid-cols-2 gap-4">
                    <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80" className="rounded-[2rem] shadow-xl w-full h-64 object-cover mt-12 hover:-translate-y-2 transition-transform duration-500" alt="Showcase 1" />
                    <img src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80" className="rounded-[2rem] shadow-xl w-full h-64 object-cover hover:-translate-y-2 transition-transform duration-500" alt="Showcase 2" />
                </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
                <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800">Who We Are</div>
                <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-[1.1]">
                    More than just a <span className="underline decoration-[6px] decoration-wavy underline-offset-4" style={{ textDecorationColor: accentColor, color: primaryColor }}>plant shop.</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed font-light">
                    We believe that every leaf tells a story. From the soil we cultivate to the events we host, Green Gold Gardens is a sanctuary for nature lovers.
                </p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-10 pt-4">
                    <StatCard number="500+" label="Plant Species" color={primaryColor} />
                    <StatCard number="100%" label="Organic Soil" color={secondaryColor} />
                    <StatCard number="24/7" label="Expert Support" color={accentColor} />
                    <StatCard number="10k" label="Happy Roots" color={primaryColor} />
                </div>
                <div className="pt-6">
                    <button onClick={() => setActiveTab('about')} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b-2 pb-1 hover:pb-2 hover:text-emerald-700 transition-all" style={{ color: primaryColor, borderColor: secondaryColor }}>
                        Read Our Full Story <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-stone-50 py-16">
         <ReviewsSection /> 
      </div>

      {/* ================= NEWSLETTER ================= */}
      <div className="py-24 px-6 relative overflow-hidden bg-gray-900">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[100px] opacity-20" style={{ backgroundColor: secondaryColor }}></div>
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md mx-auto flex items-center justify-center mb-6">
                <Droplets className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">Join the Green Club</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto pt-4">
                  <input type="email" placeholder="Enter your email address" className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white/20 transition-all" />
                  <button className="px-8 py-4 rounded-full font-bold text-gray-900 bg-green-400 hover:bg-green-300 transition-colors shadow-lg shadow-green-400/20">Subscribe</button>
              </div>
          </div>
      </div>

    </div>
  );
};

const TickerItem = ({ text }) => (
    <div className="flex items-center gap-2 text-emerald-100/60 font-medium tracking-wider uppercase text-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        {text}
    </div>
);

const FeatureCard = ({ icon, title, desc, color }) => (
    <div className="flex flex-col items-start gap-4 p-6 rounded-2xl hover:bg-gray-50 transition-colors group cursor-default h-full border border-transparent hover:border-gray-100">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" style={{ backgroundColor: color }}>{icon}</div>
        <div>
            <h3 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-emerald-800 transition-colors">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
        </div>
    </div>
);

const StatCard = ({ number, label, color }) => (
    <div className="border-l-2 pl-5" style={{ borderColor: color }}>
        <h4 className="text-4xl font-black mb-1" style={{ color: color }}>{number}</h4>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
);

const CollectionCard = ({ title, image, count, onClick }) => (
    <div onClick={onClick} className="group relative rounded-3xl overflow-hidden cursor-pointer h-full">
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity"></div>
        <div className="absolute bottom-0 left-0 p-8 w-full">
            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    {title} <MoveRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity -ml-4 group-hover:ml-0" />
                </h3>
                <p className="text-gray-300 text-sm font-medium">{count}</p>
            </div>
        </div>
    </div>
);

export default HomeView;