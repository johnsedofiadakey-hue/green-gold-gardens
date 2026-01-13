import React, { useState, useEffect, useRef } from 'react';
import { 
  DollarSign, ArrowLeft, TrendingUp, TrendingDown, Trash2, PieChart, Save, 
  Users, Package, FileText, Plus, Printer, X, CheckCircle, FileCheck, 
  Search, ShoppingBag, CreditCard, Calendar, Filter, Edit3, Briefcase,
  Share2, MessageCircle, Mail, Settings, Sliders, MapPin, Phone, User,
  Building, Wallet, AlertCircle, ChevronRight, ClipboardCheck, Download, List, Send,
  Bell, Globe, ExternalLink
} from 'lucide-react';
import { 
  collection, addDoc, deleteDoc, updateDoc, doc, query, orderBy, onSnapshot, where 
} from "firebase/firestore";

// --- IMPORT THE UPGRADED PAYROLL SYSTEM ---
import PayrollSystem from './PayrollSystem'; 

const logoImage = "/logo.jpg"; 

// --- PRINT & STYLE ENGINE ---
const PrintStyles = () => (
  <style>{`
    @media print {
      body * { visibility: hidden; }
      #printable-area, #printable-area * { visibility: visible; }
      #printable-area { 
        position: absolute; 
        left: 0; 
        top: 0; 
        width: 100%; 
        margin: 0; 
        padding: 0; 
        background: white; 
        color: black; 
        z-index: 9999;
      }
      .no-print { display: none !important; }
      /* Ensure background colors print */
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    }
    
    /* Scrollbar styling for modals */
    .modal-scroll::-webkit-scrollbar { width: 8px; }
    .modal-scroll::-webkit-scrollbar-track { background: #f1f1f1; }
    .modal-scroll::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
    .modal-scroll::-webkit-scrollbar-thumb:hover { background: #555; }
  `}</style>
);

// --- HELPER COMPONENTS ---

