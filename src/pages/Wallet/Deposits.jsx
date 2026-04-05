import React, { useState, useEffect } from 'react';
import { 
    Search, Filter, ChevronRight, 
    CheckCircle2, XCircle, Clock,
    Banknote, Phone, User, Hash,
    ArrowUpRight, RefreshCw, AlertCircle
} from 'lucide-react';
import Loader from '../../components/UI/Loader';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Deposits = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const [filter, setFilter] = useState('pending');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchDeposits();
    }, [filter]);

    const fetchDeposits = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/wallet/deposits?status=${filter}`);
            setDeposits(response.data.data);
        } catch (err) {
            toast.error('Failed to load deposits');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            const reason = action === 'reject' ? prompt('Enter reason for rejection:') : null;
            if (action === 'reject' && !reason) return;

            setProcessing(id);
            const endpoint = `/admin/deposits/${id}/${action === 'approve' ? 'approve' : 'reject'}`;
            await api.put(endpoint, { reason });
            
            toast.success(`Deposit ${action === 'approve' ? 'Approved & Credited' : 'Rejected'}`);
            fetchDeposits();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        } finally {
            setProcessing(null);
        }
    };

    const filtered = deposits.filter(d => 
        d.User?.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.User?.phone?.includes(search) ||
        d.utr?.includes(search)
    );

    if (loading && deposits.length === 0) return <div className="h-[80vh] flex items-center justify-center"><Loader size={48} text="FETCHING DEPOSITS..." /></div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 group">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">Deposit Verification</h1>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                       <Banknote size={14} className="text-indigo-500" />
                       Incoming Manual UPI Payments Queue
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {['pending', 'approved', 'rejected'].map((s) => (
                        <button 
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                filter === s ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-400'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search and Stats */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                        type="text"
                        placeholder="SEARCH BY NAME, PHONE, OR UTR..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all shadow-sm"
                    />
                </div>
                
                <button onClick={fetchDeposits} className="bg-white p-3 rounded-2xl border-2 border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all group">
                    <RefreshCw size={20} className={loading ? 'animate-spin' : 'group-active:rotate-180 transition-transform duration-500'} />
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((d) => (
                    <div key={d.id} className="admin-card group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden flex flex-col">
                        {/* Status bar */}
                        <div className={`h-1.5 w-full ${
                            d.status === 'approved' ? 'bg-emerald-500' : d.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'
                        }`} />
                        
                        <div className="p-6 flex-1 space-y-5">
                            {/* User Info */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 border border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        <User size={20} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{d.User?.name}</h3>
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                                            <Phone size={10} />
                                            {d.User?.phone}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-slate-900">₹{parseFloat(d.amount).toLocaleString()}</div>
                                    <div className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{d.status}</div>
                                </div>
                            </div>

                            {/* UTR Info */}
                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2 group-hover:bg-indigo-50/30 group-hover:border-indigo-100 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 font-black text-[9px] text-slate-400 uppercase tracking-widest">
                                        <Hash size={10} />
                                        UTR / REF NUMBER
                                    </div>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(d.utr);
                                            toast.success('UTR Copied');
                                        }}
                                        className="text-[8px] font-black text-indigo-600 hover:underline"
                                    >
                                        COPY
                                    </button>
                                </div>
                                <div className="text-sm font-black text-slate-800 tracking-wider">
                                    {d.utr || 'NOT PROVIDED'}
                                </div>
                            </div>

                            {/* Date */}
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
                                    <Clock size={12} />
                                    {new Date(d.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                </div>
                                {d.status === 'rejected' && d.rejectionReason && (
                                    <div className="flex items-center gap-1 text-[8px] font-bold text-rose-500 uppercase tracking-tighter max-w-[150px] truncate">
                                        <AlertCircle size={10} />
                                        {d.rejectionReason}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        {d.status === 'pending' && (
                            <div className="grid grid-cols-2 gap-px bg-slate-100 mt-auto border-t border-slate-100">
                                <button 
                                    onClick={() => handleAction(d.id, 'reject')}
                                    disabled={processing === d.id}
                                    className="bg-white p-4 text-rose-500 flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors disabled:opacity-50"
                                >
                                    <XCircle size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Reject</span>
                                </button>
                                <button 
                                    onClick={() => handleAction(d.id, 'approve')}
                                    disabled={processing === d.id}
                                    className="bg-white p-4 text-emerald-600 flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                                >
                                    {processing === d.id ? <RefreshCw className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                                    <span className="text-[10px] font-black uppercase tracking-widest">Approve</span>
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="admin-card p-20 text-center space-y-4">
                    <div className="inline-flex w-20 h-20 bg-slate-50 items-center justify-center rounded-3xl text-slate-200 border-2 border-slate-100 border-dashed">
                        <Banknote size={40} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-slate-900 uppercase">No Deposits Found</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Silence on the verification front...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Deposits;
