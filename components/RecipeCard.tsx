
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/recipe/${recipe.id}`)}
      className="bg-white rounded-[22px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-50 cursor-pointer active:scale-95 transition-transform"
    >
      <div 
        className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover" 
        style={{ backgroundImage: `url("${recipe.coverImage}")` }}
      ></div>
      <div className="p-3.5">
        <h3 className="text-[14px] font-bold leading-relaxed line-clamp-2 mb-2.5 text-dark-grey">{recipe.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <div 
              className="size-5 rounded-full bg-cover flex-shrink-0" 
              style={{ backgroundImage: `url("${recipe.author.avatar}")` }}
            ></div>
            <span className="text-[11px] text-medium-grey font-medium truncate">{recipe.author.name}</span>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <span className="material-symbols-outlined text-[14px] text-slate-300">favorite</span>
            <span className="text-[11px] text-medium-grey font-medium">{recipe.stats.likes >= 1000 ? (recipe.stats.likes / 1000).toFixed(1) + 'k' : recipe.stats.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
