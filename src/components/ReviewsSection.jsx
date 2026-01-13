// src/components/ReviewsSection.jsx
import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, Quote, CheckCircle2, Plus, X, Loader2, Sparkles } from 'lucide-react';
import { collection, addDoc, query, where, onSnapshot, orderBy, getFirestore } from 'firebase/firestore';

const ReviewsSection = () => {
  const db = getFirestore();
  const [reviews, setReviews] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' });
  
  // UX States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0); // For star hover effect

  // Fetch only APPROVED reviews
  useEffect(() => {
    const q = query(
      collection(db, 'reviews'), 
      where('approved', '==', true),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'reviews'), {
        ...newReview,
        approved: false, // Needs Admin Approval
        createdAt: new Date()
      });

      setSubmitted(true);
      
      setTimeout(() => {
        setSubmitted(false);
        setIsFormOpen(false);
        setNewReview({ name: '', rating: 5, text: '' });
        setHoverRating(0);
      }, 2500);

    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative py-24 bg-stone-50 overflow-hidden">
      
      {/* Inject Custom Animations */}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
      `}</style>

      {/* Background Decorative Blob */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-amber-100/40 rounded-full blur-[80px] opacity-60"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        
        {/* ================= HEADER ================= */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white border border-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3 h-3 fill-emerald-500 text-emerald-500" /> 
            Client Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Loved by <span className="text-emerald-700 decoration-wavy underline decoration-amber-400">Locals</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg font-light leading-relaxed">
            From balcony gardens to estate landscapes, see what the Green Gold community is saying.
          </p>
        </div>

        {/* ================= REVIEWS GRID ================= */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {reviews.length === 0 ? (
            <div className="col-span-3 flex flex-col items-center justify-center py-20 text-gray-400 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-gray-300"/>
              </div>
              <p className="text-lg font-medium">No reviews yet.</p>
              <p className="text-sm">Be the first to share your green story!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div 
                key={review.id} 
                className="group flex flex-col justify-between bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-white/50 hover:border-emerald-200 hover:bg-white hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.15)] transition-all duration-300 transform hover:-translate-y-1"
              >
                <div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} 
                                />
                            ))}
                        </div>
                        <Quote className="w-8 h-8 text-emerald-100 fill-emerald-50 group-hover:text-emerald-200 transition-colors" />
                    </div>
                    <p className="text-gray-700 leading-relaxed font-medium mb-6">"{review.text}"</p>
                </div>
                
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center text-emerald-800 font-bold shadow-inner">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{review.name}</p>
                    <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Verified Customer
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ================= ADD REVIEW BUTTON ================= */}
        <div className="text-center">
          <button 
            onClick={() => setIsFormOpen(true)}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-emerald-900 text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:bg-emerald-800 transition-all transform hover:-translate-y-0.5 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
                Write a Review
            </span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>

        {/* ================= MODAL FORM ================= */}
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-emerald-950/60 backdrop-blur-md transition-opacity" 
                onClick={() => setIsFormOpen(false)}
            ></div>

            {/* Modal Content */}
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 relative shadow-2xl animate-scale-in border border-white/20">
              
              {/* Close Button */}
              <button 
                onClick={() => setIsFormOpen(false)} 
                className="absolute top-6 right-6 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6"/>
              </button>
              
              {submitted ? (
                <div className="text-center py-12 flex flex-col items-center animate-scale-in">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 animate-bounce">
                      <CheckCircle2 className="w-10 h-10"/>
                  </div>
                  <h3 className="text-2xl font-black text-emerald-900 mb-2">Thank You!</h3>
                  <p className="text-gray-500">Your review has been sent to our team for moderation.</p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">Share your story</h3>
                      <p className="text-gray-500">How was your experience with Green Gold?</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star Rating Input */}
                    <div className="flex flex-col items-center justify-center gap-3 py-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tap to Rate</p>
                      <div 
                        className="flex gap-2"
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star} 
                            type="button" 
                            className="transition-transform hover:scale-110 focus:outline-none"
                            onMouseEnter={() => setHoverRating(star)}
                            onClick={() => setNewReview({...newReview, rating: star})}
                          >
                            <Star 
                                className={`w-10 h-10 transition-colors duration-200 ${
                                    star <= (hoverRating || newReview.rating) 
                                    ? 'fill-amber-400 text-amber-400 drop-shadow-sm' 
                                    : 'text-gray-200'
                                }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <input 
                                required 
                                placeholder="Your Name" 
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder-gray-400 font-medium"
                                value={newReview.name} 
                                onChange={e=>setNewReview({...newReview, name:e.target.value})} 
                            />
                        </div>
                        <div>
                            <textarea 
                                required 
                                placeholder="Tell us about your plants..." 
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl h-32 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder-gray-400 font-medium resize-none"
                                value={newReview.text} 
                                onChange={e=>setNewReview({...newReview, text:e.target.value})} 
                            />
                        </div>
                    </div>
                    
                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-500 flex justify-center items-center gap-2 shadow-lg hover:shadow-emerald-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-5 h-5 animate-spin"/> Posting Review...</>
                      ) : (
                        <><Send className="w-5 h-5"/> Submit Review</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReviewsSection;