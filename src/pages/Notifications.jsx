import React, { useState, useEffect } from 'react';
import { 
    Bell, Send, Users, User, Megaphone, 
    Smartphone, Search, Filter, History, Trash2,
    CheckCircle2, AlertTriangle, RefreshCw, Zap,
    MoreVertical, ArrowRight, ShieldCheck, Mail, Globe, 
    ChevronRight, Activity, Terminal, Database, Target
} from 'lucide-react';
import api from '../services/api';
import userService from '../services/user.service';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/UI/Loader';
import Badge from '../components/UI/Badge';
import toast from 'react-hot-toast';

const Notifications = () => {
    const { isSuperAdmin } = useAuth();
    const [tab, setTab] = useState('broadcast'); // broadcast/targeted
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // Form States
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetId, setTargetId] = useState('');
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [searching, setSearching] = useState(false);

    const handleSearch = async (val) => {
        setSearch(val);
        if (val.length < 3) {
            setUsers([]);
            return;
        }
        try {
            setSearching(true);
            const data = await userService.getAllUsers({ search: val });
            setUsers(data);
        } catch (err) {
            toast.error('Search synchronization failure');
        } finally {
            setSearching(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!title || !message) return toast.error('Transmission payload required');
        if (tab === 'targeted' && !targetId) return toast.error('Target node not selected');

        try {
            setSubmitting(true);
            if (tab === 'broadcast') {
                await api.post('/admin/notifications/broadcast', { title, message });
                toast.success('Omni-broadcast dispatched across all vectors');
            } else {
                await api.post('/admin/notifications/send', { userId: targetId, title, message });
                toast.success('Point-to-point transmission established');
            }
            setTitle('');
            setMessage('');
            setTargetId('');
            setSearch('');
            setUsers([]);
        } catch (err) {
            toast.error('Signal transmission aborted');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20">
            {/* Notifications Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 group">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">Signal Dispatch</h1>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                       <Megaphone size={14} className="text-amber-500" />
                       Inter-node Communication & Network-wide Broadcasts
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner group/tabs">
                    <button
                        onClick={() => setTab('broadcast')}
                        className={`px-8 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[9px] transition-all flex items-center gap-3 ${
                            tab === 'broadcast' 
                            ? 'bg-white text-slate-900 shadow-xl shadow-slate-200 scale-105 border border-slate-200' 
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <Globe size={14} strokeWidth={2.5} className={tab === 'broadcast' ? 'text-amber-500' : ''} />
                        Omni Broadcast
                    </button>
                    <button
                        onClick={() => setTab('targeted')}
                        className={`px-8 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[9px] transition-all flex items-center gap-3 ${
                            tab === 'targeted' 
                            ? 'bg-white text-slate-900 shadow-xl shadow-slate-200 scale-105 border border-slate-200' 
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <Target size={14} strokeWidth={2.5} className={tab === 'targeted' ? 'text-indigo-500' : ''} />
                        Vector Target
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Dispatch Console */}
                <div className="lg:col-span-8">
                    <div className="admin-card p-10 group/form">
                         <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
                             <div className="p-2.5 bg-slate-900 text-white rounded-xl border border-slate-700 shadow-xl group-hover/form:scale-110 transition-transform">
                                 <Send size={18} strokeWidth={2.5} />
                             </div>
                             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Transmission Module</h3>
                             <div className="ml-auto flex items-center gap-2">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                 <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">ENCODER_READY</span>
                             </div>
                         </div>

                         <form onSubmit={handleSend} className="space-y-8">
                            {tab === 'targeted' && (
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">TARGET NODE IDENTIFIER</label>
                                    <div className="relative group/search">
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/search:text-indigo-500 transition-colors" size={16} strokeWidth={2.5} />
                                        <input 
                                            type="text"
                                            value={search}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            placeholder="SCAN NODE IDENTITY / PHONE..."
                                            className="admin-input pl-14 pr-12 py-4 text-[11px] font-bold tracking-widest uppercase placeholder:text-slate-200"
                                        />
                                        {searching && <RefreshCw className="absolute right-5 top-1/2 -translate-y-1/2 text-indigo-500 animate-spin" size={16} />}
                                    </div>

                                    {users.length > 0 && (
                                        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[300px] overflow-y-auto p-2 space-y-1">
                                            {users.map(u => (
                                                <button 
                                                    key={u.id}
                                                    type="button"
                                                    onClick={() => { setTargetId(u.id); setSearch(u.name); setUsers([]); }}
                                                    className={`w-full p-4 rounded-lg border flex items-center justify-between transition-all ${
                                                        targetId === u.id 
                                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-100' 
                                                        : 'bg-slate-50 border-slate-100 text-slate-900 hover:border-indigo-200 hover:bg-white'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${targetId === u.id ? 'bg-white/10' : 'bg-slate-900 text-indigo-400 shadow-lg shadow-slate-900/10'}`}>
                                                            <User size={16} strokeWidth={2.5} />
                                                        </div>
                                                        <div className="flex flex-col text-left">
                                                            <span className="font-bold uppercase text-[11px] tracking-tight">{u.name}</span>
                                                            <span className={`text-[9px] font-bold ${targetId === u.id ? 'text-white/60' : 'text-slate-400'} uppercase tracking-widest`}>{u.phone}</span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={14} className={targetId === u.id ? 'text-white' : 'text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity'} />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">TRANSMISSION HEADER</label>
                                <input 
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="SIGNAL SUBJECT..."
                                    className="admin-input py-4 px-6 text-[11px] font-bold tracking-widest uppercase placeholder:text-slate-200"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">DATA PAYLOAD</label>
                                <textarea 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="ENTER MESSAGE PROTOCOL TO BE DISPATCHED ACROSS THE GRID..."
                                    className="admin-input px-6 py-6 min-h-[220px] text-xs font-bold leading-relaxed uppercase placeholder:text-slate-200"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={submitting}
                                className="w-full py-5 bg-slate-900 text-white rounded-xl font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-6 shadow-xl shadow-slate-100 hover:bg-black hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 group/send border-b-4 border-indigo-600"
                            >
                                {submitting ? <RefreshCw className="animate-spin" size={16} /> : (
                                    <>
                                        DISPATCH SIGNAL
                                        <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500 text-indigo-400" strokeWidth={2.5} />
                                    </>
                                )}
                            </button>
                         </form>
                    </div>
                </div>

                {/* Audit & Info */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#1A1A2E] p-10 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden group/info">
                         <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none transform rotate-12 transition-transform group-hover/info:rotate-0 duration-1000">
                             <Globe size={180} className="text-white" />
                         </div>
                         <div className="space-y-8 relative z-10">
                            <div className="p-3 bg-white/5 rounded-xl w-fit border border-white/10 group-hover/info:scale-110 transition-transform duration-500 shadow-lg">
                                <ShieldCheck className="text-amber-500" size={24} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-base font-bold text-white uppercase tracking-tight">Dispatch Protocols</h4>
                                <div className="space-y-5">
                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0 animate-pulse"></div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose">Omni-broadcasts alert all active nodes on the sync grid in real-time.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose">Targeted vectors are private tunnel signals restricted to specific node IDs.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose">All dispatch events are linked to the root node for audit compliance.</p>
                                    </div>
                                </div>
                            </div>
                         </div>
                    </div>

                    <div className="admin-card p-10 group/pulse">
                         <h3 className="text-sm font-bold text-slate-800 tracking-widest uppercase mb-8 flex items-center justify-between border-b border-slate-100 pb-4">
                            Signal Pulse
                            <Activity className="text-indigo-500 animate-pulse" size={18} strokeWidth={2.5} />
                         </h3>
                         <div className="space-y-3">
                            {[
                                { node: 'Sys', msg: 'Market Cycle Terminated', time: '2m', color: 'indigo' },
                                { node: 'Usr', msg: 'Payout Hash Finalized', time: '15m', color: 'emerald' },
                                { node: 'Adm', msg: 'Maintenance Protocol Dispatched', time: '1h', color: 'amber' },
                            ].map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 shadow-sm group/item">
                                    <div className="flex flex-col">
                                        <span className={`text-[8px] font-bold text-${p.color}-500 uppercase tracking-[0.2em] mb-1`}>{p.node}_VECTOR</span>
                                        <span className="text-[9px] font-bold text-slate-700 uppercase tracking-tight truncate max-w-[120px]">{p.msg}</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover/item:text-slate-900 transition-colors">{p.time}</span>
                                </div>
                            ))}
                         </div>
                         <div className="mt-8 pt-8 border-t border-slate-100">
                             <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-4 border border-slate-100 shadow-inner group/db">
                                 <Database size={16} className="text-slate-300 group-hover/db:text-indigo-500 transition-colors" />
                                 <div className="flex flex-col">
                                     <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Network Load</span>
                                     <div className="flex items-center gap-2 mt-0.5">
                                         <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                             <div className="w-[64%] h-full bg-indigo-500"></div>
                                         </div>
                                         <span className="text-[9px] font-black text-slate-800 tracking-tighter">64%</span>
                                     </div>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
