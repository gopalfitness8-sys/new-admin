import React, { useState, useEffect } from 'react';
import { 
    Plus, Search, Filter, RefreshCw, Smartphone, 
    History, Clock, ArrowRight, ShieldCheck, CheckCircle2,
    XCircle, AlertTriangle, MoreVertical, LayoutGrid,
    Target, Activity, Database, Globe, Edit3, Trash2, Ban
} from 'lucide-react';
import gameService from '../../services/game.service';
import { useAuth } from '../../context/AuthContext';
import Table from '../../components/UI/Table';
import Badge from '../../components/UI/Badge';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import Loader from '../../components/UI/Loader';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const GamesList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const { isSuperAdmin } = useAuth();

    // Action states
    const [deleteId, setDeleteId] = useState(null);
    const [statusId, setStatusId] = useState(null);

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            setLoading(true);
            const data = await gameService.getAllGames({ admin: true });
            setGames(data);
        } catch (err) {
            toast.error('Market repository synchronization failure');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await gameService.deleteGame(deleteId);
            toast.success('Market successfully purged from GRID');
            setDeleteId(null);
            fetchGames();
        } catch (err) { toast.error(err.message || 'Purge failure: Sector remains active'); }
    };

    const handleToggleStatus = async () => {
        try {
            const game = games.find(g => g.id === statusId);
            await gameService.updateGame(statusId, { isActive: !game.isActive });
            toast.success('Operational state modulated');
            setStatusId(null);
            fetchGames();
        } catch (err) { toast.error(err.message || 'Modulation failure'); }
    };

    const columns = [
        { 
            header: 'Market Vector', 
            accessor: 'name',
            render: (row) => (
                <div className="flex items-center gap-3 py-1 group">
                    <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-indigo-400 border border-slate-700 shadow-xl shadow-slate-900/10 transition-all group-hover:scale-110">
                        <Target size={18} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-800 font-bold uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{row.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                           <Database size={10} className="text-slate-400 font-black" />
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">VEC_#{row.id}</span>
                        </div>
                    </div>
                </div>
            )
        },
        { 
            header: 'Declaration matrix', 
            render: (row) => (
                <div className="flex flex-col gap-2 p-1">
                    <div className="flex items-center gap-2">
                       <div className="p-1 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100 shadow-sm">
                          <Clock size={10} strokeWidth={3} />
                       </div>
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{row.openTime} (OPEN)</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="p-1 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100 shadow-sm">
                          <Clock size={10} strokeWidth={3} />
                       </div>
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{row.closeTime} (CLOSE)</span>
                    </div>
                </div>
            )
        },
        { 
            header: 'Internal status', 
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${row.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                    <Badge variant={row.isActive ? 'success' : 'default'} className="uppercase font-bold text-[9px] tracking-widest px-3 py-1.5 rounded-md border border-white/50 shadow-sm">
                        {row.isActive ? 'OPERATIONAL' : 'DORMANT'}
                    </Badge>
                </div>
            )
        },
        { 
            header: 'Bet bounds (₹)', 
            render: (row) => (
                <div className="flex flex-col p-1">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-tight flex items-baseline gap-1">
                       <span className="text-slate-400 font-bold">Min:</span> ₹{parseFloat(row.minBet).toLocaleString()}
                    </span>
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-tight flex items-baseline gap-1 mt-1">
                       <span className="text-slate-400 font-bold">Max:</span> ₹{parseFloat(row.maxBet).toLocaleString()}
                    </span>
                </div>
            )
        },
        {
            header: 'Control Panel',
            className: 'text-right',
            render: (row) => (
                <div className="flex justify-end gap-3 pr-2">
                    <button 
                         onClick={() => navigate(`/games/edit/${row.id}`)}
                         className="p-2.5 bg-slate-50 text-slate-500 rounded-lg border border-slate-200 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 transition-all active:scale-90 shadow-sm group/edit"
                    >
                         <Edit3 size={16} strokeWidth={2.5} />
                    </button>
                    <button 
                         onClick={() => setStatusId(row.id)}
                         className={`p-2.5 rounded-lg border transition-all active:scale-95 shadow-lg group/status ${
                            row.isActive 
                            ? 'bg-rose-50 text-rose-500 border-rose-100 hover:bg-rose-600 hover:text-white hover:border-rose-600' 
                            : 'bg-emerald-50 text-emerald-500 border-emerald-100 hover:bg-emerald-600 hover:text-white hover:border-emerald-100'
                         }`}
                    >
                         {row.isActive ? <Ban size={16} strokeWidth={2.5} /> : <CheckCircle2 size={16} strokeWidth={2.5} />}
                    </button>
                    {isSuperAdmin && (
                        <button 
                             onClick={() => setDeleteId(row.id)}
                             className="p-2.5 bg-slate-900 text-white rounded-lg hover:bg-black transition-all active:scale-95 shadow-xl group/del"
                        >
                             <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                    )}
                </div>
            )
        }
    ];

    const filteredGames = (games || []).filter(g => (g.name || '').toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-8 space-y-8 animate-in slide-in-from-bottom duration-500 pb-20 w-full">
            {/* Market Control Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 group">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Market Architecture</h1>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest">
                       <Target size={14} className="text-indigo-500" />
                       Consolidated Gaming Market Vector Control
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group/search">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-indigo-500 transition-colors" size={16} />
                       <input 
                           type="text"
                           placeholder="SCAN MARKET SECTORS..."
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           className="w-full pl-12 pr-6 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-sm tracking-widest shadow-sm uppercase shadow-sm"
                       />
                    </div>
                    <button 
                       onClick={() => navigate('/games/create')}
                       className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 px-6 font-bold text-xs uppercase tracking-widest shadow-indigo-100"
                    >
                       <Plus size={16} strokeWidth={3} />
                       Deploy Market
                    </button>
                </div>
            </div>

            {/* Grid Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Markets', val: games.length, icon: Globe, color: 'indigo' },
                    { label: 'Active Sectors', val: games.filter(g => g.isActive).length, icon: Activity, color: 'emerald' },
                    { label: 'Market Stability', val: '99.9%', icon: ShieldCheck, color: 'amber' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 group hover:-translate-y-1 transition-all duration-300">
                        <div className={`p-4 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl border border-${stat.color}-100 group-hover:scale-110 transition-transform`}>
                            <stat.icon size={22} strokeWidth={2.5} />
                        </div>
                        <div className="space-y-0.5">
                           <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</h4>
                           <p className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Table 
                columns={columns} 
                data={filteredGames} 
                loading={loading}
                noDataMessage="No operational market vectors detected in current GRID scan"
            />

            {/* Operational Protocols */}
            <ConfirmDialog 
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                type="danger"
                title="Market Purge"
                message="Purge this market vector?"
                description="This action is IRREVERSIBLE. All historical nodes and linkage associated with this market will be decoupled from the GRID immediately."
                confirmText="Execute Purge"
                cancelText="Abort"
            />
            <ConfirmDialog 
                isOpen={!!statusId}
                onClose={() => setStatusId(null)}
                onConfirm={handleToggleStatus}
                type="warning"
                title="Status Modulation"
                message="Modulate operational state?"
                description="This will instantly toggle the market visibility and bet intake for all participants on the network layer."
                confirmText="Execute Sync"
                cancelText="Abort"
            />
        </div>
    );
};

export default GamesList;
