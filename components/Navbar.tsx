
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogin, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8 flex justify-center pointer-events-none">
      <div className="max-w-[1400px] w-full flex items-center justify-between bg-white/90 backdrop-blur-2xl px-10 py-5 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50 pointer-events-auto">
        <div 
          className="flex items-center gap-4 group cursor-pointer active:scale-95 transition-transform"
          onClick={() => navigate('/')}
        >
          <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black shadow-lg shadow-slate-900/10 transition-transform">
            G
          </div>
          <span className="brand-font text-2xl font-black tracking-tighter text-slate-900">GEOTRACE AI</span>
        </div>

        <div className="hidden sm:flex items-center gap-12">
          {navLinks.map((link) => (
            link.path.startsWith('#') ? (
              <a 
                key={link.name} 
                href={link.path}
                className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-slate-900 transition-all"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all relative group ${
                  location.pathname === link.path ? 'text-sky-500' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <div className="flex items-center gap-6">
               <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-500 hover:text-sky-600 transition-all hidden lg:block"
               >
                  Console
               </button>
               <button 
                  onClick={onLogout}
                  className="px-8 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 transition-all active:scale-95"
               >
                  Logout
               </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="px-10 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-xl shadow-sky-500/20 active:scale-95"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
