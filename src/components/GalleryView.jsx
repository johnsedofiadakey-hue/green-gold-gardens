// src/components/GalleryView.jsx
import React, { useState } from 'react';
import { Camera, X, ZoomIn, Image as ImageIcon, Sparkles } from 'lucide-react';

const GalleryView = ({ galleryImages }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    // 1. NEW BACKGROUND: Artistic soft gradient with organic blur shapes
    <div className="min-h-screen bg-stone-50 pt-28 pb-20 px-6 font-sans relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[var(--color-secondary)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto mb-16 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/50 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-sm mb-6 animate-fade-in-down">
           <Camera className="w-4 h-4 text-[var(--color-secondary)]" /> Visual Stories
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-none mb-6">
          Our Living <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">Portfolio</span>
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          A showcase of our finest landscapes, events, and the natural beauty we cultivate.
        </p>
      </div>

      {/* --- GALLERY GRID --- */}
      <div className="max-w-7xl mx-auto relative z-10">
        {galleryImages.length === 0 ? (
          <div className="text-center py-32 bg-white/60 backdrop-blur-xl rounded-[3rem] border border-dashed border-gray-300">
            <ImageIcon className="w-24 h-24 text-gray-200 mx-auto mb-6 animate-pulse" />
            <h3 className="text-2xl font-bold text-gray-400">Gallery is Empty</h3>
            <p className="text-gray-400 mt-2">Photos are being curated. Check back soon!</p>
          </div>
        ) : (
          // Masonry-style grid layout
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image) => (
              <div 
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="group relative aspect-square rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50"
              >
                {/* Image */}
                <img 
                  src={image.src} 
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Hover Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Overlay Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                   <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                     <span className="inline-block bg-[var(--color-secondary)] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                        {image.category}
                     </span>
                     <h3 className="text-white text-2xl font-bold leading-tight drop-shadow-md">
                        {image.title}
                     </h3>
                   </div>
                   
                   {/* Zoom Icon */}
                   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                      <ZoomIn className="w-8 h-8" />
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= LIGHTBOX MODAL ================= */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 md:p-8 animate-fade-in"
            onClick={() => setSelectedImage(null)} // Close on background click
        >
            {/* Close Button */}
            <button 
                className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-10"
            >
                <X className="w-8 h-8" />
            </button>

            {/* Image Container */}
            <div 
                className="relative w-full max-w-6xl max-h-full flex flex-col items-center animate-scale-up"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image area
            >
                <img 
                    src={selectedImage.src} 
                    alt={selectedImage.title}
                    className="w-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                />
                
                {/* Caption */}
                <div className="mt-6 text-center text-white">
                    <span className="inline-block text-[var(--color-accent)] text-xs font-bold uppercase tracking-wider mb-2">
                        {selectedImage.category}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold">
                        {selectedImage.title}
                    </h3>
                    {/* Optional: Add a description field to your Admin Gallery upload if you want more text here */}
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default GalleryView;