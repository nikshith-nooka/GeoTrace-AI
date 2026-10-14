
import React, { useState, useRef, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyzeAirQualityImage, chatWithAI } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'scan' | 'predict' | 'routes'>('map');
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string, text: string}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const forecastData = [
    { time: '06:00', aqi: 42 },
    { time: '09:00', aqi: 125 },
    { time: '12:00', aqi: 85 },
    { time: '15:00', aqi: 65 },
    { time: '18:00', aqi: 148 },
    { time: '21:00', aqi: 72 },
    { time: '00:00', aqi: 35 },
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsScanning(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const result = await analyzeAirQualityImage(base64);
        setScanResult(result);
      } catch (err) { console.error(err); }
      finally { setIsScanning(false); }
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const msg = userInput;
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setUserInput('');
    setIsTyping(true);
    try {
      const response = await chatWithAI(msg);
      setChatMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (err) { console.error(err); }
    finally { setIsTyping(false); }
  };

  return (
    <div className="min-h-screen pt-32 px-4 md:px-12 pb-16 flex flex-col gap-10 max-w-[1700px] mx-auto animate-in fade-in duration-1000">
      
      {/* Polite User Greeting */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter brand-font">Welcome back, <span className="text-sky-400">Explorer</span>.</h1>
          <p className="text-white/40 font-medium text-lg">We are pleased to see you. Currently, the regional atmospheric health is <span className="text-emerald-400 font-bold">Optimal</span>.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-8 py-4 glass rounded-2xl border-white/5 flex items-center gap-4 shadow-xl">
            <span className="w-3 h-3 rounded-full bg-emerald-500 aqi-pulse"></span>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Protocol Online</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:w-80 flex-shrink-0">
          <div className="glass p-8 rounded-[3rem] sticky top-32 space-y-12 border-white/10 shadow-2xl">
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-sky-400/80 mb-8">Service Modules</h2>
              <nav className="space-y-4">
                {[
                  { id: 'map', label: '3D Spatial Trace', sub: 'Visualization', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 11V9' },
                  { id: 'scan', label: 'AI Vision Scan', sub: 'Active Detection', icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' },
                  { id: 'predict', label: 'AQI Predictor', sub: 'Machine Intelligence', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
                  { id: 'routes', label: 'Healthy Routes', sub: 'Navigation Path', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-5 p-5 rounded-[2rem] transition-all duration-500 group ${
                      activeTab === item.id 
                      ? 'bg-sky-500 text-white shadow-[0_20px_40px_rgba(56,189,248,0.3)] ring-1 ring-white/30 scale-[1.02]' 
                      : 'text-white/40 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      activeTab === item.id ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10 group-hover:rotate-6'
                    }`}>
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-base font-black leading-none mb-1.5">{item.label}</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{item.sub}</p>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
            <div className="pt-10 border-t border-white/10">
               <div className="bg-white/5 rounded-[2rem] p-8 border border-white/5">
                  <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.4em] mb-4">Wellness Advisory</p>
                  <p className="text-sm text-white/70 leading-relaxed italic font-medium">"Consider brief outdoor activity at 10:00 AM for optimal air quality benefits."</p>
               </div>
            </div>
          </div>
        </aside>

        {/* MAIN FEATURE CANVAS */}
        <main className="flex-grow flex flex-col gap-10 min-w-0">
          <section className="glass rounded-[4rem] p-10 md:p-16 relative overflow-hidden border-white/10 min-h-[700px] flex flex-col shadow-2xl">
            {activeTab === 'map' && (
              <div className="h-full flex flex-col animate-in fade-in zoom-in-95 duration-700">
                 <div className="flex justify-between items-start mb-12">
                    <div className="space-y-3">
                      <h2 className="text-5xl font-black tracking-tighter">Global Particle Trace</h2>
                      <p className="text-white/40 max-w-xl text-lg">Visualizing real-time atmospheric data streams across all monitoring nodes.</p>
                    </div>
                 </div>
                 <div className="flex-grow relative bg-[#01030a] rounded-[3.5rem] border border-white/10 overflow-hidden flex items-center justify-center group shadow-inner">
                    <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-all duration-1000 scale-105 group-hover:scale-100" alt="Map" />
                    <div className="relative z-10 text-center glass p-12 rounded-full border-sky-500/20 max-w-md backdrop-blur-3xl shadow-2xl">
                       <div className="w-20 h-20 border-[6px] border-sky-500 border-t-transparent animate-spin rounded-full mx-auto mb-8"></div>
                       <p className="text-sky-400 font-black uppercase tracking-[0.4em] text-sm">Calibrating Geodata Matrix...</p>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'scan' && (
              <div className="h-full flex flex-col animate-in slide-in-from-right-12 duration-700">
                 <h2 className="text-5xl font-black tracking-tighter mb-12">Vision Analysis Engine</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-grow">
                    <div className="flex flex-col items-center justify-center border-[3px] border-dashed border-white/5 rounded-[4rem] p-12 hover:border-sky-500/40 transition-all bg-white/[0.02] group cursor-pointer relative overflow-hidden">
                       <input type="file" id="vision-scan" className="hidden" accept="image/*" onChange={handleFileChange} />
                       <label htmlFor="vision-scan" className="cursor-pointer text-center relative z-10">
                          <div className="w-28 h-28 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 mx-auto mb-10 shadow-[0_0_60px_rgba(56,189,248,0.2)] group-hover:scale-110 transition-all duration-500">
                             <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                          </div>
                          <h3 className="text-3xl font-black mb-4">Ingest Environment</h3>
                          <p className="text-white/40 text-lg max-w-sm mx-auto">Kindly provide a photograph of your local environment for deep vision analysis.</p>
                       </label>
                    </div>
                    <div className="glass rounded-[4rem] p-12 flex flex-col border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent">
                       {isScanning ? (
                          <div className="flex-grow flex flex-col items-center justify-center space-y-8">
                             <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent animate-spin rounded-full"></div>
                             <p className="text-sky-400 font-black uppercase tracking-[0.4em] text-xs animate-pulse">Running Environmental Diagnostics...</p>
                          </div>
                       ) : scanResult ? (
                          <div className="space-y-12 animate-in zoom-in-95 duration-700">
                             <div className="flex justify-between items-center"><span className="text-[11px] font-black uppercase text-white/30 tracking-[0.5em]">Diagnostics Result</span></div>
                             <div className="flex items-baseline gap-6">
                                <div className="text-8xl font-black tracking-tighter text-white">{scanResult.riskScore}</div>
                                <div className="text-white/30 font-black uppercase text-xs tracking-widest">Risk Index</div>
                             </div>
                             <div className="space-y-2">
                                <p className="text-4xl font-black text-sky-400 uppercase tracking-tighter">{scanResult.pollutant}</p>
                                <p className="text-white/40 text-sm font-bold tracking-widest uppercase">Primary Trace</p>
                             </div>
                             <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 italic text-white/80 text-lg leading-relaxed shadow-xl">
                                "{scanResult.recommendation}"
                             </div>
                          </div>
                       ) : (
                          <div className="flex-grow flex flex-col items-center justify-center text-white/10">
                             <p className="font-black tracking-[0.6em] uppercase text-xs">Awaiting Data Ingestion</p>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'predict' && (
              <div className="h-full flex flex-col animate-in fade-in duration-700">
                 <h2 className="text-5xl font-black tracking-tighter mb-16">Intelligence Forecast</h2>
                 <div className="flex-grow min-h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={forecastData}>
                        <defs><linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/><stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="time" stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                        <Tooltip 
                           contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '24px', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} 
                           itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="aqi" stroke="#38bdf8" fill="url(#colorAqi)" strokeWidth={4} />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
            )}
            
            {activeTab === 'routes' && (
               <div className="h-full flex flex-col animate-in slide-in-from-bottom-12 duration-700">
                  <h2 className="text-5xl font-black tracking-tighter mb-12">Spatial Navigation</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 flex-grow">
                     <div className="md:col-span-2 relative bg-white/5 rounded-[4rem] border border-white/10 overflow-hidden shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1517511620798-cec17d428bc0?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20 scale-105" alt="Routes" />
                        <div className="absolute inset-0 p-12 flex flex-col justify-end">
                          <div className="glass p-8 rounded-[2.5rem] max-w-md border-white/10 backdrop-blur-2xl">
                            <p className="text-2xl font-black mb-2 uppercase tracking-tighter">Planetary Corridor A</p>
                            <p className="text-sm text-white/50 leading-relaxed">Optimization suggested via Green Corridor based on real-time atmospheric sensor feeds.</p>
                          </div>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="p-8 glass rounded-[2.5rem] border-sky-500/20 bg-sky-500/5 cursor-pointer hover:border-sky-500 transition-all group shadow-xl">
                           <h4 className="text-xl font-black group-hover:text-sky-400 transition-colors uppercase tracking-tight">Prime Path</h4>
                           <p className="text-xs font-bold text-white/30 mt-2 uppercase tracking-widest">Recommended for morning activity</p>
                        </div>
                        <div className="p-8 glass rounded-[2.5rem] border-white/5 bg-white/5 cursor-pointer hover:border-white/20 transition-all group">
                           <h4 className="text-xl font-black group-hover:text-white transition-colors uppercase tracking-tight">Eco Transit</h4>
                           <p className="text-xs font-bold text-white/30 mt-2 uppercase tracking-widest">Safest for urban travel</p>
                        </div>
                     </div>
                  </div>
               </div>
            )}
          </section>

          {/* AI INTELLIGENCE CENTER */}
          <section className="glass rounded-[5rem] p-12 md:p-20 border-white/10 flex flex-col lg:flex-row gap-16 bg-gradient-to-tr from-white/[0.03] to-transparent shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 blur-[120px] rounded-full pointer-events-none"></div>
             <div className="lg:w-1/3 space-y-10 relative z-10">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-black uppercase tracking-[0.4em]">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                  Polite AI Support
                </div>
                <h3 className="text-5xl font-black tracking-tighter leading-none">Your Atmospheric<br />Concierge.</h3>
                <p className="text-white/50 text-lg leading-relaxed font-medium">Please feel free to ask about AQI metrics, health precautions, or environmental trends.</p>
                <div className="flex flex-wrap gap-3">
                   {['Is it safe to run?', 'Explain PM2.5 levels', 'Today\'s health tip'].map(t => (
                     <button key={t} onClick={() => setUserInput(t)} className="text-[11px] px-6 py-3 rounded-2xl border border-white/5 text-white/40 hover:text-white hover:border-sky-500/50 transition-all bg-white/[0.03] font-bold uppercase tracking-widest">{t}</button>
                   ))}
                </div>
             </div>
             <div className="flex-grow flex flex-col bg-black/60 rounded-[3.5rem] border border-white/5 overflow-hidden h-[550px] shadow-inner relative z-10">
                <div className="flex-grow overflow-y-auto p-10 space-y-8 custom-scrollbar">
                   {chatMessages.map((m, i) => (
                     <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4`}>
                        <div className={`max-w-[80%] px-8 py-5 rounded-[2.2rem] text-base leading-relaxed ${m.role === 'user' ? 'bg-sky-600 text-white rounded-br-none shadow-xl' : 'bg-white/5 text-white/90 border border-white/10 rounded-bl-none'}`}>
                          {m.text}
                        </div>
                     </div>
                   ))}
                   {isTyping && <div className="flex gap-2.5 p-5 bg-white/5 rounded-3xl w-fit"><span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></span><span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:0.2s]"></span><span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:0.4s]"></span></div>}
                   <div ref={chatEndRef} />
                </div>
                <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-5 backdrop-blur-3xl">
                   <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Kindly ask GeoTrace a question..." className="flex-grow bg-white/5 border border-white/10 rounded-[1.8rem] px-8 py-5 text-base focus:border-sky-500/50 focus:outline-none transition-all placeholder:text-white/20" />
                   <button onClick={handleSendMessage} className="w-16 h-16 bg-sky-500 rounded-[1.8rem] flex items-center justify-center text-white active:scale-90 transition-all shadow-xl shadow-sky-500/20"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></button>
                </div>
             </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
