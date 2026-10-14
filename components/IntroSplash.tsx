
import React, { useEffect, useState } from 'react';

const IntroSplash: React.FC = () => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => (p < 100 ? p + 1.2 : 100));
    }, 20);

    const stages = [
      setTimeout(() => setStage(1), 800),
      setTimeout(() => setStage(2), 1800),
      setTimeout(() => setStage(3), 2800),
      setTimeout(() => setIsExiting(true), 4000)
    ];

    return () => {
      clearInterval(timer);
      stages.forEach(s => clearTimeout(s));
    };
  }, []);

  const bootMessages = [
    "Establishing Satellite Link...",
    "Synchronizing Atmospheric Sensors...",
    "Calibrating Neural Mapping...",
    "Protocols Active. Welcome."
  ];

  return (
    <div className={`fixed inset-0 bg-[#010409] flex flex-col items-center justify-center z-[100] transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Cinematic Background Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: 'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#010409] via-transparent to-[#010409]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">
        {/* Animated Brand Mark */}
        <div className="mb-16 relative">
          <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-[0_0_100px_rgba(56,189,248,0.3)] animate-pulse relative z-10">
            <span className="text-white text-5xl font-black">G</span>
          </div>
          <div className="absolute -inset-8 bg-sky-500/10 blur-[60px] rounded-full animate-pulse"></div>
        </div>

        <div className="space-y-8">
          <div className="overflow-hidden">
             <h1 className="text-4xl md:text-5xl font-black tracking-[0.3em] text-white uppercase brand-font animate-in slide-in-from-bottom-full duration-1000">
               GEOTRACE <span className="text-sky-400">AI</span>
             </h1>
          </div>
          
          <div className="h-6 flex flex-col items-center justify-center">
            <p className="text-[10px] font-bold tracking-[0.5em] text-sky-400/60 uppercase animate-in fade-in duration-700">
               {bootMessages[stage]}
            </p>
          </div>

          <div className="w-64 h-[2px] bg-white/5 mx-auto relative overflow-hidden rounded-full mt-10">
            <div 
              className="h-full bg-sky-500 shadow-[0_0_20px_#38bdf8] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroSplash;
