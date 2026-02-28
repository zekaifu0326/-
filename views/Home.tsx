
import React, { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types';

const CATEGORIES = ['精选', '快手菜', '空气炸锅', '家乡味', '宿舍减脂'];

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState('精选');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/recipes`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRecipes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch recipes:', err);
        setLoading(false);
      });
  }, []);


  return (
    <div className="bg-white min-h-screen">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-50">
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[26px]">cooking</span>
            </div>
            <h1 className="text-[22px] font-black tracking-tight text-dark-grey">留学生小灶</h1>
          </div>
          <button className="size-10 flex items-center justify-center rounded-full bg-slate-100/80">
            <span className="material-symbols-outlined text-dark-grey text-[22px]">notifications</span>
          </button>
        </div>

        <div className="px-5 pb-3">
          <div className="relative flex items-center group">
            <div className="absolute left-4 text-slate-400 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined text-[22px]">search</span>
            </div>
            <input
              className="w-full h-[48px] pl-11 pr-5 bg-slate-100/60 border-none rounded-full focus:ring-2 focus:ring-primary/30 text-[15px] placeholder:text-slate-400"
              placeholder="想吃点什么食材？"
              type="text"
            />
          </div>
        </div>

        <div className="flex gap-3 px-5 py-3.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex h-8 shrink-0 items-center justify-center rounded-full px-5 transition-all text-[13px] font-bold ${activeTab === cat ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'bg-slate-100 text-medium-grey'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 py-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2">restaurant_menu</span>
            <p>暂无食谱，去发布一个吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              {recipes.filter((_, i) => i % 2 === 0).map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {recipes.filter((_, i) => i % 2 !== 0).map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
