import React, { useState, useEffect } from 'react';
import { 
    TrendingUp, TrendingDown, Users, Wallet, 
    Target, LayoutGrid, RefreshCw, Trophy, Bell,
    ArrowUpRight, ArrowDownRight, Activity, Calendar
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar,
    LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import Loader from '../components/UI/Loader';
import api from '../services/api';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, icon: Icon, color, trend, type }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-2.5 rounded-lg bg-${color}-50 text-${color}-600 border border-${color}-100`}>
                <Icon size={20} strokeWidth={2.5} />
            </div>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {trend.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {trend}
            </div>
        </div>
        <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <div className="text-2xl font-bold text-slate-800 tracking-tight flex items-baseline gap-1">
                {type === 'currency' && <span className="text-slate-400 text-lg">₹</span>}
                {parseFloat(value || 0).toLocaleString()}
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('24h');

    useEffect(() => {
        fetchStats();
    }, [timeframe]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/dashboard?timeframe=${timeframe}`);
            setStats(response.data.data);
        } catch (err) {
            toast.error('Forensic matrix synchronization error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-[80vh] flex items-center justify-center"><Loader size={48} text="Syncing Admin Hub Data..." /></div>;
    if (!stats) return null;

    const mainStats = [
        { label: 'Total Balance', value: stats.totalWalletBalance, icon: Wallet, color: 'indigo', trend: '+12.4%', type: 'currency' },
        { label: 'Registered Users', value: stats.totalUsers, icon: Users, color: 'emerald', trend: '+5.2%', type: 'number' },
        { label: 'Active Bets', value: stats.totalBets, icon: Target, color: 'rose', trend: '+18.1%', type: 'number' },
        { label: 'Net Profit', value: (stats.totalAmount || 0) - (stats.totalPayout || 0), icon: Trophy, color: 'amber', trend: '+4.2%', type: 'currency' }
    ];

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500 pb-20 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-8 relative group">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest">
                       <Activity size={14} className="text-indigo-500" />
                       Real-time Network Statistics
                    </div>
                </div>

                <div className="flex gap-2">
                   <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex items-center gap-1 shadow-sm">
                       {['24h', '7d', '30d'].map(t => (
                           <button
                               key={t}
                               onClick={() => setTimeframe(t)}
                               className={`px-4 py-1.5 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-all ${
                                   timeframe === t 
                                   ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                                   : 'text-slate-500 hover:text-slate-700'
                               }`}
                           >
                               {t}
                           </button>
                       ))}
                   </div>
                   <button 
                      onClick={fetchStats}
                      className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest px-4"
                   >
                      <RefreshCw size={14} /> Refresh
                   </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainStats.map((stat, i) => <StatCard key={i} {...stat} />)}
            </div>

            {/* Deposit Stats Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    <Activity size={12} className="text-emerald-500" />
                    Fintech Matrix: Deposit Insights
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12">
                            <TrendingUp size={80} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Today's Total Intake</p>
                        <h4 className="text-2xl font-black text-slate-800 tracking-tight flex items-baseline gap-1">
                            <span className="text-emerald-500 text-lg">₹</span>
                            {parseFloat(stats.depositStats?.today || 0).toLocaleString()}
                        </h4>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Real-time approved settlement</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12">
                            <Calendar size={80} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Cumulative</p>
                        <h4 className="text-2xl font-black text-slate-800 tracking-tight flex items-baseline gap-1">
                            <span className="text-indigo-500 text-lg">₹</span>
                            {parseFloat(stats.depositStats?.month || 0).toLocaleString()}
                        </h4>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">Consolidated 30-day inflow</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative border-l-4 border-l-amber-500">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12">
                            <Activity size={80} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Overall Network Intake</p>
                        <h4 className="text-2xl font-black text-slate-800 tracking-tight flex items-baseline gap-1">
                            <span className="text-amber-500 text-lg">₹</span>
                            {parseFloat(stats.depositStats?.total || 0).toLocaleString()}
                        </h4>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Lifetime approved matrix</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                           <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-baseline gap-2 leading-none mb-1">Revenue Performance</h3>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Growth Trajectory</p>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                           Live Hub Sync
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.dailyStats || []}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} 
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#fff', 
                                        borderRadius: '12px', 
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                        padding: '12px 16px'
                                    }}
                                    itemStyle={{ color: '#1e293b', fontSize: '12px', fontWeight: 700 }}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 1.5 }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#6366f1" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorRevenue)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Games Panel */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col p-8 overflow-hidden group">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-1 leading-none">Market Leaders</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High Stakes Execution</p>
                        </div>
                        <div className="p-2 bg-slate-900 text-white rounded-lg">
                            <Target size={16} />
                        </div>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                        {stats.topGames?.map((game, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-300 group/item">
                               <div className="flex flex-col">
                                   <span className="text-[11px] font-bold text-slate-800 uppercase tracking-tight group-hover/item:text-indigo-600">{game.name}</span>
                                   <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2">
                                       <Calendar size={10} /> {game.totalBets} Bets
                                   </span>
                               </div>
                               <div className="text-sm font-bold text-slate-700 flex items-baseline gap-0.5">
                                   <span className="text-[10px] text-slate-400">₹</span>
                                   {parseFloat(game.totalAmount).toLocaleString()}
                               </div>
                           </div>
                        ))}
                        {(!stats.topGames || stats.topGames.length === 0) && (
                            <div className="h-full flex flex-col items-center justify-center opacity-40 text-center space-y-4">
                                <Activity size={32} />
                                <p className="text-[10px] font-bold uppercase tracking-widest">No Active Sessions</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Inflow/Outflow Balance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                     <div className="flex items-center gap-4 mb-2">
                         <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 shadow-sm">
                             <TrendingUp size={18} strokeWidth={2.5} />
                         </div>
                         <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Growth Distribution</h3>
                     </div>
                     <p className="text-[10px] font-bold text-slate-400 mb-8 uppercase tracking-widest">Consolidated Network Inflow</p>
                     
                     <div className="space-y-6">
                        {[
                            { label: 'Bank Deposits', val: stats.totalDeposits, color: 'emerald', progress: 85 },
                            { label: 'Network Revenue', val: stats.totalAmount, color: 'indigo', progress: 72 }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-2.5">
                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                                    <span>{stat.label}</span>
                                    <span className="text-slate-900 font-bold">₹{parseFloat(stat.val || 0).toLocaleString()}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
                                    <div className={`h-full bg-${stat.color}-500 rounded-full transition-all duration-1000`} style={{ width: `${stat.progress}%` }}></div>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                     <div className="flex items-center gap-4 mb-2">
                         <div className="p-2 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 shadow-sm">
                             <TrendingDown size={18} strokeWidth={2.5} />
                         </div>
                         <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Network Outflow</h3>
                     </div>
                     <p className="text-[10px] font-bold text-slate-400 mb-8 uppercase tracking-widest">Financial Disbursement Analytics</p>
                     
                     <div className="space-y-6">
                        {[
                            { label: 'Network Withdrawals', val: stats.totalWithdrawals, color: 'rose', progress: 45 },
                            { label: 'Win Settlements', val: stats.totalPayout, color: 'amber', progress: 58 }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-2.5">
                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                                    <span>{stat.label}</span>
                                    <span className="text-slate-900 font-bold">₹{parseFloat(stat.val || 0).toLocaleString()}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
                                    <div className={`h-full bg-${stat.color}-500 rounded-full transition-all duration-1000`} style={{ width: `${stat.progress}%` }}></div>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
