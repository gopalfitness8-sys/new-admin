import React, { useState, useEffect } from 'react';
import { Target, Trophy, Clock, AlertTriangle, CheckCircle2, Info, ChevronRight, Calculator } from 'lucide-react';
import { declareOpen, declareClose, getBetSummary } from '../services/result.service';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const DeclareResult = () => {
    const { isSuperAdmin } = useAuth();
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const [openPanna, setOpenPanna] = useState('');
    const [closePanna, setClosePanna] = useState('');

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await api.get('/games?admin=true');
                setGames(response.data.data);
            } catch (err) {
                toast.error('Failed to fetch games');
            }
        };
        fetchGames();
    }, []);

    useEffect(() => {
        if (selectedGame && date) {
            fetchSummary();
        }
    }, [selectedGame, date]);

    const fetchSummary = async () => {
        try {
            const data = await getBetSummary(selectedGame, date);
            setSummary(data.data);
            if (data.data.result) {
                setOpenPanna(data.data.result.openPanna || '');
                setClosePanna(data.data.result.closePanna || '');
            } else {
                setOpenPanna('');
                setClosePanna('');
            }
        } catch (err) {
            toast.error('Failed to fetch summary');
        }
    };

    const calculateDigit = (panna) => {
        if (!panna || panna.length !== 3) return '-';
        const sum = panna.split('').reduce((acc, char) => acc + parseInt(char), 0);
        return sum % 10;
    };

    const handleDeclareOpen = async () => {
        if (!window.confirm('Are you sure you want to declare the open result? This will change the game status and broadcast the result.')) return;
        setLoading(true);
        try {
            await declareOpen({ gameId: selectedGame, date, openPanna });
            toast.success('Open result declared successfully');
            fetchSummary();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to declare open result');
        } finally {
            setLoading(false);
        }
    };

    const handleDeclareClose = async () => {
        if (!window.confirm('FINAL WARNING: Declaring the close result will SETTLE ALL BETS and credit winnings to user wallets. Proceed?')) return;
        setLoading(true);
        try {
            const response = await declareClose({ gameId: selectedGame, date, closePanna });
            toast.success('Full settlement complete!');
            console.log('Settlement data:', response.data);
            fetchSummary();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to declare close result');
        } finally {
            setLoading(false);
        }
    };

    const openDigit = calculateDigit(openPanna);
    const closeDigit = calculateDigit(closePanna);
    const jodi = openDigit !== '-' && closeDigit !== '-' ? `${openDigit}${closeDigit}` : '--';

    const gameStatus = summary?.status || 'upcoming';

    return (
        <div className="py-10 px-6 space-y-8 w-full">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                   <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Result Declaration</h2>
                   <p className="text-gray-500 font-medium">Control the market lifecycle and settle player investments.</p>
                </div>
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                   <select 
                     value={selectedGame}
                     onChange={(e) => setSelectedGame(e.target.value)}
                     className="flex-1 md:w-64 px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-900 focus:border-indigo-600 outline-none transition-all shadow-sm"
                   >
                     <option value="">Select Market Game</option>
                     {games.map(g => (
                         <option key={g.id} value={g.id}>{g.name}</option>
                     ))}
                   </select>
                   <input 
                     type="date" 
                     value={date}
                     onChange={(e) => setDate(e.target.value)}
                     className="flex-1 md:w-48 px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-900 focus:border-indigo-600 outline-none transition-all shadow-sm"
                   />
                </div>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Open Bets</p>
                        <h4 className="text-2xl font-black text-slate-900">{summary.open.count} <span className="text-sm font-bold text-gray-400 ml-1">({summary.open.amount} pts)</span></h4>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jodi Bets (Open)</p>
                        <h4 className="text-2xl font-black text-slate-900">{summary.jodi_open.count} <span className="text-sm font-bold text-gray-400 ml-1">({summary.jodi_open.amount} pts)</span></h4>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Close Bets</p>
                        <h4 className="text-2xl font-black text-slate-900">{summary.close.count} <span className="text-sm font-bold text-gray-400 ml-1">({summary.close.amount} pts)</span></h4>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jodi Bets (Close)</p>
                        <h4 className="text-2xl font-black text-slate-900">{summary.jodi_close.count} <span className="text-sm font-bold text-gray-400 ml-1">({summary.jodi_close.amount} pts)</span></h4>
                    </div>
                    <div className="bg-indigo-600 p-6 rounded-3xl border border-indigo-700 shadow-xl shadow-indigo-100 text-white">
                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Total Exposure</p>
                        <h4 className="text-2xl font-black">₹ {(summary.open.amount + summary.close.amount + summary.jodi_open.amount + summary.jodi_close.amount).toLocaleString()}</h4>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* PHASE 1: OPEN RESULT */}
                <div className={`bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 border-l-8 border-l-amber-500 relative ${selectedGame ? '' : 'opacity-50 pointer-events-none'}`}>
                    <div className="flex justify-between items-start mb-8">
                       <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                          <Clock size={28} />
                       </div>
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                           gameStatus === 'open_declared' || gameStatus === 'complete' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                       }`}>
                           {gameStatus === 'open_declared' || gameStatus === 'complete' ? 'Phase 01 Complete' : 'Phase 01 Required'}
                       </span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 mb-2">Declare Open Panna</h3>
                    <p className="text-gray-500 text-sm font-medium mb-10">Calculate the open side digit from its three-digit panna.</p>

                    <div className="space-y-8">
                       <input 
                         type="text" 
                         maxLength="3"
                         value={openPanna}
                         onChange={(e) => setOpenPanna(e.target.value.replace(/\D/g, ''))}
                         disabled={gameStatus !== 'pending' && gameStatus !== 'upcoming'}
                         placeholder="Enter Open Panna (e.g. 128)"
                         className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-3xl focus:border-amber-500 focus:bg-white outline-none transition-all text-2xl font-black placeholder:text-gray-300"
                       />

                       <div className="flex items-center gap-6 p-8 bg-slate-900 rounded-[2rem] text-white shadow-xl">
                          <div className="flex-1 text-center">
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Panna</p>
                             <h4 className="text-4xl font-black text-amber-500 tracking-tighter">{openPanna || '---'}</h4>
                          </div>
                          <div className="w-px h-12 bg-white/10"></div>
                          <div className="flex-1 text-center">
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Digit</p>
                             <h4 className="text-4xl font-black tracking-tighter">{openDigit}</h4>
                          </div>
                       </div>

                       <button 
                         onClick={handleDeclareOpen}
                         disabled={loading || openPanna.length !== 3 || (gameStatus !== 'pending' && gameStatus !== 'upcoming')}
                         className={`w-full py-6 rounded-3xl font-black text-lg shadow-xl transition-all uppercase tracking-widest flex items-center justify-center gap-3 ${
                            openPanna.length === 3 && (gameStatus === 'pending' || gameStatus === 'upcoming')
                              ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-200 active:scale-95' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                         }`}
                       >
                          {loading ? 'Processing...' : gameStatus === 'pending' || gameStatus === 'upcoming' ? 'Declare Open Phase' : 'Open Declared'}
                          <ChevronRight size={24} />
                       </button>
                    </div>
                </div>

                {/* PHASE 2: CLOSE RESULT */}
                <div className={`p-10 rounded-[2.5rem] shadow-sm border border-gray-100 border-l-8 border-l-indigo-600 relative transition-all ${
                     gameStatus !== 'open_declared' ? 'bg-gray-50/50 opacity-40 grayscale pointer-events-none' : 'bg-white'
                  }`}>
                    <div className="flex justify-between items-start mb-8">
                       <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Trophy size={28} />
                       </div>
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                           gameStatus === 'complete' ? 'bg-green-50 text-green-600' : 'bg-indigo-50 text-indigo-600'
                       }`}>
                           {gameStatus === 'complete' ? 'Phase 02 Complete' : 'Phase 02 Pending'}
                       </span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 mb-2">Declare Close & Settle</h3>
                    <p className="text-gray-500 text-sm font-medium mb-10">Finalize market with close panna and trigger automatic settlement.</p>

                    <div className="space-y-8">
                       <input 
                         type="text" 
                         maxLength="3"
                         value={closePanna}
                         onChange={(e) => setClosePanna(e.target.value.replace(/\D/g, ''))}
                         placeholder="Enter Close Panna"
                         className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-3xl focus:border-indigo-600 focus:bg-white outline-none transition-all text-2xl font-black placeholder:text-gray-300"
                       />

                        <div className="flex items-center gap-6 p-8 bg-indigo-900 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
                          <div className="flex-1 text-center">
                             <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Panna</p>
                             <h4 className="text-4xl font-black text-indigo-200 tracking-tighter">{closePanna || '---'}</h4>
                          </div>
                          <div className="w-px h-12 bg-white/10"></div>
                          <div className="flex-1 text-center">
                             <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Digit</p>
                             <h4 className="text-4xl font-black tracking-tighter">{closeDigit}</h4>
                          </div>
                       </div>

                       <div className="p-6 bg-slate-900 rounded-2xl text-center border-2 border-indigo-500/30">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Final Market Jodi</p>
                          <h4 className="text-5xl font-black tracking-tight text-white">
                             {openDigit}<span className="text-indigo-500 mx-2">|</span>{closeDigit}
                          </h4>
                       </div>

                       <button 
                         onClick={handleDeclareClose}
                         disabled={loading || closePanna.length !== 3 || gameStatus !== 'open_declared'}
                         className={`w-full py-6 rounded-3xl font-black text-lg shadow-xl transition-all uppercase tracking-widest flex items-center justify-center gap-3 ${
                            closePanna.length === 3 && gameStatus === 'open_declared'
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 active:scale-95' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                         }`}
                       >
                          {loading ? 'Settling Platform...' : 'Declare & Settle All'}
                          <CheckCircle2 size={24} />
                       </button>
                    </div>
                </div>
            </div>

            {/* Critical Info */}
            <div className={`p-10 rounded-[2.5rem] flex items-center justify-between gap-10 transition-all ${
                gameStatus === 'complete' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
            } border-2 relative overflow-hidden group`}>
                <div className="relative z-10 flex items-start gap-8">
                     <div className={`w-16 h-16 rounded-3xl flex items-center justify-center flex-shrink-0 ${
                         gameStatus === 'complete' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                     } shadow-xl`}>
                        {gameStatus === 'complete' ? <Trophy size={32} /> : <AlertTriangle size={32} />}
                     </div>
                     <div>
                        <h4 className={`text-2xl font-black tracking-tight mb-2 ${
                            gameStatus === 'complete' ? 'text-green-900' : 'text-red-900'
                        }`}>
                            {gameStatus === 'complete' ? 'MARKET SETTLED SUCCESSFULLY' : 'CRITICAL SETTLEMENT SYSTEM'}
                        </h4>
                        <p className="text-slate-600 font-medium max-w-3xl leading-relaxed">
                            {gameStatus === 'complete' 
                                ? 'All winners have been credited and logs have been updated. You can view the settlement report in the reports section.'
                                : 'Finalizing Phase 2 will trigger a chain reaction: calculating winners for Single, Panna, Jodi, Half Sangam, and Full Sangam across both phases, updating user wallets, and creating financial records.'}
                        </p>
                     </div>
                </div>
                {isSuperAdmin && gameStatus === 'complete' && (
                    <button className="px-8 py-4 bg-white border-2 border-red-200 text-red-600 font-black rounded-2xl hover:bg-red-50 transition-all uppercase tracking-widest text-sm relative z-10 shadow-sm">
                        Resettle Results
                    </button>
                )}
            </div>
        </div>
    );
};

export default DeclareResult;
