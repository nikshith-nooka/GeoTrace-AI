
import React from 'react';

interface HomePageProps {
  onExplore: () => void;
  onLogin: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onExplore, onLogin }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      
      {/* Enhanced Cinematic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 blur-[1px]"
        >
          <source 
            src="https://media.istockphoto.com/id/2154816569/video/power-plant-exhaust-chimney.mp4?s=mp4-640x640-is&k=20&c=_t9P-7EMjYWYmm_FFFkBFp0Y1yjnfM5yp-raKq2qPTo=" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/30 to-black"></div>
        <div className="absolute inset-0 backdrop-blur-[1px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl px-8 flex flex-col items-center justify-center text-center py-24">
        
        <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white/90 text-[10px] font-bold uppercase tracking-[0.5em] mb-14 animate-in slide-in-from-top-6 duration-1000 backdrop-blur-3xl shadow-2xl">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
          </span>
          Atmospheric Intelligence • Active
        </div>

        <div className="relative mb-14">
           <h1 className="text-[clamp(3.5rem,12vw,9rem)] font-extrabold tracking-tighter mb-4 leading-[0.8] animate-in fade-in zoom-in-95 duration-1000 text-white select-none filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] uppercase">
             TRACE THE <br />
             FUTURE <span className="text-sky-400/95">AIR.</span>
           </h1>
        </div>

        <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto mb-20 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Welcome to GeoTrace. We provide ultra-high resolution environmental insights for a cleaner, safer planet.
        </p>

        {/* Dual Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <button
            onClick={onExplore}
            className="w-full sm:w-auto px-16 py-7 rounded-[2rem] bg-sky-500 hover:bg-sky-400 text-white font-black text-xl transition-all flex items-center justify-center gap-5 group active:scale-95 shadow-[0_30px_60px_rgba(56,189,248,0.25)] hover:shadow-[0_40px_80px_rgba(56,189,248,0.4)]"
          >
            INITIATE TRACE
            <svg className="w-6 h-6 group-hover:translate-x-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          
          <button
            onClick={onLogin}
            className="w-full sm:w-auto px-16 py-7 rounded-[2rem] bg-white/5 hover:bg-white/10 backdrop-blur-3xl text-white font-black text-xl transition-all active:scale-95 border border-white/20 hover:border-white/40 shadow-2xl"
          >
            SYSTEM CONSOLE
          </button>
        </div>

        <div className="mt-32 pt-12 border-t border-white/5 w-full max-w-sm animate-in fade-in duration-1000 delay-500">
          <p className="text-[11px] font-black uppercase tracking-[0.7em] text-white/20">Secured Environmental Node Matrix</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
