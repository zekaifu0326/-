
import React, { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('我的菜谱');
  const navigate = useNavigate();

  const renderTabContent = () => {
    switch (activeTab) {
      case '我的菜谱':
        return (
          <div className="grid grid-cols-2 gap-5">
            <div 
              onClick={() => navigate('/create')}
              className="flex flex-col items-center justify-center min-h-[180px] border-dashed border-2 border-slate-200 rounded-2xl text-slate-400 cursor-pointer active:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[40px]">add_circle</span>
              <span className="text-[13px] mt-2 font-medium">发布新作品</span>
            </div>
            {/* 这里将来可以循环渲染用户的菜谱 */}
          </div>
        );
      case '我的收藏':
        return (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <span className="material-symbols-outlined text-[64px] mb-4">bookmark_border</span>
            <p className="text-[14px] font-medium">还没有收藏的菜谱哦</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 text-primary text-[13px] font-bold border border-primary px-6 py-2 rounded-full active:bg-primary/5"
            >
              去首页看看
            </button>
          </div>
        );
      case '草稿箱':
        return (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <span className="material-symbols-outlined text-[64px] mb-4">drafts</span>
            <p className="text-[14px] font-medium">草稿箱空空如也</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <header className="bg-gradient-to-b from-[#f27f0d] to-[#ff9d3d] pt-14 pb-24 px-6 relative rounded-b-[3rem] shadow-xl shadow-orange-500/10 text-white">
        <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4">
          <div className="w-10"></div>
          <h1 className="text-[18px] font-bold tracking-wider">个人中心</h1>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[24px]">settings</span>
          </button>
        </nav>
        
        <div className="flex flex-col items-center mt-6">
          <div className="relative">
            <div className="w-[110px] h-[110px] rounded-full border-[4px] border-white/40 p-1.5 bg-white/20 backdrop-blur-md">
              <div 
                className="w-full h-full rounded-full bg-cover bg-center shadow-inner" 
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDVj3lo4KYSYUBGOQf0z1i5cmE5i0Dmp2-OpegqtoABC6kNuPnitk9me0b9RmB2fya-M8Oj1pwRxR3gtqFweA8wjlEQ5I7IvcXiGkpF6nyv0RF7t3edKot9wAubqbOOcVNCDc--zT6Q3JSrv1JJjw2bBnM3XRSyvKJgD4Vxr43YP2a6hf2Agnc4Fy9TQ9lKBc_VPGYzEo6u1_qE9woV44KEWyU7VODqmBR1RjX1_lOg9H8mioZ2hzi-DXKOfsxeRSypTg8JZh5egGWf')` }}
              ></div>
            </div>
            <button className="absolute bottom-1 right-1 bg-white text-primary p-2 rounded-full shadow-lg border border-orange-50 flex items-center justify-center active:scale-95">
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>
          </div>
          <div className="mt-5 text-center px-6">
            <h2 className="text-[24px] font-bold tracking-tight">伦敦小当家</h2>
            <div className="flex items-center justify-center gap-1.5 mt-1 opacity-90">
              <span className="material-symbols-outlined text-[15px]">location_on</span>
              <span className="text-[14px] font-normal">伦敦, 英国</span>
            </div>
            <p className="mt-4 text-[14px] leading-[1.6] opacity-95 font-normal max-w-[340px] mx-auto">
              伦敦留学生，重度嗜辣爱好者。擅长在宿舍有限的条件下复刻家乡味。🌶️🍳
            </p>
          </div>
        </div>
      </header>

      <section className="px-6 -mt-10 relative z-10">
        <div className="flex items-center justify-around py-6 bg-white rounded-[1.5rem] shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-orange-50/50">
          <div className="flex flex-col items-center flex-1">
            <span className="text-[20px] font-bold text-slate-800">128</span>
            <span className="text-[12px] text-slate-400 mt-1 font-medium tracking-wider">关注</span>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-[20px] font-bold text-slate-800">256</span>
            <span className="text-[12px] text-slate-400 mt-1 font-medium tracking-wider">粉丝</span>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-[20px] font-bold text-slate-800">1.2k</span>
            <span className="text-[12px] text-slate-400 mt-1 font-medium tracking-wider">获赞</span>
          </div>
        </div>
      </section>

      <section className="mt-8 bg-white sticky top-0 z-20">
        <div className="flex justify-around px-4 border-b border-slate-50">
          {['我的菜谱', '我的收藏', '草稿箱'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-4 flex-1 text-center font-bold text-[15px] transition-colors ${activeTab === tab ? 'text-primary' : 'text-slate-400'}`}
            >
              {tab}
              {activeTab === tab && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full"></span>}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 py-6 bg-white">
        {renderTabContent()}
      </section>
    </main>
  );
};

export default Profile;
