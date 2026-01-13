// src/components/AdminPanel.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Save, 
  Bot, 
  Upload, 
  ImageIcon, 
  Trash2, 
  UserCheck, 
  DollarSign, 
  LogOut, 
  Shield, 
  UserPlus, 
  CalendarCheck,
  CheckCircle, 
  XCircle, 
  FileText, 
  LayoutDashboard, 
  Package,
  Menu, 
  X, 
  Search, 
  Bell, 
  MessageSquare, 
  Star, 
  ThumbsUp,
  Settings,
  TrendingUp,
  Activity,
  AlertCircle,
  PieChart
} from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc, getDocs, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const AdminPanel = ({ user, role, db, storage, plants, gallery, workers, onLaunchBookkeeping, onLogout }) => {
  // --- NAVIGATION STATE ---
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard'); // Default to Dashboard for overview
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 

  // --- SETTINGS STATE (Configurable Site Appearance) ---
  const [siteSettings, setSiteSettings] = useState({
    primaryColor: '#064e3b',   // Default Emerald-900
    secondaryColor: '#059669', // Default Emerald-600
    accentColor: '#f59e0b',    // Default Amber-500
    heroHeadline: 'Nature, Curated for You.',
    heroSubtext: 'Green Gold Gardens connects you with premium flora, expert landscaping, and the serenity of nature.',
    logoUrl: '',
    contactEmail: 'info@greengold.com',
    phoneNumber: '+233 20 000 0000'
  });

  // --- INVENTORY STATES ---
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [inventorySearch, setInventorySearch] = useState('');

  // --- GENERAL STATES ---
  const [newPhoto, setNewPhoto] = useState({ title: '', category: 'Events', src: '' });
  const [newWorker, setNewWorker] = useState({ name: '', role: '', image: '' });
  const [aboutForm, setAboutForm] = useState({ 
    founderName: '', 
    founderRole: '', 
    storyTitle: '', 
    storyText: '', 
    founderImage: '' 
  });
  const [newStaff, setNewStaff] = useState({ email: '', password: '', name: '', role: 'intern' });
  const [staffMsg, setStaffMsg] = useState('');
  
  // --- DATA LIST STATES ---
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]); 
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // --- PERMISSIONS ---
  const canEditContent = role === 'owner' || role === 'assistant'; 
  const canAccessBookkeeping = role === 'owner' || role === 'assistant';
  const canViewBookings = role === 'owner' || role === 'assistant';
  const isOwner = role === 'owner';

  // --- COMPUTED STATS FOR DASHBOARD ---
  const stats = useMemo(() => {
    const totalInventoryValue = plants.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
    const pendingBookings = bookings.filter(b => b.status !== 'Completed' && b.status !== 'Cancelled').length;
    const pendingReviews = reviews.filter(r => !r.approved).length;
    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / reviews.length).toFixed(1) 
        : 'N/A';

    return {
        totalPlants: plants.length,
        inventoryValue: totalInventoryValue,
        pendingBookings,
        pendingReviews,
        averageRating,
        totalGallery: gallery.length
    };
  }, [plants, bookings, reviews, gallery]);

  // --- INITIAL DATA FETCHING ---
  
  // 1. Fetch Settings
  useEffect(() => {
    const fetchSettings = async () => {
        try {
            const docRef = doc(db, 'siteSettings', 'config');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSiteSettings(prev => ({ ...prev, ...docSnap.data() }));
            }
        } catch (err) { console.error("Error fetching settings:", err); }
    };
    fetchSettings();
  }, [db]);

  // 2. Fetch Bookings (if permitted)
  useEffect(() => {
    if (canViewBookings) {
      const fetchBookings = async () => {
        setLoadingBookings(true);
        try {
          const snapshot = await getDocs(collection(db, 'bookings'));
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
          setBookings(data);
        } catch (error) { console.error("Error fetching bookings:", error); }
        setLoadingBookings(false);
      };
      fetchBookings();
    }
  }, [canViewBookings, db]);

  // 3. Fetch Reviews
  useEffect(() => {
    const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
            const snapshot = await getDocs(collection(db, 'reviews'));
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setReviews(data);
        } catch (error) { console.error("Error fetching reviews:", error); }
        setLoadingReviews(false);
    };
    fetchReviews();
  }, [db]);

  // 4. Fetch About Content
  useEffect(() => {
    if (activeAdminTab === 'content') {
      const fetchAbout = async () => {
        const docRef = doc(db, 'siteContent', 'aboutPage');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setAboutForm(docSnap.data());
        }
      };
      fetchAbout();
    }
  }, [activeAdminTab, db]);

  // --- FILE UPLOAD HANDLER ---
  const uploadImage = async (file) => {
    if (!file) return null;
    const fileRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  // --- GENERIC DELETE HANDLER ---
  const deleteItem = async (collectionName, id) => {
    if(window.confirm("Are you sure you want to delete this item? This cannot be undone.")) {
      await deleteDoc(doc(db, collectionName, id));
      
      // Optimistic UI updates based on collection
      if(collectionName === 'reviews') setReviews(reviews.filter(r => r.id !== id));
      if(collectionName === 'bookings') setBookings(bookings.filter(b => b.id !== id));
      
      alert("Item Deleted Successfully!");
    }
  };

  // --- SETTINGS ACTIONS ---
  const handleSettingsSave = async () => {
    await setDoc(doc(db, 'siteSettings', 'config'), siteSettings);
    alert("System Appearance Updated! Changes are now live.");
  };

  const handleLogoUpload = async (e) => {
    const url = await uploadImage(e.target.files[0]);
    if(url) setSiteSettings({ ...siteSettings, logoUrl: url });
  };

  // --- INVENTORY ACTIONS ---
  const handleAddNew = () => { 
    setEditingId('NEW'); 
    setEditForm({ 
      name: '', scientificName: '', price: 0, category: 'Indoor', image: '', description: '', care: '', origin: '', inStock: true 
    }); 
  };
  
  const startEdit = (plant) => { setEditingId(plant.id); setEditForm(plant); };
  
  const handleInventoryImg = async (e) => { 
    const url = await uploadImage(e.target.files[0]); 
    if(url) setEditForm({ ...editForm, image: url }); 
  };

  const handleInventorySave = async () => {
    if (editingId === 'NEW') {
        await addDoc(collection(db, 'plants'), editForm);
    } else {
        await updateDoc(doc(db, 'plants', editingId), editForm);
    }
    setEditingId(null); 
    alert('Inventory Updated Successfully!');
  };

  const handleAIGenerate = () => { 
    setIsGenerating(true); 
    // Simulation of AI generation
    setTimeout(() => { 
      setEditForm(p => ({ 
        ...p, 
        description: `[AI Generated] The ${editForm.name || 'plant'} is a stunning addition to any space, known for its resilience and beauty.`, 
        care: `[AI Generated] Water sparingly when soil is dry. Needs indirect sunlight.`, 
        origin: `[AI Generated] Locally sourced from the Eastern Region of Ghana.` 
      })); 
      setIsGenerating(false); 
    }, 1000); 
  };

  const filteredPlants = plants.filter(p => 
      p.name.toLowerCase().includes(inventorySearch.toLowerCase()) || 
      p.category.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  // --- BOOKING & REVIEW ACTIONS ---
  const handleBookingStatus = async (id, s) => { 
      await updateDoc(doc(db, 'bookings', id), { status: s }); 
      setBookings(p => p.map(b => b.id === id ? { ...b, status: s } : b)); 
  };

  const handleReviewStatus = async (id, status) => {
      await updateDoc(doc(db, 'reviews', id), { approved: status });
      setReviews(reviews.map(r => r.id === id ? { ...r, approved: status } : r));
  };

  // --- CONTENT & TEAM ACTIONS ---
  const handleAboutSave = async () => { 
      await setDoc(doc(db, 'siteContent', 'aboutPage'), aboutForm); 
      alert("Content Saved!"); 
  };
  
  const handleAboutImg = async (e) => { 
      const url = await uploadImage(e.target.files[0]); 
      if(url) setAboutForm({ ...aboutForm, founderImage: url }); 
  };
  
  const handleGallerySave = async () => { 
      await addDoc(collection(db, 'gallery'), newPhoto); 
      setNewPhoto({title:'', category:'Events', src:''}); 
      alert('Photo Added to Gallery!'); 
  };
  
  const handleGalleryImg = async (e) => { 
      const url = await uploadImage(e.target.files[0]); 
      if(url) setNewPhoto({ ...newPhoto, src: url }); 
  };

  const handleWorkerSave = async () => { 
      await addDoc(collection(db, 'workers'), newWorker); 
      setNewWorker({name:'', role:'', image:''}); 
      alert('Team Member Added!'); 
  };
  
  const handleWorkerImg = async (e) => { 
      const url = await uploadImage(e.target.files[0]); 
      if(url) setNewWorker({...newWorker, image: url}); 
  };
  
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    if(!window.confirm("Creating a new user will sign you out currently. Do you want to continue?")) return;
    try {
      await createUserWithEmailAndPassword(auth, newStaff.email, newStaff.password);
      await setDoc(doc(db, 'staff', newStaff.email), { name: newStaff.name, role: newStaff.role, email: newStaff.email });
      onLogout(); 
    } catch (err) { setStaffMsg('Error: ' + err.message); }
  };

  // --- MENU CONFIGURATION ---
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    ...(canViewBookings ? [{ id: 'bookings', label: 'Requests', icon: CalendarCheck, badge: stats.pendingBookings }] : []),
    ...(canEditContent ? [{ id: 'reviews', label: 'Reviews', icon: MessageSquare, badge: stats.pendingReviews }] : []),
    ...(canEditContent ? [{ id: 'content', label: 'Page Content', icon: FileText }] : []),
    ...(canEditContent ? [{ id: 'gallery', label: 'Gallery', icon: ImageIcon }] : []),
    ...(canEditContent ? [{ id: 'team', label: 'Team', icon: UserCheck }] : []),
    ...(isOwner ? [{ id: 'settings', label: 'Settings', icon: Settings }] : []),
    ...(isOwner ? [{ id: 'staff', label: 'Staff Access', icon: Shield }] : []),
  ];

  return (
    <div className="flex h-screen bg-stone-50 font-sans overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className={`bg-slate-900 text-white w-72 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute z-50 h-full'} md:relative md:translate-x-0 shadow-2xl`}>
        
        {/* Brand Header */}
        <div className="p-8 border-b border-slate-800 flex items-center gap-4">
           <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl shadow-lg shadow-emerald-900/50">
               <Activity className="w-6 h-6 text-white"/>
           </div>
           <div>
             <h1 className="font-bold text-xl tracking-wide font-display">Admin OS</h1>
             <p className="text-xs text-slate-400">Green Gold Gardens</p>
           </div>
           <button className="md:hidden ml-auto" onClick={() => setIsSidebarOpen(false)}><X className="w-5 h-5"/></button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-5 space-y-2 overflow-y-auto custom-scrollbar">
           {menuItems.map(item => (
             <button
                key={item.id}
                onClick={() => { setActiveAdminTab(item.id); if(window.innerWidth < 768) setIsSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all group ${
                  activeAdminTab === item.id 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-900/30' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
             >
                <div className="flex items-center gap-4">
                    <item.icon className={`w-5 h-5 transition-colors ${activeAdminTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}/>
                    <span className="font-medium text-sm tracking-wide">{item.label}</span>
                </div>
                {item.badge > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                        {item.badge}
                    </span>
                )}
             </button>
           ))}
        </nav>

        {/* User Profile & Logout Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950">
           <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                 {user?.email ? user.email[0].toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                 <p className="text-sm font-bold truncate text-white">{user?.email}</p>
                 <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">{role}</p>
              </div>
           </div>
           <button 
                onClick={onLogout} 
                className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 py-3 rounded-xl hover:bg-red-500 hover:text-white border border-red-900/30 hover:border-red-500 transition-all text-sm font-bold"
           >
              <LogOut className="w-4 h-4"/> Sign Out
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col h-full w-full relative">
        
        {/* TOP HEADER */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-200/60 flex justify-between items-center px-8 shadow-sm shrink-0 sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <button className="md:hidden text-gray-500 p-2 hover:bg-gray-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
                  <Menu className="w-6 h-6"/>
              </button>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 capitalize tracking-tight">
                    {activeAdminTab === 'content' ? 'Page Content' : activeAdminTab}
                </h2>
                <p className="text-xs text-gray-400 hidden md:block">
                    {activeAdminTab === 'dashboard' ? 'Overview of your business performance' : 'Manage your platform data'}
                </p>
              </div>
           </div>

           <div className="flex items-center gap-6">
              <button className="relative p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                  <Bell className="w-6 h-6"/>
                  {stats.pendingBookings > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
              </button>
              
              {canAccessBookkeeping && (
                <button 
                  onClick={onLaunchBookkeeping}
                  className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-transform active:scale-95 shadow-xl shadow-slate-200"
                >
                  <DollarSign className="w-5 h-5 text-emerald-400"/> Finance & Books
                </button>
              )}
           </div>
        </header>

        {/* SCROLLABLE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">

          {/* ================= DASHBOARD TAB (NEW) ================= */}
          {activeAdminTab === 'dashboard' && (
             <div className="animate-fade-in space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <Package className="w-7 h-7"/>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Plants</p>
                            <h4 className="text-2xl font-bold text-slate-800">{stats.totalPlants}</h4>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <TrendingUp className="w-7 h-7"/>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Inventory Value</p>
                            <h4 className="text-2xl font-bold text-slate-800">GH₵{stats.inventoryValue.toLocaleString()}</h4>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center relative">
                            <CalendarCheck className="w-7 h-7"/>
                            {stats.pendingBookings > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Pending Requests</p>
                            <h4 className="text-2xl font-bold text-slate-800">{stats.pendingBookings}</h4>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                            <Star className="w-7 h-7"/>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Avg Rating</p>
                            <h4 className="text-2xl font-bold text-slate-800">{stats.averageRating} <span className="text-xs text-gray-400">/ 5.0</span></h4>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Recent Bookings List */}
                    <div className="md:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-800">Recent Service Requests</h3>
                            <button onClick={()=>setActiveAdminTab('bookings')} className="text-sm text-emerald-600 font-bold hover:underline">View All</button>
                        </div>
                        {bookings.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">No requests yet.</div>
                        ) : (
                            <div className="space-y-4">
                                {bookings.slice(0, 5).map(b => (
                                    <div key={b.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-12 rounded-full ${b.status === 'Completed' ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                                            <div>
                                                <p className="font-bold text-slate-800">{b.name}</p>
                                                <p className="text-xs text-gray-500">{b.service} • {b.date}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${b.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {b.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Action Widget */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-xl shadow-slate-300 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
                            <p className="text-slate-400 text-sm mb-6">Shortcuts to manage your site.</p>
                            
                            <div className="space-y-3">
                                <button onClick={handleAddNew} className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-xl flex items-center gap-3 transition-colors text-sm font-bold backdrop-blur-sm">
                                    <Plus className="w-4 h-4 text-emerald-400"/> Add New Plant
                                </button>
                                <button onClick={()=>setActiveAdminTab('gallery')} className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-xl flex items-center gap-3 transition-colors text-sm font-bold backdrop-blur-sm">
                                    <ImageIcon className="w-4 h-4 text-purple-400"/> Upload to Gallery
                                </button>
                                {isOwner && (
                                    <button onClick={()=>setActiveAdminTab('settings')} className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-xl flex items-center gap-3 transition-colors text-sm font-bold backdrop-blur-sm">
                                        <Settings className="w-4 h-4 text-amber-400"/> Site Settings
                                    </button>
                                )}
                            </div>
                        </div>
                        <Bot className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 rotate-12"/>
                    </div>
                </div>
             </div>
          )}
          
          {/* ================= INVENTORY TAB ================= */}
          {activeAdminTab === 'inventory' && (
            <div className="animate-fade-in space-y-6">
              {!editingId && (
                 <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5"/>
                        <input 
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl outline-none transition-all"
                            placeholder="Search plants, pots, accessories..."
                            value={inventorySearch}
                            onChange={(e) => setInventorySearch(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={handleAddNew} 
                        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold flex gap-2 shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 whitespace-nowrap"
                    >
                      <Plus className="w-5 h-5" /> Add Item
                    </button>
                 </div>
              )}

              {editingId ? (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-5xl mx-auto animate-fade-in-up">
                   <div className="bg-slate-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                     <div>
                        <h3 className="text-xl font-bold text-slate-800">{editingId === 'NEW' ? 'New Product Entry' : 'Editing Product'}</h3>
                        <p className="text-xs text-gray-500">Fill in the details below. Use AI for quick text generation.</p>
                     </div>
                     <button 
                        onClick={handleAIGenerate} 
                        disabled={isGenerating} 
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 text-xs hover:shadow-lg hover:shadow-purple-200 transition-all active:scale-95 disabled:opacity-50"
                     >
                        {isGenerating ? 'Generating...' : <><Bot className="w-4 h-4"/> AI Auto-Fill</>}
                     </button>
                   </div>
                   
                   <div className="p-8 grid md:grid-cols-12 gap-10">
                      {/* Image Uploader */}
                      <div className="md:col-span-4 space-y-4">
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Product Image</label>
                         <div className="border-2 border-dashed border-gray-300 rounded-3xl bg-gray-50 h-80 flex items-center justify-center relative group overflow-hidden hover:border-emerald-400 transition-colors">
                            {editForm.image ? (
                                <img src={editForm.image} className="w-full h-full object-cover" alt="Product" />
                            ) : (
                                <div className="text-gray-400 text-center">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                        <Upload className="w-6 h-6 text-emerald-500"/>
                                    </div>
                                    <p className="text-sm font-bold text-gray-500">Click to Upload</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                </div>
                            )}
                            <input type="file" onChange={handleInventoryImg} className="absolute inset-0 opacity-0 cursor-pointer"/>
                            {editForm.image && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <span className="text-white font-bold border-2 border-white px-4 py-2 rounded-lg">Change Image</span>
                                </div>
                            )}
                         </div>
                      </div>

                      {/* Form Fields */}
                      <div className="md:col-span-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 group-focus-within:text-emerald-600">Name</label>
                                <input className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" value={editForm.name} onChange={e=>setEditForm({...editForm, name:e.target.value})}/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Scientific Name</label>
                                <input className="w-full p-4 border border-gray-200 rounded-xl italic text-gray-600 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Monstera deliciosa" value={editForm.scientificName} onChange={e=>setEditForm({...editForm, scientificName:e.target.value})}/>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price (GH₵)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-4 text-gray-400 font-bold">₵</span>
                                    <input type="number" className="w-full pl-8 p-4 border border-gray-200 rounded-xl font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-none" value={editForm.price} onChange={e=>setEditForm({...editForm, price:Number(e.target.value)})}/>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                                <select className="w-full p-4 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 outline-none appearance-none" value={editForm.category} onChange={e=>setEditForm({...editForm, category:e.target.value})}>
                                    <option>Indoor</option>
                                    <option>Outdoor</option>
                                    <option>Pots</option>
                                    <option>Accessories</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                            <textarea className="w-full p-4 border border-gray-200 rounded-xl h-28 focus:ring-2 focus:ring-emerald-500 outline-none resize-none leading-relaxed" value={editForm.description} onChange={e=>setEditForm({...editForm, description:e.target.value})}/>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Care Instructions</label>
                                <textarea className="w-full p-4 border border-gray-200 rounded-xl h-28 focus:ring-2 focus:ring-emerald-500 outline-none resize-none text-sm" placeholder="Watering, Light..." value={editForm.care} onChange={e=>setEditForm({...editForm, care:e.target.value})}/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Origin / Note</label>
                                <textarea className="w-full p-4 border border-gray-200 rounded-xl h-28 focus:ring-2 focus:ring-emerald-500 outline-none resize-none text-sm" placeholder="Country of origin..." value={editForm.origin} onChange={e=>setEditForm({...editForm, origin:e.target.value})}/>
                            </div>
                        </div>
                      </div>
                   </div>
                   
                   <div className="p-6 bg-slate-50 flex justify-end gap-3 border-t border-gray-200">
                       <button onClick={()=>setEditingId(null)} className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-white hover:text-red-500 hover:shadow-sm border border-transparent hover:border-gray-200 transition-all">Cancel</button>
                       <button onClick={handleInventorySave} className="px-10 py-3 bg-emerald-600 text-white rounded-xl font-bold flex gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"><Save className="w-5 h-5"/> Save Item</button>
                   </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredPlants.map(p => (
                    <div key={p.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                       <div className="h-48 rounded-2xl overflow-hidden mb-4 bg-gray-50 relative">
                          <img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt={p.name} />
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
                             GH₵{p.price}
                          </div>
                       </div>
                       <div className="mb-4">
                          <p className="font-bold text-gray-800 text-lg truncate">{p.name}</p>
                          <p className="text-xs text-gray-400 italic truncate">{p.scientificName}</p>
                       </div>
                       
                       <div className="flex gap-2 border-t border-gray-50 pt-4">
                         <button onClick={() => startEdit(p)} className="flex-1 bg-slate-50 text-slate-600 text-xs py-2.5 rounded-xl hover:bg-slate-800 hover:text-white font-bold transition-all">Edit Details</button>
                         <button onClick={() => deleteItem('plants', p.id)} className="bg-red-50 text-red-500 px-3 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4"/></button>
                       </div>
                    </div>
                  ))}
                  {filteredPlants.length === 0 && (
                      <div className="col-span-full py-20 text-center text-gray-400">
                          <Package className="w-16 h-16 mx-auto mb-4 opacity-20"/>
                          <p>No products found matching your search.</p>
                      </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= SETTINGS TAB (NEW & IMPROVED) ================= */}
          {activeAdminTab === 'settings' && isOwner && (
            <div className="max-w-5xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
              <div className="flex justify-between items-start mb-10 border-b border-gray-100 pb-8">
                  <div>
                    <h3 className="text-3xl font-bold text-slate-800">System Appearance</h3>
                    <p className="text-gray-500 mt-2">Customize the look and feel of your customer-facing website.</p>
                  </div>
                  <div className="bg-slate-100 p-2 rounded-lg">
                      <Settings className="w-8 h-8 text-slate-400"/>
                  </div>
              </div>

              <div className="grid md:grid-cols-12 gap-12">
                 {/* Color Controls */}
                 <div className="md:col-span-4 space-y-8">
                    <h4 className="font-bold text-gray-800 uppercase text-xs tracking-wider">Brand Palette</h4>
                    
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6">
                        <div>
                            <label className="flex justify-between text-xs font-bold text-gray-500 uppercase mb-2">
                                <span>Primary (Dark)</span>
                                <span className="font-mono text-gray-400">{siteSettings.primaryColor}</span>
                            </label>
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-full rounded-xl overflow-hidden relative border border-gray-200 shadow-inner">
                                    <input type="color" className="absolute -top-4 -left-4 w-32 h-32 cursor-pointer" value={siteSettings.primaryColor} onChange={e=>setSiteSettings({...siteSettings, primaryColor:e.target.value})} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="flex justify-between text-xs font-bold text-gray-500 uppercase mb-2">
                                <span>Secondary (Main)</span>
                                <span className="font-mono text-gray-400">{siteSettings.secondaryColor}</span>
                            </label>
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-full rounded-xl overflow-hidden relative border border-gray-200 shadow-inner">
                                    <input type="color" className="absolute -top-4 -left-4 w-32 h-32 cursor-pointer" value={siteSettings.secondaryColor} onChange={e=>setSiteSettings({...siteSettings, secondaryColor:e.target.value})} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="flex justify-between text-xs font-bold text-gray-500 uppercase mb-2">
                                <span>Accent (Highlight)</span>
                                <span className="font-mono text-gray-400">{siteSettings.accentColor}</span>
                            </label>
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-full rounded-xl overflow-hidden relative border border-gray-200 shadow-inner">
                                    <input type="color" className="absolute -top-4 -left-4 w-32 h-32 cursor-pointer" value={siteSettings.accentColor} onChange={e=>setSiteSettings({...siteSettings, accentColor:e.target.value})} />
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Text & Logo Controls */}
                 <div className="md:col-span-8 space-y-8">
                    <h4 className="font-bold text-gray-800 uppercase text-xs tracking-wider">Identity & Messaging</h4>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Website Logo</label>
                            <div className="flex items-center gap-6 p-6 border border-gray-100 rounded-2xl bg-gray-50">
                                <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden relative shadow-sm">
                                    {siteSettings.logoUrl ? (
                                        <img src={siteSettings.logoUrl} className="w-full h-full object-contain p-2" alt="Logo"/>
                                    ) : (
                                        <ImageIcon className="text-gray-300 w-8 h-8"/>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input 
                                        type="file" 
                                        onChange={handleLogoUpload} 
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-400 mt-2">Recommended: Square PNG with transparent background. Max 2MB.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Hero Headline</label>
                            <input 
                                className="w-full p-4 border border-gray-200 rounded-xl font-bold text-lg text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none" 
                                value={siteSettings.heroHeadline} 
                                onChange={e=>setSiteSettings({...siteSettings, heroHeadline:e.target.value})} 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Hero Subtext</label>
                            <textarea 
                                className="w-full p-4 border border-gray-200 rounded-xl h-32 resize-none focus:ring-2 focus:ring-emerald-500 outline-none text-gray-600 leading-relaxed" 
                                value={siteSettings.heroSubtext} 
                                onChange={e=>setSiteSettings({...siteSettings, heroSubtext:e.target.value})} 
                            />
                        </div>

                        <button 
                            onClick={handleSettingsSave} 
                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 shadow-xl shadow-slate-200 hover:shadow-emerald-200 transition-all flex items-center justify-center gap-3 mt-4 active:scale-95"
                        >
                            <Save className="w-5 h-5"/> Save Configuration Live
                        </button>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* ================= REVIEWS TAB ================= */}
          {activeAdminTab === 'reviews' && canEditContent && (
            <div className="animate-fade-in max-w-6xl mx-auto">
                {/* Pending Reviews Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                            <AlertCircle className="w-5 h-5"/>
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg">Pending Approval</h4>
                    </div>
                    
                    {reviews.filter(r => !r.approved).length === 0 ? (
                        <div className="bg-white/50 border border-dashed border-gray-300 p-12 rounded-3xl text-center text-gray-400">
                            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20"/>
                            No new reviews to moderate.
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {reviews.filter(r => !r.approved).map(review => (
                                <div key={review.id} className="bg-white p-6 rounded-3xl shadow-sm border border-amber-100 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 text-white flex items-center justify-center text-xs font-bold">
                                                    {review.name[0]}
                                                </div>
                                                <span className="font-bold text-gray-900">{review.name}</span>
                                            </div>
                                            <div className="flex text-amber-400 bg-amber-50 px-2 py-1 rounded-full">
                                                {[...Array(5)].map((_,i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400' : 'text-gray-300'}`}/>)}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl mb-4">
                                            <p className="text-gray-600 text-sm italic">"{review.text}"</p>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-4 flex items-center gap-1"><CalendarCheck className="w-3 h-3"/> {new Date(review.createdAt?.seconds * 1000).toDateString()}</p>
                                    </div>
                                    <div className="flex gap-3 border-t border-gray-50 pt-4">
                                        <button 
                                            onClick={() => handleReviewStatus(review.id, true)} 
                                            className="flex-1 bg-emerald-100 text-emerald-700 py-2.5 rounded-xl font-bold text-xs hover:bg-emerald-200 flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <ThumbsUp className="w-4 h-4"/> Approve
                                        </button>
                                        <button 
                                            onClick={() => deleteItem('reviews', review.id)} 
                                            className="px-4 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Published Reviews Section */}
                <div>
                    <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-6 pl-2">Live on Website</h4>
                    <div className="grid md:grid-cols-3 gap-6">
                        {reviews.filter(r => r.approved).map(review => (
                            <div key={review.id} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 hover:bg-white hover:shadow-md transition-all relative group">
                                <div className="flex justify-between mb-2">
                                    <p className="font-bold text-sm text-slate-700">{review.name}</p>
                                    <div className="flex text-amber-400 text-xs">★ {review.rating}.0</div>
                                </div>
                                <p className="text-gray-500 text-xs line-clamp-3">"{review.text}"</p>
                                <button 
                                    onClick={() => deleteItem('reviews', review.id)} 
                                    className="absolute top-2 right-2 bg-white text-red-500 p-1.5 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                                >
                                    <Trash2 className="w-3 h-3"/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          )}

          {/* ================= CONTENT (ABOUT) TAB ================= */}
          {activeAdminTab === 'content' && canEditContent && (
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
                <div className="text-center mb-10">
                   <h3 className="text-3xl font-bold text-slate-800">Edit "Our Roots" Page</h3>
                   <p className="text-gray-500 mt-2">Manage the founder story and image shown to customers.</p>
                </div>
                
                <div className="grid md:grid-cols-12 gap-10">
                   <div className="md:col-span-4">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Founder Image</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-3xl bg-gray-50 h-80 flex items-center justify-center relative hover:bg-gray-100 transition-colors group cursor-pointer overflow-hidden">
                        {aboutForm.founderImage ? (
                            <img src={aboutForm.founderImage} className="h-full w-full object-cover" alt="Founder" />
                        ) : (
                            <div className="text-gray-400 text-center"><Upload className="w-10 h-10 mx-auto mb-2"/><p>Upload Photo</p></div>
                        )}
                        <input type="file" onChange={handleAboutImg} className="absolute inset-0 opacity-0 cursor-pointer"/>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white font-bold">Change Photo</p>
                        </div>
                      </div>
                   </div>
                   <div className="md:col-span-8 space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                         <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Founder Name</label>
                             <input className="w-full p-4 border border-gray-200 rounded-xl" placeholder="Name" value={aboutForm.founderName} onChange={e=>setAboutForm({...aboutForm, founderName:e.target.value})} />
                         </div>
                         <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Role Title</label>
                             <input className="w-full p-4 border border-gray-200 rounded-xl" placeholder="Role" value={aboutForm.founderRole} onChange={e=>setAboutForm({...aboutForm, founderRole:e.target.value})} />
                         </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Story Title</label>
                          <input className="w-full p-4 border border-gray-200 rounded-xl font-bold text-lg" placeholder="Story Title" value={aboutForm.storyTitle} onChange={e=>setAboutForm({...aboutForm, storyTitle:e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">The Story</label>
                          <textarea className="w-full p-4 border border-gray-200 rounded-xl h-48 resize-none leading-relaxed text-gray-600" placeholder="Write the story here..." value={aboutForm.storyText} onChange={e=>setAboutForm({...aboutForm, storyText:e.target.value})} />
                      </div>
                      <button onClick={handleAboutSave} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"><Save className="w-5 h-5"/> Save Content Changes</button>
                   </div>
                </div>
            </div>
          )}

          {/* ================= GALLERY TAB ================= */}
          {activeAdminTab === 'gallery' && canEditContent && (
            <div className="animate-fade-in space-y-10">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><ImageIcon className="w-5 h-5"/></div>
                        <h3 className="font-bold text-xl text-gray-800">Add to Gallery</h3>
                      </div>
                      <p className="text-gray-500 text-sm mb-6 pl-12">Upload high-quality images of your projects to showcase your work.</p>
                      
                      <div className="flex flex-col md:flex-row gap-4 pl-0 md:pl-12">
                         <div className="relative flex-1">
                            <input className="w-full p-3.5 border border-gray-200 rounded-xl pl-10" placeholder="Image Caption / Title" value={newPhoto.title} onChange={e=>setNewPhoto({...newPhoto, title:e.target.value})} />
                            <FileText className="w-4 h-4 text-gray-400 absolute left-4 top-4"/>
                         </div>
                         <div className="relative w-full md:w-40 overflow-hidden group">
                            <button className="w-full bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl group-hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                                <Upload className="w-4 h-4"/> Upload
                            </button>
                            <input type="file" onChange={handleGalleryImg} className="absolute inset-0 opacity-0 cursor-pointer" />
                         </div>
                      </div>
                  </div>
                  <button onClick={handleGallerySave} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-purple-200 hover:shadow-xl transition-all h-fit w-full md:w-auto active:scale-95">Save Photo</button>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-6 pl-2">Current Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {gallery.map(g => ( 
                    <div key={g.id} className="relative group rounded-3xl overflow-hidden shadow-sm aspect-square bg-gray-100 border border-gray-100">
                        <img src={g.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={g.title} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => deleteItem('gallery', g.id)} className="bg-white text-red-500 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"><Trash2 className="w-5 h-5"/></button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10">
                            <p className="text-white font-bold truncate text-sm">{g.title}</p>
                            <p className="text-gray-300 text-xs">{g.category}</p>
                        </div>
                    </div> 
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TEAM TAB ================= */}
          {activeAdminTab === 'team' && canEditContent && (
            <div className="grid md:grid-cols-12 gap-8 animate-fade-in">
               <div className="md:col-span-4 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
                  <h3 className="font-bold text-xl mb-2 flex items-center gap-2 text-slate-800"><UserPlus className="w-6 h-6 text-blue-500"/> Add Team Member</h3>
                  <p className="text-gray-500 text-sm mb-6">Display your staff on the 'About' page.</p>
                  
                  <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 h-48 flex items-center justify-center relative hover:bg-blue-50 transition-colors group overflow-hidden">
                          {newWorker.image ? (
                              <img src={newWorker.image} className="w-full h-full object-cover" alt="Worker" />
                          ) : (
                              <div className="text-center text-gray-400">
                                  <Upload className="mx-auto w-6 h-6 mb-1"/>
                                  <span className="text-xs font-bold">Upload Photo</span>
                              </div>
                          )}
                          <input type="file" onChange={handleWorkerImg} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                      <input className="w-full p-3.5 border border-gray-200 rounded-xl" placeholder="Full Name" value={newWorker.name} onChange={e=>setNewWorker({...newWorker, name:e.target.value})} />
                      <input className="w-full p-3.5 border border-gray-200 rounded-xl" placeholder="Role (e.g. Head Gardener)" value={newWorker.role} onChange={e=>setNewWorker({...newWorker, role:e.target.value})} />
                      <button onClick={handleWorkerSave} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Add Member</button>
                  </div>
               </div>

               <div className="md:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-slate-800"><UserCheck className="w-6 h-6 text-emerald-500"/> Current Team</h3>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {workers.map(w => ( 
                      <div key={w.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors group">
                        <img src={w.image} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md" alt={w.name} />
                        <div className="flex-1">
                           <p className="font-bold text-slate-800 text-lg">{w.name}</p>
                           <p className="text-xs text-blue-500 uppercase tracking-wide font-bold">{w.role}</p>
                        </div>
                        <button onClick={() => deleteItem('workers', w.id)} className="text-gray-300 hover:text-red-500 p-3 hover:bg-red-50 rounded-full transition-all"><Trash2 className="w-5 h-5"/></button>
                      </div> 
                    ))}
                  </div>
               </div>
            </div>
          )}

          {/* ================= BOOKINGS TAB ================= */}
          {activeAdminTab === 'bookings' && canViewBookings && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in min-h-[500px]">
              <div className="p-8 border-b border-gray-100 bg-amber-50/30 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-amber-900 flex items-center gap-2"><CalendarCheck className="w-6 h-6"/> Incoming Requests</h3>
                    <p className="text-xs text-amber-700 mt-1">Manage service appointments and orders.</p>
                </div>
                <div className="flex gap-2">
                    <span className="bg-white text-amber-800 px-4 py-2 rounded-xl text-sm font-bold shadow-sm border border-amber-100">Total: {bookings.length}</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Date Logged', 'Customer Details', 'Service Type', 'Current Status', 'Actions'].map(h => <th key={h} className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bookings.map((b) => ( 
                      <tr key={b.id} className={`hover:bg-amber-50/20 transition-colors ${b.status === 'Completed' ? 'opacity-60 bg-gray-50/50' : ''}`}>
                        <td className="p-6 text-sm font-bold text-gray-500">{new Date(b.createdAt?.seconds * 1000).toLocaleDateString() || b.date}</td>
                        <td className="p-6">
                            <div className="font-bold text-gray-900 text-base">{b.name}</div>
                            <div className="text-xs text-gray-500 font-mono mt-1">{b.phone}</div>
                        </td>
                        <td className="p-6">
                            <span className="bg-white border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm">{b.service}</span>
                        </td>
                        <td className="p-6">
                            <span className={`text-xs px-3 py-1.5 rounded-full font-bold flex w-fit items-center gap-1.5 ${
                                b.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                b.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>
                                <span className={`w-2 h-2 rounded-full ${b.status === 'Completed' ? 'bg-green-500' : b.status === 'Cancelled' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                                {b.status}
                            </span>
                        </td>
                        <td className="p-6">
                            <div className="flex gap-2">
                                <button onClick={() => handleBookingStatus(b.id, 'Completed')} className="bg-green-50 text-green-600 p-2.5 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm" title="Mark Done"><CheckCircle className="w-4 h-4"/></button>
                                <button onClick={() => handleBookingStatus(b.id, 'Cancelled')} className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Cancel Request"><XCircle className="w-4 h-4"/></button>
                            </div>
                        </td>
                      </tr> 
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= STAFF MANAGEMENT TAB ================= */}
          {activeAdminTab === 'staff' && isOwner && (
              <div className="max-w-xl mx-auto bg-white p-12 rounded-3xl shadow-xl border border-purple-100 animate-fade-in text-center mt-10">
                  <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner"><Shield className="w-10 h-10"/></div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-3">Create Access Key</h3>
                  <p className="text-gray-500 mb-10 text-sm max-w-sm mx-auto">Generate a secure login for your managers or interns to access the admin panel.</p>
                  
                  <form onSubmit={handleCreateStaff} className="space-y-5 text-left bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-xs font-bold text-gray-500 ml-1 uppercase mb-1 block">Email Address</label>
                            <input required type="email" className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" value={newStaff.email} onChange={e=>setNewStaff({...newStaff, email:e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 ml-1 uppercase mb-1 block">Password</label>
                            <input required type="password" className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" value={newStaff.password} onChange={e=>setNewStaff({...newStaff, password:e.target.value})} />
                        </div>
                      </div>
                      
                      <div>
                          <label className="text-xs font-bold text-gray-500 ml-1 uppercase mb-1 block">Staff Name</label>
                          <input required className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" value={newStaff.name} onChange={e=>setNewStaff({...newStaff, name:e.target.value})} />
                      </div>
                      
                      <div>
                          <label className="text-xs font-bold text-gray-500 ml-1 uppercase mb-1 block">Role Permission</label>
                          <div className="relative">
                            <select className="w-full p-3.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 outline-none appearance-none" value={newStaff.role} onChange={e=>setNewStaff({...newStaff, role:e.target.value})}>
                                <option value="intern">Intern (View Inventory & Bookings)</option>
                                <option value="assistant">Assistant (Edit Content & Reviews)</option>
                                <option value="owner">Owner (Full System Access)</option>
                            </select>
                            <Shield className="absolute right-4 top-3.5 text-gray-400 w-5 h-5 pointer-events-none"/>
                          </div>
                      </div>
                      
                      {staffMsg && <div className="text-center text-red-500 font-bold text-xs bg-red-50 p-3 rounded-xl border border-red-100 flex items-center justify-center gap-2"><AlertCircle className="w-4 h-4"/>{staffMsg}</div>}
                      
                      <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-200 transition-all mt-2">Generate Account</button>
                  </form>
              </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminPanel;