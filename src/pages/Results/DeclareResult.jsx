import React, { useState, useEffect, useCallback } from 'react';
import { 
    Search, Filter, RefreshCw, Smartphone, 
    History, Clock, ArrowRight, ShieldCheck, CheckCircle2,
    XCircle, AlertTriangle, MoreVertical, LayoutGrid,
    Target, Activity, Database, Globe, Calendar, Ban
} from 'lucide-react';
import gameService from '../../services/game.service';
import resultService from '../../services/result.service';
import Table from '../../components/UI/Table';
import Badge from '../../components/UI/Badge';
import Modal from '../../components/UI/Modal';
import Loader from '../../components/UI/Loader';
import toast from 'react-hot-toast';

const DeclareResult = () => {
    const [games, setGames] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Result States
    const [resultData, setResultData] = useState({
        panna: ''
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [gamesData, resultsData] = await Promise.all([
                gameService.getAllGames({ admin: true }),
                resultService.getResultHistory({ date: targetDate })
            ]);
            setGames(gamesData);
            setResults(resultsData);
        } catch (err) {
            toast.error('Market repository synchronization failure');
        } finally {
            setLoading(false);
        }
    }, [targetDate]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const getGameResult = (gameId) => results.find(r => r.gameId === gameId);

    const handleDeclareOpen = async () => {
        if (!resultData.panna) return toast.error('Enter Open Panna');
        try {
            setSubmitting(true);
            await resultService.declareOpen({
                gameId: selectedGame.id,
                date: targetDate,
                openPanna: resultData.panna
            });
            toast.success('Open result propagated successfully');
            setSelectedGame(null);
            setResultData({ panna: '' });
            fetchData();
        } catch (err) {
            toast.error(err.message || 'Propagation aborted');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeclareClose = async () => {
        if (!resultData.panna) return toast.error('Enter Close Panna');
        try {
            setSubmitting(true);
            await resultService.declareClose({
                gameId: selectedGame.id,
                date: targetDate,
                closePanna: resultData.panna
            });
            toast.success('Close result & settlement finalized');
            setSelectedGame(null);
            setResultData({ panna: '' });
            fetchData();
        } catch (err) {
            toast.error(err.message || 'Propagation aborted');
        } finally {
            setSubmitting(false);
        }
    };

    const handleHoliday = async (gameId) => {
        try {
            await resultService.declareHoliday({ gameId, date: targetDate });
            toast.success('Market suspended for current cycle');
            fetchData();
        } catch (err) { toast.error(err.message || 'Holiday declaration failure'); }
    };

    const columns = [
        { 
            header: 'Target Market', 
            accessor: 'name',
            render: (row) => (
                <div className="flex items-center gap-3 py-1 group">
                    <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-indigo-400 border border-slate-700 shadow-xl shadow-slate-900/10 transition-all group-hover:scale-110">
                        <Target size={18} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                           <span className="text-slate-800 font-bold uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{row.name}</span>
                           {!row.isActive && (
                               <span className="px-2 py-0.5 bg-rose-50 text-rose-500 border border-rose-100 rounded text-[9px] font-black tracking-widest uppercase">INACTIVE MARKET</span>
                           )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 w-fit">
                           <Clock size={10} className="text-slate-400" />
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.openTime} - {row.closeTime}</span>
                        </div>
                    </div>
                </div>
            )
        },
        { 
            header: 'Vector Outcome', 
            render: (row) => {
                const res = getGameResult(row.id);
                if (!res) return <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase italic border-l-2 border-slate-100 pl-3">No Outcome Recorded</span>;
                
                return (
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col items-center justify-center p-2 bg-slate-900 text-white rounded-lg min-w-[120px] border-b-2 border-indigo-500 shadow-lg">
                           <span className="text-[10.5px] font-black tracking-[0.2em] font-mono leading-none py-1">
                               {res.openPanna || '***'}-{res.openDigit ?? '*'}{res.closeDigit ?? '*'}-{res.closePanna || '***'}
                           </span>
                        </div>
                        {res.phase === 'holiday' && <Badge variant="danger" className="text-[9px]">HOLIDAY</Badge>}
                    </div>
                );
            }
        },
        { 
            header: 'Phase Status', 
            render: (row) => {
                const res = getGameResult(row.id);
                let state = { label: 'PENDING', color: 'default', icon: Clock };
                
                if (res) {
                    if (res.phase === 'open_declared') state = { label: 'OPEN_DECLARED', color: 'warning', icon: History };
                    else if (res.phase === 'complete') state = { label: 'FULLY_SYNCED', color: 'success', icon: CheckCircle2 };
                    else if (res.phase === 'holiday') state = { label: 'SUSPENDED', color: 'danger', icon: Ban };
                }
                
                const VariantIcon = state.icon;
                
                return (
                    <Badge variant={state.color} className="uppercase font-bold text-[9px] tracking-widest px-3 py-1.5 rounded-md border border-white/50 shadow-sm flex items-center gap-2">
                        <VariantIcon size={10} />
                        {state.label}
                    </Badge>
                );
            }
        },
        { 
            header: 'Logic Controller', 
            className: 'text-right',
            render: (row) => {
                const res = getGameResult(row.id);
                const isComplete = res && (res.phase === 'complete' || res.phase === 'holiday');
                const isOpenDeclared = res && res.phase === 'open_declared';
                
                return (
                    <div className="flex justify-end gap-3 pr-2">
                        <button 
                             onClick={() => setSelectedGame(row)}
                             disabled={isComplete}
                             className={`p-2.5 rounded-lg transition-all active:scale-95 shadow-lg font-bold uppercase text-[9px] tracking-widest px-6 ${
                                isComplete 
                                ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200 shadow-none' 
                                : isOpenDeclared 
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                             }`}
                        >
                             {isOpenDeclared ? 'Declare Close' : isComplete ? 'Settled' : 'Declare Open'}
                        </button>
                        <button 
                             onClick={() => handleHoliday(row.id)}
                             disabled={isComplete}
                             className={`p-2.5 rounded-lg border transition-all active:scale-95 shadow-sm font-bold uppercase text-[10px] px-4 ${
                                isComplete ? 'bg-slate-50 text-slate-200 border-slate-100 cursor-not-allowed' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900'
                             }`}
                             title="Mark Holiday"
                        >
                             <Ban size={14} strokeWidth={2.5} />
                        </button>
                    </div>
                );
            }
        }
    ];

    const currentResult = selectedGame ? getGameResult(selectedGame.id) : null;
    const isReadyForClose = currentResult && currentResult.phase === 'open_declared';

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20">
            {/* Live Operations Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 group">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Outcome Control</h1>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-widest">
                       <CheckCircle2 size={14} className="text-emerald-500" />
                       Real-time Phased Result Hub
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group/date">
                       <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/date:text-indigo-500 transition-colors" size={16} />
                       <input 
                           type="date"
                           value={targetDate}
                           onChange={(e) => setTargetDate(e.target.value)}
                           className="admin-input pl-12 pr-6 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition-all text-xs tracking-widest shadow-sm"
                       />
                    </div>
                    <button 
                       onClick={fetchData}
                       className="p-3 bg-slate-900 text-white rounded-xl hover:bg-black transition-all active:scale-95 shadow-lg group/ref"
                    >
                       <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
                    </button>
                </div>
            </div>

            <Table 
                columns={columns} 
                data={games} 
                loading={loading}
                noDataMessage="No market vectors ready for synchronization in target sector"
            />

            {/* Phased Declaration Modal */}
            <Modal 
                isOpen={!!selectedGame} 
                onClose={() => setSelectedGame(null)}
                title={isReadyForClose ? "Close Matrix Declaration" : "Open Matrix Declaration"}
            >
                <div className="p-8 space-y-8">
                    <div className="flex flex-col items-center text-center gap-5">
                       <div className={`p-5 rounded-2xl border-2 shadow-xl shadow-indigo-50 transform rotate-3 ${isReadyForClose ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                          <Activity size={40} strokeWidth={2.5} />
                       </div>
                       <div className="space-y-1">
                          <h3 className="text-2xl font-bold text-slate-800 tracking-tight uppercase leading-none">{selectedGame?.name}</h3>
                          <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-1 flex items-center gap-2 justify-center">
                              <Calendar size={14} className="text-indigo-400" /> FOR {new Date(targetDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                          {!selectedGame?.isActive && <Badge variant="danger" className="text-[9px] mt-2">INACTIVE MARKET VECTOR</Badge>}
                       </div>
                    </div>

                    {isReadyForClose && (
                        <div className="bg-slate-900 p-6 rounded-xl border-l-4 border-indigo-500 flex justify-between items-center group">
                            <div className="flex flex-col">
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">Open Vector Locked</span>
                               <span className="text-xl font-black text-white tracking-widest font-mono">{currentResult.openPanna} - {currentResult.openDigit}</span>
                            </div>
                            <ShieldCheck className="text-indigo-400 opacity-50 group-hover:opacity-100 transition-opacity" size={32} />
                        </div>
                    )}

                    <div className="space-y-4 bg-slate-100 p-8 rounded-2xl border-2 border-slate-200">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-center block leading-none">
                            {isReadyForClose ? 'Input Close Panna Matrix' : 'Input Open Panna Matrix'}
                        </label>
                        <input 
                            type="text"
                            maxLength="3"
                            value={resultData.panna}
                            onChange={(e) => setResultData({...resultData, panna: e.target.value})}
                            placeholder="789"
                            autoFocus
                            className="w-full text-center py-5 text-4xl font-black text-slate-800 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all uppercase placeholder:text-slate-200 tracking-[0.2em] font-mono shadow-inner"
                        />
                    </div>

                    <div className="bg-slate-900 p-8 rounded-2xl shadow-xl shadow-indigo-900/10 border-b-4 border-indigo-500">
                        <div className="flex flex-col items-center gap-2">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mb-1">Preview Matrix</span>
                           <div className="text-3xl font-black text-white tracking-[0.5em] font-mono flex items-center gap-4">
                               {isReadyForClose ? (
                                   <>
                                      <span>{currentResult.openPanna}</span>
                                      <span className="text-indigo-400 text-4xl">-</span>
                                      <span>{currentResult.openDigit}{resultData.panna ? [...resultData.panna].reduce((a, b) => a + parseInt(b), 0) % 10 : '*'}</span>
                                      <span className="text-indigo-400 text-4xl">-</span>
                                      <span>{resultData.panna || '***'}</span>
                                   </>
                               ) : (
                                   <>
                                      <span>{resultData.panna || '***'}</span>
                                      <span className="text-indigo-400 text-4xl">-</span>
                                      <span>{resultData.panna ? [...resultData.panna].reduce((a, b) => a + parseInt(b), 0) % 10 : '*'}*</span>
                                      <span className="text-indigo-400 text-4xl">-</span>
                                      <span>***</span>
                                   </>
                               )}
                           </div>
                        </div>
                    </div>

                    <button 
                       onClick={isReadyForClose ? handleDeclareClose : handleDeclareOpen}
                       disabled={submitting}
                       className={`w-full py-5 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50 ${isReadyForClose ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'}`}
                    >
                       {submitting ? <RefreshCw className="animate-spin" size={20} /> : <CheckCircle2 size={20} strokeWidth={3} />}
                       {isReadyForClose ? 'Settle Market Outcome' : 'Synchronize Open Vector'}
                    </button>
                    
                    <div className="bg-[#FFF9F9] p-4 rounded-xl border border-[#FFECEC] text-center flex items-center justify-center gap-3">
                         <AlertTriangle size={14} className="text-rose-400" />
                         <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest leading-loose">
                            CAUTION: PHASED CLEARANCE IS PERMANENT & IRREVERSIBLE.
                         </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DeclareResult;
