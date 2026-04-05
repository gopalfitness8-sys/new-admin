import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    ShieldCheck, 
    ShieldAlert, 
    Plus, 
    Minus, 
    Phone, 
    RefreshCw, 
    Database,
    Trophy,
    CreditCard
} from 'lucide-react';
import userService from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';
import Table from '../../components/UI/Table';
import Badge from '../../components/UI/Badge';
import Loader from '../../components/UI/Loader';
import Modal from '../../components/UI/Modal';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import toast from 'react-hot-toast';

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isSuperAdmin } = useAuth();
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bets, setBets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    
    // Wallet States
    const [walletModal, setWalletModal] = useState(false);
    const [walletAction, setWalletAction] = useState('add'); // add/deduct
    const [walletAmount, setWalletAmount] = useState('');
    const [walletNote, setWalletNote] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    // Status states
    const [confirmAction, setConfirmAction] = useState(null);

    const fetchUserData = useCallback(async () => {
        try {
            setLoading(true);
            const [userData, betLogs, transLogs] = await Promise.all([
                userService.getUserById(id),
                userService.getUserBets(id),
                userService.getUserTransactions(id)
            ]);
            setUser(userData);
            setBets(betLogs);
            setTransactions(transLogs);
        } catch (err) {
            toast.error('Identity node isolation failed');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleWalletUpdate = async () => {
        if (!walletAmount || isNaN(walletAmount)) return toast.error('Valid numeric quanta required');
        try {
            setSubmitting(true);
            if (walletAction === 'add') {
                await userService.manualAddWallet(id, walletAmount, walletNote);
                toast.success('Capital injection completed');
            } else {
                await userService.manualDeductWallet(id, walletAmount, walletNote);
                toast.success('Capital purge completed');
            }
            setWalletModal(false);
            setWalletAmount('');
            setWalletNote('');
            fetchUserData();
        } catch (err) {
            toast.error(err.message || 'Operation aborted by root override');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            await userService.updateUserStatus(id, user.isActive ? false : true);
            toast.success('Identity state reconfirmed');
            setConfirmAction(null);
            fetchUserData();
        } catch (err) { toast.error(err.message || 'Node status abort'); }
    };

    if (loading) return <div className="h-[80vh] flex items-center justify-center"><Loader size={48} text="Isolating Node Data..." /></div>;
    if (!user) return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest">Node not found in local grid</div>;

    const betColumns = [
        { 
            header: 'Market Vector', 
            accessor: 'Game', 
            render: row => (
                <div className="flex flex-col py-1">
                    <span className="text-slate-800 font-bold uppercase text-[11px] leading-tight uppercase">{row.Game?.name}</span>
                    <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase mt-1 px-2 py-0.5 rounded bg-slate-50 border border-slate-100 w-fit">#{row.number} • {row.betType}</span>
                </div>
            )
        },
        { header: 'Stake', accessor: 'amount', render: row => <span className="font-bold text-slate-800 text-sm">₹{parseFloat(row.amount).toLocaleString()}</span> },
        { 
            header: 'Outcome', 
            accessor: 'status',
            render: row => (
                <Badge variant={row.status === 'won' ? 'success' : row.status === 'lost' ? 'danger' : 'warning'} className="uppercase font-bold text-[9px] tracking-widest px-3 py-1 rounded-md border border-white/50 shadow-sm">
                    {row.status}
                </Badge>
            )
        },
        { header: 'P&L Output', accessor: 'winAmount', render: row => <span className={`font-bold tracking-tight text-sm ${parseFloat(row.winAmount) > 0 ? 'text-emerald-500' : 'text-slate-300'}`}>₹{parseFloat(row.winAmount).toLocaleString()}</span> }
    ];

    const transColumns = [
        { header: 'Vector Category', accessor: 'type', render: row => <Badge variant={['winning', 'deposit', 'manual_add', 'refund'].includes(row.type) ? 'success' : 'danger'} className="uppercase font-bold text-[9px] tracking-widest border border-white/50 px-3 py-1 rounded-md">{row.type.replace(/_/g, ' ')}</Badge> },
        { header: 'Quanta (₹)', accessor: 'amount', render: row => <span className="font-bold text-slate-800 text-sm">₹{parseFloat(row.amount).toLocaleString()}</span> },
        { header: 'Epoch', accessor: 'createdAt', render: row => <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{new Date(row.createdAt).toLocaleDateString()}</span> },
        { header: 'Data Payload', accessor: 'note', render: row => <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[120px] block bg-slate-50 px-2 py-1 rounded border border-slate-100">{row.note || 'NO_DATA'}</span> }
    ];

    return (
        <div className="p-8 pb-32 space-y-8 animate-in slide-in-from-bottom duration-500 max-w-6xl mx-auto">
            {/* Header / Identity Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 group">
                <div className="flex items-center gap-6">
                    <button 
                       onClick={() => navigate('/users')}
                       className="p-3 bg-slate-900 text-white rounded-xl hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200 group/back flex items-center justify-center shrink-0"
                    >
                       <ArrowLeft size={20} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase leading-none">{user.name}</h1>
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest">
                           <Phone size={14} className="text-indigo-500" />
                           Network Port: {user.phone}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    {isSuperAdmin && (
                        <button 
                            onClick={() => setConfirmAction(true)}
                            className={`px-6 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all hover:-translate-y-1 active:scale-95 shadow-sm border ${
                                !user.isActive 
                                ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700 shadow-emerald-100' 
                                : 'bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-600 hover:text-white hover:border-rose-600 shadow-rose-50'
                            }`}
                        >
                            {!user.isActive ? <ShieldCheck size={16} strokeWidth={3} /> : <ShieldAlert size={16} strokeWidth={3} />}
                            {!user.isActive ? 'RESTORE NODE' : 'PURGE NODE'}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Profile Snapshot */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="admin-card p-8 flex flex-col items-center">
                        <div className="w-32 h-32 rounded-2xl bg-slate-900 border-4 border-white text-indigo-400 flex items-center justify-center shadow-xl mb-6 relative overflow-hidden group/avatar">
                            <img src={`https://ui-avatars.com/api/?name=${user.name}&background=1e293b&color=fff&size=200&bold=true`} alt="user" className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110" />
                        </div>
                        <div className="text-center space-y-1 mb-8">
                            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">{user.name}</h2>
                            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center justify-center gap-2">
                               <Database size={12} className="text-indigo-500" /> VEC_ID: {user.id}
                            </p>
                        </div>

                        <div className="w-full bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-900/10 border-b-4 border-indigo-500 mb-6">
                            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-2 block leading-none">Global Wallet Balance</span>
                            <div className="flex items-baseline gap-1 text-white text-3xl font-black tracking-tighter">
                                <span className="text-slate-500 text-lg">₹</span>
                                {parseFloat(user.walletBalance).toLocaleString()}
                            </div>
                            <div className="mt-8 flex gap-3">
                               <button 
                                  onClick={() => { setWalletAction('add'); setWalletModal(true); }}
                                  className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 hover:-translate-y-1 transition-all active:scale-95 shadow-sm"
                               >
                                  <Plus size={14} strokeWidth={3} /> INJECT
                                </button>
                               <button 
                                  onClick={() => { setWalletAction('deduct'); setWalletModal(true); }}
                                  className="flex-1 bg-white/10 text-white py-3 rounded-xl font-bold uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 hover:-translate-y-1 transition-all border border-white/10 active:scale-95 hover:bg-white/20"
                               >
                                  <Minus size={14} strokeWidth={3} /> PURGE
                                </button>
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Node Init</span>
                                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Last Pulse</span>
                                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">ACTIVE</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Tabs */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="admin-card overflow-hidden group/bets">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                           <div className="flex items-center gap-3">
                              <Trophy className="text-indigo-500" size={20} />
                              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Active Play Vectors</h3>
                           </div>
                           <Badge variant="primary" className="font-bold text-[9px] uppercase tracking-widest px-3 py-1 border border-white/50">{bets.length} NODES</Badge>
                        </div>
                        <Table 
                            columns={betColumns} 
                            data={bets} 
                            noDataMessage="No betting vectors detected in trace history"
                        />
                    </div>

                    <div className="admin-card overflow-hidden group/trans">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                           <div className="flex items-center gap-3">
                              <CreditCard className="text-emerald-500" size={20} />
                              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Financial Trace Ledger</h3>
                           </div>
                           <Badge variant="success" className="font-bold text-[9px] uppercase tracking-widest px-3 py-1 border border-white/50">{transactions.length} OPS</Badge>
                        </div>
                        <Table 
                            columns={transColumns} 
                            data={transactions} 
                            noDataMessage="No financial traces detected in the specified temporal window"
                        />
                    </div>
                </div>
            </div>

            {/* Wallet Modulation Modal */}
            <Modal
                isOpen={walletModal}
                onClose={() => setWalletModal(false)}
                title="Capital Management Protocol"
                size="sm"
            >
                <div className="p-8 space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">Injection Quanta (₹)</label>
                        <div className="relative">
                            <input 
                               type="number"
                               value={walletAmount}
                               onChange={(e) => setWalletAmount(e.target.value)}
                               placeholder="0.00"
                               className="w-full p-6 bg-slate-50 border border-slate-200 rounded-xl font-bold text-2xl text-slate-900 text-center focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner"
                            />
                            <div className={`absolute left-6 top-1/2 -translate-y-1/2 font-bold text-2xl ${walletAction === 'add' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {walletAction === 'add' ? '+' : '-'}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">Audit Payload Ref</label>
                        <textarea 
                            value={walletNote}
                            onChange={(e) => setWalletNote(e.target.value)}
                            placeholder="REASON FOR MANUAL MODULATION..."
                            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner min-h-[100px] uppercase text-[10px] tracking-widest"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button 
                           onClick={() => setWalletModal(false)}
                           className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all hover:bg-slate-200"
                        >
                           ABORT
                        </button>
                        <button 
                           onClick={handleWalletUpdate}
                           disabled={submitting || !walletAmount}
                           className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 shadow-lg ${
                                walletAction === 'add' ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100' : 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-100'
                           }`}
                        >
                            {submitting ? <RefreshCw className="animate-spin" size={14} /> : <ShieldCheck size={14} strokeWidth={3} />}
                           SYNCHRONIZE {walletAction.toUpperCase()}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Status Modal */}
            <ConfirmDialog
                isOpen={!!confirmAction}
                onClose={() => setConfirmAction(null)}
                onConfirm={handleStatusUpdate}
                type={!user.isActive ? 'success' : 'danger'}
                title="STATE MODULATION"
                message={`${!user.isActive ? 'RESTORE' : 'SUSPEND'} TARGET NODE?`}
                description="This protocol will re-write the node's permission state on the global grid. Confirm root clearance."
                confirmText={`PROCEED ${!user.isActive ? 'RESTORE' : 'SUSPEND'}`}
                cancelText="ABORT"
            />
        </div>
    );
};

export default UserDetail;
