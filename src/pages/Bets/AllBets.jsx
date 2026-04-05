import React, { useState, useEffect } from 'react';
import { 
    Search, Filter, RefreshCw, Smartphone, History, 
    ArrowUpRight, ArrowDownRight, User, Settings,
    Trash2, Ban, CheckCircle2, MoreVertical, LayoutGrid,
    Target, Activity, Database, Globe, Zap, X
} from 'lucide-react';
import betService from '../../services/bet.service';
import Table from '../../components/UI/Table';
import Badge from '../../components/UI/Badge';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import Loader from '../../components/UI/Loader';
import toast from 'react-hot-toast';

const AllBets = () => {
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [cancelId, setCancelId] = useState(null);

    useEffect(() => {
        fetchBets();
    }, [statusFilter]);

    const fetchBets = async () => {
        try {
            setLoading(true);
            const data = await betService.getAllBets({ status: statusFilter });
            setBets(data);
        } catch (err) {
            toast.error('Matrix bet reconstruction failure');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        try {
            await betService.cancelBet(cancelId);
            toast.success('Bet termination executed successfully');
            setCancelId(null);
            fetchBets();
        } catch (err) { toast.error(err.message || 'Termination aborted'); }
    };

    const columns = [
        { 
            header: 'Target Node', 
            accessor: 'User',
            render: (row) => (
                <div className="flex items-center gap-3 py-1 group">
                    <div className="w-9 h-9 bg-slate-900 border border-slate-700 text-indigo-400 rounded-lg transition-all group-hover:rotate-12 duration-500 shadow-lg">
                        <Smartphone size={16} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-800 font-bold uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{row.User?.name || 'UNKNOWN NODE'}</span>
                        <div className="flex items-center gap-2 mt-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 w-fit">
                           <Smartphone size={10} className="text-slate-400" />
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{row.User?.phone || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            )
        },
        { 
            header: 'Market Vector', 
            accessor: 'Game',
            render: (row) => (
                <div className="flex flex-col group py-1">
                    <span className="text-slate-800 font-bold uppercase tracking-tight text-[11px] leading-tight group-hover:text-indigo-600 transition-colors">{row.Game?.name || 'GENERIC MARKET'}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 w-fit">{row.betType} / {row.betPhase}</span>
                </div>
            )
        },
        { 
            header: 'Selection Matrix', 
            accessor: 'number',
            render: (row) => (
                <div className="flex flex-col items-center justify-center p-2.5 bg-indigo-50 border border-indigo-100/50 rounded-xl min-w-[80px] shadow-sm group hover:scale-105 transition-transform duration-500">
                    <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-indigo-400 mb-0.5 leading-none px-2 py-0.5 rounded-full bg-white border border-indigo-100">ID</span>
                    <span className="font-bold text-base tracking-tighter text-indigo-700 font-mono">#{row.number}</span>
                </div>
            )
        },
        { 
            header: 'Stake Quanta', 
            accessor: 'amount',
            render: (row) => (
                <div className="flex flex-col p-1 leading-none">
                    <div className="text-base font-bold text-slate-900 tracking-tight flex items-baseline gap-1">
                        <span className="text-slate-400 text-[10px] font-bold">₹</span>
                        {parseFloat(row.amount).toLocaleString()}
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 w-fit">RISKED</span>
                </div>
            )
        },
        { 
            header: 'Outcome State', 
            accessor: 'status',
            render: (row) => (
                <div className="flex flex-col gap-1.5">
                    <Badge variant={row.status === 'won' ? 'success' : row.status === 'lost' ? 'danger' : row.status === 'cancelled' ? 'default' : 'warning'} className="uppercase font-bold text-[9px] tracking-widest px-3 py-1.5 rounded-md border border-white/50 shadow-sm">
                        {row.status}
                    </Badge>
                </div>
            )
        },
        { 
            header: 'Acquisition', 
            accessor: 'winAmount',
            render: (row) => (
                <div className="flex flex-col p-1 leading-none">
                    <div className={`text-base font-bold tracking-tight flex items-baseline gap-1 ${parseFloat(row.winAmount) > 0 ? 'text-emerald-500' : 'text-slate-300'}`}>
                        {parseFloat(row.winAmount) > 0 ? '+' : ''} ₹{parseFloat(row.winAmount).toLocaleString()}
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 w-fit">PAYOUT</span>
                </div>
            )
        },
        {
            header: 'Vectors',
            className: 'text-right',
            render: (row) => (
                <div className="flex justify-end gap-3 pr-2">
                    {row.status === 'pending' && (
                        <button 
                            onClick={() => setCancelId(row.id)}
                            className="p-2.5 bg-rose-50 text-rose-500 rounded-lg border border-rose-100 hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-xl hover:shadow-rose-100 transition-all active:scale-95 group/can shadow-sm"
                            title="Abort Bet"
                        >
                            <X size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                        </button>
                    )}
                </div>
            )
        }
    ];

    const filteredBets = bets.filter(b => 
        b.User?.name?.toLowerCase().includes(search.toLowerCase()) || 
        b.User?.phone?.toLowerCase().includes(search.toLowerCase()) ||
        b.Game?.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.number?.includes(search)
    );

    return (
        <div className="p-8 space-y-8 animate-in slide-in-from-bottom duration-500 pb-20 w-full">
            {/* Bet Operations Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 group">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Active Bets Grid</h1>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest">
                       <Target size={14} className="text-indigo-500" />
                       Real-time Vector Monitoring Hub
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
                       onClick={() => { setSearch(''); fetchBets(); }}
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
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-transparent font-bold text-[11px] uppercase tracking-widest text-slate-700 outline-none w-full"
                    >
                        <option value="">GRID: ALL OUTCOMES</option>
                        <option value="pending">VECTOR: PENDING CLEARANCE</option>
                        <option value="won">VECTOR: WINNING NODES</option>
                        <option value="lost">VECTOR: TERMINATED LOSS</option>
                        <option value="cancelled">VECTOR: ABORTED REFUND</option>
                    </select>
                </div>
                <div className="hidden lg:flex items-center gap-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-l border-slate-200">
                    <Database size={14} />
                    SYNCED_COUNT: {filteredBets.length} VECTORS
                </div>
            </div>

            <Table 
                columns={columns} 
                data={filteredBets} 
                loading={loading}
                noDataMessage="No operational play vectors detected in current sector synchronization"
            />

            {/* Termination Protocol */}
            <ConfirmDialog 
                isOpen={!!cancelId}
                onClose={() => setCancelId(null)}
                onConfirm={handleCancel}
                type="danger"
                title="Abort Protocol"
                message="Terminate target bet vector?"
                description="This will instantly extinguish the target bet and perform an automated capital refund to the source node wallet."
                confirmText="Execute Termination"
                cancelText="Abort"
            />
        </div>
    );
};

export default AllBets;
