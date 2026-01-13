// src/components/CatalogView.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, ShoppingBag, Filter, Leaf, ArrowRight, Sparkles, 
  X, Droplets, Sun, Globe, CheckCircle2, AlertCircle 
} from 'lucide-react';

const CatalogView = ({ plants = [], addToCart, config }) => {
  // --- Config & Defaults (Matches HomeView) ---
  const primaryColor = config?.primaryColor || '#064e3b';
  const secondaryColor = config?.secondaryColor || '#059669';
  const accentColor = config?.accentColor || '#f59e0b';
  
  // --- State ---
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }

  // --- Logic ---
  const categories = ['All', ...new Set(plants.map(p => p.category))];

  const filteredPlants = useMemo(() => {
    return plants.filter(plant => {
      const matchesCategory = activeCategory === 'All' || plant.category === activeCategory;
      const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            plant.scientificName?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [plants, activeCategory, searchTerm]);

  // --- Handlers ---
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = (e, plant) => {
    e.stopPropagation(); // Prevent opening modal if clicking the button directly
    if (!plant.inStock) return;
    
    addToCart(plant);
    showToast(`Added ${plant.name} to cart`);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 font-sans relative overflow-x-hidden">
      
      {/* Dynamic Styles & Keyframes */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-up { animation: fadeUp 0.6s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
      `}</style>

      {/* Background Gradient */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-30"
        style={{ 
            background: `radial-gradient(circle at 10% 20%, ${secondaryColor}10 0%, transparent 40%), radial-gradient(circle at 90% 80%, ${accentColor}10 0%, transparent 40%)` 
        }}
      ></div>

      {/* --- TOAST NOTIFICATION --- */}
      {toast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[70] animate-fade-up">
            <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="font-medium text-sm">{toast.message}</span>
            </div>
        </div>
      )}

      {/* --- HEADER SECTION --- */}
      <div className="max-w-7xl mx-auto mb-16 relative z-10 animate-fade-up">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border text-xs font-bold uppercase tracking-wider shadow-sm" style={{ borderColor: `${primaryColor}20`, color: primaryColor }}>
            <Sparkles className="w-3 h-3" style={{ color: accentColor }} /> 
            Premium Collection
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[0.95]">
            Find Your <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>Sanctuary.</span>
          </h2>
          
          <p className="text-gray-500 text-lg md:text-xl font-light max-w-2xl mx-auto pt-2">
            Explore our curated selection of rare flora, locally grown in Ghana and nurtured for your home.
          </p>
        </div>

        {/* --- CONTROLS BAR (Glassmorphism) --- */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/70 backdrop-blur-xl p-3 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 max-w-6xl mx-auto">
          
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 px-2 no-scrollbar mask-gradient">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'text-white shadow-lg transform scale-105' 
                    : 'bg-transparent text-gray-500 hover:bg-white hover:text-gray-900'
                }`}
                style={{ 
                    backgroundColor: activeCategory === cat ? primaryColor : 'transparent' 
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
            </div>
            <input 
              placeholder="Search by name..." 
              className="w-full pl-12 pr-6 py-3.5 bg-white/50 hover:bg-white focus:bg-white border-2 border-transparent focus:border-emerald-100 rounded-[1.5rem] outline-none transition-all font-medium text-gray-700 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="max-w-7xl mx-auto relative z-10 px-2">
        {filteredPlants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white/40 backdrop-blur-sm rounded-[3rem] border border-dashed border-gray-300 text-center animate-fade-up">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Leaf className="w-10 h-10 text-gray-400 opacity-50" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No plants found</h3>
            <p className="text-gray-500">Try adjusting your search or category filters.</p>
            <button 
                onClick={() => {setActiveCategory('All'); setSearchTerm('')}}
                className="mt-6 text-sm font-bold underline"
                style={{ color: primaryColor }}
            >
                Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10">
            {filteredPlants.map((plant, index) => (
              <div 
                key={plant.id} 
                onClick={() => setSelectedPlant(plant)}
                className="group flex flex-col cursor-pointer animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-100 mb-5 shadow-sm group-hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2">
                  <img 
                    src={plant.image} 
                    alt={plant.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Stock Badge */}
                  <div className="absolute top-4 left-4">
                    {!plant.inStock && (
                      <span className="bg-red-500/90 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                        Sold Out
                      </span>
                    )}
                  </div>

                  {/* Quick Add Button (Visible on Hover) */}
                  <button 
                     onClick={(e) => handleAddToCart(e, plant)}
                     className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-emerald-50"
                     disabled={!plant.inStock}
                     style={{ color: primaryColor }}
                  >
                     <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>

                {/* Info */}
                <div className="px-2">
                  <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70" style={{ color: secondaryColor }}>
                            {plant.category}
                        </p>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-emerald-700 transition-colors">
                            {plant.name}
                        </h3>
                      </div>
                      <span className="font-black text-lg text-gray-900">
                        ₵{plant.price}
                      </span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium truncate">
                      {plant.scientificName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= PRODUCT DETAIL MODAL ================= */}
      {selectedPlant && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity"
                onClick={() => setSelectedPlant(null)}
            ></div>

            {/* Modal Card */}
            <div className="bg-white w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-2xl grid lg:grid-cols-2 relative animate-scale-in max-h-[90vh] lg:h-[600px] flex flex-col lg:flex-row">
                
                {/* Close Button */}
                <button 
                    onClick={() => setSelectedPlant(null)}
                    className="absolute top-6 right-6 z-20 bg-white/40 hover:bg-white text-gray-800 p-2 rounded-full transition-all backdrop-blur-md shadow-sm"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left: Image Side */}
                <div className="relative h-64 lg:h-full w-full bg-gray-100 overflow-hidden">
                    <img 
                        src={selectedPlant.image} 
                        alt={selectedPlant.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-8">
                        <p className="text-white/80 font-serif italic text-lg tracking-wide">{selectedPlant.scientificName}</p>
                    </div>
                </div>

                {/* Right: Details Side */}
                <div className="p-8 lg:p-12 flex flex-col h-full overflow-y-auto custom-scrollbar bg-white">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                                {selectedPlant.category}
                            </span>
                            {selectedPlant.inStock ? (
                                <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                                    <CheckCircle2 className="w-3 h-3" /> In Stock
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                                    <AlertCircle className="w-3 h-3" /> Out of Stock
                                </span>
                            )}
                        </div>

                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-2 leading-[0.95]">
                            {selectedPlant.name}
                        </h2>
                        <p className="text-3xl font-bold mt-2" style={{ color: primaryColor }}>
                             GH₵{selectedPlant.price}
                        </p>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-8 text-lg font-light">
                        {selectedPlant.description || "Known for its stunning foliage and air-purifying qualities, this plant is a perfect addition to modern Ghanaian homes. Thrives in our local climate with minimal fuss."}
                    </p>

                    {/* Care Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                            <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-sm uppercase tracking-wide">
                                <Droplets className="w-4 h-4" /> Watering
                            </div>
                            <p className="text-sm text-gray-600 font-medium">
                                {selectedPlant.care || "Water when topsoil is dry."}
                            </p>
                        </div>
                        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                            <div className="flex items-center gap-2 mb-2 text-amber-600 font-bold text-sm uppercase tracking-wide">
                                <Sun className="w-4 h-4" /> Light
                            </div>
                            <p className="text-sm text-gray-600 font-medium">
                                {selectedPlant.light || "Bright indirect light."}
                            </p>
                        </div>
                    </div>

                    {/* Footer / CTA */}
                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <button 
                            onClick={(e) => {
                                handleAddToCart(e, selectedPlant);
                                if(selectedPlant.inStock) setSelectedPlant(null);
                            }}
                            disabled={!selectedPlant.inStock}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${
                                selectedPlant.inStock 
                                    ? 'text-white hover:opacity-90' 
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                            style={{ backgroundColor: selectedPlant.inStock ? primaryColor : undefined }}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {selectedPlant.inStock ? 'Add to Cart' : 'Currently Unavailable'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default CatalogView;