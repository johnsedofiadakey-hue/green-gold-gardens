// src/components/AdminLogin.jsx
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore'; // Added setDoc
import { Lock, Mail, Key, ArrowLeft, ShieldCheck, Loader2, AlertCircle, Wrench } from 'lucide-react';

const AdminLogin = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const auth = getAuth();
    const db = getFirestore();

    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Check Database Record
      const docRef = doc(db, 'staff', user.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Normal Login: User exists in DB
        const role = docSnap.data().role;
        onLogin({ user, role }); 
      } else {
        // --- EMERGENCY FIX: AUTO-CREATE OWNER ---
        // If the user exists in Auth but not in DB, we assume this is the Owner setting up.
        // We create the record automatically so you aren't locked out.
        await setDoc(docRef, {
            email: user.email,
            name: "Owner (Auto-Created)",
            role: "owner"
        });
        
        // Login immediately after creating
        onLogin({ user, role: "owner" });
        alert("System Notice: Your Owner account was successfully initialized.");
      }

    } catch (err) {
      console.error("Login Error:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError("Wrong email or password.");
      } else if (err.code === 'auth/user-not-found') {
        setError("No account found. You must create the user in Firebase Console first, or use the sign-up flow.");
      } else {
        setError(err.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] w-full h-full flex items-center justify-center bg-slate-900 font-sans">
      
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 grayscale mix-blend-overlay"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--color-primary)] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--color-secondary)] rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
      </div>

      {/* --- BACK BUTTON --- */}
      <button 
        onClick={onCancel}
        type="button"
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group cursor-pointer"
      >
        <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/20 transition-all">
            <ArrowLeft className="w-6 h-6" />
        </div>
        <span className="font-bold text-sm tracking-wide uppercase">Back to Site</span>
      </button>

      {/* --- LOGIN CARD --- */}
      <div className="relative z-10 w-full max-w-md p-6 animate-scale-up">
        
        <div className="bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10">
          
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-900/50 mb-6">
                <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Admin Core</h2>
            <p className="text-slate-400 text-sm mt-2 font-medium">Secure Entry</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Staff Email</label>
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-[var(--color-secondary)] transition-colors" />
                    <input 
                        type="email" 
                        required
                        autoFocus
                        className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-600 outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all font-medium"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Password</label>
                <div className="relative group">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-[var(--color-secondary)] transition-colors" />
                    <input 
                        type="password" 
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-600 outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all font-medium"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold animate-pulse">
                    <AlertCircle className="w-5 h-5 shrink-0" /> 
                    <span>{error}</span>
                </div>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 rounded-xl bg-white text-slate-900 font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
                {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin"/> Verifying...</>
                ) : (
                    <><Lock className="w-5 h-5" /> Authenticate</>
                )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;