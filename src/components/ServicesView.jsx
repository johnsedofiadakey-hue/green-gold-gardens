// src/components/ServicesView.jsx
import React, { useState } from 'react';
import { 
  Leaf, Shovel, Calendar, BookOpen, Award, Truck, Heart, 
  ArrowRight, Star, Sparkles, CheckCircle 
} from 'lucide-react';
import BookingModal from './BookingModal';

const ServicesView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('General Consultation');

  const openBooking = (serviceName) => {
    setSelectedService(serviceName);
    setIsModalOpen(true);
  };

  const SERVICES = [
    { 
      id: 'sales', 
      title: 'Plant Sales & Nursery', 
      icon: <Leaf className="w-6 h-6 text-white" />, 
      desc: 'From rare exotic species to hardy local favorites. We source the healthiest plants for your home.',
      features: ['Indoor & Outdoor Plants', 'Exotic Species', 'Pots & Planters'],
      image: 'https://images.unsplash.com/photo-1530968464165-7a1861cbaf9f?auto=format&fit=crop&q=80&w=800',
      color: 'bg-green-500'
    },
    { 
      id: 'landscaping', 
      title: 'Landscape Architecture', 
      icon: <Shovel className="w-6 h-6 text-white" />, 
      desc: 'We don’t just plant; we design ecosystems. Transforming corporate offices & private residences.',
      features: ['Garden Design', 'Hardscaping', 'Maintenance Plans'],
      image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80&w=800',
      color: 'bg-amber-600'
    },
    { 
      id: 'events', 
      title: 'Event Venue Hosting', 
      icon: <Calendar className="w-6 h-6 text-white" />, 
      desc: 'Nature’s backdrop for your perfect day. A serene garden space available for weddings & shoots.',
      features: ['Weddings', 'Photo Shoots', 'Corporate Retreats'],
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
      color: 'bg-purple-500'
    },
    { 
      id: 'therapy', 
      title: 'Plant Education & Care', 
      icon: <BookOpen className="w-6 h-6 text-white" />, 
      desc: 'Don’t let your plants die. Walk in, ask questions, and learn the science of botany.',
      features: ['Workshops', 'Plant Doctor', 'Soil Testing'],
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800',
      color: 'bg-blue-500'
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} serviceType={selectedService} />

      {/* --- HERO SECTION --- */}
      <div className="relative bg-emerald-900 text-white overflow-hidden rounded-b-[50px] shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-800/50 border border-emerald-700 rounded-full px-4 py-1 mb-6 animate-fade-in-down">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Professional Green Services</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            We Bring <span className="text-emerald-400">Nature</span> <br/> To Your Doorstep.
          </h1>
          <p className="text-lg text-emerald-100/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether you need a complete landscape overhaul, a venue for your wedding, or just a single healthy plant—we are ready to help.
          </p>

          {/* BOLD GENERAL REQUEST BUTTON */}
          <button 
            onClick={() => openBooking('General Consultation')}
            className="group relative inline-flex items-center gap-3 bg-white text-emerald-900 px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-emerald-50 transition-all transform hover:-translate-y-1"
          >
            <span>Request General Service</span>
            <div className="bg-emerald-900 text-white rounded-full p-1 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
          <p className="mt-4 text-sm text-emerald-400 font-medium">Free consultation for new projects</p>
        </div>
      </div>

      {/* --- SERVICES GRID --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {SERVICES.map((service, index) => (
            <div
              key={service.id}
              onClick={() => openBooking(service.title)}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:-translate-y-2 flex flex-col md:flex-row h-full"
            >
              {/* Image Side */}
              <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                <div className={`absolute top-4 left-4 ${service.color} p-3 rounded-2xl shadow-lg`}>
                  {service.icon}
                </div>
              </div>

              {/* Text Side */}
              <div className="md:w-3/5 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed mb-6 text-sm">
                    {service.desc}
                  </p>
                  
                  {/* Mini Features List */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center text-emerald-600 font-bold text-sm uppercase tracking-wide group-hover:gap-2 transition-all">
                  Book This Service <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- WHY CHOOSE US --- */}
      <div className="bg-white py-20 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-800">Why Green Gold?</h3>
            <div className="w-20 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-10 h-10 text-amber-500" />
              </div>
              <h4 className="font-bold text-xl text-gray-900 mb-3">Certified Botanists</h4>
              <p className="text-gray-500 leading-relaxed">Our team doesn't just guess; we know the science behind every leaf and root in your garden.</p>
            </div>
            <div className="text-center group">
              <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-10 h-10 text-emerald-600" />
              </div>
              <h4 className="font-bold text-xl text-gray-900 mb-3">Safe Delivery</h4>
              <p className="text-gray-500 leading-relaxed">We transport delicate plants with specialized vehicles to ensure they arrive fresh and intact.</p>
            </div>
            <div className="text-center group">
              <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-10 h-10 text-rose-500" />
              </div>
              <h4 className="font-bold text-xl text-gray-900 mb-3">After-Care Support</h4>
              <p className="text-gray-500 leading-relaxed">We don't leave you guessing. Every service comes with a care guide and support line.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- FINAL CTA --- */}
      <div className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Still not sure what you need?</h2>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
              Our team is happy to visit your site, assess your soil, and give you a custom recommendation.
            </p>
            <button
              onClick={() => openBooking('General Inquiry')}
              className="bg-emerald-500 text-white font-bold py-4 px-10 rounded-full hover:bg-emerald-400 transition-colors shadow-lg inline-flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" /> Schedule a Site Visit
            </button>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-slate-800 rounded-full opacity-50"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-900 rounded-full opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default ServicesView;