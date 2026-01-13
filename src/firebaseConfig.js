// src/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAejhIuFDtvyR304bgg1ALplnqNr39OLxU",
  authDomain: "green-gold-gardens.firebaseapp.com",
  projectId: "green-gold-gardens",
  storageBucket: "green-gold-gardens.firebasestorage.app",
  messagingSenderId: "701558287366",
  appId: "1:701558287366:web:51c89dca0c5bf74b572787"
};

// Singleton pattern: Check if an app is already initialized
// This prevents "Firebase: App named '[DEFAULT]' already exists" errors during Vite HMR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Services with error catching
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Logic Check: Exporting clean instances
export { db, storage, auth };
export default app;