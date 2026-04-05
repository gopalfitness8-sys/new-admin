import React from 'react';
import Modal from './Modal';
import { AlertCircle, AlertTriangle, AlertOctagon, RefreshCw, XCircle, ShieldAlert } from 'lucide-react';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Protocol Confirmation', 
  message, 
  type = 'warning', 
  confirmText = 'Execute Sync', 
  cancelText = 'Abort',
  loading = false,
  description 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger': return <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 mb-6 group-hover:scale-110 transition-transform"><AlertOctagon size={32} strokeWidth={2.5} className="text-rose-600" /></div>;
      case 'warning': return <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-6 group-hover:scale-110 transition-transform"><AlertTriangle size={32} strokeWidth={2.5} className="text-amber-500" /></div>;
      default: return <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mb-6 group-hover:scale-110 transition-transform"><ShieldAlert size={32} strokeWidth={2.5} className="text-indigo-600" /></div>;
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'danger': return 'bg-rose-600 hover:bg-rose-700 shadow-rose-100 border-rose-700';
      case 'warning': return 'bg-amber-600 hover:bg-amber-700 shadow-amber-100 border-amber-700';
      default: return 'bg-slate-900 hover:bg-black shadow-slate-100 border-slate-900';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all hover:bg-slate-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-3 text-[10px] font-bold text-white uppercase tracking-[0.2em] rounded-xl shadow-lg border-b-4 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${getButtonClass()}`}
          >
            {loading ? <RefreshCw className="animate-spin mx-auto" size={16} /> : confirmText}
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center text-center p-6 group">
        {getIcon()}
        <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight uppercase leading-none">{message}</h3>
        {description && <p className="text-[10px] font-bold text-slate-400 max-w-sm leading-relaxed uppercase tracking-widest">{description}</p>}
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
