import React from 'react';
import { Target, RefreshCw, Activity, Terminal } from 'lucide-react';

const Loader = ({ className = '', size = 32, text = 'Synchronizing...' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-100 shadow-xl transition-all ${className}`}>
      <div className="relative mb-8 flex items-center justify-center transform group">
         <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-10 animate-pulse"></div>
         <div className="relative p-6 bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <RefreshCw className="animate-spin text-indigo-400" size={size} strokeWidth={2.5} />
         </div>
      </div>
      {text && (
         <div className="flex flex-col items-center gap-2">
            <p className="text-slate-900 font-bold uppercase tracking-[0.4em] text-[10px] leading-none mb-1">{text}</p>
            <div className="flex items-center gap-1.5 opacity-40">
               <Terminal size={10} className="text-indigo-600" />
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Initializing_Local_Grid_v4.0.1</p>
            </div>
         </div>
      )}
    </div>
  );
};

export default Loader;
