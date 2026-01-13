// src/App.jsx
import React, { useState, useEffect, Suspense } from 'react';
import { Bot, MessageCircle } from 'lucide-react';

// --- COMPONENTS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import CatalogView from './components/CatalogView';
import GalleryView from './components/GalleryView';
import ServicesView from './components/ServicesView';
import LocationView from './components/LocationView';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AIChatBot from './components/AIChatBot';

// --- ADMIN & AUTH ---
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { auth, db, storage } from './firebaseConfig'; 
import { signOut } from 'firebase/auth';
import { doc, onSnapshot, collection, getDocs } from 'firebase/firestore'; 

// --- BOOKKEEPING ---
import BookkeepingSystem from './Bookkeeping';

// --- SERVICE LAYER ---
import { DataService } from './services/dataService';

// --- DEFAULT CONFIGURATION ---
const DEFAULT_CONFIG = {
  primaryColor: '#064e3b',
  secondaryColor: '#059669',
  accentColor: '#f59e0b',
  heroHeadline: 'Nature, Curated for You.',
  heroSubtext: 'Green Gold Gardens connects you with premium flora, expert landscaping, and the serenity of nature.',
  logoUrl: '' 
};

export default function GreenGoldGardensApp() {
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showBookkeeping, setShowBookkeeping] = useState(false);

  // --- DATA STATE (Initialized to empty arrays to prevent .map() crashes) ---
  const [cart, setCart] = useState([]);
  const [plants, setPlants] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [siteConfig, setSiteConfig] = useState(DEFAULT_CONFIG);
  
  // --- ADMIN STATE ---
  const [adminUser, setAdminUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  // =========================================================
  // 1. INITIAL DATA FETCHING
  // =========================================================
  useEffect(() => {
    const initData = async () => {
      try {
        // A. Fetch Catalog
        const plantList = await DataService.getAllPlants();
        if (plantList) setPlants(plantList);

        // B. Fetch Gallery (With error fallback)
        try {
            const gallerySnap = await getDocs(collection(db, 'gallery'));
            setGallery(gallerySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (e) { console.error("Gallery fetch failed", e); }

        // C. Fetch Workers (With error fallback)
        try {
            const workersSnap = await getDocs(collection(db, 'workers'));
            setWorkers(workersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (e) { console.error("Workers fetch failed", e); }

      } catch (error) {
        console.error("Critical error initializing app data:", error);
      } finally {
        // Stop loading spinner regardless of success
        setLoading(false);
      }
    };

    initData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []); 

  // =========================================================
  // 2. LIVE CONFIG LISTENER
  // =========================================================
  useEffect(() => {
    // Listen to 'config' document inside 'siteSettings' collection
    const unsubSettings = onSnapshot(doc(db, 'siteSettings', 'config'), (docSnapshot) => {
      if (docSnapshot.exists()) {
        setSiteConfig(prev => ({ ...prev, ...docSnapshot.data() }));
      }
    }, (err) => {
        console.warn("Config listener failed. Using defaults.", err);
    });
    return () => unsubSettings();
  }, []);

  // --- ACTIONS ---
  const addToCart = (product) => { 
    setCart(prev => [...prev, product]); 
    setIsCartOpen(true); 
  };
  
  const removeFromCart = (index) => { 
    setCart(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleLogout = async () => { 
    try {
        await signOut(auth); 
        setAdminUser(null); 
        setShowBookkeeping(false); 
        setActiveTab('home');
    } catch (e) { console.error("Logout failed", e); }
  };

  // --- RENDER LOGIC ---
  if (showBookkeeping) {
    return <BookkeepingSystem db={db} onExit={() => setShowBookkeeping(false)} />;
  }

  const renderContent = () => {
    // Wrap in safety checks to prevent one view from killing the whole app
    switch (activeTab) {
      case 'home': 
        return <HomeView setActiveTab={setActiveTab} config={siteConfig} /> || null;
      case 'about': 
        return <AboutView workers={workers || []} config={siteConfig} /> || null;
      case 'catalog': 
        return <CatalogView plants={plants || []} addToCart={addToCart} config={siteConfig} /> || null;
      case 'gallery': 
        return <GalleryView galleryImages={gallery || []} config={siteConfig} /> || null;
      case 'services': 
        return <ServicesView config={siteConfig} /> || null;
      case 'contact': 
        return <LocationView config={siteConfig} /> || null;
      case 'admin': 
        if (!adminUser) {
            return <AdminLogin onLogin={setAdminUser} onCancel={() => setActiveTab('home')} />;
        }
        return (
            <AdminPanel 
                user={adminUser.user}
                role={adminUser.role}
                db={db}
                storage={storage}
                plants={plants || []}
                gallery={gallery || []}
                workers={workers || []}
                onLaunchBookkeeping={() => setShowBookkeeping(true)}
                onLogout={handleLogout}
            />
        );
      default: return <HomeView setActiveTab={setActiveTab} config={siteConfig} />;
    }
  };

  if (loading) {
     return (
       <div className="h-screen w-full bg-[#022c22] flex flex-col items-center justify-center text-emerald-100">
         <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
         <p className="animate-pulse font-medium">Loading Green Gold...</p>
       </div>
     );
  }

  return (
    <div 
      className="font-sans text-gray-900 bg-stone-50 min-h-screen flex flex-col transition-colors duration-500 selection:bg-emerald-200 selection:text-emerald-900"
      style={{
        '--color-primary': siteConfig.primaryColor || DEFAULT_CONFIG.primaryColor,
        '--color-secondary': siteConfig.secondaryColor || DEFAULT_CONFIG.secondaryColor,
        '--color-accent': siteConfig.accentColor || DEFAULT_CONFIG.accentColor,
      }}
    >
      
      {activeTab !== 'admin' && (
        <>
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            cartCount={cart.length} 
            onOpenCart={() => setIsCartOpen(true)} 
            config={siteConfig} 
          />
          
          <CartDrawer 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            cartItems={cart} 
            onRemove={removeFromCart} 
            onCheckout={() => setIsCheckoutOpen(true)} 
            config={siteConfig}
          />
          
          {isCheckoutOpen && (
            <CheckoutModal 
              cart={cart} 
              total={cart.reduce((sum, item) => sum + (item.price || 0), 0)} 
              onClose={() => setIsCheckoutOpen(false)} 
              onSuccess={() => { 
                setCart([]); 
                setIsCheckoutOpen(false); 
                setIsCartOpen(false); 
              }} 
              config={siteConfig}
            />
          )}

          <div className="fixed bottom-6 right-6 z-50">
            {!isChatOpen && (
              <button 
                onClick={() => setIsChatOpen(true)}
                className="group relative flex items-center justify-center w-16 h-16 text-white rounded-full shadow-2xl transition-all transform hover:scale-110"
                style={{ backgroundColor: siteConfig.secondaryColor }}
              >
                <MessageCircle className="w-8 h-8" />
                <span className="absolute top-0 right-0 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500 border-2 border-white"></span>
                </span>
              </button>
            )}

            <AIChatBot 
              isOpen={isChatOpen} 
              onClose={() => setIsChatOpen(false)} 
              plants={plants || []} 
              workers={workers || []} 
              config={siteConfig}
            />
          </div>
        </>
      )}

      <main className={`flex-grow animate-fade-in ${activeTab !== 'admin' ? 'pt-20' : ''}`}>
        {renderContent()}
      </main>
      
      {activeTab !== 'admin' && (
        <Footer 
            setActiveTab={setActiveTab} 
            config={siteConfig} 
            onAdminClick={() => setActiveTab('admin')}
        />
      )}
    </div>
  );
}