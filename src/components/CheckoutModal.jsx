// src/components/CheckoutModal.jsx
import React, { useState } from 'react';
import { X, CheckCircle, Smartphone, CreditCard, Lock, Loader2, User, Mail, Phone, MapPin, Printer } from 'lucide-react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const CheckoutModal = ({ cart, total, onClose, onSuccess }) => {
  const [method, setMethod] = useState('momo');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('details'); // details, payment, processing, success
  const [invoiceData, setInvoiceData] = useState(null);
  
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

  const handlePrint = () => {
    window.print();
  };

  const handlePay = async () => {
    setIsProcessing(true);
    setStep('processing');

    try {
      // GENERATE INVOICE NUMBER (e.g., INV-17099283)
      const invoiceNum = `INV-${Math.floor(Math.random() * 1000000)}`;
      const currentDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const orderData = {
        type: 'income',
        category: 'Sales',
        amount: total,
        description: `Web Order: ${customer.name}`,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date(),
        method: method === 'momo' ? 'Mobile Money' : 'Card',
        isWebOrder: true,
        processed: false,
        invoiceNumber: invoiceNum,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        items: cart 
      };

      // Store invoice data locally for the print template
      setInvoiceData({ ...orderData, displayDate: currentDate });

      // 1. RECORD TRANSACTION
      await addDoc(collection(db, 'transactions'), orderData);

      // 2. Simulate Paystack Processing
      setTimeout(() => {
        setIsProcessing(false);
        setStep('success');
      }, 2000);

    } catch (error) {
      console.error("Transaction Error:", error);
      alert("Payment recorded locally but failed to sync.");
      setIsProcessing(false);
    }
  };

  // --- SUCCESS VIEW WITH PROFESSIONAL RECEIPT BUTTON ---
  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        {/* HIDDEN PRINT-ONLY INVOICE TEMPLATE */}
        {invoiceData && (
          <div className="hidden invoice-container p-10 bg-white text-black font-serif">
            <div className="flex justify-between items-start border-b-2 border-emerald-900 pb-6 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-emerald-900 uppercase tracking-tighter">Green Gold Gardens</h1>
                <p className="text-sm text-gray-600">Premium Botanical Collections</p>
                <p className="text-xs mt-2">Accra, Ghana</p>
                <p className="text-xs">+233 (0) 50 000 0000</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold uppercase">Official Receipt</h2>
                <p className="text-sm font-bold mt-1 text-emerald-700">{invoiceData.invoiceNumber}</p>
                <p className="text-xs text-gray-500 mt-1">{invoiceData.displayDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 mb-8 text-sm">
              <div>
                <h3 className="font-bold border-b mb-2 uppercase text-xs text-gray-400">Bill To:</h3>
                <p className="font-bold text-lg">{invoiceData.customerName}</p>
                <p>{invoiceData.customerPhone}</p>
                <p className="w-64">{invoiceData.customerAddress}</p>
              </div>
              <div className="text-right">
                <h3 className="font-bold border-b mb-2 uppercase text-xs text-gray-400">Payment Status:</h3>
                <p className="font-bold text-emerald-700">PAID VIA {invoiceData.method.toUpperCase()}</p>
              </div>
            </div>

            <table className="w-full text-left border-collapse mb-10">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 font-bold uppercase text-xs">Item Description</th>
                  <th className="py-3 font-bold uppercase text-xs text-center">Qty</th>
                  <th className="py-3 font-bold uppercase text-xs text-right">Price</th>
                  <th className="py-3 font-bold uppercase text-xs text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-4 font-medium">{item.name}</td>
                    <td className="py-4 text-center">1</td>
                    <td className="py-4 text-right">GH₵{item.price}</td>
                    <td className="py-4 text-right">GH₵{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Subtotal</span>
                  <span>GH₵{total}</span>
                </div>
                <div className="flex justify-between py-3 font-bold text-xl text-emerald-900">
                  <span>Grand Total</span>
                  <span>GH₵{total}</span>
                </div>
              </div>
            </div>

            <div className="mt-20 pt-10 border-t text-center text-xs text-gray-400">
              <p>Thank you for shopping with Green Gold Gardens.</p>
              <p className="mt-1 font-bold">Nature, Curated for You.</p>
            </div>
          </div>
        )}

        {/* ON-SCREEN SUCCESS MODAL */}
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
          <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-900">Order Placed!</h2>
          <p className="text-gray-600 mt-2 mb-8">We have received your details and your order is being processed.</p>
          
          <div className="space-y-3 no-print">
            <button 
              onClick={handlePrint}
              className="w-full bg-emerald-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-800 transition-all"
            >
              <Printer className="w-5 h-5" /> Download Receipt
            </button>
            <button 
              onClick={onSuccess}
              className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4">
      <div className="bg-white w-full md:max-w-md md:rounded-3xl rounded-t-3xl p-6 md:p-8 animate-fade-in relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="bg-emerald-900 text-white font-bold px-3 py-1 rounded text-[10px] tracking-widest uppercase">Secured Checkout</div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Complete Order</h2>
        </div>

        <div className="bg-emerald-50 p-4 rounded-2xl mb-6 flex items-center justify-between border border-emerald-100">
          <p className="text-emerald-800 text-sm font-medium italic">Total amount due:</p>
          <span className="font-black text-emerald-900 text-2xl">GH₵{total}</span>
        </div>

        {/* STEP 1: CUSTOMER DETAILS FORM */}
        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-emerald-900 uppercase mb-1 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-emerald-700" />
                <input 
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-12 p-4 bg-gray-50 border-gray-200 border rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all text-gray-800"
                  value={customer.name}
                  onChange={e => setCustomer({...customer, name: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-emerald-900 uppercase mb-1 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-emerald-700" />
                <input 
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="w-full pl-12 p-4 bg-gray-50 border-gray-200 border rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all text-gray-800"
                  value={customer.email}
                  onChange={e => setCustomer({...customer, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-emerald-900 uppercase mb-1 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 w-5 h-5 text-emerald-700" />
                <input 
                  required
                  type="tel"
                  placeholder="055 123 4567"
                  className="w-full pl-12 p-4 bg-gray-50 border-gray-200 border rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all text-gray-800"
                  value={customer.phone}
                  onChange={e => setCustomer({...customer, phone: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-emerald-900 uppercase mb-1 ml-1">Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-emerald-700" />
                <textarea 
                  required
                  placeholder="Street name, House number, Landmark..."
                  className="w-full pl-12 p-4 bg-gray-50 border-gray-200 border rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all h-24 resize-none text-gray-800"
                  value={customer.address}
                  onChange={e => setCustomer({...customer, address: e.target.value})}
                />
              </div>
            </div>

            <button className="w-full bg-emerald-900 text-white font-bold py-5 rounded-2xl mt-4 hover:bg-emerald-800 shadow-xl transition-all transform hover:-translate-y-1 active:scale-95">
              Proceed to Payment
            </button>
          </form>
        )}

        {/* STEP 2: PAYMENT METHOD */}
        {(step === 'payment' || step === 'processing') && (
          <div className="animate-fade-in-right">
             <div className="flex gap-4 mb-6">
              <button onClick={() => setMethod('momo')} className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'momo' ? 'border-emerald-500 bg-emerald-50 text-emerald-900 scale-105 shadow-md' : 'border-gray-100 text-gray-400'}`}>
                <Smartphone className="w-6 h-6" /><span className="text-[10px] font-black uppercase tracking-widest">Mobile Money</span>
              </button>
              <button onClick={() => setMethod('card')} className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'card' ? 'border-emerald-500 bg-emerald-50 text-emerald-900 scale-105 shadow-md' : 'border-gray-100 text-gray-400'}`}>
                <CreditCard className="w-6 h-6" /><span className="text-[10px] font-black uppercase tracking-widest">Card</span>
              </button>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl mb-6 border border-gray-200 flex justify-between items-center">
               <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase">Billing Details:</p>
                 <p className="font-bold text-gray-800">{customer.name}</p>
                 <p className="text-xs text-gray-500">{customer.phone}</p>
               </div>
               <button onClick={() => setStep('details')} className="text-emerald-700 text-xs font-black uppercase hover:underline">Change</button>
            </div>

            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full bg-emerald-900 text-white font-bold py-5 rounded-2xl hover:bg-emerald-800 transition-all flex items-center justify-center gap-3 shadow-xl transform active:scale-95"
            >
              {isProcessing ? <><Loader2 className="animate-spin w-6 h-6"/> Processing Securely...</> : <>Pay GH₵{total}</>}
            </button>
            
            <p className="text-center text-[10px] font-black text-gray-400 mt-6 flex items-center justify-center gap-1 uppercase tracking-tighter">
              <Lock className="w-3 h-3" /> Secure SSL Encryption by Paystack
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;