const SearchableSelect = ({ options, value, onChange, onSelect, placeholder, labelKey = 'name', subLabelKey = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) { if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false); }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filtered = options.filter(opt => opt[labelKey]?.toLowerCase().includes(value?.toLowerCase() || ''));

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
        <input 
          type="text" placeholder={placeholder} 
          className="w-full pl-10 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm font-medium" 
          value={value} onChange={(e) => { onChange(e.target.value); setIsOpen(true); }} onFocus={() => setIsOpen(true)} 
        />
      </div>
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
          {filtered.map((opt, i) => (
            <div key={i} onClick={() => { onSelect(opt); setIsOpen(false); }} className="p-3 hover:bg-emerald-50 cursor-pointer border-b border-gray-50 last:border-0 flex justify-between items-center transition-colors">
              <div><p className="font-bold text-gray-800 text-sm">{opt[labelKey]}</p>{subLabelKey && <p className="text-xs text-gray-500 mt-0.5">{opt[subLabelKey]}</p>}</div>
              {opt.stock !== undefined && <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 rounded text-gray-600">Stock: {opt.stock}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- SETTINGS MANAGER ---
const SettingsManager = () => {
    const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('ggg_settings')) || { 
        taxName: 'VAT', taxRate: 0, discountName: 'Discount', discountRate: 0, 
        companyName: 'Green Gold Gardens', companyAddress: 'Efua Sutherland Road, Accra', 
        companyPhone: '053 609 8146', companyEmail: 'info@greengold.com',
        bankName: '', bankAccount: '', paymentTerms: 'Payment due upon receipt.'
    });

    const save = () => {
        localStorage.setItem('ggg_settings', JSON.stringify(settings));
        alert("Settings Updated Successfully!");
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800"><Settings className="w-6 h-6"/> System Configuration</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider border-b pb-2">Company Details (Invoice Header)</h3>
                    <div><label className="text-xs font-bold text-gray-600">Company Name</label><input className="w-full p-3 border rounded-lg bg-gray-50" value={settings.companyName} onChange={e=>setSettings({...settings, companyName:e.target.value})}/></div>
                    <div><label className="text-xs font-bold text-gray-600">Address</label><input className="w-full p-3 border rounded-lg bg-gray-50" value={settings.companyAddress} onChange={e=>setSettings({...settings, companyAddress:e.target.value})}/></div>
                    <div className="grid grid-cols-2 gap-2">
                        <div><label className="text-xs font-bold text-gray-600">Phone</label><input className="w-full p-3 border rounded-lg bg-gray-50" value={settings.companyPhone} onChange={e=>setSettings({...settings, companyPhone:e.target.value})}/></div>
                        <div><label className="text-xs font-bold text-gray-600">Email</label><input className="w-full p-3 border rounded-lg bg-gray-50" value={settings.companyEmail} onChange={e=>setSettings({...settings, companyEmail:e.target.value})}/></div>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider border-b pb-2">Financial Defaults & Terms</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div><label className="text-xs font-bold text-gray-600">Def. Tax Name</label><input className="w-full p-3 border rounded-lg bg-gray-50" value={settings.taxName} onChange={e=>setSettings({...settings, taxName:e.target.value})}/></div>
                        <div><label className="text-xs font-bold text-gray-600">Def. Tax %</label><input type="number" className="w-full p-3 border rounded-lg bg-gray-50" value={settings.taxRate} onChange={e=>setSettings({...settings, taxRate:e.target.value})}/></div>
                    </div>
                    <div><label className="text-xs font-bold text-gray-600">Bank Name</label><input className="w-full p-3 border rounded-lg bg-gray-50" value={settings.bankName} onChange={e=>setSettings({...settings, bankName:e.target.value})}/></div>
                    <div><label className="text-xs font-bold text-gray-600">Account Number</label><input className="w-full p-3 border rounded-lg bg-gray-50" value={settings.bankAccount} onChange={e=>setSettings({...settings, bankAccount:e.target.value})}/></div>
                    <div><label className="text-xs font-bold text-gray-600">Terms & Conditions</label><textarea className="w-full p-3 border rounded-lg bg-gray-50 h-20" value={settings.paymentTerms} onChange={e=>setSettings({...settings, paymentTerms:e.target.value})}/></div>
                </div>
            </div>
            <button onClick={save} className="w-full mt-8 bg-emerald-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-emerald-800 transition-all flex justify-center items-center gap-2"><Save className="w-5 h-5"/> Save All Settings</button>
        </div>
    )
}

// --- NEW FEATURE: SALES NOTIFICATION CENTER ---
const SalesNotificationCenter = ({ transactions, customers, onProcessOrder }) => {
    // Filter for transactions that came from website (isInvoice=true) but are not yet assigned a customerId in our system or marked as 'processed'
    // Assuming website sends { isWebOrder: true, processed: false }
    const webOrders = transactions.filter(t => t.isWebOrder === true && t.processed !== true);

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Globe className="w-6 h-6 text-blue-500"/> Web Order Inbox</h2>
                    <p className="text-gray-500 text-sm mt-1">Review and convert website sales into formal invoices.</p>
                </div>
                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold border border-blue-100">
                    {webOrders.length} Pending Orders
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Incoming Requests</h3>
                </div>
                {webOrders.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-20"/>
                        <p>All caught up! No pending web orders.</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Customer Info</th>
                                <th className="p-4">Items</th>
                                <th className="p-4 text-right">Amount</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {webOrders.map(order => (
                                <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="p-4 text-gray-500">{order.date}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800">{order.customerName}</div>
                                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-xs text-gray-600 bg-gray-100 rounded p-2 max-w-[200px]">
                                            {order.items && order.items.length > 0 
                                                ? order.items.map(i => `${i.qty}x ${i.name}`).join(', ') 
                                                : order.description}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right font-bold text-emerald-600">GH₵{order.amount.toLocaleString()}</td>
                                    <td className="p-4 text-center">
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">Web Sale</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => onProcessOrder(order)}
                                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-emerald-700 shadow flex items-center gap-2 mx-auto"
                                        >
                                            <User className="w-3 h-3"/> Process & Create Invoice
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

// --- TRANSACTIONS HUB (REPORTING CENTER) ---

const TransactionsHub = ({ transactions }) => {
    const settings = JSON.parse(localStorage.getItem('ggg_settings')) || { companyName: 'Green Gold Gardens' };
    const [filter, setFilter] = useState('all');
    // Date filters (Default to current month)
    const date = new Date();
    const [startDate, setStartDate] = useState(new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0]);

    // Enhanced Filter Logic
    const filtered = transactions.filter(t => {
        const tDate = t.date;
        const matchesDate = tDate >= startDate && tDate <= endDate;
        const matchesType = filter === 'all' || t.type === filter;
        return matchesDate && matchesType;
    });

    const income = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const profit = income - expenses;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
                <div className="flex flex-col md:flex-row gap-4 items-center w-full">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mr-4"><List className="w-6 h-6"/> Transactions Hub</h2>
                    <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg border">
                        <span className="text-xs font-bold text-gray-500 uppercase">From</span>
                        <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="bg-transparent text-sm outline-none font-bold text-gray-700" />
                    </div>
                    <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg border">
                        <span className="text-xs font-bold text-gray-500 uppercase">To</span>
                        <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="bg-transparent text-sm outline-none font-bold text-gray-700" />
                    </div>
                    <select value={filter} onChange={e=>setFilter(e.target.value)} className="p-2 border rounded-lg bg-gray-50 text-sm font-bold text-gray-700">
                        <option value="all">All Transactions</option>
                        <option value="income">Sales Only</option>
                        <option value="expense">Expenses Only</option>
                    </select>
                </div>
                <button onClick={()=>window.print()} className="bg-gray-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm hover:bg-black shadow-lg"><Download className="w-4 h-4"/> Download Report PDF</button>
            </div>

            {/* PRINTABLE REPORT AREA */}
            <div id="printable-area" className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-gray-200">
                <div className="text-center mb-8 border-b-2 border-gray-100 pb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">{settings.companyName}</h1>
                    <p className="text-gray-500 uppercase text-xs tracking-widest mt-2 font-bold">Financial Report</p>
                    <p className="text-sm text-gray-400 mt-1">{startDate} to {endDate}</p>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8 text-center">
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100"><p className="text-xs text-emerald-600 font-bold uppercase">Total Revenue</p><p className="text-2xl font-bold text-emerald-700">GH₵{income.toLocaleString()}</p></div>
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100"><p className="text-xs text-red-600 font-bold uppercase">Total Expenses</p><p className="text-2xl font-bold text-red-700">GH₵{expenses.toLocaleString()}</p></div>
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100"><p className="text-xs text-blue-600 font-bold uppercase">Net Profit / Loss</p><p className={`text-2xl font-bold ${profit >= 0 ? 'text-blue-700' : 'text-red-600'}`}>GH₵{profit.toLocaleString()}</p></div>
                </div>

                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-gray-100 text-gray-600 uppercase font-bold text-xs">
                        <tr><th className="p-4 border-b">Date</th><th className="p-4 border-b">Description</th><th className="p-4 border-b">Category</th><th className="p-4 border-b text-right">Amount</th></tr>
                    </thead>
                    <tbody>
                        {filtered.map(t => (
                            <tr key={t.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                <td className="p-4 text-gray-500 font-medium">{t.date}</td>
                                <td className="p-4 font-bold text-gray-800">{t.desc}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${t.type==='income'?'bg-emerald-100 text-emerald-700':'bg-red-100 text-red-700'}`}>{t.category || t.type}</span></td>
                                <td className={`p-4 text-right font-bold font-mono ${t.type==='income'?'text-emerald-600':'text-red-600'}`}>{t.type==='income' ? '+' : '-'} {t.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-12 text-center text-xs text-gray-400 border-t pt-4">Generated by Nexus Finance OS • {new Date().toDateString()}</div>
            </div>
        </div>
    )
}

// --- DOCUMENT MODALS (INVOICE & RECEIPT) ---

const ReceiptModal = ({ transaction, customer, onClose }) => {
  const settings = JSON.parse(localStorage.getItem('ggg_settings')) || {};
  const paidAmount = transaction.amountPaid || 0;
  const balance = transaction.amount - paidAmount;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-gray-50 p-4 flex justify-between items-center border-b no-print shrink-0">
            <h3 className="font-bold text-gray-700">Official Receipt</h3>
            <div className="flex gap-2">
                <button onClick={()=>window.print()} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-emerald-700 shadow-lg text-sm"><Download className="w-4 h-4"/> Download PDF</button>
                <button onClick={onClose} className="bg-white text-gray-700 border border-gray-300 p-2 rounded-lg hover:bg-gray-50"><X className="w-5 h-5"/></button>
            </div>
        </div>
        
        <div id="printable-area" className="p-8 md:p-12 bg-white relative text-gray-800 font-sans overflow-y-auto modal-scroll">
          <div className="flex justify-between items-start mb-10 border-b-2 border-emerald-900 pb-8">
              <div>
                  <h2 className="text-2xl font-bold text-gray-900">{settings.companyName}</h2>
                  <div className="text-sm text-gray-500 mt-2 space-y-1"><p>{settings.companyAddress}</p><p>{settings.companyPhone}</p></div>
              </div>
              <div className="text-right">
                  <h1 className="text-4xl font-extrabold text-emerald-950/10 mb-2 tracking-tighter uppercase">PAYMENT RECEIPT</h1>
                  <p className="text-emerald-900 font-bold">Ref: #{transaction.id.slice(0, 6).toUpperCase()}</p>
                  <p className="text-gray-400 text-sm">Date: {new Date().toISOString().split('T')[0]}</p>
              </div>
          </div>

          <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100 mb-8 text-center">
              <p className="text-emerald-800 text-xs font-bold uppercase tracking-widest mb-2">Amount Received</p>
              <h1 className="text-5xl font-extrabold text-emerald-600">GH₵{paidAmount.toLocaleString()}</h1>
              <p className="text-emerald-600 mt-2 font-medium">For Payment of: {transaction.desc}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Received From</p>
                  <p className="text-xl font-bold text-gray-800">{customer ? customer.name : 'Guest Customer'}</p>
                  <p className="text-sm text-gray-500">{customer?.phone}</p>
              </div>
              <div className="text-right">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Payment Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${balance <= 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {balance <= 0 ? 'Paid in Full' : 'Partial Payment'}
                  </span>
                  {balance > 0 && <p className="text-sm text-red-500 mt-1 font-bold">Balance Remaining: GH₵{balance.toLocaleString()}</p>}
              </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-end">
              <p className="text-xs text-gray-400 italic">"Thank you for your business."</p>
              <div className="text-center">
                  <div className="border-b border-black w-40 mb-2"></div>
                  <p className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest">Authorized Signature</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const InvoiceModal = ({ transaction, customer, onClose }) => {
  const settings = JSON.parse(localStorage.getItem('ggg_settings')) || { companyName: 'Green Gold Gardens', companyAddress: 'Accra' };
  const items = transaction.items || [{ desc: transaction.desc, price: transaction.subTotal || transaction.amount, qty: 1 }];
  const balanceDue = transaction.amount - (transaction.amountPaid || 0);

  const handleEmail = () => {
      const subject = `Invoice #${transaction.id.slice(0, 8).toUpperCase()} from ${settings.companyName}`;
      const body = `Dear ${customer?.name || 'Valued Customer'},\n\nPlease find attached the invoice for your recent purchase.\n\nInvoice ID: #${transaction.id.slice(0, 8).toUpperCase()}\nTotal Due: GH₵${transaction.amount.toLocaleString()}\n\nTo view the invoice, please see the attachment.\n\nThank you for your business,\n${settings.companyName}`;
      window.open(`mailto:${customer?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-gray-50 p-4 flex justify-between items-center border-b no-print shrink-0">
            <h3 className="font-bold text-gray-700">Invoice Preview</h3>
            <div className="flex gap-2">
                <button onClick={handleEmail} className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-gray-50 shadow-sm text-sm"><Mail className="w-4 h-4"/> Email</button>
                <button onClick={()=>window.print()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-blue-700 shadow-lg text-sm"><Download className="w-4 h-4"/> Download PDF</button>
                <button onClick={onClose} className="bg-white text-gray-700 border border-gray-300 p-2 rounded-lg hover:bg-gray-50"><X className="w-5 h-5"/></button>
            </div>
        </div>
        
        <div id="printable-area" className="p-12 md:p-16 bg-white relative text-gray-800 font-sans overflow-y-auto modal-scroll">
          <div className="flex justify-between items-start mb-12 border-b-2 border-emerald-900 pb-8">
              <div>
                  <img src={logoImage} alt="Logo" className="h-20 object-contain mb-4" onError={(e) => e.target.style.display='none'} />
                  <h2 className="text-2xl font-bold text-gray-900">{settings.companyName}</h2>
                  <div className="text-sm text-gray-500 mt-2 space-y-1"><p>{settings.companyAddress}</p><p>{settings.companyPhone}</p><p>{settings.companyEmail}</p></div>
              </div>
              <div className="text-right">
                  <h1 className="text-6xl font-extrabold text-emerald-950/10 mb-2 tracking-tighter">INVOICE</h1>
                  <p className="text-emerald-900 font-bold text-xl">#{transaction.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-gray-400 font-medium mt-1">Date: {transaction.date}</p>
                  <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${balanceDue <= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {balanceDue <= 0 ? 'PAID' : 'DUE'}
                  </div>
              </div>
          </div>

          <div className="flex justify-between mb-12">
              <div className="w-1/2">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Bill To</p>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{customer ? customer.name : 'Guest'}</h3>
                  <div className="text-gray-600 text-sm space-y-1"><p>{customer?.company}</p><p>{customer?.address}</p><p>{customer?.phone}</p></div>
              </div>
              <div className="w-1/2 text-right">
                  <div className="inline-block bg-gray-50 rounded-xl p-4 border border-gray-100 text-left min-w-[200px]">
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Balance Due</p>
                      <p className="text-3xl font-bold text-red-600">GH₵{balanceDue.toLocaleString()}</p>
                  </div>
              </div>
          </div>

          <table className="w-full mb-8">
              <thead><tr className="bg-gray-50 border-y border-gray-200"><th className="py-3 px-4 text-left text-xs font-bold uppercase text-gray-500">Item</th><th className="py-3 px-4 text-center text-xs font-bold uppercase text-gray-500">Qty</th><th className="py-3 px-4 text-right text-xs font-bold uppercase text-gray-500">Price</th><th className="py-3 px-4 text-right text-xs font-bold uppercase text-gray-500">Total</th></tr></thead>
              <tbody>{items.map((item, i) => (<tr key={i} className="border-b border-gray-50"><td className="py-4 px-4 font-medium text-gray-800">{item.name || item.desc}</td><td className="py-4 px-4 text-center text-gray-600">{item.qty}</td><td className="py-4 px-4 text-right text-gray-600">{parseFloat(item.price).toLocaleString()}</td><td className="py-4 px-4 text-right font-bold text-gray-800">{(item.price * item.qty).toLocaleString()}</td></tr>))}</tbody>
          </table>

          <div className="flex justify-end">
              <div className="w-1/2 space-y-2">
                  <div className="flex justify-between text-gray-500 text-sm"><span>Subtotal</span><span>GH₵{transaction.subTotal?.toLocaleString() || 0}</span></div>
                  {transaction.discountAmount > 0 && <div className="flex justify-between text-emerald-600 text-sm"><span>{transaction.discountName}</span><span>- GH₵{transaction.discountAmount.toLocaleString()}</span></div>}
                  {transaction.taxAmount > 0 && <div className="flex justify-between text-red-500 text-sm"><span>{transaction.taxName}</span><span>+ GH₵{transaction.taxAmount.toLocaleString()}</span></div>}
                  <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold text-gray-800"><span>Invoice Total</span><span>GH₵{transaction.amount.toLocaleString()}</span></div>
                  <div className="flex justify-between text-emerald-700 text-sm font-bold bg-emerald-50 p-2 rounded"><span>Amount Paid</span><span>GH₵{(transaction.amountPaid || 0).toLocaleString()}</span></div>
              </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-end">
              <div className="text-xs text-gray-500 max-w-sm">
                  <p className="font-bold text-gray-700 mb-1">Bank Details:</p>
                  <p>{settings.bankName} - {settings.bankAccount}</p>
                  <p className="mt-2 font-bold text-gray-700">Terms:</p>
                  <p>{settings.paymentTerms}</p>
              </div>
              <div className="text-center">
                  <div className="border-b border-black w-40 mb-2"></div>
                  <p className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest">Authorized Signature</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- ACTION MODALS ---

const PaymentModal = ({ transaction, onClose, onUpdate }) => {
    const [amount, setAmount] = useState('');
    const balance = transaction.amount - (transaction.amountPaid || 0);

    const handlePay = () => {
        const pay = parseFloat(amount);
        if(!pay || pay <= 0) return;
        const newPaid = (transaction.amountPaid || 0) + pay;
        onUpdate(transaction.id, { 
            amountPaid: newPaid,
            status: newPaid >= transaction.amount ? 'Paid' : 'Partial'
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-2xl">
                <h3 className="text-xl font-bold mb-4">Receive Payment</h3>
                <p className="text-sm text-gray-500 mb-4">Invoice #{transaction.id.slice(0,6)} • Balance: <span className="font-bold text-red-600">GH₵{balance.toLocaleString()}</span></p>
                <input type="number" autoFocus className="w-full p-4 border-2 border-emerald-100 rounded-xl text-2xl font-bold text-center text-emerald-900 mb-4 focus:border-emerald-500 outline-none" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)} />
                <button onClick={handlePay} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700">Confirm Payment</button>
                <button onClick={onClose} className="w-full mt-2 text-gray-400 text-sm hover:text-gray-600">Cancel</button>
            </div>
        </div>
    )
}

const EditTransactionModal = ({ transaction, onClose, onSave }) => {
    const [formData, setFormData] = useState({ ...transaction });
    
    // Auto-recalculate if tax/discount rates change
    const calculate = () => {
        const p = parseFloat(formData.subTotal || formData.amount) || 0;
        const tRate = parseFloat(formData.taxRate) || 0;
        const dRate = parseFloat(formData.discountRate) || 0;
        
        const tAmt = p * (tRate / 100);
        const dAmt = p * (dRate / 100);
        const finalAmt = (p - dAmt) + tAmt;

        return { 
            ...formData, 
            amount: finalAmt, 
            taxAmount: tAmt, 
            discountAmount: dAmt 
        };
    };

    const handleSave = () => {
        const final = calculate();
        onSave(transaction.id, final);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Edit3 className="w-5 h-5 text-blue-600"/> Edit Invoice Details</h3>
                <div className="space-y-4">
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Description (Summary)</label><input className="w-full p-3 border rounded-lg" value={formData.desc} onChange={e=>setFormData({...formData, desc: e.target.value})} /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Subtotal (GH₵)</label><input type="number" className="w-full p-3 border rounded-lg font-bold" value={formData.subTotal || formData.amount} onChange={e=>setFormData({...formData, subTotal: parseFloat(e.target.value)})} /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-xs font-bold text-gray-500 uppercase">Discount %</label><input type="number" className="w-full p-3 border rounded-lg font-bold" value={formData.discountRate || 0} onChange={e=>setFormData({...formData, discountRate: e.target.value})} /></div>
                        <div><label className="text-xs font-bold text-gray-500 uppercase">Tax %</label><input type="number" className="w-full p-3 border rounded-lg font-bold" value={formData.taxRate || 0} onChange={e=>setFormData({...formData, taxRate: e.target.value})} /></div>
                    </div>
                    <div className="pt-4 border-t flex justify-end gap-2">
                        <button onClick={onClose} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- CORE LOGIC ---

const InvoiceCreator = ({ customer, inventory, onSave, onCancel }) => {
  const settings = JSON.parse(localStorage.getItem('ggg_settings')) || {};
  const [lines, setLines] = useState([{ id: Date.now(), desc: '', price: 0, qty: 1, inventoryId: null }]);
  const [meta, setMeta] = useState({ 
      date: new Date().toISOString().split('T')[0], 
      category: 'Sales of Goods',
      taxRate: settings.taxRate || 0, taxName: settings.taxName || 'Tax',
      discountRate: settings.discountRate || 0, discountName: settings.discountName || 'Discount'
  });

  const updateLine = (id, field, val) => setLines(lines.map(l => l.id === id ? { ...l, [field]: val } : l));
  const handleProductSelect = (id, product) => setLines(lines.map(l => l.id === id ? { ...l, desc: product.name, price: product.price, inventoryId: product.id } : l));
  const calculate = () => {
      const subTotal = lines.reduce((sum, l) => sum + (l.price * l.qty), 0);
      const taxAmt = subTotal * (meta.taxRate / 100);
      const discAmt = subTotal * (meta.discountRate / 100);
      return { subTotal, taxAmt, discAmt, total: (subTotal - discAmt) + taxAmt };
  };
  const totals = calculate();

  const handleSubmit = (e) => {
      e.preventDefault();
      if(totals.total === 0) return;
      onSave({
          ...meta,
          customerId: customer.id,
          items: lines,
          amount: totals.total,
          subTotal: totals.subTotal,
          taxAmount: totals.taxAmt,
          discountAmount: totals.discAmt,
          amountPaid: 0,
          status: 'Unpaid',
          type: 'income',
          desc: lines.length > 1 ? `Multiple Items (${lines.length})` : lines[0].desc
      });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
        <div className="bg-gray-900 p-4 text-white flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2"><FileText className="w-5 h-5"/> New Invoice for {customer.name}</h3>
            <button onClick={onCancel} className="bg-white/10 p-2 rounded hover:bg-white/20"><X className="w-4 h-4"/></button>
        </div>
        <div className="p-6">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div><label className="text-xs font-bold text-gray-500 uppercase">Date</label><input type="date" className="w-full p-2 border rounded bg-gray-50" value={meta.date} onChange={e=>setMeta({...meta, date:e.target.value})} /></div>
                <div><label className="text-xs font-bold text-gray-500 uppercase">Category</label><select className="w-full p-2 border rounded bg-gray-50" value={meta.category} onChange={e=>setMeta({...meta, category:e.target.value})}>{["Sales of Goods", "Sales of Service", "Proceeds", "Consultation Fee", "Installation", "Other Income"].map(c=><option key={c}>{c}</option>)}</select></div>
            </div>
            <div className="space-y-2 mb-6">
                <div className="flex text-xs font-bold text-gray-400 uppercase px-1"><span className="flex-1">Item</span><span className="w-16 text-center">Qty</span><span className="w-24 text-right">Price</span><span className="w-24 text-right">Total</span><span className="w-8"></span></div>
                {lines.map((line) => (
                    <div key={line.id} className="flex gap-2 items-start">
                        <div className="flex-1"><SearchableSelect options={inventory} value={line.desc} onChange={(val)=>updateLine(line.id, 'desc', val)} onSelect={(p)=>handleProductSelect(line.id, p)} placeholder="Item..." /></div>
                        <input type="number" className="w-16 p-2 border rounded text-center" value={line.qty} onChange={e=>updateLine(line.id, 'qty', parseFloat(e.target.value)||0)} />
                        <input type="number" className="w-24 p-2 border rounded text-right" value={line.price} onChange={e=>updateLine(line.id, 'price', parseFloat(e.target.value)||0)} />
                        <div className="w-24 p-2 text-right font-bold text-gray-700 bg-gray-50 rounded">{(line.qty * line.price).toLocaleString()}</div>
                        <button onClick={()=>setLines(lines.filter(l=>l.id!==line.id))} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                    </div>
                ))}
                <button onClick={()=>setLines([...lines, { id: Date.now(), desc: '', price: 0, qty: 1, inventoryId: null }])} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2"><Plus className="w-3 h-3"/> Add Item</button>
            </div>
            <div className="flex justify-end border-t pt-4">
                <div className="w-1/2 space-y-2 text-right">
                    <div className="flex justify-between text-xs text-gray-500"><span>Subtotal</span><span>GH₵{totals.subTotal.toLocaleString()}</span></div>
                    <div className="flex justify-between items-center"><span className="text-xs text-emerald-600">Discount %</span><input type="number" className="w-16 p-1 border rounded text-right text-xs" value={meta.discountRate} onChange={e=>setMeta({...meta, discountRate:e.target.value})}/></div>
                    <div className="flex justify-between items-center"><span className="text-xs text-red-500">Tax %</span><input type="number" className="w-16 p-1 border rounded text-right text-xs" value={meta.taxRate} onChange={e=>setMeta({...meta, taxRate:e.target.value})}/></div>
                    <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-2"><span>Total</span><span>GH₵{totals.total.toLocaleString()}</span></div>
                </div>
            </div>
            <button onClick={handleSubmit} className="w-full mt-6 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black">Create Invoice</button>
        </div>
    </div>
  )
}

const CustomerPortal = ({ customer, transactions, inventory, onBack, onSaveTransaction, onUpdateTransaction }) => {
    const [view, setView] = useState('list');
    const custTransactions = transactions.filter(t => t.customerId === customer.id);
    const totalDue = custTransactions.reduce((acc, t) => acc + (t.amount - (t.amountPaid || 0)), 0);
    const [selectedInv, setSelectedInv] = useState(null);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [payModal, setPayModal] = useState(null);

    const handleShare = (transaction, type) => {
        const text = `Dear ${customer.name},%0A%0APlease find attached invoice for ${transaction.desc}.%0AAmount: GH₵${transaction.amount.toLocaleString()}.%0ABalance: GH₵${(transaction.amount - (transaction.amountPaid||0)).toLocaleString()}.%0A%0AThank you!`;
        if(type === 'whatsapp' && customer.phone) window.open(`https://wa.me/${customer.phone.replace(/\D/g,'')}?text=${text}`, '_blank');
        if(type === 'email' && customer.email) window.open(`mailto:${customer.email}?subject=Invoice&body=${text.replace(/%0A/g, '%0D%0A')}`, '_blank');
    };

    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="mb-4 flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold"><ArrowLeft className="w-4 h-4"/> Back to Directory</button>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
                        <div className="flex gap-4 mt-2 text-gray-500 text-sm">
                            {customer.company && <span className="flex items-center gap-1"><Building className="w-4 h-4"/> {customer.company}</span>}
                            <span className="flex items-center gap-1"><Phone className="w-4 h-4"/> {customer.phone}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {customer.address}</span>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Outstanding Balance</p>
                        <p className={`text-4xl font-bold ${totalDue > 0 ? 'text-red-600' : 'text-emerald-500'}`}>GH₵{totalDue.toLocaleString()}</p>
                    </div>
                </div>
                <div className="mt-8 flex gap-3 border-t pt-6">
                    <button onClick={() => setView('create')} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-lg shadow-emerald-200"><Plus className="w-5 h-5"/> Create Invoice</button>
                </div>
            </div>

            {view === 'create' && <div className="mb-8"><InvoiceCreator customer={customer} inventory={inventory} onCancel={()=>setView('list')} onSave={(data) => { onSaveTransaction(data); setView('list'); }} /></div>}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center"><h3 className="font-bold text-gray-800">Transaction History</h3></div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase"><tr><th className="p-4">Date</th><th className="p-4">Description</th><th className="p-4 text-right">Total</th><th className="p-4 text-right">Paid</th><th className="p-4 text-right">Balance</th><th className="p-4 text-center">Status</th><th className="p-4 text-center">Actions</th></tr></thead>
                    <tbody className="divide-y">{custTransactions.map(t => {
                        const bal = t.amount - (t.amountPaid || 0);
                        return (
                        <tr key={t.id} className="hover:bg-gray-50">
                            <td className="p-4 text-gray-500">{t.date}</td>
                            <td className="p-4 font-bold text-gray-800">{t.desc}</td>
                            <td className="p-4 text-right font-bold">GH₵{t.amount.toLocaleString()}</td>
                            <td className="p-4 text-right text-emerald-600">GH₵{(t.amountPaid || 0).toLocaleString()}</td>
                            <td className="p-4 text-right text-red-600 font-bold">GH₵{bal.toLocaleString()}</td>
                            <td className="p-4 text-center"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${bal <= 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{bal <= 0 ? 'Paid' : 'Pending'}</span></td>
                            <td className="p-4 flex justify-center gap-2">
                                <button onClick={() => setPayModal(t)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded" title="Receive Payment"><Wallet className="w-4 h-4"/></button>
                                <button onClick={() => setSelectedInv(t)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="View Invoice"><FileText className="w-4 h-4"/></button>
                                {(t.amountPaid > 0) && <button onClick={() => setSelectedReceipt(t)} className="p-2 text-purple-600 hover:bg-purple-50 rounded" title="View Receipt"><ClipboardCheck className="w-4 h-4"/></button>}
                                <button onClick={() => handleShare(t, 'whatsapp')} className="p-2 text-green-600 hover:bg-green-50 rounded" title="Share Message"><Share2 className="w-4 h-4"/></button>
                            </td>
                        </tr>
                    )})}</tbody>
                </table>
            </div>
            
            {selectedInv && <InvoiceModal transaction={selectedInv} customer={customer} onClose={()=>setSelectedInv(null)} />}
            {selectedReceipt && <ReceiptModal transaction={selectedReceipt} customer={customer} onClose={()=>setSelectedReceipt(null)} />}
            {payModal && <PaymentModal transaction={payModal} onClose={()=>setPayModal(null)} onUpdate={onUpdateTransaction} />}
        </div>
    );
}

const ExpenseTerminal = ({ onSave }) => {
  const [expense, setExpense] = useState({ desc: '', amount: '', category: 'Operational Expenses', date: new Date().toISOString().split('T')[0] });
  const categories = ["Operational Expenses", "Utilities", "Fines", "Property", "Transportation", "Food & Water", "Salaries", "Maintenance", "Marketing", "Restocking", "Other"];
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in flex flex-col md:flex-row border border-red-100">
      <div className="bg-red-900 p-10 text-white md:w-2/5 flex flex-col justify-center"><div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm"><CreditCard className="w-8 h-8 text-red-300" /></div><h2 className="text-3xl font-bold mb-3">Record Expense</h2><p className="text-red-200 text-sm leading-relaxed">Track operational costs, utilities, and more.</p></div>
      <div className="p-10 md:w-3/5 bg-white"><form onSubmit={(e) => { e.preventDefault(); onSave({...expense, type: 'expense'}); setExpense({desc:'', amount:'', category:'Operational Expenses', date: new Date().toISOString().split('T')[0]}) }} className="space-y-8">
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Description</label><input required className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 font-medium" placeholder="e.g. Monthly Water Bill" value={expense.desc} onChange={e=>setExpense({...expense, desc: e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-6"><div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Amount (GH₵)</label><input type="number" required className="w-full p-4 border border-gray-200 rounded-xl font-bold text-xl text-red-600 outline-none" value={expense.amount} onChange={e=>setExpense({...expense, amount: e.target.value})} /></div><div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Category</label><select className="w-full p-4 border border-gray-200 rounded-xl bg-white outline-none" value={expense.category} onChange={e=>setExpense({...expense, category: e.target.value})}>{categories.map(c=><option key={c}>{c}</option>)}</select></div></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Date</label><input type="date" className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 font-medium text-gray-600" value={expense.date} onChange={e=>setExpense({...expense, date: e.target.value})} /></div>
          <button className="w-full bg-red-600 text-white font-bold py-5 rounded-xl hover:bg-red-700 shadow-lg flex items-center justify-center gap-3 text-lg"><Save className="w-6 h-6"/> Log Expense</button>
      </form></div>
    </div>
  )
}

const CustomerDirectory = ({ db, customers, transactions, inventory, onSaveTransaction, onUpdateTransaction, onDeleteCustomer }) => {
  const [selectedCust, setSelectedCust] = useState(null);
  const [newCust, setNewCust] = useState({ name: '', phone: '', email: '', address: '', company: '', type: 'Individual' });
  const [showAdd, setShowAdd] = useState(false);

  const addCustomer = async (e) => { e.preventDefault(); if(!newCust.name) return; await addDoc(collection(db, 'customers'), newCust); setNewCust({ name: '', phone: '', email: '', address: '', company: '', type: 'Individual' }); setShowAdd(false); };

  if (selectedCust) { return <CustomerPortal customer={selectedCust} transactions={transactions} inventory={inventory} onBack={()=>setSelectedCust(null)} onSaveTransaction={onSaveTransaction} onUpdateTransaction={onUpdateTransaction} />; }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8"><h2 className="text-3xl font-bold text-gray-800">Customer Directory</h2><button onClick={() => setShowAdd(!showAdd)} className="bg-gray-900 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black">{showAdd ? 'Cancel' : 'Add Customer'}</button></div>
      {showAdd && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-8 animate-fade-in-up">
              <h3 className="font-bold text-lg mb-4">New Customer Profile</h3>
              <form onSubmit={addCustomer} className="grid md:grid-cols-2 gap-4">
                  <input placeholder="Full Name" className="p-3 border rounded-lg" value={newCust.name} onChange={e=>setNewCust({...newCust, name: e.target.value})} />
                  <input placeholder="Company Name (Optional)" className="p-3 border rounded-lg" value={newCust.company} onChange={e=>setNewCust({...newCust, company: e.target.value})} />
                  <input placeholder="Phone" className="p-3 border rounded-lg" value={newCust.phone} onChange={e=>setNewCust({...newCust, phone: e.target.value})} />
                  <input placeholder="Email" className="p-3 border rounded-lg" value={newCust.email} onChange={e=>setNewCust({...newCust, email: e.target.value})} />
                  <div className="md:col-span-2"><textarea placeholder="Physical Address" className="w-full p-3 border rounded-lg h-20 resize-none" value={newCust.address} onChange={e=>setNewCust({...newCust, address: e.target.value})} /></div>
                  <button className="md:col-span-2 bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700">Save Customer</button>
              </form>
          </div>
      )}
      <div className="grid md:grid-cols-3 gap-6">
          {customers.map(c => {
              const bal = transactions.filter(t => t.customerId === c.id).reduce((acc, t) => acc + (t.amount - (t.amountPaid || 0)), 0);
              return (
                  <div key={c.id} onClick={() => setSelectedCust(c)} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group relative">
                      <div className="flex justify-between items-start mb-3"><div className="bg-emerald-100 text-emerald-800 p-3 rounded-full"><User className="w-6 h-6"/></div>{bal > 0 && <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">Due: GH₵{bal.toLocaleString()}</span>}</div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-700">{c.name}</h3>
                      {c.company && <p className="text-xs text-gray-500 font-bold uppercase">{c.company}</p>}
                      <div className="mt-4 space-y-1 text-sm text-gray-500"><p className="flex items-center gap-2"><Phone className="w-4 h-4"/> {c.phone}</p><p className="flex items-center gap-2"><MapPin className="w-4 h-4 truncate"/> {c.address}</p></div>
                      <button onClick={(e) => { e.stopPropagation(); onDeleteCustomer(c.id); }} className="absolute top-4 right-4 text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                  </div>
              )
          })}
      </div>
    </div>
  )
}

const InventoryManager = ({ db }) => {
  const [inventory, setInventory] = useState([]);
  useEffect(() => { const unsub = onSnapshot(collection(db, 'plants'), (snap) => setInventory(snap.docs.map(d => ({id: d.id, ...d.data()})))); return () => unsub(); }, [db]);
  const updateStock = async (id, current, change) => { const n = (current || 0) + change; if(n < 0) return; await updateDoc(doc(db, 'plants', id), { stock: n }); };
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in"><h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-emerald-900"><Package className="w-6 h-6"/> Live Inventory</h3><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider"><tr><th className="p-4">Item</th><th className="p-4">Price</th><th className="p-4 text-center">Stock</th><th className="p-4 text-right">Value</th></tr></thead><tbody className="divide-y">{inventory.map(item => (<tr key={item.id} className="hover:bg-gray-50 transition-colors"><td className="p-4 font-bold text-gray-800 flex items-center gap-3"><img src={item.image} className="w-10 h-10 rounded-lg object-cover bg-gray-200 border border-gray-200"/>{item.name}</td><td className="p-4">GH₵{item.price}</td><td className="p-4 flex justify-center items-center gap-3"><button onClick={()=>updateStock(item.id, item.stock, -1)} className="w-8 h-8 bg-gray-100 rounded-lg font-bold hover:bg-red-100">-</button><span className="w-8 text-center font-bold text-lg">{item.stock || 0}</span><button onClick={()=>updateStock(item.id, item.stock, 1)} className="w-8 h-8 bg-gray-100 rounded-lg font-bold hover:bg-green-100">+</button></td><td className="p-4 text-right font-bold text-emerald-600">GH₵{((item.stock || 0) * item.price).toLocaleString()}</td></tr>))}</tbody></table></div></div>
  )
}

const Dashboard = ({ transactions, customers }) => {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalPaid = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amountPaid || 0), 0);
  const pending = totalIncome - totalPaid;
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500"><p className="text-gray-500 text-xs font-bold uppercase">Total Invoiced</p><h3 className="text-3xl font-bold text-gray-800 mt-2">GH₵{totalIncome.toLocaleString()}</h3></div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500"><p className="text-gray-500 text-xs font-bold uppercase">Cash Collected</p><h3 className="text-3xl font-bold text-gray-800 mt-2">GH₵{totalPaid.toLocaleString()}</h3></div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500"><p className="text-gray-500 text-xs font-bold uppercase">Accounts Receivable</p><h3 className="text-3xl font-bold text-red-600 mt-2">GH₵{pending.toLocaleString()}</h3></div>
            <div className="bg-gray-900 p-6 rounded-2xl shadow-lg text-white"><p className="text-emerald-400 text-xs font-bold uppercase">Total Expenses</p><h3 className="text-3xl font-bold mt-2">GH₵{totalExpense.toLocaleString()}</h3></div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Pending Invoices</h3>
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase"><tr><th className="p-4">Client</th><th className="p-4">Date</th><th className="p-4">Description</th><th className="p-4 text-right">Balance Due</th></tr></thead>
                <tbody className="divide-y">{transactions.filter(t => t.type === 'income' && (t.amount - (t.amountPaid||0)) > 0).map(t => (
                    <tr key={t.id}><td className="p-4 font-bold">{customers.find(c=>c.id===t.customerId)?.name || 'Unknown'}</td><td className="p-4 text-gray-500">{t.date}</td><td className="p-4">{t.desc}</td><td className="p-4 text-right font-bold text-red-600">GH₵{(t.amount - (t.amountPaid||0)).toLocaleString()}</td></tr>
                ))}</tbody>
            </table>
        </div>
    </div>
  )
}

const BookkeepingSystem = ({ db, onExit }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  
  // Count unread web orders (assuming website pushes transactions with { isWebOrder: true, processed: false })
  const pendingWebOrders = transactions.filter(t => t.isWebOrder === true && t.processed !== true).length;

  useEffect(() => {
    const u1 = onSnapshot(query(collection(db, "transactions"), orderBy("date", "desc")), s => setTransactions(s.docs.map(d => ({id:d.id, ...d.data()}))));
    const u2 = onSnapshot(collection(db, "customers"), s => setCustomers(s.docs.map(d => ({id:d.id, ...d.data()}))));
    const u3 = onSnapshot(collection(db, "plants"), s => { const items = s.docs.map(d => ({id:d.id, ...d.data()})); setInventory(items); });
    return () => { u1(); u2(); u3(); }
  }, [db]);

  const handleSaveTransaction = async (data) => {
    try {
      await addDoc(collection(db, "transactions"), { ...data, createdAt: new Date() });
      if (data.type === 'income' && data.items) { 
          data.items.forEach(async (item) => {
              if (item.inventoryId) {
                  const dbItem = inventory.find(i => i.id === item.inventoryId);
                  if (dbItem) await updateDoc(doc(db, 'plants', item.inventoryId), { stock: (dbItem.stock || 0) - item.qty });
              }
          });
      }
      alert("Success! Transaction Recorded."); 
    } catch (err) { alert(err.message); }
  };

  // --- AUTOMATED ORDER PROCESSING ---
  // This function takes a raw web order, finds or creates the customer, and turns the order into a processed invoice.
  const handleProcessWebOrder = async (order) => {
    try {
        let custId = null;
        
        // 1. Check if customer exists by email
        const existingCust = customers.find(c => c.email && c.email.toLowerCase() === order.customerEmail?.toLowerCase());
        
        if (existingCust) {
            custId = existingCust.id;
        } else {
            // 2. Create new customer profile automatically
            const newCustRef = await addDoc(collection(db, 'customers'), {
                name: order.customerName || 'Web Customer',
                email: order.customerEmail || '',
                phone: order.customerPhone || '', // Assuming checkout passes phone
                address: 'Web Order',
                type: 'Individual',
                createdAt: new Date()
            });
            custId = newCustRef.id;
        }

        // 3. Update the transaction to link it to the customer and mark as processed
        // We also ensure the status is correctly set based on payment (usually web orders are Paid or Pending Payment)
        await updateDoc(doc(db, 'transactions', order.id), {
            customerId: custId,
            processed: true, // Hides it from the "Pending Inbox"
            isWebOrder: false, // Converts it to a regular transaction record
            type: 'income', // Ensures it shows in income reports
            status: 'Paid', // Assuming Paystack successful payment
            amountPaid: order.amount // Fully paid
        });
        
        // 4. Update Inventory (if items attached)
        if (order.items) {
             order.items.forEach(async (item) => {
              if (item.inventoryId) {
                  const dbItem = inventory.find(i => i.id === item.inventoryId);
                  if (dbItem) await updateDoc(doc(db, 'plants', item.inventoryId), { stock: (dbItem.stock || 0) - item.qty });
              }
          });
        }

        alert(`Order Processed! Profile created/linked for ${order.customerName}.`);
        setActiveTab('customers'); // Redirect to customer view to see the new invoice

    } catch (error) {
        alert("Error processing order: " + error.message);
    }
  };

  const handleUpdateTransaction = async (id, data) => { await updateDoc(doc(db, "transactions", id), data); };
  const handleDeleteCustomer = async (id) => { if(confirm('Deleting customer will not delete their invoices. Continue?')) await deleteDoc(doc(db, 'customers', id)); };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      <PrintStyles />
      <div className="md:w-72 bg-gradient-to-b from-emerald-900 to-emerald-950 text-white p-6 flex flex-col justify-between print:hidden shadow-2xl relative overflow-hidden no-print">
        <div className="relative z-10"><div className="flex items-center gap-3 mb-12"><div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm"><DollarSign className="w-8 h-8 text-emerald-300"/></div><div><h1 className="font-bold text-xl tracking-wide">NEXUS</h1><p className="text-emerald-400 text-[10px] tracking-widest uppercase">Finance OS</p></div></div>
        
        <nav className="space-y-2">
            {[
                {id: 'dashboard', icon: PieChart, label: 'Overview'},
                {id: 'web_orders', icon: Bell, label: 'Web Orders', badge: pendingWebOrders},
                {id: 'customers', icon: Users, label: 'Customers & Invoicing'},
                {id: 'transactions', icon: FileText, label: 'Transactions Hub'},
                {id: 'expenses', icon: TrendingDown, label: 'Expense Hub'},
                
                // --- NEW PAYROLL TAB ---
                {id: 'payroll', icon: Briefcase, label: 'HR & Payroll'}, 
                // -----------------------

                {id: 'inventory', icon: Package, label: 'Inventory'},
                {id: 'settings', icon: Settings, label: 'Settings'}
            ].map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-left p-3.5 rounded-xl flex items-center justify-between transition-all duration-200 border border-transparent ${activeTab === item.id ? 'bg-white/10 text-white border-white/10 shadow-inner font-bold translate-x-2' : 'text-emerald-100 hover:bg-white/5'}`}>
                    <div className="flex items-center gap-4">
                        <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-emerald-300' : 'text-emerald-600'}`}/> 
                        {item.label}
                    </div>
                    {item.badge > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{item.badge}</span>}
                </button>
            ))}
        </nav>
        </div>
        <button onClick={onExit} className="bg-black/20 text-emerald-200 p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-black/40 transition-colors shadow-inner border border-white/5"><ArrowLeft className="w-4 h-4"/> Return to Shop</button>
      </div>

      <div className="flex-1 p-6 md:p-10 overflow-y-auto print:p-0">
        <header className="mb-8 flex justify-between items-center print:hidden no-print"><h2 className="text-4xl font-extrabold text-emerald-950 tracking-tight">{activeTab === 'web_orders' ? 'Incoming Orders' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2><div className="text-right bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-sm font-bold text-gray-500 flex items-center gap-2"><Calendar className="w-4 h-4"/> {new Date().toDateString()}</div></header>

        {activeTab === 'dashboard' && <Dashboard transactions={transactions} totalInventoryValue={0} customers={customers} />}
        {activeTab === 'web_orders' && <SalesNotificationCenter transactions={transactions} customers={customers} onProcessOrder={handleProcessWebOrder} />}
        {activeTab === 'customers' && <CustomerDirectory db={db} customers={customers} transactions={transactions} inventory={inventory} onSaveTransaction={handleSaveTransaction} onUpdateTransaction={handleUpdateTransaction} onDeleteCustomer={handleDeleteCustomer} />}
        {activeTab === 'transactions' && <TransactionsHub transactions={transactions} />}
        {activeTab === 'expenses' && <ExpenseTerminal onSave={handleSaveTransaction} />}
        
        {/* --- RENDER PAYROLL SYSTEM --- */}
        {activeTab === 'payroll' && <PayrollSystem db={db} />}
        {/* ----------------------------- */}

        {activeTab === 'inventory' && <InventoryManager db={db} />} 
        {activeTab === 'settings' && <SettingsManager />}
      </div>
    </div>
  );
};

export default BookkeepingSystem;