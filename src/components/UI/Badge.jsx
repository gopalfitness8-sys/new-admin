import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-50 text-slate-500 border-slate-100',
    primary: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    danger: 'bg-rose-50 text-rose-600 border-rose-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    info: 'bg-sky-50 text-sky-600 border-sky-100',
    purple: 'bg-violet-50 text-violet-600 border-violet-100',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border shadow-sm transition-all hover:scale-105 ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
