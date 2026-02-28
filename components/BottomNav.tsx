
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 sm:max-w-[430px] sm:mx-auto bg-white/95 backdrop-blur-xl border-t border-gray-100 px-12 pt-3 pb-8 flex justify-between items-center z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
      <button 
        onClick={() => navigate('/')}
        className={`flex flex-col items-center gap-1 transition-all ${isActive('/') ? 'text-primary' : 'text-gray-400'}`}
      >
        <span className={`material-symbols-outlined text-[28px] ${isActive('/') ? 'filled' : ''}`}>home</span>
        <span className="text-[11px] font-bold">首页</span>
      </button>

      <div className="relative flex justify-center">
        <button 
          onClick={() => navigate('/create')}
          className="bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center -mt-10 shadow-xl shadow-orange-200 ring-[6px] ring-white active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-[32px] font-bold">add</span>
        </button>
      </div>

      <button 
        onClick={() => navigate('/profile')}
        className={`flex flex-col items-center gap-1 transition-all ${isActive('/profile') ? 'text-primary' : 'text-gray-400'}`}
      >
        <span className={`material-symbols-outlined text-[28px] ${isActive('/profile') ? 'filled' : ''}`}>person</span>
        <span className="text-[11px] font-bold">我</span>
      </button>
    </nav>
  );
};

export default BottomNav;
