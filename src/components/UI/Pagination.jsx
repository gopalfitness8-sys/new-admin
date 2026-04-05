import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, loading }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-6 bg-slate-50 border-t border-slate-100 rounded-b-3xl select-none">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="relative inline-flex items-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 disabled:opacity-50 tracking-wider uppercase"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="relative ml-3 inline-flex items-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 disabled:opacity-50 tracking-wider uppercase"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black text-slate-500 uppercase tracking-widest leading-none">
            Page <span className="font-black text-indigo-600 px-2 text-base">{currentPage}</span> of{' '}
            <span className="font-black text-indigo-600 px-2 text-base">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-2xl shadow-xl transition-all hover:shadow-2xl" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="relative inline-flex items-center rounded-l-2xl border border-slate-200 bg-white p-3 text-sm font-black text-slate-500 hover:bg-indigo-50 focus:z-20 disabled:opacity-20 transition-all hover:text-indigo-600 group"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="relative inline-flex items-center rounded-r-2xl border border-slate-200 bg-white p-3 text-sm font-black text-slate-500 hover:bg-indigo-50 focus:z-20 disabled:opacity-20 transition-all hover:text-indigo-600 group"
            >
              <span className="sr-only">Next</span>
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
