import React from 'react';
import Loader from './Loader';

const Table = ({ columns, data, loading, noDataMessage = 'No archival records detected in this node synchronization' }) => {
    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-6 bg-white rounded-xl border border-slate-200">
            <Loader size={36} />
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Matrix...</p>
        </div>
    );

    if (!data || data.length === 0) return (
        <div className="flex flex-col items-center justify-center p-20 text-center bg-white rounded-xl border border-dotted border-slate-300">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
            </div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest leading-relaxed max-w-xs">{noDataMessage}</p>
        </div>
    );

    return (
        <div className="admin-table-container shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200">
                            {columns.map((col, idx) => (
                                <th 
                                    key={idx} 
                                    className={`px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest ${col.className || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((row, rowIdx) => (
                            <tr 
                                key={rowIdx} 
                                className="group hover:bg-slate-50/50 transition-colors"
                            >
                                {columns.map((col, colIdx) => (
                                    <td 
                                        key={colIdx} 
                                        className={`px-6 py-4 text-sm font-medium text-slate-600 ${col.className || ''}`}
                                    >
                                        {col.render ? col.render(row) : (row[col.accessor] || '—')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
