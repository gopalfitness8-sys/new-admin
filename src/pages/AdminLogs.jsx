import React, { useState, useEffect } from 'react';
import { 
    ShieldCheck, Search, Filter, RefreshCw, Smartphone, 
    History, Clock, ArrowRight, XCircle, AlertTriangle, 
    MoreVertical, LayoutGrid, Target, Activity, Database, 
    Globe, Terminal, ShieldAlert, User, Shield
} from 'lucide-react';
import api from '../services/api';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import Loader from '../components/UI/Loader';
import toast from 'react-hot-toast';

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionFilter, setActionFilter] = useState('');

    useEffect(() => {
        fetchLogs();
    }, [actionFilter]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/logs?action=${actionFilter}`);
            setLogs(response.data.data);
        } catch (err) {
            toast.error('Internal audit synchronization failure');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { 
            header: 'Enforcer Node', 
            accessor: 'Admin',
            render: (row) => (
                <div className="flex items-center gap-3 py-1 group">
                    <div className="w-9 h-9 bg-slate-100 border border-slate-200 text-slate-500 rounded-lg transition-all group-hover:scale-110 shadow-sm flex items-center justify-center">
                        <User size={16} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-800 font-bold uppercase tracking-tight text-[11px] group-hover:text-amber-600 transition-colors">{row.Admin?.name || 'ROOT_OVERRIDE'}</span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest mt-1 px-2 py-0.5 rounded bg-slate-50 border border-slate-100 w-fit leading-none uppercase">{row.Admin?.role || 'SYSTEM'}</span>
                    </div>
                </div>
            )
        },
        { 
            header: 'Action protocol', 
            accessor: 'action',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-1 bg-slate-900 rounded-md border border-slate-700 shadow-lg shadow-slate-900/10">
                       <Terminal size={12} className="text-amber-400" />
                    </div>
                    <Badge variant="primary" className="uppercase tracking-[0.2em] text-[9px] font-bold px-3 py-1 rounded-md border border-white/50 shadow-sm">
                        {row.action.replace(/_/g, ' ')}
                    </Badge>
                </div>
            )
        },
        { 
            header: 'Payload Details', 
            accessor: 'details',
            render: (row) => (
                <div className="flex flex-col gap-1.5 p-1">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight line-clamp-1">
                        {typeof row.details === 'object' ? JSON.stringify(row.details) : row.details}
                    </span>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-50 px-2 py-0.5 rounded border border-slate-100 w-fit">IP: {row.ipAddress || '0.0.0.0'}</span>
                    </div>
                </div>
            )
        },
        { 
            header: 'Epoch', 
            accessor: 'createdAt',
            render: (row) => (
                <div className="flex flex-col">
                   <span className="text-slate-800 font-bold tracking-tight text-[11px] uppercase leading-none">{new Date(row.createdAt).toLocaleDateString('en-GB')}</span>
                   <span className="text-[9px] font-bold text-slate-400 tracking-widest mt-1.5 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 w-fit leading-none">{new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            )
        },
        { 
            header: 'Node Source', 
            render: (row) => (
                <Badge variant="default" className="text-[9px] font-bold tracking-widest uppercase border border-slate-200 px-3 py-1 rounded-md">
                   SYS_HUB_2
                </Badge>
            )
        }
    ];

    const filteredLogs = (logs || []).filter(l => 
        (l.Admin?.name || '').toLowerCase().includes(search.toLowerCase()) || 
        (l.details || '').toString().toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20">
            {/* Audit Ops Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 group">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Audit Log</h1>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest text-[#64748B]">
                       <Shield size={14} className="text-amber-500" />
                       Internal Security Enforcement & Audit Historical Trace
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group/search">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-amber-500 transition-colors" size={16} />
                       <input 
                           type="text"
                           placeholder="SCAN AUDIT ENTRIES..."
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           className="w-full pl-12 pr-6 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-xs tracking-widest shadow-sm uppercase shadow-sm"
                       />
                    </div>
                    <button 
                       onClick={() => { setSearch(''); fetchLogs(); }}
                       className="p-3 bg-slate-900 text-white rounded-xl hover:bg-black transition-all active:scale-95 shadow-lg group/ref"
                    >
                       <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
                    </button>
                </div>
            </div>

            {/* Filter Ribbons */}
            <div className="flex flex-wrap gap-4 bg-white/50 backdrop-blur-3xl p-4 rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-3 bg-white px-6 py-2.5 rounded-xl border border-slate-200 flex-1 group hover:border-amber-200 transition-all shadow-sm">
                    <Filter className="text-slate-300 group-hover:text-amber-600 transition-colors" size={14} />
                    <select 
                        value={actionFilter} 
                        onChange={(e) => setActionFilter(e.target.value)}
                        className="bg-transparent font-bold text-[11px] uppercase tracking-widest text-slate-700 outline-none w-full"
                    >
                        <option value="">MATRIX: ALL ACTIONS</option>
                        <option value="LOGIN">LOGIN_ATTEMPT</option>
                        <option value="UPDATE_SETTING">SYSTEM_CONFIGURE</option>
                        <option value="USER_BLOCK">ENTITY_SUSPENSION</option>
                        <option value="DECLARE_RESULT">OUTCOME_FORCING</option>
                    </select>
                </div>
                <div className="hidden lg:flex items-center gap-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-l border-slate-200">
                    <Database size={14} />
                    TRACE_COUNT: {filteredLogs.length} EVENTS
                </div>
            </div>

            <Table 
                columns={columns} 
                data={filteredLogs} 
                loading={loading}
                noDataMessage="No internal audit traces detected in the current node synchronization"
            />

            {/* Security Warning Footnote */}
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group/footer shadow-xl shadow-amber-900/5">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none transform -rotate-12 group-hover/footer:rotate-0 transition-transform duration-1000">
                    <ShieldCheck size={180} className="text-amber-900" />
                 </div>
                 
                 <div className="p-4 bg-white rounded-xl border border-amber-200 text-amber-600 shadow-xl group-hover/footer:scale-110 transition-transform">
                     <ShieldAlert size={28} strokeWidth={2.5} />
                 </div>
                 
                 <div className="space-y-1.5 flex-1 text-center md:text-left">
                    <h4 className="text-lg font-bold text-amber-900 uppercase tracking-tight">Auditor Visibility Alert</h4>
                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest leading-relaxed">
                       Every root action is timestamped and cryptographically linked to the performing node. Unauthorised modulation is reported to the central registry.
                    </p>
                 </div>
                 
                 <div className="flex gap-4">
                    <button className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all hover:-translate-y-1 shadow-lg shadow-slate-900/20 active:scale-95">
                        Export Audit Sequence
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default AdminLogs;
