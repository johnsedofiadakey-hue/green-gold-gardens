// src/components/AboutView.jsx
import React from 'react';
import { Sprout, Users, Heart, Award, Quote, Leaf } from 'lucide-react';

const AboutView = ({ workers, aboutData }) => {
  // Safe Defaults
  const founderName = aboutData?.founderName || "The Founder";
  const founderRole = aboutData?.founderRole || "Visionary & Lead Horticulturalist";
  const storyTitle = aboutData?.storyTitle || "From a Seed to a Sanctuary";
  const storyText = aboutData?.storyText || "Green Gold Gardens started with a simple belief: nature is not just a decoration, but a necessity. What began as a small backyard project has grown into Accra's premier botanical haven.";
  const founderImage = aboutData?.founderImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-stone-50 pt-20 font-sans overflow-x-hidden">
      
      {/* ================= HERO HEADER ================= */}
      <div className="relative pt-20 pb-32 px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-white to-stone-50 overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-secondary)] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob animation-delay-2000"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in-down">
            <Sprout className="w-4 h-4" /> Est. 2023
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-none mb-6">
            Cultivating <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
              Life & Legacy
            </span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
            We are more than gardeners. We are architects of serenity, bringing the healing power of nature into homes and businesses across Ghana.
          </p>
        </div>
      </div>

      {/* ================= FOUNDER STORY SECTION ================= */}
      <div className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Image Side */}
            <div className="relative order-2 lg:order-1">
                {/* Organic Frame */}
                <div className="absolute inset-0 bg-[var(--color-primary)] rounded-[3rem] rotate-3 transform scale-105 opacity-10"></div>
                <div className="absolute inset-0 bg-[var(--color-secondary)] rounded-[3rem] -rotate-2 transform scale-105 opacity-10"></div>
                
                <img 
                    src={founderImage} 
                    alt={founderName} 
                    className="relative z-10 w-full h-[600px] object-cover rounded-[2.5rem] shadow-2xl"
                />
                
                {/* Quote Card */}
                <div className="absolute -bottom-10 -right-4 md:right-10 bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-white/50 max-w-sm z-20 hidden md:block">
                    <Quote className="w-8 h-8 text-[var(--color-accent)] mb-4 fill-current opacity-50" />
                    <p className="text-gray-800 font-serif italic leading-relaxed text-lg">
                        "To plant a garden is to believe in tomorrow."
                    </p>
                </div>
            </div>

            {/* Text Side */}
            <div className="order-1 lg:order-2 space-y-8">
                <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">{storyTitle}</h2>
                    <div className="h-1.5 w-24 bg-[var(--color-accent)] rounded-full"></div>
                </div>

                <div className="prose prose-lg text-gray-600 leading-relaxed">
                    <p className="whitespace-pre-wrap">{storyText}</p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-[var(--color-primary)] font-bold text-xl border-2 border-white shadow-sm">
                        {founderName[0]}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-lg">{founderName}</p>
                        <p className="text-[var(--color-secondary)] font-bold text-sm uppercase tracking-wider">{founderRole}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* ================= VALUES STRIP ================= */}
      <div className="py-20 bg-[var(--color-primary)] text-white relative overflow-hidden">
        {/* Texture */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-3 gap-12 text-center md:text-left">
            <ValueCard 
                icon={<Leaf className="w-8 h-8" />} 
                title="Sustainable Growth" 
                desc="We prioritize eco-friendly sourcing and organic care methods for every plant."
            />
            <ValueCard 
                icon={<Heart className="w-8 h-8" />} 
                title="Rooted in Passion" 
                desc="Every member of our team is a certified plant lover, dedicated to your garden's success."
            />
            <ValueCard 
                icon={<Award className="w-8 h-8" />} 
                title="Quality Guarantee" 
                desc="We stand by our plants. If they aren't thriving upon arrival, we make it right."
            />
        </div>
      </div>

      {/* ================= TEAM SECTION ================= */}
      <div className="py-32 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <span className="text-[var(--color-secondary)] font-bold tracking-widest uppercase text-sm">The Green Team</span>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3">Experts in the Field</h2>
            </div>

            {workers.length === 0 ? (
                <div className="text-center py-10 bg-stone-50 rounded-3xl border border-dashed border-gray-200">
                    <Users className="w-12 h-12 mx-auto text-gray-300 mb-2"/>
                    <p className="text-gray-400">Team members coming soon.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {workers.map((worker) => (
                        <div key={worker.id} className="group text-center">
                            <div className="relative w-48 h-48 mx-auto mb-6">
                                <div className="absolute inset-0 bg-[var(--color-accent)] rounded-[2rem] rotate-6 group-hover:rotate-12 transition-transform opacity-20"></div>
                                <div className="absolute inset-0 bg-[var(--color-secondary)] rounded-[2rem] -rotate-3 group-hover:-rotate-6 transition-transform opacity-20"></div>
                                <img 
                                    src={worker.image} 
                                    alt={worker.name} 
                                    className="relative z-10 w-full h-full object-cover rounded-[2rem] shadow-lg group-hover:-translate-y-2 transition-transform duration-500"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">{worker.name}</h3>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mt-1">{worker.role}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

    </div>
  );
};

// --- SUB-COMPONENTS ---
const ValueCard = ({ icon, title, desc }) => (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
        <div className="mb-4 text-[var(--color-accent)]">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-white/70 leading-relaxed text-sm">{desc}</p>
    </div>
);

export default AboutView;