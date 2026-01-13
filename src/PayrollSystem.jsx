// src/PayrollSystem.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, DollarSign, Calendar, TrendingUp, AlertCircle, 
  FileText, Briefcase, ChevronRight, Save, X, Search, Award, 
  Activity, Clock, Upload, Trash2, CheckCircle, CreditCard, Layout,
  MinusCircle, PlusCircle, History
} from 'lucide-react';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, orderBy 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';

// --- SUB-COMPONENT: HISTORY LIST ---
const RecordHistory = ({ records }) => {
  if (records.length === 0) return <div className="text-gray-400 text-sm italic py-4">No history recorded yet.</div>;

  return (
    <div className="space-y-3 mt-4">
      {records.map((rec) => (
        <div key={rec.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start">
          <div>
            <p className="font-bold text-gray-800 text-sm">{rec.title || rec.category?.toUpperCase()}</p>
            <p className="text-xs text-gray-500">{rec.notes || rec.reason || `Processed on ${new Date(rec.createdAt?.seconds * 1000).toLocaleDateString()}`}</p>
            <p className="text-[10px] text-gray-400 mt-1">{rec.date}</p>
          </div>
          {rec.score && <span className={`px-2 py-1 rounded text-xs font-bold ${rec.score >= 8 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>Score: {rec.score}</span>}
          {rec.days && <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">{rec.days} Days</span>}
          {rec.netPay && <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-xs font-bold">Paid: GH₵{rec.netPay}</span>}
        </div>
      ))}
    </div>
  );
};

// --- EMPLOYEE PORTAL (DASHBOARD) ---
const EmployeePortal = ({ employee, onClose, db }) => {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [formData, setFormData] = useState({ ...employee });
  const [records, setRecords] = useState([]);
  
  // Forms State
  const [leaveLog, setLeaveLog] = useState({ type: 'Sick Leave', days: 1, reason: '', date: new Date().toISOString().split('T')[0] });
  const [kpiLog, setKpiLog] = useState({ score: 5, notes: '', title: 'Monthly Review', date: new Date().toISOString().split('T')[0] });
  const [complaintLog, setComplaintLog] = useState({ title: '', notes: '', date: new Date().toISOString().split('T')[0] });

  // Fetch Employee History & Payslips
  useEffect(() => {
    // We fetch generic HR records
    const q1 = query(collection(db, 'hr_records'), where('employeeId', '==', employee.id), orderBy('createdAt', 'desc'));
    const unsub1 = onSnapshot(q1, (snap) => {
      const genericRecords = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRecords(prev => [...genericRecords]);
    });
    return () => { unsub1(); };
  }, [db, employee.id]);

  const handleSaveProfile = async () => {
    await updateDoc(doc(db, 'employees', employee.id), formData);
    alert('Profile Updated Successfully!');
  };

  const handleAddRecord = async (category, data) => {
    await addDoc(collection(db, 'hr_records'), { 
      ...data, 
      category, 
      employeeId: employee.id, 
      createdAt: new Date() 
    });
    alert('Log Added to History');
    setLeaveLog({ type: 'Sick Leave', days: 1, reason: '', date: new Date().toISOString().split('T')[0] });
    setKpiLog({ score: 5, notes: '', title: 'Monthly Review', date: new Date().toISOString().split('T')[0] });
    setComplaintLog({ title: '', notes: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-50 w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden flex shadow-2xl relative">
        
        {/* SIDEBAR */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col justify-between p-6">
            <div>
                <div className="text-center mb-8">
                    <div className="relative inline-block">
                        <img src={formData.photo || "https://via.placeholder.com/150"} className="w-28 h-28 rounded-full mx-auto border-4 border-emerald-50 object-cover shadow-lg mb-4"/>
                        <span className="absolute bottom-2 right-2 bg-emerald-500 w-5 h-5 rounded-full border-2 border-white"></span>
                    </div>
                    <h2 className="font-bold text-xl text-gray-900">{formData.name}</h2>
                    <p className="text-emerald-600 font-medium text-sm">{formData.role}</p>
                </div>
                
                <nav className="space-y-1">
                    {[
                        { id: 'overview', icon: Layout, label: 'Overview' },
                        { id: 'profile', icon: Users, label: 'Profile Details' },
                        { id: 'leave', icon: Clock, label: 'Leave & Time' },
                        { id: 'kpi', icon: TrendingUp, label: 'Performance (KPI)' },
                        { id: 'complaints', icon: AlertCircle, label: 'HR Issues' },
                    ].map(tab => (
                        <button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${activeTab===tab.id ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <tab.icon className="w-5 h-5"/> {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <button onClick={onClose} className="bg-gray-200 text-gray-600 p-3 rounded-xl hover:bg-gray-300 font-bold transition-colors">Close Portal</button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12">
            
            {activeTab === 'overview' && (
                <div className="animate-fade-in space-y-8">
                    <h2 className="text-3xl font-bold text-gray-800">Staff Dashboard</h2>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                            <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Salary</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-2">GH₵{Number(formData.salary).toLocaleString()}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
                            <p className="text-blue-600 text-xs font-bold uppercase tracking-wider">Bank</p>
                            <h3 className="text-sm font-bold text-gray-800 mt-2">{formData.bankDetails || 'No Bank Info'}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
                            <p className="text-purple-600 text-xs font-bold uppercase tracking-wider">Status</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-2">Active</h3>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">History Log</h3>
                        <RecordHistory records={records} />
                    </div>
                </div>
            )}

            {activeTab === 'profile' && (
                <div className="animate-fade-in max-w-3xl">
                    <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2><button onClick={handleSaveProfile} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 flex items-center gap-2"><Save className="w-4 h-4"/> Save Changes</button></div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Full Name</label><input className="w-full p-3 border rounded-lg bg-gray-50" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})}/></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Role</label><input className="w-full p-3 border rounded-lg bg-gray-50" value={formData.role} onChange={e=>setFormData({...formData, role:e.target.value})}/></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Phone</label><input className="w-full p-3 border rounded-lg bg-gray-50" value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})}/></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Salary (GH₵)</label><input type="number" className="w-full p-3 border rounded-lg bg-gray-50 font-bold text-emerald-700" value={formData.salary} onChange={e=>setFormData({...formData, salary:Number(e.target.value)})}/></div>
                            <div className="md:col-span-2"><label className="text-xs font-bold text-gray-500 uppercase">Bank Details</label><input className="w-full p-3 border rounded-lg bg-gray-50" placeholder="Bank Name - Account Number" value={formData.bankDetails} onChange={e=>setFormData({...formData, bankDetails:e.target.value})}/></div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'leave' && (
                <div className="animate-fade-in grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 h-fit">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Clock className="w-5 h-5 text-blue-500"/> Record Absence</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Type</label><select className="w-full p-3 border rounded-lg bg-white" value={leaveLog.type} onChange={e=>setLeaveLog({...leaveLog, type:e.target.value})}><option>Sick Leave</option><option>Casual Leave</option><option>Annual Leave</option><option>Unpaid</option></select></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Days</label><input type="number" className="w-full p-3 border rounded-lg" value={leaveLog.days} onChange={e=>setLeaveLog({...leaveLog, days:e.target.value})}/></div>
                            </div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Date</label><input type="date" className="w-full p-3 border rounded-lg" value={leaveLog.date} onChange={e=>setLeaveLog({...leaveLog, date:e.target.value})}/></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Reason</label><textarea className="w-full p-3 border rounded-lg h-20" value={leaveLog.reason} onChange={e=>setLeaveLog({...leaveLog, reason:e.target.value})}/></div>
                            <button onClick={()=>handleAddRecord('leave', leaveLog)} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">Submit Record</button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'kpi' && (
                <div className="animate-fade-in grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 h-fit">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Award className="w-5 h-5 text-amber-500"/> Log Performance</h3>
                        <div className="space-y-4">
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Title</label><input className="w-full p-3 border rounded-lg" value={kpiLog.title} onChange={e=>setKpiLog({...kpiLog, title:e.target.value})}/></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Score (1-10)</label><input type="number" max="10" className="w-full p-3 border rounded-lg font-bold" value={kpiLog.score} onChange={e=>setKpiLog({...kpiLog, score:e.target.value})}/></div>
                            <button onClick={()=>handleAddRecord('kpi', kpiLog)} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700">Submit Review</button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'complaints' && (
                <div className="animate-fade-in grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 h-fit">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-red-600"><AlertCircle className="w-5 h-5"/> Log HR Issue</h3>
                        <div className="space-y-4">
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Title</label><input className="w-full p-3 border rounded-lg" value={complaintLog.title} onChange={e=>setComplaintLog({...complaintLog, title:e.target.value})}/></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase">Details</label><textarea className="w-full p-3 border rounded-lg h-24" value={complaintLog.notes} onChange={e=>setComplaintLog({...complaintLog, notes:e.target.value})}/></div>
                            <button onClick={()=>handleAddRecord('complaint', complaintLog)} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700">File Report</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  )
}

// --- PAYROLL RUNNER (THE INTERACTIVE WORKSHEET) ---
const PayrollRunInterface = ({ employees, onClose, onConfirm }) => {
    const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
    // Stores adjustments: { [empId]: { bonus: 0, deduction: 0 } }
    const [adjustments, setAdjustments] = useState({});

    const handleAdjustment = (id, field, value) => {
        setAdjustments(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: parseFloat(value) || 0 }
        }));
    };

    const calculateTotal = () => {
        return employees.reduce((total, emp) => {
            const adj = adjustments[emp.id] || { bonus: 0, deduction: 0 };
            return total + (Number(emp.salary) + (adj.bonus || 0) - (adj.deduction || 0));
        }, 0);
    };

    const handleFinalize = () => {
        if(!window.confirm(`Confirm Total Payout of GH₵${calculateTotal().toLocaleString()}? This will be recorded as an expense.`)) return;
        
        const payrollData = employees.map(emp => {
            const adj = adjustments[emp.id] || { bonus: 0, deduction: 0 };
            return {
                employeeId: emp.id,
                name: emp.name,
                baseSalary: Number(emp.salary),
                bonus: adj.bonus || 0,
                deduction: adj.deduction || 0,
                netPay: Number(emp.salary) + (adj.bonus || 0) - (adj.deduction || 0)
            };
        });

        onConfirm(payrollData, calculateTotal(), month);
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-fade-in-up">
                {/* Header */}
                <div className="bg-emerald-900 p-8 text-white flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-3xl font-bold flex items-center gap-3"><DollarSign className="w-8 h-8 text-emerald-400"/> Run Payroll</h2>
                        <input className="bg-transparent text-emerald-200 border-none font-medium mt-1 focus:ring-0 p-0 text-lg" value={month} onChange={e=>setMonth(e.target.value)} />
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-widest opacity-70">Total Payout</p>
                        <p className="text-5xl font-bold">GH₵{calculateTotal().toLocaleString()}</p>
                    </div>
                </div>

                {/* Worksheet */}
                <div className="flex-1 overflow-y-auto p-8">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs sticky top-0">
                            <tr>
                                <th className="p-4">Employee</th>
                                <th className="p-4">Role</th>
                                <th className="p-4 text-right">Base Salary</th>
                                <th className="p-4 text-center">Bonus (+)</th>
                                <th className="p-4 text-center">Deduction (-)</th>
                                <th className="p-4 text-right">Net Pay</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {employees.map(emp => {
                                const adj = adjustments[emp.id] || { bonus: 0, deduction: 0 };
                                const net = Number(emp.salary) + adj.bonus - adj.deduction;
                                return (
                                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-bold text-gray-800">{emp.name}</td>
                                        <td className="p-4 text-xs text-gray-500 uppercase">{emp.role}</td>
                                        <td className="p-4 text-right font-mono text-gray-600">GH₵{Number(emp.salary).toLocaleString()}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2 bg-green-50 rounded-lg p-1 w-32 mx-auto border border-green-100">
                                                <PlusCircle className="w-4 h-4 text-green-600"/>
                                                <input type="number" className="bg-transparent w-full text-center outline-none text-sm font-bold text-green-700" placeholder="0" onChange={e=>handleAdjustment(emp.id, 'bonus', e.target.value)} />
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2 bg-red-50 rounded-lg p-1 w-32 mx-auto border border-red-100">
                                                <MinusCircle className="w-4 h-4 text-red-600"/>
                                                <input type="number" className="bg-transparent w-full text-center outline-none text-sm font-bold text-red-700" placeholder="0" onChange={e=>handleAdjustment(emp.id, 'deduction', e.target.value)} />
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-bold text-lg text-emerald-900">GH₵{net.toLocaleString()}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center shrink-0">
                    <button onClick={onClose} className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200">Cancel</button>
                    <button onClick={handleFinalize} className="bg-emerald-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-emerald-800 shadow-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5"/> Approve & Pay
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- SALARY HISTORY REPORT ---
const SalaryHistory = ({ db }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'payroll_history'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => setHistory(snap.docs.map(d => d.data())));
        return () => unsub();
    }, [db]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Payroll History</h2>
            <div className="grid gap-6">
                {history.map((run, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4 border-b pb-4">
                            <div>
                                <h3 className="font-bold text-lg text-emerald-900">{run.month} Payroll</h3>
                                <p className="text-xs text-gray-500">Processed on {new Date(run.createdAt?.seconds * 1000).toDateString()}</p>
                            </div>
                            <div className="text-right">
                                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase">Paid</span>
                                <p className="text-xl font-bold mt-1">Total: GH₵{run.totalPaid.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {run.details.map((emp, i) => (
                                <div key={i} className="bg-gray-50 p-3 rounded-lg text-sm">
                                    <p className="font-bold text-gray-800">{emp.name}</p>
                                    <div className="flex justify-between text-xs mt-1 text-gray-500">
                                        <span>Base: {emp.baseSalary}</span>
                                        {emp.bonus > 0 && <span className="text-green-600">+ {emp.bonus}</span>}
                                        {emp.deduction > 0 && <span className="text-red-600">- {emp.deduction}</span>}
                                    </div>
                                    <p className="text-right font-bold text-emerald-600 mt-1">Net: {emp.netPay}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- ADD STAFF MODAL ---
const AddStaffModal = ({ onClose, onSave, storage }) => {
    const [newEmp, setNewEmp] = useState({ name: '', role: '', salary: '', phone: '', email: '', address: '', dob: '', ghanaCard: '', bankDetails: '', photo: '' });
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if(!file) return;
        setIsUploading(true);
        const fileRef = ref(storage, `staff/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        setNewEmp({...newEmp, photo: url});
        setIsUploading(false);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Staff Member</h2>
                    <button onClick={onClose}><X className="w-6 h-6 text-gray-400"/></button>
                </div>
                
                <div className="flex gap-6 mb-6">
                    <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center relative overflow-hidden group border-2 border-dashed border-gray-300">
                        {newEmp.photo ? <img src={newEmp.photo} className="w-full h-full object-cover"/> : <Upload className="w-8 h-8 text-gray-400"/>}
                        <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer"/>
                        {isUploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs">Uploading...</div>}
                    </div>
                    <div className="flex-1 space-y-4">
                        <input placeholder="Full Name" className="w-full p-3 border rounded-xl" value={newEmp.name} onChange={e=>setNewEmp({...newEmp, name:e.target.value})}/>
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="Role / Position" className="w-full p-3 border rounded-xl" value={newEmp.role} onChange={e=>setNewEmp({...newEmp, role:e.target.value})}/>
                            <input placeholder="Monthly Salary (GH₵)" type="number" className="w-full p-3 border rounded-xl" value={newEmp.salary} onChange={e=>setNewEmp({...newEmp, salary:e.target.value})}/>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <input placeholder="Phone Number" className="w-full p-3 border rounded-xl" value={newEmp.phone} onChange={e=>setNewEmp({...newEmp, phone:e.target.value})}/>
                    <input placeholder="Email Address" className="w-full p-3 border rounded-xl" value={newEmp.email} onChange={e=>setNewEmp({...newEmp, email:e.target.value})}/>
                    <input placeholder="Date of Birth" type="date" className="w-full p-3 border rounded-xl text-gray-500" value={newEmp.dob} onChange={e=>setNewEmp({...newEmp, dob:e.target.value})}/>
                    <input placeholder="Ghana Card ID" className="w-full p-3 border rounded-xl" value={newEmp.ghanaCard} onChange={e=>setNewEmp({...newEmp, ghanaCard:e.target.value})}/>
                    <div className="md:col-span-2"><input placeholder="Home Address" className="w-full p-3 border rounded-xl" value={newEmp.address} onChange={e=>setNewEmp({...newEmp, address:e.target.value})}/></div>
                    <div className="md:col-span-2"><input placeholder="Bank Details (Bank - Acct No)" className="w-full p-3 border rounded-xl" value={newEmp.bankDetails} onChange={e=>setNewEmp({...newEmp, bankDetails:e.target.value})}/></div>
                </div>

                <button onClick={() => onSave(newEmp)} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 shadow-lg">Save Employee Profile</button>
            </div>
        </div>
    );
};

// --- MAIN PAYROLL SYSTEM COMPONENT ---
const PayrollSystem = ({ db }) => {
  const [view, setView] = useState('list'); // list, run, history
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isRunningPayroll, setIsRunningPayroll] = useState(false);
  const storage = getStorage();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'employees'), (s) => 
      setEmployees(s.docs.map(d => ({id: d.id, ...d.data()})))
    );
    return () => unsub();
  }, [db]);

  const handleAddEmployee = async (empData) => {
    await addDoc(collection(db, 'employees'), { ...empData, createdAt: new Date() });
    alert("Staff Member Added!");
    setShowAddModal(false);
  };

  const processPayroll = async (details, total, month) => {
    // 1. Save detailed report for History
    await addDoc(collection(db, 'payroll_history'), {
        month,
        totalPaid: total,
        details: details,
        createdAt: new Date()
    });

    // 2. Add single expense transaction for Bookkeeping
    await addDoc(collection(db, 'transactions'), {
        type: 'expense',
        category: 'Salaries & Wages',
        amount: total,
        description: `Payroll Run: ${month}`,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date(),
        isPayroll: true
    });

    alert("Payroll Completed Successfully!");
    setIsRunningPayroll(false);
    setView('history');
  };

  return (
    <div className="animate-fade-in h-full flex flex-col">
      {selectedEmp && <EmployeePortal employee={selectedEmp} onClose={()=>setSelectedEmp(null)} db={db} storage={storage} />}
      {showAddModal && <AddStaffModal onClose={()=>setShowAddModal(false)} onSave={handleAddEmployee} storage={storage} />}
      {isRunningPayroll && <PayrollRunInterface employees={employees} onClose={()=>setIsRunningPayroll(false)} onConfirm={processPayroll} />}

      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Nexus-HR</h1>
            <p className="text-gray-500">Staff Management & Payroll</p>
        </div>
        <div className="flex gap-3">
             <button onClick={()=>setShowAddModal(true)} className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black shadow-lg"><UserPlus className="w-5 h-5"/> Add Staff</button>
             <button onClick={()=>setView('list')} className={`px-4 py-2 rounded-lg font-bold ${view==='list'?'bg-white text-emerald-600 border border-emerald-200':'text-gray-500'}`}>Staff</button>
             <button onClick={()=>setView('history')} className={`px-4 py-2 rounded-lg font-bold ${view==='history'?'bg-white text-emerald-600 border border-emerald-200':'text-gray-500'}`}>Reports</button>
             <button onClick={()=>setIsRunningPayroll(true)} className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg flex items-center gap-2"><DollarSign className="w-5 h-5"/> Run Payroll</button>
        </div>
      </div>

      {view === 'list' && (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {employees.length === 0 && (
                <div className="col-span-full text-center py-20 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-300">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-20"/>
                    <p>No staff members yet. Click "Add Staff" to begin.</p>
                </div>
            )}
            {employees.map(emp => (
                <div key={emp.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-all cursor-pointer group" onClick={()=>setSelectedEmp(emp)}>
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-gray-50 group-hover:border-emerald-50 transition-colors">
                        <img src={emp.photo || "https://via.placeholder.com/150"} className="w-full h-full object-cover"/>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">{emp.name}</h3>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-4">{emp.role}</p>
                    <div className="bg-gray-50 w-full py-2 rounded-xl text-sm font-bold text-emerald-700">GH₵{Number(emp.salary).toLocaleString()}</div>
                    <button className="mt-4 text-xs text-gray-400 hover:text-emerald-600 font-bold flex items-center gap-1">View Portal <ChevronRight className="w-3 h-3"/></button>
                </div>
            ))}
        </div>
      )}

      {view === 'history' && <SalaryHistory db={db} />}
    </div>
  );
};

export default PayrollSystem;