import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'indigo', subValue, trend }) => {
  const colors = {
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    rose: 'text-rose-600 bg-rose-50 border-rose-200',
    amber: 'text-amber-600 bg-amber-50 border-amber-200',
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    violet: 'text-violet-600 bg-violet-50 border-violet-200',
  };

  return (
    <div className={`p-6 bg-white border rounded-2xl shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow group`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{title}</h3>
        <div className={`p-3 rounded-xl border ${colors[color] || colors.indigo} group-hover:scale-105 transition-transform`}>
          {Icon && <Icon size={22} strokeWidth={2.5} />}
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-3xl font-black text-slate-800 tracking-tighter leading-none mb-1">
          {value}
        </span>
        
        {(subValue || trend) && (
          <div className="flex items-center gap-2">
            {trend && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${trend > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
            {subValue && <span className="text-xs font-semibold text-slate-400">{subValue}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
