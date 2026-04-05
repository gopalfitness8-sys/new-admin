import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Clock, ShieldCheck, Settings2, Activity, Trash2, Target, Calendar, Zap, RefreshCw } from 'lucide-react';
import gameService from '../../services/game.service';
import toast from 'react-hot-toast';
import Loader from '../../components/UI/Loader';

const EditGame = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        openTime: '',
        openBetCloseTime: '',
        closeBetOpenTime: '',
        closeTime: '',
        minBet: 0,
        maxBet: 0,
        allowedBetTypes: [],
        activeDays: [],
        isActive: true,
        sortOrder: 0
    });

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const game = await gameService.getGameById(id);
                if (game) {
                    setFormData({
                        ...game,
                        openTime: game.openTime ? game.openTime.slice(0, 5) : '',
                        openBetCloseTime: game.openBetCloseTime ? game.openBetCloseTime.slice(0, 5) : '',
                        closeBetOpenTime: game.closeBetOpenTime ? game.closeBetOpenTime.slice(0, 5) : '',
                        closeTime: game.closeTime ? game.closeTime.slice(0, 5) : '',
                        minBet: parseFloat(game.minBet),
                        maxBet: parseFloat(game.maxBet)
                    });
                } else {
                    toast.error('Market not found in repository');
                    navigate('/games');
                }
            } catch (err) {
                toast.error('Failed to reconstruct market data');
            } finally {
                setLoading(false);
            }
        };
        fetchGame();
    }, [id, navigate]);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const betTypes = [
        { id: 'single', label: 'Single' },
        { id: 'jodi', label: 'Jodi' },
        { id: 'single_panna', label: 'Single Panna' },
        { id: 'double_panna', label: 'Double Panna' },
        { id: 'triple_panna', label: 'Triple Panna' },
        { id: 'half_sangam', label: 'Half Sangam' },
        { id: 'full_sangam', label: 'Full Sangam' }
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCheckboxChange = (name, value) => {
        setFormData(prev => {
            const current = [...prev[name]];
            if (current.includes(value)) {
                return { ...prev, [name]: current.filter(item => item !== value) };
            } else {
                return { ...prev, [name]: [...current, value] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Final Validation check
        if (!formData.name) return toast.error('Market name node is empty');
        if (!formData.openTime || !formData.closeTime) return toast.error('Time matrix is incomplete');

        try {
            setSaving(true);
            await gameService.updateGame(id, formData);
            toast.success('Market successfully re-configured');
            navigate('/games');
        } catch (err) {
            toast.error(err.message || 'Configuration failure');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="h-[80vh] flex items-center justify-center"><Loader size={48} text="RECONSTRUCTING ENGINE..." /></div>;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20">
            {/* Market Architect Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 group">
                <div className="flex items-center gap-6">
                    <button 
                       onClick={() => navigate('/games')}
                       className="p-3 bg-slate-900 text-white rounded-xl hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200 group/back flex items-center justify-center shrink-0"
                    >
                       <ArrowLeft size={20} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase leading-none">Modify Market</h1>
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest">
                           <Settings2 size={14} className="text-indigo-500" />
                           Re-calibrating Engine: {formData.name}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-100 disabled:opacity-50"
                    >
                        {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} strokeWidth={3} />}
                        Sync Re-Config
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Core Config */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="admin-card p-10 group/core">
                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
                           <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl border border-slate-200 shadow-sm group-hover/core:scale-110 transition-transform">
                              <Target size={18} strokeWidth={2.5} />
                           </div>
                           <h2 className="text-sm font-bold text-slate-800 tracking-widest uppercase mb-0.5 leading-none">Base Parameters</h2>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">Market Title</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="admin-input py-4 text-lg font-bold tracking-tight uppercase"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">Stake Boundary (Min)</label>
                                    <div className="relative group/input">
                                       <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-lg group-focus-within/input:text-indigo-600 transition-colors">₹</span>
                                       <input
                                            type="number"
                                            name="minBet"
                                            value={formData.minBet}
                                            onChange={handleInputChange}
                                            className="admin-input pl-12 pr-6 py-4 font-bold text-lg tracking-tight"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">Stake Boundary (Max)</label>
                                    <div className="relative group/input">
                                       <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-lg group-focus-within/input:text-indigo-600 transition-colors">₹</span>
                                       <input
                                            type="number"
                                            name="maxBet"
                                            value={formData.maxBet}
                                            onChange={handleInputChange}
                                            className="admin-input pl-12 pr-6 py-4 font-bold text-lg tracking-tight"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1E1E2D] p-10 rounded-2xl border border-slate-800 shadow-2xl shadow-indigo-200/20 text-white relative overflow-hidden group/time border-b-4 border-indigo-500">
                        <div className="absolute bottom-0 right-0 p-12 opacity-[0.05] pointer-events-none group-hover/time:-translate-y-4 transition-transform duration-1000">
                           <Clock size={160} />
                        </div>
                        
                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-800">
                           <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 shadow-lg group-hover/time:scale-110 transition-transform">
                              <Activity size={18} strokeWidth={2.5} />
                           </div>
                           <h2 className="text-sm font-bold text-white tracking-widest uppercase mb-0.5 leading-none">Chrono Matrix</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
                            {[
                                { label: 'Market Open Time', name: 'openTime' },
                                { label: 'Open Bet Deadline', name: 'openBetCloseTime' },
                                { label: 'Close Bet Start', name: 'closeBetOpenTime' },
                                { label: 'Market Close Time', name: 'closeTime' }
                            ].map((field) => (
                                <div key={field.name} className="space-y-4 group/field">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1 group-hover/field:text-indigo-400 transition-colors">{field.label}</label>
                                    <div className="relative">
                                       <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/field:text-indigo-400 transition-colors" size={20} />
                                       <input
                                            type="time"
                                            name={field.name}
                                            required
                                            value={formData[field.name]}
                                            onChange={handleInputChange}
                                            onClick={(e) => { try { e.target.showPicker(); } catch(err) {} }}
                                            className="w-full pl-16 pr-8 py-4 bg-slate-800/40 border-2 border-slate-700/50 rounded-2xl font-bold text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-slate-800 transition-all text-xl tracking-wider cursor-pointer"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Rail */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="admin-card p-8 group/days">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                           <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 shadow-sm group-hover/days:scale-110 transition-transform">
                              <Calendar size={16} strokeWidth={2.5} />
                           </div>
                           <h2 className="text-[11px] font-bold text-slate-800 tracking-widest uppercase leading-none">Active Cycle</h2>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                           {days.map(day => (
                               <button
                                   key={day}
                                   type="button"
                                   disabled={saving}
                                   onClick={() => handleCheckboxChange('activeDays', day)}
                                   className={`px-2 py-3 rounded-lg font-bold text-[9px] uppercase tracking-widest transition-all border shadow-sm ${
                                       formData.activeDays.includes(day)
                                       ? 'bg-emerald-600 text-white border-emerald-600 scale-105 z-10'
                                       : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'
                                   }`}
                               >
                                   {day}
                               </button>
                           ))}
                        </div>
                    </div>

                    <div className="admin-card p-8 group/types">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                           <div className="p-2 bg-amber-50 text-amber-500 rounded-lg border border-amber-100 shadow-sm group-hover/types:scale-110 transition-transform">
                              <Zap size={16} strokeWidth={2.5} />
                           </div>
                           <h2 className="text-[11px] font-bold text-slate-800 tracking-widest uppercase leading-none">Market Engines</h2>
                        </div>
                        
                        <div className="space-y-2">
                           {betTypes.map(type => (
                               <button
                                   key={type.id}
                                   type="button"
                                   disabled={saving}
                                   onClick={() => handleCheckboxChange('allowedBetTypes', type.id)}
                                   className={`w-full px-5 py-3 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all border flex items-center justify-between group/bet shadow-sm ${
                                       formData.allowedBetTypes.includes(type.id)
                                       ? 'bg-slate-900 text-white border-slate-900'
                                       : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300 shadow-inner'
                                   }`}
                               >
                                   <div className="flex items-center gap-3">
                                       <div className={`w-2 h-2 rounded-full ${formData.allowedBetTypes.includes(type.id) ? 'bg-amber-400' : 'bg-slate-300'}`}></div>
                                       {type.label}
                                   </div>
                                   {formData.allowedBetTypes.includes(type.id) && <ShieldCheck size={12} strokeWidth={3} className="text-amber-400" />}
                               </button>
                           ))}
                        </div>
                    </div>

                    <div className="admin-card p-6 flex flex-col gap-6 bg-slate-50">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none text-slate-500">Live Status</span>
                                <span className="text-xs font-bold text-slate-800 tracking-tight leading-none uppercase">Operational State</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange} 
                                />
                                <div className="w-12 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:after:translate-x-6 shadow-inner group-hover:scale-110 duration-300"></div>
                            </label>
                        </div>
                        
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-loose text-center">
                                RE-CALIBRATING THIS ENGINE WILL MODIFY PAYOUT CYCLES AND DEADLINES IMMEDIATELY.
                             </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditGame;
