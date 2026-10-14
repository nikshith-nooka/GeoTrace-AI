
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import AboutPage from './pages/AboutPage';
import IntroSplash from './components/IntroSplash';
import { GlobePage } from './pages/GlobePage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4500); 
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showSplash) {
    return <IntroSplash />;
  }

  // Hide Navbar specifically on the Explore (Globe) page to avoid UI clutter
  const hideNavbar = location.pathname === '/explore';

  return (
    <div className="min-h-screen bg-[#010409] text-white flex flex-col selection:bg-sky-500/30 overflow-x-hidden">
      {!hideNavbar && (
        <Navbar 
          isLoggedIn={isLoggedIn} 
          onLogin={handleLogin} 
          onLogout={handleLogout} 
        />
      )}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage onExplore={() => navigate('/explore')} onLogin={handleLogin} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/explore" element={<GlobePage onBack={() => navigate('/')} />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <HomePage onExplore={() => navigate('/explore')} onLogin={handleLogin} />} />
        </Routes>
      </main>

      {!hideNavbar && (
        <footer id="contact" className="py-20 px-8 border-t border-white/5 bg-[#000]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="md:col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white font-black">
                  G
                </div>
                <span className="brand-font text-2xl font-black tracking-tighter text-white">GEOTRACE AI</span>
              </div>
              <p className="text-white/40 max-w-sm text-sm leading-relaxed">
                Advancing global atmospheric tracking through cutting-edge artificial intelligence and 3D visualization.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Resources</h4>
              <div className="flex flex-col gap-4 text-sm text-white/50">
                 <a href="#" className="hover:text-sky-400 transition-colors">Documentation</a>
                 <a href="#" className="hover:text-sky-400 transition-colors">API Access</a>
                 <a href="#" className="hover:text-sky-400 transition-colors">Global Metrics</a>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Solutions</h4>
              <div className="flex flex-col gap-4 text-sm text-white/50">
                 <button onClick={() => navigate('/explore')} className="text-left hover:text-sky-400 transition-colors">3D Visualization</button>
                 <button onClick={() => navigate('/dashboard')} className="text-left hover:text-sky-400 transition-colors">Predictive Analytics</button>
                 <button onClick={() => navigate('/dashboard')} className="text-left hover:text-sky-400 transition-colors">AQI Scanning</button>
              </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
            <p>© 2026 GEOTRACE AI • Atmospheric Intelligence Protocol</p>
            <div className="flex gap-12">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
