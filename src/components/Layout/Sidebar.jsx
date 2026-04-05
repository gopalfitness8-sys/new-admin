import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, Trophy, Target, Wallet, Gamepad2, 
  Settings, Bell, LogOut, LayoutDashboard, History, 
  Coins, ShieldCheck, ChevronRight, Menu, ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NavItem = ({ to, icon: Icon, label, isCollapsed }) => {
  return (
    <NavLink
      to={to}
      title={isCollapsed ? label : ''}
      className={({ isActive }) =>
        `flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-lg transition-all mb-1.5 font-semibold text-sm ${
          isActive 
            ? 'bg-indigo-600 text-white shadow-sm' 
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`
      }
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
      </div>
      {!isCollapsed && <ChevronRight size={14} className="opacity-40" />}
    </NavLink>
  );
};

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout, isSuperAdmin } = useAuth();

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out`}>
      {/* Header with Toggle */}
      <div className={`p-6 border-b border-slate-800/60 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-6`}>
        {!isCollapsed && (
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 animate-in fade-in duration-300">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-lg shrink-0">
              <Trophy size={16} />
            </div>
            <span className="whitespace-nowrap uppercase text-sm tracking-tighter">BS <span className="text-indigo-400">MATKA</span></span>
          </h1>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
        >
          {isCollapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} overflow-y-auto no-scrollbar`}>
        <div className={`text-[10px] font-bold text-slate-500 uppercase tracking-widest ${isCollapsed ? 'text-center' : 'px-4'} mb-4 opacity-50`}>
          {isCollapsed ? 'CORE' : 'Core Panel'}
        </div>
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" isCollapsed={isCollapsed} />
        <NavItem to="/games" icon={Gamepad2} label="Market Control" isCollapsed={isCollapsed} />
        <NavItem to="/declare-result" icon={Target} label="Live Results" isCollapsed={isCollapsed} />
        <NavItem to="/results/history" icon={History} label="Result Archive" isCollapsed={isCollapsed} />
        
        <div className={`text-[10px] font-bold text-slate-500 uppercase tracking-widest ${isCollapsed ? 'text-center' : 'px-4'} mt-8 mb-4 opacity-50`}>
          {isCollapsed ? 'MGMT' : 'Management'}
        </div>
        <NavItem to="/users" icon={Users} label="User Directory" isCollapsed={isCollapsed} />
        <NavItem to="/bets" icon={Trophy} label="Live Bets" isCollapsed={isCollapsed} />
        <NavItem to="/wallet/deposits" icon={Coins} label="Direct Deposits" isCollapsed={isCollapsed} />
        <NavItem to="/wallet/withdrawals" icon={Wallet} label="Withdrawals" isCollapsed={isCollapsed} />
        <NavItem to="/wallet/transactions" icon={History} label="Financial Logs" isCollapsed={isCollapsed} />
        <NavItem to="/notifications" icon={Bell} label="Broadcasts" isCollapsed={isCollapsed} />
        
        {isSuperAdmin && (
          <>
            <div className={`text-[10px] font-bold text-slate-500 uppercase tracking-widest ${isCollapsed ? 'text-center' : 'px-4'} mt-8 mb-4 opacity-50`}>
              {isCollapsed ? 'SYS' : 'System Hub'}
            </div>
            <NavItem to="/settings" icon={Settings} label="Global Config" isCollapsed={isCollapsed} />
            <NavItem to="/admin-logs" icon={ShieldCheck} label="Internal Logs" isCollapsed={isCollapsed} />
          </>
        )}
      </nav>
      
      <div className={`p-4 border-t border-slate-800 ${isCollapsed ? 'items-center' : ''}`}>
        <div className={`p-2 bg-slate-800/40 rounded-xl border border-slate-700/50 ${isCollapsed ? 'flex justify-center' : ''}`}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3 mb-4 animate-in fade-in duration-300">
               <div className="w-10 h-10 rounded-lg bg-slate-700 overflow-hidden border border-slate-600 shrink-0">
                 <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=6366f1&color=fff&bold=true`} alt="admin" />
               </div>
               <div className="overflow-hidden">
                 <p className="text-xs font-bold text-white truncate uppercase tracking-tight">{user?.name || 'Super Admin'}</p>
                 <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{user?.role}</span>
               </div>
            </div>
          ) : (
             <div className="w-10 h-10 rounded-lg bg-slate-700 overflow-hidden border border-slate-600 mb-2">
                 <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=6366f1&color=fff&bold=true`} alt="admin" />
             </div>
          )}
          <button 
            onClick={logout}
            className={`w-full py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-bold rounded-lg transition-all text-[11px] uppercase flex items-center justify-center ${isCollapsed ? 'px-0' : 'gap-2'} group`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut size={14} className={isCollapsed ? '' : 'group-hover:-translate-x-0.5 transition-transform'} />
            {!isCollapsed && <span>Secure Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
