
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateRecipeIdea } from '../services/geminiService';

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('宿舍5分钟快手番茄面');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([
    { name: '挂面', amount: '1把' },
    { name: '鸡蛋', amount: '2个' }
  ]);
  const [steps, setSteps] = useState([{ description: '' }]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [coverImage, setCoverImage] = useState<string>('https://lh3.googleusercontent.com/aida-public/AB6AXuA1tnPq5WpLV9zKU9ILi4h4CpF2bhxogIh0s_rulPIZb_5uoJM16qIz5XmxWtK6qPQtHMIb07NrFltcOsSVcNDBCU09mp5JE6QWVPcXdozSWtGgBQDTSToGiJ-6sVulo3zNUmVapShmCxbdR59BYGLUh6orreYLUB4--ACil2zCbHhkY42qEPwiIZKG5O1GAg-tdm9TKr-rmPo_acULSWrGc8DiCvXBnsp8jRtEI29ybFhc4ByQIQf_a7FEbPBhf77UBxwvvScB7ugH');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => setIngredients([...ingredients, { name: '', amount: '' }]);
  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: 'name' | 'amount', value: string) => {
    const newIng = [...ingredients];
    newIng[index][field] = value;
    setIngredients(newIng);
  };

  const addStep = () => setSteps([...steps, { description: '' }]);

  const handlePublish = async () => {
    if (!title) return alert('请先输入菜名');
    setPublishing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          coverImage,
          ingredients,
          steps,
          tags: ['最新首发'],
          cookingTime: '15min',
          cost: '£5'
        })
      });
      if (response.ok) {
        alert('发布成功！');
        navigate('/');
      } else {
        alert('发布失败');
      }
    } catch (error) {
      console.error(error);
      alert('发布失败，请重试');
    } finally {
      setPublishing(false);
    }
  };

  const handleAISuggest = async () => {
    if (!title) return alert('请先输入一个大致的菜名或关键词');
    setLoading(true);
    try {
      const result = await generateRecipeIdea(title);
      setTitle(result.title);
      setDescription(result.description);
      setIngredients(result.ingredients);
      setSteps(result.steps);
    } catch (error) {
      console.error(error);
      alert('AI生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="sticky top-0 z-50 flex items-center bg-white/95 backdrop-blur-md px-5 py-4 justify-between border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-start text-gray-600">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="text-gray-900 text-[18px] font-bold flex-1 text-center">发布帖子</h2>
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="bg-primary text-white text-[15px] font-bold px-6 py-2 rounded-full shadow-md active:scale-95 disabled:opacity-50"
        >
          {publishing ? '发布中...' : '发布'}
        </button>
      </div>

      <div className="p-5 space-y-6">
        <div className="flex overflow-x-auto no-scrollbar gap-3 pt-2">
          <label className="flex-shrink-0 w-[160px] h-[160px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-primary/50 relative overflow-hidden">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            {coverImage && coverImage.startsWith('data:image') ? (
              <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <>
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                </div>
                <span className="text-xs font-bold text-gray-400">添加封面</span>
              </>
            )}
          </label>
        </div>

        <div className="flex items-center gap-4">
          <input
            className="flex-1 bg-white border border-gray-200 rounded-xl p-4 text-[19px] font-bold focus:ring-primary/20 text-dark-grey"
            placeholder="填写标题..."
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={handleAISuggest}
            disabled={loading}
            className="bg-primary-light text-primary px-4 py-4 rounded-xl font-bold flex flex-col items-center justify-center text-[10px] min-w-[70px] active:scale-90 transition-transform disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px] mb-1">auto_awesome</span>
            {loading ? '生成中...' : 'AI助手'}
          </button>
        </div>

        <textarea
          className="w-full bg-white border border-gray-200 rounded-xl p-4 min-h-[120px] text-[16px] leading-relaxed text-dark-grey"
          placeholder="分享这道菜的心得或故事..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <div className="h-[1px] bg-gray-100"></div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[18px] font-bold text-gray-900">食材清单</h3>
            <button onClick={addIngredient} className="flex items-center gap-1.5 text-primary text-[15px] font-bold active:scale-95">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              添加食材
            </button>
          </div>
          <div className="space-y-3 px-1">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-2.5 items-center w-full">
                <input
                  className="flex-1 bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-[15px] focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all text-dark-grey font-medium"
                  placeholder="食材名"
                  value={ing.name}
                  onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                />
                <input
                  className="w-24 bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-[15px] focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all text-center text-dark-grey font-medium"
                  placeholder="用量"
                  value={ing.amount}
                  onChange={(e) => updateIngredient(idx, 'amount', e.target.value)}
                />
                <button
                  onClick={() => removeIngredient(idx)}
                  className="flex-shrink-0 p-2 text-slate-300 hover:text-red-400 active:scale-90 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 pt-6">
          <h3 className="text-[18px] font-bold text-gray-900">烹饪步骤</h3>
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="w-7 h-7 flex-shrink-0 rounded-full bg-primary text-white flex items-center justify-center text-[14px] font-bold">{idx + 1}</div>
              <div className="flex-1 space-y-4">
                <textarea
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 text-[15px] min-h-[80px] text-dark-grey"
                  placeholder="具体描述这一步..."
                  value={step.description}
                  onChange={(e) => {
                    const newSteps = [...steps];
                    newSteps[idx].description = e.target.value;
                    setSteps(newSteps);
                  }}
                ></textarea>
                <div className="w-24 h-24 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                  <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addStep} className="w-full py-4 border border-dashed border-gray-200 rounded-xl text-gray-400 font-bold active:bg-gray-50">
            点击添加下一步
          </button>
        </div>

        <div className="py-10 text-center">
          <button className="flex items-center gap-2 mx-auto px-8 py-3.5 text-gray-400 text-[15px] font-bold">
            <span className="material-symbols-outlined text-xl">inventory_2</span>
            保存到草稿箱
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
