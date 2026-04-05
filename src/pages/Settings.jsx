import React, { useState, useEffect } from 'react';
import { 
    Settings, Save, ShieldCheck, Activity, Sparkles,
    RefreshCw, Banknote, ShieldAlert, Phone,
    Terminal, Zap, Star
} from 'lucide-react';
import Loader from '../components/UI/Loader';
import toast from 'react-hot-toast';
import api from '../services/api';

const GlobalSettings = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/settings');
            const data = response.data.data;
            
            const mandatoryKeys = [
                'single_digit_val1', 'single_digit_val2',
                'jodi_digit_val1', 'jodi_digit_val2',
                'single_panna_val1', 'single_panna_val2',
                'double_panna_val1', 'double_panna_val2',
                'triple_panna_val1', 'triple_panna_val2',
                'half_sangam_val1', 'half_sangam_val2',
                'full_sangam_val1', 'full_sangam_val2',
                'left_digit_val1', 'left_digit_val2',
                'right_digit_val1', 'right_digit_val2',
                'starline_single_digit_val1', 'starline_single_digit_val2',
                'starline_single_panna_val1', 'starline_single_panna_val2',
                'starline_double_panna_val1', 'starline_double_panna_val2',
                'starline_triple_panna_val1', 'starline_triple_panna_val2',
                'min_deposit', 'max_deposit', 'min_withdrawal', 'max_withdrawal', 'commission_percent',
                'maintenance_mode', 'marquee_text', 'admin_upi_id', 'contact_phone', 'whatsapp_phone'
            ];

            const finalSettings = mandatoryKeys.map(key => {
                const existing = data.find(s => s.key === key);
                return existing || { key, value: '' };
            });

            setSettings(finalSettings);
        } catch (err) {
            toast.error('Failed to load system matrix');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const updates = settings.map(s => ({ key: s.key, value: String(s.value) }));
            await api.put('/admin/settings', updates);
            toast.success('Matrix parameters re-synchronized');
            fetchSettings();
        } catch (err) {
            toast.error('Synchronization failure');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (key, value) => {
        setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
    };

    const renderPriceGroup = (label, keyV1, keyV2) => {
        const val1 = settings.find(s => s.key === keyV1);
        const val2 = settings.find(s => s.key === keyV2);
        if (!val1 || !val2) return null;

        return (
            <div className="bg-white p-4 rounded-3xl border-2 border-slate-100 shadow-sm flex flex-col gap-3 group/group hover:border-indigo-300 transition-all duration-300">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none">{label}</span>
                    <div className="bg-amber-100 p-1.5 rounded-lg border border-amber-200">
                        <Zap size={12} className="text-amber-600 font-bold" />
                    </div>
                </div>
                <div className="flex items-center gap-2 px-1">
                    <div className="flex-1 space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Base</label>
                        <input 
                            type="number"
                            value={val1.value}
                            onChange={(e) => handleInputChange(keyV1, e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-200 px-1 py-3 rounded-2xl font-black text-slate-900 text-lg text-center focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-inner"
                            placeholder="0"
                        />
                    </div>
                    
                    <div className="pt-4 px-1">
                        <span className="text-slate-300 font-black text-lg">/</span>
                    </div>

                    <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block ml-1">Win</label>
                        <input 
                            type="number"
                            value={val2.value}
                            onChange={(e) => handleInputChange(keyV2, e.target.value)}
                            className="w-full bg-indigo-50/50 border-2 border-indigo-100 px-1 py-3 rounded-2xl font-black text-indigo-700 text-lg text-center focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-inner"
                            placeholder="0"
                        />
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="h-[80vh] flex items-center justify-center"><Loader size={48} text="CALIBRATING GRID..." /></div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 group">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">Game Engine Control</h1>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                       <Settings size={14} className="text-indigo-500" />
                       Precision Market Calibration & Thresholds
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button 
                        onClick={handleUpdate}
                        disabled={saving}
                        className="w-full md:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl flex items-center justify-center gap-3 transition-all hover:bg-black active:scale-95 disabled:opacity-50 shadow-xl shadow-slate-200 font-bold uppercase text-[10px] tracking-widest border border-slate-800"
                    >
                        {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} strokeWidth={3} />}
                        Deploy Configuration
                    </button>
                </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-10">
                {/* Standard Payouts */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                            <Sparkles size={18} />
                        </div>
                        <h2 className="text-sm font-black text-slate-800 tracking-widest uppercase mb-0.5">Standard Markets</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {renderPriceGroup('Single Digit', 'single_digit_val1', 'single_digit_val2')}
                        {renderPriceGroup('Jodi Digit', 'jodi_digit_val1', 'jodi_digit_val2')}
                        {renderPriceGroup('Single Pana', 'single_panna_val1', 'single_panna_val2')}
                        {renderPriceGroup('Double Pana', 'double_panna_val1', 'double_panna_val2')}
                        {renderPriceGroup('Triple Pana', 'triple_panna_val1', 'triple_panna_val2')}
                        {renderPriceGroup('Half Sangam', 'half_sangam_val1', 'half_sangam_val2')}
                        {renderPriceGroup('Full Sangam', 'full_sangam_val1', 'full_sangam_val2')}
                        {renderPriceGroup('Left Digit', 'left_digit_val1', 'left_digit_val2')}
                        {renderPriceGroup('Right Digit', 'right_digit_val1', 'right_digit_val2')}
                    </div>
                </div>

                {/* Starline Payouts */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                            <Star size={18} />
                        </div>
                        <h2 className="text-sm font-black text-slate-800 tracking-widest uppercase mb-0.5">Starline Markets</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {renderPriceGroup('Starline Single', 'starline_single_digit_val1', 'starline_single_digit_val2')}
                        {renderPriceGroup('Starline Single Pana', 'starline_single_panna_val1', 'starline_single_panna_val2')}
                        {renderPriceGroup('Starline Double Pana', 'starline_double_panna_val1', 'starline_double_panna_val2')}
                        {renderPriceGroup('Starline Triple Pana', 'starline_triple_panna_val1', 'starline_triple_panna_val2')}
                    </div>
                </div>

                {/* Other Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                    {/* Financial Limits */}
                    <div className="admin-card p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2 underline decoration-emerald-500/30 decoration-4 underline-offset-4">
                            <Banknote size={20} className="text-emerald-500" />
                            <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Financial Thresholds</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {['min_deposit', 'max_deposit', 'min_withdrawal', 'max_withdrawal', 'commission_percent'].map(key => {
                                const s = settings.find(x => x.key === key);
                                return (
                                    <div key={key} className="space-y-2">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{key.replace(/_/g,' ')}</label>
                                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-emerald-400 transition-all">
                                            <input 
                                                type="number"
                                                value={s?.value || ''}
                                                onChange={(e) => handleInputChange(key, e.target.value)}
                                                className="flex-1 bg-transparent px-4 py-2.5 font-bold text-xs"
                                            />
                                            <div className="bg-slate-100 px-3 py-2.5 border-l border-slate-200">
                                                <span className="text-[10px] font-black text-slate-400">{key === 'commission_percent' ? '%' : '₹'}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Operational Control */}
                    <div className="admin-card p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2 underline decoration-rose-500/30 decoration-4 underline-offset-4">
                            <Activity size={20} className="text-rose-500" />
                            <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Operational Matrix</h3>
                        </div>
                        
                        {/* Maintenance Toggle */}
                        {(() => {
                            const s = settings.find(x => x.key === 'maintenance_mode');
                            return (
                                <div className="space-y-3">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">System Status</label>
                                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <span className={`text-[10px] font-black uppercase ${s?.value === 'true' ? 'text-rose-600' : 'text-emerald-600'}`}>
                                            {s?.value === 'true' ? 'MAINTENANCE_ACTIVE' : 'LIVE_PRODUCTION'}
                                        </span>
                                        <label className="relative inline-flex items-center cursor-pointer scale-110">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={s?.value === 'true'}
                                                onChange={(e) => handleInputChange('maintenance_mode', e.target.checked ? 'true' : 'false')}
                                            />
                                            <div className="w-10 h-5 bg-slate-300 rounded-full peer peer-checked:bg-rose-500 after:content-[''] after:absolute after:top-[3.5px] after:left-[3px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-5"></div>
                                        </label>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Marquee Text */}
                        {(() => {
                            const s = settings.find(x => x.key === 'marquee_text');
                            return (
                                <div className="space-y-3">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Broadcast Signal</label>
                                    <textarea 
                                        value={s?.value || ''}
                                        onChange={(e) => handleInputChange('marquee_text', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-[10px] min-h-[80px] focus:bg-white focus:border-rose-400 transition-all outline-none leading-relaxed"
                                        placeholder="ENTER GLOBAL BROADCAST MSG..."
                                    />
                                </div>
                            );
                        })()}
                    </div>
                    {/* Payment Control */}
                    <div className="admin-card p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2 underline decoration-indigo-500/30 decoration-4 underline-offset-4">
                            <Banknote size={20} className="text-indigo-500" />
                            <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Payment Gateway Relay</h3>
                        </div>
                        
                        <div className="space-y-3">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global UPI ID (Receiving)</label>
                            {(() => {
                                const s = settings.find(x => x.key === 'admin_upi_id');
                                return (
                                    <div className="flex items-center bg-indigo-50 border-2 border-indigo-100 rounded-xl overflow-hidden focus-within:border-indigo-500 transition-all">
                                        <input 
                                            type="text"
                                            placeholder="EXAMPLE@UPI"
                                            value={s?.value || ''}
                                            onChange={(e) => handleInputChange('admin_upi_id', e.target.value)}
                                            className="flex-1 bg-transparent px-4 py-3 font-black text-sm text-indigo-700 placeholder:text-indigo-200 uppercase"
                                        />
                                    </div>
                                );
                            })()}
                            <p className="text-[8px] text-slate-400 font-bold uppercase">This ID is used to generate PhonePe/GPay intent links in the app.</p>
                        </div>
                    </div>
                    <div className="admin-card p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2 underline decoration-indigo-500/30 decoration-4 underline-offset-4">
                            <Phone size={20} className="text-indigo-500" />
                            <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">Direct Support Relay</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Calling Support Number</label>
                                {(() => {
                                    const s = settings.find(x => x.key === 'contact_phone');
                                    return (
                                        <div className="flex items-center bg-indigo-50 border-2 border-indigo-100 rounded-xl overflow-hidden focus-within:border-indigo-500 transition-all">
                                            <input 
                                                type="text"
                                                placeholder="+91 1234567890"
                                                value={s?.value || ''}
                                                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                                                className="flex-1 bg-transparent px-4 py-3 font-black text-sm text-indigo-700"
                                            />
                                        </div>
                                    );
                                })()}
                            </div>
                            <div className="space-y-3">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">WhatsApp Business Number</label>
                                {(() => {
                                    const s = settings.find(x => x.key === 'whatsapp_phone');
                                    return (
                                        <div className="flex items-center bg-emerald-50 border-2 border-emerald-100 rounded-xl overflow-hidden focus-within:border-emerald-500 transition-all">
                                            <input 
                                                type="text"
                                                placeholder="+91 1234567890"
                                                value={s?.value || ''}
                                                onChange={(e) => handleInputChange('whatsapp_phone', e.target.value)}
                                                className="flex-1 bg-transparent px-4 py-3 font-black text-sm text-emerald-700"
                                            />
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Root Access Disclaimer */}
            <div className="bg-slate-900 p-6 rounded-2xl text-white flex items-center gap-4 border border-slate-800 shadow-2xl overflow-hidden relative group">
                 <div className="absolute right-0 top-0 p-10 opacity-[0.05] pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <ShieldAlert size={120} />
                 </div>
                 <div className="p-3 bg-rose-500/20 text-rose-500 rounded-xl border border-rose-500/20">
                     <ShieldCheck size={24} strokeWidth={2.5} />
                 </div>
                 <div className="space-y-0.5 relative z-10">
                    <h4 className="text-sm font-black uppercase tracking-tight">Privileged Modulation Access</h4>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                       All parameters modulate live payout logic. Precision is mandatory.
                    </p>
                 </div>
            </div>
        </div>
    );
};

export default GlobalSettings;
