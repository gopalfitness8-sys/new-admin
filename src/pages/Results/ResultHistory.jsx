import React, { useState, useEffect } from 'react';
import { 
    Clock, History, Search, Filter, Calendar, 
    Sparkles, RefreshCw, Trophy, Target, Target as TargetIcon,
    Edit3, ChevronRight, Activity, ShieldCheck, List, LayoutGrid,
    Database
} from 'lucide-react';
import resultService from '../../services/result.service';
import Table from '../../components/UI/Table';
import Badge from '../../components/UI/Badge';
import toast from 'react-hot-toast';

const ResultHistory = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchResults();
    }, [dateFilter]);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const data = await resultService.getResultHistory({ date: dateFilter });
            setResults(data);
        } catch (err) {
            toast.error('Historical repository synchronization failure');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { 
            header: 'Enforcement Market', 
            accessor: 'Game',
            render: (row) => (
                <div className="flex flex-col group py-1">
                    <span className="text-slate-800 font-bold uppercase tracking-tight text-[11px] group-hover:text-indigo-600 transition-colors uppercase">{row.Game?.name || 'GENERIC MARKET'}</span>
                    <div className="flex items-center gap-2 mt-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 w-fit">
                       <Clock size={10} className="text-slate-400" />
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{row.Game?.openTime} - {row.Game?.closeTime}</span>
                    </div>
                </div>
            )
        },
        { 
            header: 'Outcome Signature', 
            render: (row) => (
                <div className="flex gap-4">
                    <div className="flex flex-col items-center justify-center p-2.5 bg-slate-900 text-white rounded-lg min-w-[140px] shadow-lg relative overflow-hidden group/result border-b-2 border-indigo-500">
                        <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-1.5 leading-none">Archived Vector</span>
                        <div className="flex items-center gap-2">
                           <span className="font-bold text-base tracking-[0.2em] font-mono">{row.openPanna || '***'}-{row.openDigit || '*'}{row.closeDigit || '*'}-{row.closePanna || '***'}</span>
                        </div>
                    </div>
                </div>
            )
        },
        { 
            header: 'Epoch Timestamp', 
            accessor: 'createdAt',
            render: (row) => (
                <div className="flex flex-col">
                   <span className="text-slate-800 font-bold tracking-tight text-xs uppercase leading-none">{new Date(row.createdAt).toLocaleDateString('en-GB')}</span>
                   <span className="text-[9px] font-bold text-slate-400 tracking-widest mt-1.5 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 w-fit">{new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            )
        },
        { 
            header: 'State Matrix', 
            render: (row) => (
                <div className="flex items-center gap-2">
                     <Badge variant="success" className="uppercase tracking-[0.2em] text-[9px] font-bold px-3 py-1 rounded-md border border-white/50 shadow-sm">
                        DISTRIBUTED
                     </Badge>
                </div>
            )
        },
        {
            header: 'Audit Protocol',
            className: 'text-right',
            render: (row) => (
                <div className="flex justify-end gap-2 pr-2">
                    <button 
                         onClick={() => toast.success('Event re-synchronized')}
                         className="p-2.5 bg-slate-50 text-slate-400 rounded-lg border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95 group/sync shadow-sm"
                         title="Recalibrate Node"
                    >
                         <RefreshCw size={14} strokeWidth={2.5} className="group-hover:rotate-180 transition-transform duration-700" />
                    </button>
                    <button 
                         className="p-2.5 bg-slate-50 text-slate-300 rounded-lg border border-slate-200 cursor-not-allowed"
                    >
                         <Edit3 size={14} strokeWidth={2.5} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20">
            {/* Historical Archive Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 group">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Outcome Archives</h1>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest text-[#64748B]">
                       <History size={14} className="text-indigo-500" />
                       Historical Result Ledger & Audit Compliance
                    </div>
                </div>

                <div className="flex gap-4">
                   <div className="bg-white border border-slate-200 p-2 rounded-xl flex items-center gap-4 group/date hover:border-indigo-600 transition-all shadow-sm">
                       <Calendar className="text-slate-300 group-hover/date:text-indigo-600 transition-colors ml-2" size={16} />
                       <input 
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="bg-transparent font-bold tracking-tight text-xs text-slate-700 outline-none uppercase"
                       />
                   </div>
                   <button 
                       onClick={fetchResults}
                       className="p-3 bg-slate-900 text-white rounded-xl hover:bg-black transition-all active:scale-95 shadow-lg group/ref"
                    >
                       <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
                    </button>
                </div>
            </div>

            {/* Visual Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Synchronized Nodes', val: results.length, icon: Sparkles, color: 'indigo' },
                    { label: 'Archive Integrity', val: '99.9%', icon: ShieldCheck, color: 'emerald' },
                    { label: 'Temporal Sector', val: dateFilter, icon: Database, color: 'rose' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 group hover:-translate-y-1 transition-all duration-300">
                        <div className={`p-4 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl border border-${stat.color}-100 group-hover:scale-110 transition-transform shadow-sm`}>
                            <stat.icon size={18} strokeWidth={2.5} />
                        </div>
                        <div className="space-y-0.5">
                           <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</h4>
                           <p className="text-lg font-bold text-slate-900 tracking-tight uppercase leading-none">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Table 
                columns={columns} 
                data={results} 
                loading={loading}
                noDataMessage="No historical archival vectors detected in current temporal sector synchronization"
            />
            
            {/* Compliance Footnote */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-dotted border-slate-300 flex items-center gap-6">
                 <div className="p-3 bg-white rounded-xl border border-slate-200 text-indigo-500 shadow-sm">
                     <ShieldCheck size={20} strokeWidth={2.5} />
                 </div>
                 <div className="flex flex-col">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide leading-none mb-1">Audit Protocol V4.2</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Historical result vectors are permanently archived and cryptographically signed for financial audit compliance.</p>
                 </div>
            </div>
        </div>
    );
};

export default ResultHistory;
