
import React, { useEffect } from 'react';
import { LocationAnalysisResult, Facility } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface LocationReportProps {
  result: LocationAnalysisResult;
  imageUrl: string | null;
  coords: { lat: number; lng: number };
  onFacilitiesFound: (facilities: Facility[]) => void;
}

export const LocationReport: React.FC<LocationReportProps> = ({ result, onFacilitiesFound }) => {
  useEffect(() => {
    if (result.facilities) {
      onFacilitiesFound(result.facilities);
    }
  }, [result.facilities, onFacilitiesFound]);

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return '#10b981';
    if (aqi <= 100) return '#f59e0b';
    if (aqi <= 200) return '#f97316';
    return '#ef4444';
  };

  const predictionData = [
    { hour: 'Now', val: result.aqi },
    { hour: '+6h', val: result.aqi * 1.05 },
    { hour: '+12h', val: result.aqi * 0.95 },
    { hour: '+18h', val: result.aqi * 1.15 },
    { hour: '+24h', val: result.aqi * 0.85 },
  ];

  return (
    <div className="flex flex-col bg-white min-h-full animate-in fade-in duration-700 font-sans">
      
      {/* Top Hero Image - Satellite View */}
      <div className="w-full aspect-video overflow-hidden border-b border-slate-100">
        <img 
          src={result.locationImageUrl || "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop"} 
          alt={result.locationName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6 space-y-8">
        
        {/* Title and Location Marker Style */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
             <div className="mt-1.5 p-1.5 bg-sky-50 rounded-full text-sky-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
             </div>
             <h3 className="text-2xl font-bold text-slate-900 leading-tight">{result.locationName}</h3>
          </div>
        </div>

        {/* Overall Assessment Box - Light Blue Style */}
        <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-6 relative">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-sky-100 rounded-lg text-sky-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7"/></svg>
             </div>
             <h4 className="text-sm font-extrabold uppercase tracking-wider text-sky-900">Overall Assessment</h4>
          </div>
          <p className="text-sm text-sky-800 leading-relaxed font-medium">
             {result.recommendation}
          </p>
        </div>

        {/* Charts & Graphs Section - Promoter Level Visualization */}
        <div className="grid grid-cols-1 gap-6">
           {/* Current AQI Gauge/Value */}
           <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
              <div className="flex justify-between items-end">
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Live AQI Score</h4>
                    <div className="text-5xl font-black tracking-tighter" style={{ color: getAqiColor(result.aqi) }}>{result.aqi}</div>
                 </div>
                 <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Category</div>
                    <div className="text-lg font-bold uppercase tracking-tight" style={{ color: getAqiColor(result.aqi) }}>{result.status}</div>
                 </div>
              </div>
              <div className="mt-6 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                 <div 
                   className="h-full transition-all duration-1000" 
                   style={{ width: `${Math.min(100, (result.aqi / 300) * 100)}%`, backgroundColor: getAqiColor(result.aqi) }}
                 ></div>
              </div>
           </div>

           {/* Pollutant Bars */}
           <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Pollutant Spectrum</h4>
              <div className="h-40 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.pollutants}>
                       <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                       <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                       <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {result.pollutants.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={getAqiColor(result.aqi)} opacity={0.6 + (index * 0.1)} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Future Prediction Chart */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">24h Prediction Trend</h4>
           <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={predictionData}>
                    <defs>
                       <linearGradient id="predColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={getAqiColor(result.aqi)} stopOpacity={0.2}/>
                          <stop offset="95%" stopColor={getAqiColor(result.aqi)} stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke={getAqiColor(result.aqi)} strokeWidth={3} fill="url(#predColor)" />
                    <XAxis dataKey="hour" hide />
                    <YAxis hide />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Identified Hazards - Table Style from Screenshot */}
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="p-1.5 bg-rose-50 rounded-full text-rose-500">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Identified Hazards</h4>
           </div>

           <div className="space-y-2 border-t border-slate-100 pt-2">
              {result.hazards && result.hazards.map((hazard, i) => (
                 <div key={i} className="grid grid-cols-12 gap-4 py-4 border-b border-slate-50 last:border-none group">
                    <div className="col-span-4 text-[11px] font-black uppercase tracking-tight text-rose-700 leading-tight">
                       {hazard.title}
                    </div>
                    <div className="col-span-8 text-[11px] text-slate-600 leading-relaxed font-medium">
                       {hazard.description}
                    </div>
                 </div>
              ))}
              {!result.hazards && (
                <p className="text-xs text-slate-400 italic py-4 text-center">No immediate hazards detected by primary sensors.</p>
              )}
           </div>
        </div>

        {/* Nearby Facilities */}
        <div className="space-y-4 pb-10">
           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Health Infrastructure</h4>
           <div className="space-y-2">
              {result.facilities.map((f, i) => (
                 <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:border-sky-100 hover:shadow-sm transition-all">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${f.type === 'Hospital' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                       {f.type[0]}
                    </div>
                    <div>
                       <div className="text-xs font-bold text-slate-900 leading-tight">{f.name}</div>
                       <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{f.type}</div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};
