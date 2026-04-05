import React, { useState, useEffect, useCallback } from 'react';
import { 
    Search, Filter, RefreshCw, Smartphone, 
    User, Settings,
    Ban, CheckCircle2, LayoutGrid,
    Activity, Database
} from 'lucide-react';
import userService from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';
import Table from '../../components/UI/Table';
import Badge from '../../components/UI/Badge';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import Loader from '../../components/UI/Loader';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const { isSuperAdmin } = useAuth();
    const navigate = useNavigate();

    // Action states
    const [blockId, setBlockId] = useState(null);
    const [unblockId, setUnblockId] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await userService.getAllUsers({ role: roleFilter, isActive: statusFilter });
            setUsers(data);
        } catch (err) {
            toast.error(err.message || 'Network user synchronization failure');
        } finally {
            setLoading(false);
        }
    }, [roleFilter, statusFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleBlock = async () => {
        try {
            await userService.updateUserStatus(blockId, false);
            toast.success('Matrix node disabled successfully');
            setBlockId(null);
            fetchUsers();
        } catch (err) { toast.error(err.message || 'Status modulation failure'); }
    };

    const handleUnblock = async () => {
        try {
            await userService.updateUserStatus(unblockId, true);
            toast.success('Matrix node re-synchronized');
            setUnblockId(null);
            fetchUsers();
        } catch (err) { toast.error(err.message || 'Status modulation failure'); }
    };

    const columns = [
        { 
            header: 'Network Identity', 
            accessor: 'name',
            render: (row) => (
                <div className="flex items-center gap-3 py-1 group cursor-pointer" onClick={() => navigate(`/users/${row.id}`)}>
                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 border border-slate-200 shadow-sm transition-all group-hover:scale-110">
                        <User size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-800 font-bold uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{row.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                           <Smartphone size={10} className="text-slate-400 font-black" />
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.phone}</span>
                        </div>
                    </div>
                </div>
            )
        },
        { 
            header: 'Role State', 
            accessor: 'role',
            render: (row) => (
                <Badge variant={row.role === 'admin' ? 'danger' : 'primary'} className="uppercase font-bold text-[9px] tracking-widest px-3 py-1 rounded-md border border-white/50 shadow-sm">
                    {row.role}
                </Badge>
            )
        },
        { 
            header: 'Node Balance', 
            accessor: 'walletBalance',
            render: (row) => (
                <div className="font-bold text-slate-800 flex items-baseline gap-0.5">
                    <span className="text-slate-400 text-[11px]">₹</span>
                    {parseFloat(row.walletBalance).toLocaleString()}
                </div>
            )
        },
        { 
            header: 'Status', 
            accessor: 'isActive',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${row.isActive ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}></div>
                    <Badge variant={row.isActive ? 'success' : 'danger'} className="uppercase font-bold text-[9px] tracking-widest border border-white/50 px-3 py-1 rounded-md">
                        {row.isActive ? 'OPERATIONAL' : 'SUSPENDED'}
                    </Badge>
                </div>
            )
        },
        { 
            header: 'Epoch Created', 
            accessor: 'createdAt',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{new Date(row.createdAt).toLocaleDateString('en-GB')}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">NODE_#{row.id}</span>
                </div>
            )
        },
        {
            header: 'Linkage',
            className: 'text-right',
            render: (row) => (
                <div className="flex justify-end gap-2 pr-2">
                    <button 
                         onClick={() => navigate(`/users/${row.id}`)}
                         className="p-2 bg-slate-50 text-slate-500 rounded-lg border border-slate-200 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 transition-all active:scale-90 shadow-sm group/edit"
                    >
                         <Settings size={14} className="group-hover:rotate-45 transition-transform" />
                    </button>
                    {isSuperAdmin && (
                        row.isActive ? (
                            <button 
                                onClick={() => setBlockId(row.id)}
                                className="p-2 bg-rose-50 text-rose-500 rounded-lg border border-rose-100 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all active:scale-95 group/block shadow-sm"
                            >
                                <Ban size={14} className="group-hover:scale-110 transition-transform" />
                            </button>
                        ) : (
                            <button 
                                onClick={() => setUnblockId(row.id)}
                                className="p-2 bg-emerald-50 text-emerald-500 rounded-lg border border-emerald-100 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all active:scale-95 group/sync shadow-sm"
                            >
                                <CheckCircle2 size={14} className="group-hover:scale-110 transition-transform" />
                            </button>
                        )
                    )}
                </div>
            )
        }
    ];

    const filteredUsers = (users || []).filter(u => 
        u.role !== 'admin' && 
        !u.name?.toLowerCase().includes('super admin') && (
            (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
            (u.phone || '').toLowerCase().includes(search.toLowerCase())
        )
    );

    return (
        <div className="p-8 space-y-8 animate-in slide-in-from-bottom duration-500 pb-20 w-full">
            {/* Admin Hub Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 group">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Node Directory</h1>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest">
                       <LayoutGrid size={14} className="text-indigo-500" />
                       Synchronized Active Participant Units
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
                           className="w-full pl-12 pr-6 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-xs tracking-widest shadow-sm uppercase"
                       />
                    </div>
                    <button 
                       onClick={() => { setSearch(''); fetchUsers(); }}
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
                        value={roleFilter} 
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="bg-transparent font-bold text-[11px] uppercase tracking-widest text-slate-700 outline-none w-full"
                    >
                        <option value="">MATRIX: ALL ROLES</option>
                        <option value="user">PARTICIPANT NODES</option>
                        <option value="admin">AUTHORITY NODES</option>
                        <option value="subadmin">SUB-ENFORCER NODES</option>
                    </select>
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-2.5 rounded-xl border border-slate-200 flex-1 group hover:border-indigo-200 transition-all shadow-sm">
                    <Activity className="text-slate-300 group-hover:text-indigo-600 transition-colors" size={14} />
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-transparent font-bold text-[11px] uppercase tracking-widest text-slate-700 outline-none w-full"
                    >
                        <option value="">NODE: ALL STATES</option>
                        <option value="true">OPERATIONAL</option>
                        <option value="false">SUSPENDED</option>
                    </select>
                </div>
                <div className="hidden lg:flex items-center gap-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-l border-slate-200">
                    <Database size={14} />
                    HUB_SYNC: {filteredUsers.length} UNITS
                </div>
            </div>

            <div className="h-full">
            {loading ? (
                <div className="py-20 flex justify-center">
                    <Loader size={32} text="SYNCING_GRID..." />
                </div>
            ) : (
                <Table 
                    columns={columns} 
                    data={filteredUsers} 
                    noDataMessage="No connected nodes detected in the target sector synchronization"
                />
            )}
            </div>

            {/* Operational Modals */}
            <ConfirmDialog 
                isOpen={!!blockId}
                onClose={() => setBlockId(null)}
                onConfirm={handleBlock}
                type="danger"
                title="Status Modulation"
                message="Confirm node suspension?"
                description="This will immediately restrict matrix access for this node identifier. System state will remain archived."
                confirmText="Execute Suspension"
                cancelText="Abort"
            />
            <ConfirmDialog 
                isOpen={!!unblockId}
                onClose={() => setUnblockId(null)}
                onConfirm={handleUnblock}
                type="success"
                title="Status Modulation"
                message="Confirm node re-sync?"
                description="This will restore full operational capacity and matrix access for this node identifier."
                confirmText="Execute Re-Sync"
                cancelText="Abort"
            />
        </div>
    );
};

export default UsersList;
