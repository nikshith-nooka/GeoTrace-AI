
import React from 'react';
import { CityHealthSnapshot } from '../types';

interface CityHealthReportProps {
  snapshot: CityHealthSnapshot;
}

export const CityHealthReport: React.FC<CityHealthReportProps> = ({ snapshot }) => (
  <div className="p-10 space-y-12 animate-in fade-in slide-in-from-right-10 duration-700">
    <div className="space-y-2">
      <h3 className="text-4xl font-extrabold tracking-tight text-slate-900 uppercase leading-none">{snapshot.cityName}</h3>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Urban Profile Snapshot</p>
    </div>

    <div className="relative p-16 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center text-center shadow-xl overflow-hidden group">
      <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="text-8xl font-black text-white tracking-tighter leading-none mb-4">{snapshot.overallScore}</div>
      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">Environment Score</div>
      
      {/* Design Accents */}
      <div className="absolute top-6 left-6 w-10 h-10 border-t border-l border-white/10 rounded-tl-2xl"></div>
      <div className="absolute bottom-6 right-6 w-10 h-10 border-b border-r border-white/10 rounded-br-2xl"></div>
    </div>

    <div className="grid grid-cols-1 gap-10">
       <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Environmental Highlights</h4>
          <div className="space-y-3">
            {snapshot.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-5 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 group">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xs">✓</div>
                <p className="text-sm text-slate-700 font-semibold leading-snug">{h}</p>
              </div>
            ))}
          </div>
       </div>

       <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Potential Risk Vectors</h4>
          <div className="space-y-3">
            {snapshot.riskFactors.map((r, i) => (
              <div key={i} className="flex items-center gap-5 p-5 rounded-2xl bg-rose-50/50 border border-rose-100 group">
                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-500 font-black text-xs">!</div>
                <p className="text-sm text-slate-700 font-semibold leading-snug">{r}</p>
              </div>
            ))}
          </div>
       </div>
    </div>
    
    <div className="pt-8">
       <div className="p-8 rounded-[2.5rem] bg-slate-100 border border-slate-200 text-center italic text-slate-400 text-xs leading-relaxed font-medium">
          "Profile synthesized via real-time sensory fusion and global news grounding for maximum urban fidelity."
       </div>
    </div>
  </div>
);
