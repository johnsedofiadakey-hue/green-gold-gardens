import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const LocationView = ({ config }) => {
  // --- DYNAMIC CONFIGURATION ---
  const primaryColor = config?.primaryColor || '#064e3b';
  const secondaryColor = config?.secondaryColor || '#059669';
  const accentColor = config?.accentColor || '#f59e0b';

  // --- STATE ---
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // --- HANDLERS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // We save contact form messages to 'bookings' so they appear 
      // in your Admin Panel's "Requests" tab with type "General Inquiry"
      await addDoc(collection(db, 'bookings'), {
        name: formData.name,
        email: formData.email,
        notes: formData.message,
        service: 'General Inquiry', // This tag helps you filter in Admin
        status: 'Pending',
        createdAt: serverTimestamp(),
        type: 'contact_form'
      });

      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);

    } catch (error) {
      console.error("Error sending message:", error);
      setLoading(false);
      alert("Could not send message. Please check your connection.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 animate-fade-in font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* --- DYNAMIC STYLES --- */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.6s ease-out forwards; }
      `}</style>

      {/* --- HEADER SECTION --- */}
      <div className="relative pt-32 pb-20 px-6 lg:px-12 bg-white rounded-b-[3rem] shadow-sm overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none blur-[100px]" style={{ backgroundColor: secondaryColor }}></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border text-xs font-bold uppercase tracking-wider shadow-sm animate-fade-up" 
            style={{ borderColor: `${primaryColor}20`, color: primaryColor }}
          >
            <MapPin className="w-3 h-3" /> Visit Our Nursery
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[0.95] animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Rooted in <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>Accra.</span>
          </h1>
          
          <p className="text-gray-500 text-lg md:text-xl font-light max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Experience the serenity of Green Gold Gardens in person. Walk through our greenhouses, speak with our experts, and pick your plants by hand.
          </p>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12">
        
        {/* LEFT COLUMN: INFO & MAP */}
        <div className="space-y-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          
          {/* Info Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
               <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                 <Phone className="w-6 h-6" />
               </div>
               <div>
                 <h3 className="font-bold text-gray-900">Call Us</h3>
                 <p className="text-gray-500 text-sm mt-1">+233 55 555 5555</p>
                 <p className="text-gray-500 text-sm">+233 24 123 4567</p>
               </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
               <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                 <Mail className="w-6 h-6" />
               </div>
               <div>
                 <h3 className="font-bold text-gray-900">Email Us</h3>
                 <p className="text-gray-500 text-sm mt-1">hello@greengold.com</p>
                 <p className="text-gray-500 text-sm">support@greengold.com</p>
               </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow sm:col-span-2">
               <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                 <Clock className="w-6 h-6" />
               </div>
               <div className="flex justify-between items-end">
                 <div>
                    <h3 className="font-bold text-gray-900">Opening Hours</h3>
                    <p className="text-gray-500 text-sm mt-1">Mon - Sat: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-500 text-sm">Sunday: 12:00 PM - 5:00 PM</p>
                 </div>
                 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Open Now
                 </span>
               </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="h-[400px] bg-gray-200 rounded-[2.5rem] overflow-hidden shadow-inner border border-white relative group">
            {/* Using an iframe for East Legon, Accra */}
            <iframe 
              title="Green Gold Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.627961168097!2d-0.16017122525547076!3d5.633758694347209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9cae00da9871%3A0x6e25d26210ea0760!2sEast%20Legon%2C%20Accra!5e0!3m2!1sen!2sgh!4v1705149021203!5m2!1sen!2sgh" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }} 
              allowFullScreen="" 
              loading="lazy"
              className="group-hover:filter-none transition-all duration-700"
            ></iframe>
            
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 max-w-xs">
                <p className="font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" /> East Legon, Accra
                </p>
                <p className="text-xs text-gray-500 mt-1">Near the A&C Mall, 2nd Turn on the Right.</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTACT FORM */}
        <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="bg-white p-8 lg:p-12 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
            
            {/* Form Success Overlay */}
            {success ? (
               <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-12 animate-fade-in">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-lg">Thanks for reaching out. Our team will get back to you within 24 hours.</p>
               </div>
            ) : null}

            <div className="mb-8">
               <h3 className="text-3xl font-bold text-gray-900 mb-2">Send a Message</h3>
               <p className="text-gray-500">Have a specific question about a plant or landscaping project? Let us know.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Your Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-100 rounded-2xl outline-none transition-all font-medium text-gray-800"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com"
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-100 rounded-2xl outline-none transition-all font-medium text-gray-800"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">How can we help?</label>
                <textarea 
                  required
                  rows="5"
                  placeholder="Tell us about your garden goals..."
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-100 rounded-2xl outline-none transition-all font-medium text-gray-800 resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 rounded-2xl font-bold text-lg text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mt-4"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <>Send Message <Send className="w-5 h-5" /></>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LocationView;