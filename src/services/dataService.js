// src/services/dataService.js
import { db } from '../firebaseConfig'; 
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export const DataService = {

  // 1. UNIVERSAL GETTER (This fixes the App.jsx crash)
  async getCollection(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      return [];
    }
  },

  // 2. GET SITE CONFIG
  async getSiteConfig() {
    try {
      const querySnapshot = await getDocs(collection(db, 'siteSettings'));
      if (!querySnapshot.empty) {
        return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching site settings:', error);
      return null;
    }
  },

  // 3. GET PLANTS
  async getAllPlants() {
    try {
      const querySnapshot = await getDocs(collection(db, 'plants'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching plants:', error);
      return [];
    }
  },

  // 4. GET REVIEWS
  async getReviews() {
    try {
      const querySnapshot = await getDocs(collection(db, 'reviews'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  // 5. SAVE ORDER / BOOKING
  async saveBooking(customerData, cartItems, total) {
    try {
      const bookingData = {
        name: customerData.name || 'Anonymous', // Simplified to match AdminPanel expectations
        phone: customerData.phone || '',
        service: customerData.service || 'Plant Order',
        items: cartItems,
        totalAmount: total,
        status: 'Pending',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'bookings'), bookingData);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error creating booking:", error);
      return { success: false, error };
    }
  }
};