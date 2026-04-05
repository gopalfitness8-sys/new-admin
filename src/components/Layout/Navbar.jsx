import React from 'react';
import { Menu, Bell, User, LogOut, Search, Maximize } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-10">
        <button className="text-slate-900 hover:bg-slate-50 p-2 rounded-lg transition active:scale-95">
          <Menu size={24} />
        </button>
        <div className="relative group flex items-center">
           <Search size={18} className="absolute left-4 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
           <input 
             type="text" 
             placeholder="Search User or Game..." 
             className="pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl w-72 text-sm focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all outline-none"
           />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <button className="text-slate-500 hover:bg-slate-50 p-2.5 rounded-xl transition relative group">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            <div className="absolute top-full right-0 mt-4 px-4 py-3 bg-white shadow-xl rounded-xl border border-gray-100 hidden group-hover:block w-64 text-sm animate-in fade-in slide-in-from-top-2">
              <p className="font-semibold mb-2">Notifications</p>
              <div className="space-y-3">
                 <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                       <User size={14} />
                    </div>
                    <p className="text-xs text-gray-600 leading-tight">New user registered: <strong>9876543210</strong></p>
                 </div>
              </div>
            </div>
          </button>
          <button className="text-slate-500 hover:bg-slate-50 p-2.5 rounded-xl transition">
            <Maximize size={20} />
          </button>
        </div>

        <div className="h-8 w-px bg-gray-200"></div>

        <div className="flex items-center gap-4 group cursor-pointer relative">
          <div className="text-right flex flex-col items-end">
            <p className="text-sm font-bold text-gray-900 leading-none">Vicky Sharma</p>
            <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1.5 uppercase tracking-wide">Administrator</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-lg group-hover:shadow-amber-200 transition-shadow">
            <div className="w-full h-full rounded-[14px] bg-white p-0.5 overflow-hidden">
               <img 
                 src="https://api.dicebear.com/7.x/avataaars/svg?seed=Vicky" 
                 alt="Admin Avatar"
                 className="w-full h-full object-cover" 
               />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
