// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// ✅ YOUR REAL CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyAejhIuFDtvyR304bgg1ALplnqNr39OLxU",
  authDomain: "green-gold-gardens.firebaseapp.com",
  projectId: "green-gold-gardens",
  storageBucket: "green-gold-gardens.firebasestorage.app",
  messagingSenderId: "701558287366",
  appId: "1:701558287366:web:51c89dca0c5bf74b572787"
};

// 1. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Initialize Services
const db = getFirestore(app);       // The Database
const storage = getStorage(app);    // File Storage (for uploading plant images)
const auth = getAuth(app);          // Authentication (for Rosaline's login)

export { db, storage, auth };