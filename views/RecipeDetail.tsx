
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Recipe, Comment } from '../types';

const RecipeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch(`/api/recipes/${id}`)
      .then(res => res.json())
      .then(data => {
        setRecipe(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex justify-center flex-col items-center min-h-screen bg-white text-medium-grey">
        <span className="material-symbols-outlined text-4xl mb-4 text-gray-300">search_off</span>
        <p>未找到该食谱</p>
        <button onClick={() => navigate('/')} className="mt-4 text-primary font-bold">返回首页</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center p-4 justify-between h-16">
        <button onClick={() => navigate(-1)} className="text-dark-grey flex w-10 shrink-0 items-center justify-start">
          <span className="material-symbols-outlined text-[24px]">arrow_back_ios</span>
        </button>
        <h2 className="text-dark-grey text-[18px] font-bold leading-tight flex-1 text-center">留学生小灶</h2>
        <div className="flex w-10 items-center justify-end">
          <button className="text-dark-grey">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
      </div>

      <div className="relative w-full aspect-square bg-gray-200 overflow-hidden">
        <div
          className="w-full h-full bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: `url("${recipe.coverImage}")` }}
        ></div>
        <div className="absolute bottom-6 left-6 flex gap-2.5">
          <span className="px-4 py-1.5 bg-primary text-white text-[12px] font-bold rounded-full shadow-sm">超简单</span>
          <span className="px-4 py-1.5 bg-black/40 backdrop-blur-md text-white text-[12px] font-bold rounded-full">25分钟</span>
          <span className="px-4 py-1.5 bg-black/40 backdrop-blur-md text-white text-[12px] font-bold rounded-full">£5以下</span>
        </div>
      </div>

      <div className="px-6 pt-8 pb-4">
        <h1 className="text-dark-grey text-2xl font-bold leading-tight mb-4 tracking-tight">{recipe.title}</h1>
        <div className="flex items-center gap-6 text-medium-grey text-[14px]">
          <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">visibility</span> {recipe.stats.views}</span>
          <span className="flex items-center gap-1.5 text-primary font-medium"><span className="material-symbols-outlined text-[18px] filled">favorite</span> {recipe.stats.likes}</span>
          <span className="flex items-center gap-1.5 text-primary font-medium"><span className="material-symbols-outlined text-[18px] filled">bookmark</span> {recipe.stats.bookmarks}</span>
        </div>
      </div>

      <div className="flex px-6 py-5 border-y border-gray-50 bg-white items-center justify-between">
        <div className="flex gap-4 items-center">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border border-gray-100"
            style={{ backgroundImage: `url("${recipe.author.avatar}")` }}
          ></div>
          <div className="flex flex-col justify-center">
            <p className="text-dark-grey text-sm font-bold">{recipe.author.name}</p>
            <p className="text-medium-grey text-[12px]">{recipe.author.description}</p>
          </div>
        </div>
        <button className="bg-primary text-white text-[14px] font-bold h-9 px-6 rounded-full shadow-sm shadow-primary/20">关注</button>
      </div>

      <div className="px-6 py-8">
        <p className="text-medium-grey text-[16px] leading-[1.7] font-normal">{recipe.description}</p>
      </div>

      <div className="px-6 py-8 bg-primary-light/40">
        <h3 className="text-primary text-[19px] font-bold mb-5 flex items-center gap-2.5">
          <span className="material-symbols-outlined filled text-[22px]">shopping_basket</span> 所需食材
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {recipe.ingredients.map((ing, idx) => (
            <div key={idx} className="flex justify-between items-center px-5 py-4 bg-white rounded-xl border border-orange-50 shadow-[0_2px_10px_-2px_rgba(255,107,0,0.08)]">
              <span className="text-dark-grey text-[15px] font-medium">{ing.name}</span>
              <span className="text-primary font-bold text-[15px]">{ing.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-10">
        <h3 className="text-primary text-[19px] font-bold mb-8 flex items-center gap-2.5">
          <span className="material-symbols-outlined filled text-[22px]">restaurant_menu</span> 烹饪步骤
        </h3>
        {recipe.steps.map((step, idx) => (
          <div key={idx} className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[14px]">{step.number}</div>
              <p className="text-dark-grey text-[17px] font-bold">步骤 {step.number}</p>
            </div>
            <p className="text-medium-grey text-[15px] leading-relaxed mb-5 pl-1">{step.description}</p>
            {step.image && (
              <div className="w-full aspect-[16/9] rounded-2xl bg-cover bg-center shadow-md overflow-hidden" style={{ backgroundImage: `url('${step.image}')` }}></div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[60] px-6 pb-10">
        <div className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] rounded-full px-10 py-4 flex justify-between items-center">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center flex-col gap-1 transition-colors ${isLiked ? 'text-primary' : 'text-gray-400'}`}
          >
            <span className={`material-symbols-outlined text-[26px] ${isLiked ? 'filled' : ''}`}>favorite</span>
            <span className="text-[11px] font-bold">点赞</span>
          </button>
          <div className="w-[1px] h-8 bg-gray-100"></div>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`flex items-center flex-col gap-1 transition-colors ${isBookmarked ? 'text-primary' : 'text-gray-400'}`}
          >
            <span className={`material-symbols-outlined text-[26px] ${isBookmarked ? 'filled' : ''}`}>bookmark</span>
            <span className="text-[11px] font-bold">收藏</span>
          </button>
          <div className="w-[1px] h-8 bg-gray-100"></div>
          <button className="flex items-center flex-col gap-1 text-primary">
            <span className="material-symbols-outlined filled text-[26px]">share</span>
            <span className="text-[11px] font-bold">分享</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
