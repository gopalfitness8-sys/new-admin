import React, { useState, useEffect, useCallback } from 'react';
import { 
    Search, Filter, Smartphone, History, RefreshCw, 
    ShieldCheck, ArrowRight, ShieldAlert, Database
} from 'lucide-react';
import walletService from '../../services/wallet.service';
import Table from '../../components/UI/Table';
import Badge from '../../components/UI/Badge';
import Loader from '../../components/UI/Loader';
import toast from 'react-hot-toast';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const data = await walletService.getTransactions({ type: typeFilter });
            setTransactions(data);
        } catch (err) {
            toast.error('Financial ledger synchronization failure');
        } finally {
            setLoading(false);
        }
    }, [typeFilter]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const columns = [
        { 
            header: 'Target Node', 
            accessor: 'User',
            render: (row) => (
                <div className="flex items-center gap-3 py-1 group">
                    <div className="w-9 h-9 bg-slate-100 border border-slate-200 text-indigo-500 rounded-lg transition-all group-hover:scale-110 shadow-sm flex items-center justify-center">
                        <Smartphone size={16} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-800 font-bold uppercase tracking-tight text-[11px] group-hover:text-indigo-600 transition-colors">{row.User?.name || 'UNKNOWN NODE'}</span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1 px-2 py-0.5 rounded bg-slate-50 border border-slate-100 w-fit leading-none">{row.User?.phone || 'N/A'}</span>
                    </div>
                </div>
            )
        },
        { 
            header: 'Vector Category', 
            accessor: 'type',
            render: (row) => (
                <Badge variant={['winning', 'deposit', 'manual_add', 'refund'].includes(row.type) ? 'success' : 'danger'} className="uppercase tracking-[0.2em] text-[9px] font-bold px-3 py-1 rounded-md border border-white/50 shadow-sm">
                    {row.type.replace(/_/g, ' ')}
                </Badge>
            )
        },
        { 
            header: 'Quanta (₹)', 
            accessor: 'amount',
            render: (row) => (
                <div className={`text-sm font-bold tracking-tight flex items-baseline gap-1 leading-none ${['winning', 'deposit', 'manual_add', 'refund'].includes(row.type) ? 'text-emerald-500' : 'text-rose-500'}`}>
                    <span className="text-[11px] font-bold opacity-60">₹</span>
                    {parseFloat(row.amount).toLocaleString()}
                </div>
            )
        },
        { 
            header: 'Balance Shift', 
            render: (row) => (
                <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 shadow-inner group hover:bg-white hover:border-indigo-100 transition-all w-fit">
                    <span className="text-[10px] font-bold text-slate-400">₹{parseFloat(row.balanceBefore).toLocaleString()}</span>
                    <ArrowRight size={10} className="text-slate-300 group-hover:text-indigo-400" />
                    <span className="text-[11px] font-bold text-slate-900 font-mono">₹{parseFloat(row.balanceAfter).toLocaleString()}</span>
                </div>
            )
        },
        { 
            header: 'Epoch', 
            accessor: 'createdAt',
            render: (row) => (
                <div className="flex flex-col">
                   <span className="text-slate-800 font-bold tracking-tight text-[11px] uppercase leading-none">{new Date(row.createdAt).toLocaleDateString('en-GB')}</span>
                   <span className="text-[9px] font-bold text-slate-400 tracking-widest mt-1.5 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 w-fit">{new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            )
        },
        { 
            header: 'Payload Data', 
            accessor: 'note',
            render: (row) => <div className="max-w-[150px] truncate text-[9px] font-bold uppercase text-slate-400 tracking-widest bg-slate-50 px-2.5 py-1 rounded border border-slate-100">{row.note || 'ROOT_SYNC'}</div> 
        }
    ];

    const filteredTransactions = transactions.filter(t => 
        t.User?.name?.toLowerCase().includes(search.toLowerCase()) || 
        t.User?.phone?.toLowerCase().includes(search.toLowerCase()) ||
        t.note?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20">
            {/* Financial Ops Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 group">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Audit</h1>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest">
                       <History size={14} className="text-indigo-500" />
                       Consolidated Transaction Ledger & Integrity Archives
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group/search">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-indigo-500 transition-colors" size={16} />
                       <input 
                           type="text"
                           placeholder="SCAN NODE PHONE / IDENTITY..."
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           className="w-full pl-12 pr-6 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-xs tracking-widest shadow-sm uppercase shadow-sm"
                       />
                    </div>
                    <button 
                       onClick={() => { setSearch(''); fetchTransactions(); }}
                       className="p-3 bg-slate-900 text-white rounded-xl hover:bg-black transition-all active:scale-95 shadow-lg group/ref"
                    >
                       <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
                    </button>
                </div>
            </div>

            {/* Filter Ribbons */}
            <div className="flex flex-wrap gap-4 bg-white/50 backdrop-blur-3xl p-4 rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-3 bg-white px-6 py-2.5 rounded-xl border border-slate-200 flex-1 group hover:border-indigo-200 transition-all shadow-sm">
                    <Filter className="text-slate-300 group-hover:text-indigo-600 transition-colors" size={14} />
                    <select 
                        value={typeFilter} 
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="bg-transparent font-bold text-[11px] uppercase tracking-widest text-slate-700 outline-none w-full"
                    >
                        <option value="">MATRIX: ALL TRANSACTIONS</option>
                        <option value="deposit">NETWORK DEPOSIT</option>
                        <option value="withdraw">NETWORK WITHDRAWAL</option>
                        <option value="bet">PLAY VECTORS (STAKE)</option>
                        <option value="winning">PLAY VECTORS (WIN)</option>
                        <option value="refund">SYSTEM REFUNDS</option>
                        <option value="manual_add">ROOT CREDIT INJECTION</option>
                        <option value="manual_deduct">ROOT CREDIT PURGE</option>
                    </select>
                </div>
                <div className="hidden lg:flex items-center gap-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-l border-slate-200">
                    <Database size={14} />
                    LEDGER_COUNT: {filteredTransactions.length} OPS
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center">
                    <Loader size={32} text="RECONSTRUCTING_LEDGER..." />
                </div>
            ) : (
                <Table 
                    columns={columns} 
                    data={filteredTransactions} 
                    noDataMessage="No financial archival vectors detected in the current ledger synchronization"
                />
            )}

            {/* Verification Alert */}
            <div className="bg-slate-900 p-8 rounded-2xl text-white flex flex-col md:flex-row items-center gap-8 border border-slate-800 relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <ShieldCheck size={180} />
                 </div>
                 
                 <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20 shadow-xl group-hover:scale-110 transition-transform">
                     <ShieldAlert size={28} strokeWidth={2.5} />
                 </div>
                 
                 <div className="space-y-2 flex-1 text-center md:text-left">
                    <h4 className="text-lg font-bold text-white uppercase tracking-tight">Auditor Pulse Log</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                       This ledger is a synchronized, immutable record of all capital shifts within the network. Any vector discrepancies should be reported to root authority immediately.
                    </p>
                 </div>
                 
                 <div className="flex gap-4">
                    <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all hover:-translate-y-1 shadow-lg shadow-indigo-100">
                        Export Audit (CSV)
                    </button>
                    <button className="px-6 py-2.5 bg-white/5 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10">
                        Print Ledger
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default Transactions;
