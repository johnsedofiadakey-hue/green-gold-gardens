import React, { useState } from 'react';
import { X, Calendar, User, Phone, FileText, CheckCircle, Loader2, Mail } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const BookingModal = ({ isOpen, onClose, preselectedService = 'General Consultation' }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: preselectedService,
    preferredDate: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Prepare Data for Firestore
      const bookingPayload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service: formData.serviceType,
        date: formData.preferredDate,
        notes: formData.notes,
        status: 'Pending', // Default status for Admin Panel
        createdAt: serverTimestamp(),
        type: 'Service Request' // Distinguishes from Cart Orders
      };

      // 2. Send to 'bookings' collection
      await addDoc(collection(db, 'bookings'), bookingPayload);

      // 3. Show Success Message
      setLoading(false);
      setSuccess(true);

      // 4. Auto-close after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          name: '',
          phone: '',
          email: '',
          serviceType: preselectedService,
          preferredDate: '',
          notes: ''
        });
        onClose();
      }, 3000);

    } catch (err) {
      console.error("Booking Error:", err);
      setError("Failed to send request. Please try again or call us directly.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      
      {/* 1. Backdrop Blur */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* 2. Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
        
        {/* Success State Overlay */}
        {success ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-full">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Request Received!</h3>
            <p className="text-gray-500">We will contact you shortly to confirm your appointment.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-emerald-900 p-6 flex justify-between items-center text-white">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" /> 
                  Book a Service
                </h3>
                <p className="text-emerald-200 text-xs mt-1">Professional Landscaping & Care</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name Field */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      type="text" 
                      name="name" 
                      required
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Contact Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="tel" 
                        name="phone" 
                        required
                        placeholder="+233..." 
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Date</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        name="preferredDate" 
                        required
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Service Required</label>
                  <select 
                    name="serviceType" 
                    value={formData.serviceType} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                  >
                    <option>General Consultation</option>
                    <option>Landscape Design</option>
                    <option>Garden Maintenance</option>
                    <option>Plant Doctor Visit</option>
                    <option>Corporate Installation</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Additional Details</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea 
                      name="notes" 
                      rows="3"
                      placeholder="Describe your garden size or specific issues..." 
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 rounded-lg">
                    {error}
                  </p>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Booking Request'}
                </button>

              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;