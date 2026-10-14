import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-32 space-y-40 animate-in fade-in duration-1000">
      {/* Product Mission */}
      <section className="flex flex-col md:flex-row gap-20 items-center">
        <div className="md:w-1/2 space-y-8">
          <div className="text-sky-400 font-bold tracking-[0.4em] uppercase text-xs">The Vision</div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">Making the Invisible Visible</h2>
          <p className="text-white/60 leading-relaxed text-xl font-medium">
            GeoTrace AI is built to bridge the gap between complex environmental data and human understanding. 
            We utilize high-resolution 3D mapping and advanced vision models to provide a definitive view of atmospheric health across the planet.
          </p>
          <div className="pt-6 flex gap-12">
             <div className="space-y-2">
               <div className="text-4xl font-black text-white tracking-tighter">Real-Time</div>
               <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Analysis Speed</div>
             </div>
             <div className="space-y-2">
               <div className="text-4xl font-black text-white tracking-tighter">99.9%</div>
               <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Data Accuracy</div>
             </div>
          </div>
        </div>
        <div className="md:w-1/2 relative">
           <div className="aspect-square rounded-[4rem] bg-gradient-to-br from-sky-500/20 to-indigo-500/10 border border-white/10 flex items-center justify-center p-10 overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
                alt="Earth Data" 
                className="w-full h-full object-cover rounded-[3rem] opacity-50 group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-16 left-16 right-16 text-center">
                 <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Global Sensing Network</h4>
              </div>
           </div>
        </div>
      </section>

      {/* Core Technology */}
      <section className="space-y-16">
         <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Advanced Infrastructure</h2>
            <p className="text-white/40 text-lg">Harnessing the power of the latest AI and spatial rendering technologies.</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Vision Intelligence', desc: 'Analyzing physical environments through hyper-local image processing.' },
              { title: 'Predictive Flow', desc: 'Forecasting atmospheric changes using deep learning temporal models.' },
              { title: 'Spatial Mapping', desc: 'Intuitive 3D globe visualization for global data accessibility.' }
            ].map((tech, i) => (
              <div key={i} className="glass p-10 rounded-[3rem] border-white/5 hover:border-sky-500/30 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400 mb-8 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight uppercase">{tech.title}</h3>
                <p className="text-white/40 leading-relaxed">{tech.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Philosophy Section */}
      <section className="glass rounded-[5rem] p-16 md:p-32 border-white/5 bg-gradient-to-tr from-white/[0.02] to-transparent text-center space-y-12">
         <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">Built for the <br /> <span className="text-sky-500">Next Generation</span></h2>
         <p className="text-white/40 text-xl max-w-2xl mx-auto leading-relaxed">
            We believe that clean air is a fundamental right. GeoTrace AI provides the tools needed to monitor, protect, and advocate for environmental transparency.
         </p>
         <button className="px-12 py-6 rounded-2xl bg-white text-black font-black uppercase text-sm tracking-widest hover:bg-sky-400 hover:text-white transition-all shadow-2xl">Get Involved</button>
      </section>
    </div>
  );
};

export default AboutPage;