import React, { useEffect } from 'react';
import { X, ShieldCheck, Database, Target, Terminal } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div 
        className={`w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 ${sizes[size] || sizes.md}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Protocol */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <div className="p-1.5 bg-slate-100 rounded-lg border border-slate-200">
                <Target size={14} className="text-slate-500" strokeWidth={2.5} />
             </div>
             <h2 className="text-sm font-bold text-slate-800 tracking-widest uppercase mb-0.5 leading-none">{title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-all hover:rotate-90 duration-300 group"
          >
            <X size={16} className="text-slate-400 group-hover:text-slate-800" strokeWidth={2.5} />
          </button>
        </div>

        {/* Console Body */}
        <div className="px-6 py-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* Audit Footnote & Controls */}
        {footer ? (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 items-center">
            <div className="mr-auto hidden sm:flex items-center gap-2 opacity-30">
               <ShieldCheck size={12} className="text-slate-500" />
               <span className="text-[8px] font-black tracking-tighter uppercase">Protocol_Secure_ECC_v4</span>
            </div>
            {footer}
          </div>
        ) : null}
      </div>
      
      {/* Background Dimming Overlay (Backdrop) */}
      <div className="fixed inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

export default Modal;
