import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Leaf } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, cartItems = [], onRemove, onCheckout, config }) => {
  // 1. Calculate Total Price dynamically
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  // 2. Fallback Colors (if config is loading)
  const primaryColor = config?.primaryColor || '#064e3b';
  const secondaryColor = config?.secondaryColor || '#059669';

  return (
    <>
      {/* --- BACKDROP OVERLAY --- */}
      {/* Clicking this dark area closes the drawer */}
      <div 
        className={`fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* --- SLIDE-OUT DRAWER --- */}
      <div 
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-full text-emerald-800">
                <ShoppingBag className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Your Garden</h2>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold">
              {cartItems.length} items
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* BODY: SCROLLABLE ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            // EMPTY STATE
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
               <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                   <Leaf className="w-10 h-10 text-gray-300" />
               </div>
               <h3 className="text-lg font-bold text-gray-800">Your cart is empty</h3>
               <p className="text-sm text-gray-500 max-w-[200px]">
                 Looks like you haven't discovered our plants yet.
               </p>
               <button 
                 onClick={onClose}
                 className="mt-4 text-emerald-600 font-bold text-sm hover:underline"
                 style={{ color: secondaryColor }}
               >
                 Start Shopping &rarr;
               </button>
            </div>
          ) : (
            // CART ITEMS LIST
            cartItems.map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-200 hover:bg-white transition-all group"
              >
                {/* Product Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-gray-100">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-gray-500 italic">{item.category}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-emerald-700" style={{ color: primaryColor }}>
                        GH₵ {item.price.toFixed(2)}
                    </span>
                    
                    {/* Remove Button */}
                    <button 
                      onClick={() => onRemove(index)}
                      className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER: CHECKOUT ACTIONS */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10">
            
            {/* Subtotal Row */}
            <div className="flex justify-between items-center mb-6">
               <span className="text-gray-500 font-medium">Subtotal</span>
               <span className="text-2xl font-black text-gray-900">
                 GH₵ {subtotal.toFixed(2)}
               </span>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
               <button 
                 onClick={onCheckout}
                 className="w-full py-4 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all"
                 style={{ backgroundColor: primaryColor }}
               >
                 Proceed to Checkout <ArrowRight className="w-5 h-5" />
               </button>
               
               <p className="text-center text-xs text-gray-400 mt-4">
                 Taxes and shipping calculated at checkout.
               </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;