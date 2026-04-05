import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Target, Mail, Lock, ShieldCheck, Database, Terminal, RefreshCw } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Matrix access granted');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Authentication refused');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] flex-col px-4 relative overflow-hidden font-inter" style={{ minWidth: '1200px' }}>
            {/* Neural Gradients */}
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            <div className="max-w-md w-full relative z-10">
                {/* Protocol Header */}
                <div className="mb-10 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-indigo-200/50 border-b-4 border-indigo-500 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        <Target className="text-white relative z-10 group-hover:scale-110 transition-transform duration-500" size={32} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight uppercase">Satta Matka Admin</h1>
                        <div className="flex items-center gap-3 justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[9px]">Internal Grid Access Node</p>
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Auth Console */}
                <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group/console">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none select-none">
                        <Database size={160} />
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Root Identity</label>
                                <Terminal size={12} className="text-slate-200" />
                            </div>
                            <div className="relative group/input">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-indigo-600 transition-colors" size={18} strokeWidth={2.5} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-900 text-sm tracking-tight placeholder:text-slate-200"
                                    placeholder="ADMIN_ID"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access Key</label>
                                <ShieldCheck size={12} className="text-slate-200" />
                            </div>
                            <div className="relative group/input">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-indigo-600 transition-colors" size={18} strokeWidth={2.5} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-900 text-sm tracking-tight placeholder:text-slate-200"
                                    placeholder="PAYLOAD_SECRET"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-xl shadow-slate-100 disabled:opacity-50 mt-4 tracking-[0.3em] uppercase text-[10px] flex items-center justify-center gap-4 active:scale-[0.98] border-b-4 border-indigo-600"
                        >
                            {loading ? <RefreshCw className="animate-spin" size={18} /> : (
                                <>
                                    Establish Link
                                    <ShieldCheck size={18} strokeWidth={2.5} className="text-indigo-400" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
                {/* Security Footer */}
                <div className="mt-12 flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.4em]">© 2026 Grid-Nexus Protocol • Encrypted Session</p>
                    <div className="flex items-center gap-4 text-[8px] font-black text-slate-300 uppercase tracking-tighter">
                        <span>NODE_SYNC_ACTIVE</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                        <span>ECC_ENCRYPTION_V4</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
