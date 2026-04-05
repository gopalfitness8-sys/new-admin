import React, { useState, useEffect, useCallback } from 'react';
import { 
    Search, Filter, RefreshCw, Wallet, Smartphone, 
    Clock, ArrowRight, ShieldCheck, CheckCircle2,
    XCircle, MoreVertical, Database
} from 'lucide-react';
import walletService from '../../services/wallet.service';
import Table from '../../components/UI/Table';
import Badge from '../../components/UI/Badge';
import Modal from '../../components/UI/Modal';
import toast from 'react-hot-toast';

const Withdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending');
    
    // Action states
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchWithdrawals = useCallback(async () => {
        try {
            setLoading(true);
            const data = await walletService.getWithdrawalRequests({ status: statusFilter });
            setWithdrawals(data);
        } catch (err) {
            toast.error('Financial sector synchronization failure');
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchWithdrawals();
    }, [fetchWithdrawals]);

    const handleAction = async (status) => {
        try {
            setSubmitting(true);
            await walletService.updateWithdrawalStatus(selectedRequest.id, status);
            toast.success(`Point-to-point transmission ${status} finalized`);
            setSelectedRequest(null);
            fetchWithdrawals();
        } catch (err) {
            toast.error(err.message || 'Signal transmission aborted');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        { 
            header: 'Target Node', 
            accessor: 'User',
            render: (row) => (
                <div className="flex items-center gap-3 py-1 group">
                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 border border-slate-200 shadow-sm transition-all group-hover:scale-110">
                        <Smartphone size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-800 font-bold uppercase tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{row.User?.name || 'N/A'}</span>
                        <div className="flex items-center gap-2 mt-1">
                           <Smartphone size={10} className="text-slate-400 font-black" />
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{row.User?.phone || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            )
        },
        { 
            header: 'Quanta (₹)', 
            accessor: 'amount',
            render: (row) => (
                <div className="font-bold text-slate-900 text-base flex items-baseline gap-0.5">
                    <span className="text-slate-400 text-[11px]">₹</span>
                    {parseFloat(row.amount).toLocaleString()}
                </div>
            )
        },
        { 
            header: 'Credentials', 
            render: (row) => (
                <div className="flex flex-col p-1">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-tighter mb-1 leading-none uppercase">
                        {row.method === 'upi' ? `UPI: ${row.upiId}` : `${row.bankName} - ${row.accountNo}`}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.accountHolderName}</span>
                        {row.ifscCode && (
                            <span className="text-[10px] bg-slate-100 px-1 rounded text-slate-500 font-black">{row.ifscCode}</span>
                        )}
                    </div>
                </div>
            )
        },
        { 
            header: 'Epoch', 
            accessor: 'createdAt',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700 tracking-tight">{new Date(row.createdAt).toLocaleDateString('en-GB')}</span>
                    <div className="flex items-center gap-2 mt-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 w-fit">
                       <Clock size={10} className="text-slate-400" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            )
        },
        { 
            header: 'Status', 
            accessor: 'status',
            render: (row) => (
                <Badge variant={row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'danger' : 'warning'} className="uppercase font-bold text-[9px] tracking-widest border border-white/50 px-3 py-1 rounded-md">
                    {row.status}
                </Badge>
            )
        },
        {
            header: 'Control',
            className: 'text-right',
            render: (row) => (
                <div className="flex justify-end gap-3 pr-2">
                    {row.status === 'pending' ? (
                        <button 
                             onClick={() => setSelectedRequest(row)}
                             className="p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all active:scale-90 shadow-lg shadow-indigo-100 group/edit"
                        >
                             <CheckCircle2 size={16} strokeWidth={2.5} />
                        </button>
                    ) : (
                        <button className="p-2.5 bg-slate-50 text-slate-300 rounded-lg border border-slate-200 cursor-not-allowed">
                             <MoreVertical size={16} />
                        </button>
                    )}
                </div>
            )
        }
    ];

    const filteredRequests = withdrawals.filter(w => 
        w.User?.name?.toLowerCase().includes(search.toLowerCase()) || 
        w.User?.phone?.toLowerCase().includes(search.toLowerCase()) ||
        w.accountHolder?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20">
            {/* Financial Ops Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 group">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Vault</h1>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest">
                       <Wallet size={14} className="text-indigo-500" />
                       Active Withdrawal Vector Synchronization
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
                       onClick={() => { setSearch(''); fetchWithdrawals(); }}
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
                        className="bg-transparent font-bold text-[11px] uppercase tracking-widest text-slate-700 outline-none w-full uppercase"
                    >
                        <option value="pending">VECTOR: PENDING CLEARANCE</option>
                        <option value="approved">VECTOR: PROCESSED</option>
                        <option value="rejected">VECTOR: DENIED</option>
                        <option value="all">VECTOR: COMPLETE GRID</option>
                    </select>
                </div>
                <div className="hidden lg:flex items-center gap-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-l border-slate-200">
                    <Database size={14} />
                    VAULT_COUNT: {filteredRequests.length} VECTORS
                </div>
            </div>

            <Table 
                columns={columns} 
                data={filteredRequests} 
                loading={loading}
                noDataMessage="No financial archival vectors detected in the immediate sector synchronization"
            />

            {/* Verification Modal */}
            <Modal 
                isOpen={!!selectedRequest} 
                onClose={() => setSelectedRequest(null)}
                title="Financial Node Clearance"
                size="md"
            >
                <div className="p-8 space-y-8">
                    <div className="flex flex-col items-center text-center gap-5">
                       <div className="p-5 bg-indigo-50 text-indigo-600 rounded-2xl border-2 border-indigo-100 shadow-xl shadow-indigo-50 transform -rotate-3">
                          <Wallet size={48} strokeWidth={2.5} />
                       </div>
                       <div className="space-y-1">
                          <h3 className="text-2xl font-bold text-slate-800 tracking-tight uppercase leading-none">Execute Clearance</h3>
                          <div className="flex items-center gap-3 justify-center text-[11px] font-bold text-slate-400 tracking-widest uppercase">
                             POINT-TO-POINT DISBURSEMENT
                          </div>
                       </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-2xl shadow-xl shadow-indigo-900/10 border-b-4 border-indigo-500 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                           <ShieldCheck size={120} className="text-white" />
                       </div>
                       <div className="space-y-6 relative z-10">
                          <div className="flex justify-between items-center text-white pb-4 border-b border-white/10 uppercase">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Node Target</span>
                             <span className="text-base font-bold uppercase tracking-tight">{selectedRequest?.User?.name}</span>
                          </div>
                          <div className="flex justify-between items-center text-white pb-4 border-b border-white/10 uppercase">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Wallet Decoupling</span>
                             <span className="text-2xl font-black tracking-tighter text-indigo-400 flex items-baseline gap-1">
                                <span className="text-sm">₹</span>
                                {parseFloat(selectedRequest?.amount || 0).toLocaleString()}
                             </span>
                          </div>
                          <div className="flex flex-col gap-2 pt-2 uppercase">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Protocol Matrix</span>
                             <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <p className="text-xs font-bold text-white uppercase tracking-tight mb-2 flex items-center gap-2">
                                   <ArrowRight size={14} className="text-indigo-400" />
                                   {selectedRequest?.upiId ? `UPI: ${selectedRequest.upiId}` : `${selectedRequest?.bankName || 'Bank'}: ${selectedRequest?.accountNo}`}
                                </p>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{selectedRequest?.accountHolderName} {selectedRequest?.ifscCode ? `/ ${selectedRequest.ifscCode}` : ''}</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-4">
                        <button 
                           onClick={() => handleAction('rejected')}
                           disabled={submitting}
                           className="flex-1 py-4 bg-rose-50 text-rose-600 rounded-xl font-bold uppercase tracking-widest text-[11px] border border-rose-100 hover:bg-rose-100 transition-all flex items-center justify-center gap-3"
                        >
                           <XCircle size={16} strokeWidth={3} />
                           ABORT VEC
                        </button>
                        <button 
                           onClick={() => handleAction('approved')}
                           disabled={submitting}
                           className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                           {submitting ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle2 size={16} strokeWidth={3} />}
                           SYNCHRONIZE
                        </button>
                    </div>
                    
                    <div className="bg-[#FFF9F9] p-4 rounded-xl border border-[#FFECEC] text-center">
                        <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest leading-loose uppercase">
                           CAUTION: VERIFYING PROTOCOL EXECUTES IMMEDIATELY & IRREVERSIBLY.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Withdrawals;
