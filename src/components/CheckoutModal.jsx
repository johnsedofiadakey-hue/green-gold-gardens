// src/components/CheckoutModal.jsx
import React, { useState } from 'react';
import { X, CheckCircle, Smartphone, CreditCard, Lock, Loader2, User, Mail, Phone, MapPin } from 'lucide-react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const CheckoutModal = ({ cart, total, onClose, onSuccess }) => {
  const [method, setMethod] = useState('momo');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('details'); // details, payment, processing, success
  
  // Updated state to include Phone and Address
  const [customer, setCustomer] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    address: '' 
  });

  const db = getFirestore();

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePay = async () => {
    setIsProcessing(true);
    setStep('processing');

    try {
      // GENERATE INVOICE NUMBER (e.g., INV-17099283)
      const invoiceNum = `INV-${Math.floor(Math.random() * 1000000)}`;

      // 1. RECORD TRANSACTION WITH ALL CUSTOMER DETAILS & NOTIFICATION FLAGS
      await addDoc(collection(db, 'transactions'), {
        type: 'income',
        category: 'Sales',
        amount: total,
        description: `Web Order: ${customer.name}`,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date(),
        method: method === 'momo' ? 'Mobile Money' : 'Card',
        
        // --- CRITICAL NOTIFICATION FLAGS ---
        isWebOrder: true,    // Triggers the "Inbox" in Bookkeeping
        processed: false,    // Triggers the Red Notification Badge
        // -----------------------------------
        
        invoiceNumber: invoiceNum,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,     // Sent to Bookkeeping
        customerAddress: customer.address, // Sent to Bookkeeping
        items: cart 
      });

      // 2. Simulate Paystack Processing
      setTimeout(() => {
        setIsProcessing(false);
        setStep('success');
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }, 2000);

    } catch (error) {
      console.error("Transaction Error:", error);
      alert("Payment recorded locally but failed to sync.");
      setIsProcessing(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-bounce">
          <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-900">Order Placed!</h2>
          <p className="text-gray-600 mt-2">We have received your details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full md:max-w-md md:rounded-3xl rounded-t-3xl p-6 md:p-8 animate-fade-in relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="bg-emerald-900 text-white font-bold px-3 py-1 rounded text-xs tracking-wider">CHECKOUT</div>
          <h2 className="text-xl font-bold text-gray-800">Complete Order</h2>
        </div>

        <p className="text-gray-500 mb-6 text-sm">
          Total to pay: <span className="font-bold text-emerald-600 text-lg">GH₵{total}</span>
        </p>

        {/* STEP 1: CUSTOMER DETAILS FORM */}
        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input 
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-10 p-3 bg-gray-50 border rounded-xl outline-none focus:border-emerald-500"
                  value={customer.name}
                  onChange={e => setCustomer({...customer, name: e.target.value})}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input 
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="w-full pl-10 p-3 bg-gray-50 border rounded-xl outline-none focus:border-emerald-500"
                  value={customer.email}
                  onChange={e => setCustomer({...customer, email: e.target.value})}
                />
              </div>
            </div>

            {/* Phone (New) */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input 
                  required
                  type="tel"
                  placeholder="055 123 4567"
                  className="w-full pl-10 p-3 bg-gray-50 border rounded-xl outline-none focus:border-emerald-500"
                  value={customer.phone}
                  onChange={e => setCustomer({...customer, phone: e.target.value})}
                />
              </div>
            </div>

            {/* Address (New) */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea 
                  required
                  placeholder="Street name, House number, Landmark..."
                  className="w-full pl-10 p-3 bg-gray-50 border rounded-xl outline-none focus:border-emerald-500 h-20 resize-none"
                  value={customer.address}
                  onChange={e => setCustomer({...customer, address: e.target.value})}
                />
              </div>
            </div>

            <button className="w-full bg-emerald-900 text-white font-bold py-4 rounded-xl mt-2 hover:bg-emerald-800 shadow-lg">
              Proceed to Payment
            </button>
          </form>
        )}

        {/* STEP 2: PAYMENT METHOD */}
        {(step === 'payment' || step === 'processing') && (
          <div className="animate-fade-in-right">
             <div className="flex gap-4 mb-6">
              <button onClick={() => setMethod('momo')} className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'momo' ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-gray-100 text-gray-400'}`}>
                <Smartphone className="w-6 h-6" /><span className="text-xs font-bold">Mobile Money</span>
              </button>
              <button onClick={() => setMethod('card')} className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'card' ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-gray-100 text-gray-400'}`}>
                <CreditCard className="w-6 h-6" /><span className="text-xs font-bold">Card</span>
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100 flex justify-between items-center">
               <div>
                 <p className="text-xs text-gray-500">Billing Details:</p>
                 <p className="font-bold text-sm text-gray-800">{customer.name}</p>
                 <p className="text-xs text-gray-500">{customer.phone}</p>
               </div>
               <button onClick={() => setStep('details')} className="text-emerald-600 text-xs font-bold underline">Edit</button>
            </div>

            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full bg-emerald-900 text-white font-bold py-4 rounded-xl hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              {isProcessing ? <><Loader2 className="animate-spin w-5 h-5"/> Processing...</> : <>Pay GH₵{total}</>}
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Secured by Paystack
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;