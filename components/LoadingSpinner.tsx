import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent animate-spin rounded-full shadow-lg shadow-sky-500/20"></div>
    <div className="text-sky-500 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">Processing Data</div>
  </div>
);