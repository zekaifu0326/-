import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import supabase from './supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable permissive CORS for Vercel integration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Gemini Client
const getAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// ----------------------------------------------------------------------------
// Recipe Routes
// ----------------------------------------------------------------------------

app.get('/api/recipes', async (req, res) => {
    if (!supabase) {
        return res.status(503).json({ error: 'Supabase not configured' });
    }

    try {
        const { data: recipes, error } = await supabase
            .from('recipes')
            .select('*, author:users!recipes_author_id_fkey(*)');

        if (error) throw error;

        // Fetch tags, ingredients, and steps for each recipe (simplified approach for now)
        const enrichedRecipes = await Promise.all(recipes.map(async (recipe) => {
            const { data: ingredients } = await supabase
                .from('ingredients')
                .select('*')
                .eq('recipe_id', recipe.id);

            const { data: steps } = await supabase
                .from('steps')
                .select('*')
                .eq('recipe_id', recipe.id)
                .order('number', { ascending: true });

            return {
                id: recipe.id,
                title: recipe.title,
                coverImage: recipe.cover_image,
                author: recipe.author ? {
                    name: recipe.author.name,
                    avatar: recipe.author.avatar,
                    description: recipe.author.description,
                    followers: recipe.author.followers?.toString() || "0",
                } : { name: "未知作者", avatar: "https://picsum.photos/100/100?random=0" },
                stats: {
                    views: recipe.views?.toString() || "0",
                    likes: recipe.likes || 0,
                    bookmarks: recipe.bookmarks || 0,
                },
                tags: recipe.tags || [],
                cookingTime: recipe.cooking_time,
                cost: recipe.cost,
                description: recipe.description,
                ingredients: ingredients || [],
                steps: steps || []
            };
        }));

        res.json(enrichedRecipes);
    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/recipes/:id', async (req, res) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not configured' });

    try {
        const { data: recipe, error } = await supabase
            .from('recipes')
            .select('*, author:users!recipes_author_id_fkey(*)')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

        const { data: ingredients } = await supabase
            .from('ingredients')
            .select('*')
            .eq('recipe_id', recipe.id);

        const { data: steps } = await supabase
            .from('steps')
            .select('*')
            .eq('recipe_id', recipe.id)
            .order('number', { ascending: true });

        res.json({
            id: recipe.id,
            title: recipe.title,
            coverImage: recipe.cover_image,
            author: recipe.author ? {
                name: recipe.author.name,
                avatar: recipe.author.avatar,
                description: recipe.author.description,
                followers: recipe.author.followers?.toString() || "0",
            } : { name: "未知作者", avatar: "https://picsum.photos/100/100?random=0" },
            stats: {
                views: recipe.views?.toString() || "0",
                likes: recipe.likes || 0,
                bookmarks: recipe.bookmarks || 0,
            },
            tags: recipe.tags || [],
            cookingTime: recipe.cooking_time,
            cost: recipe.cost,
            description: recipe.description,
            ingredients: ingredients || [],
            steps: steps || []
        });
    } catch (err) {
        console.error('Error fetching recipe details:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/recipes', async (req, res) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase not configured' });

    try {
        const {
            title,
            description,
            coverImage,
            tags,
            cookingTime,
            cost,
            ingredients,
            steps,
            authorId
        } = req.body;

        // Ensure anonymous user exists if authorId is not provided
        let currentAuthorId = authorId;
        if (!currentAuthorId) {
            currentAuthorId = '00000000-0000-0000-0000-000000000000';
            const { data: userExists } = await supabase
                .from('users')
                .select('id')
                .eq('id', currentAuthorId)
                .single();

            if (!userExists) {
                // Create the stub user
                const { error: insertUserError } = await supabase.from('users').insert([{
                    id: currentAuthorId,
                    name: '匿名用户 (Anonymous)',
                    avatar: 'https://picsum.photos/100/100?random=0'
                }]);

                if (insertUserError) {
                    console.error('Failed to create stub user:', insertUserError);
                    throw new Error(`User creation failed: ${insertUserError.message}`);
                }
            }
        }

        // 1. Insert Recipe
        const { data: recipe, error: recipeError } = await supabase
            .from('recipes')
            .insert([{
                title,
                description,
                cover_image: coverImage,
                tags,
                cooking_time: cookingTime,
                cost,
                author_id: currentAuthorId
            }])
            .select()
            .single();

        if (recipeError) throw recipeError;

        // 2. Insert Ingredients
        if (ingredients && ingredients.length > 0) {
            const { error: ingError } = await supabase
                .from('ingredients')
                .insert(ingredients.map(ing => ({
                    recipe_id: recipe.id,
                    name: ing.name,
                    amount: ing.amount
                })));
            if (ingError) throw ingError;
        }

        // 3. Insert Steps
        if (steps && steps.length > 0) {
            const { error: stepError } = await supabase
                .from('steps')
                .insert(steps.map((step, idx) => ({
                    recipe_id: recipe.id,
                    number: idx + 1,
                    description: step.description,
                    image: step.image || null
                })));
            if (stepError) throw stepError;
        }

        res.status(201).json({ message: 'Recipe created successfully', recipeId: recipe.id });
    } catch (err) {
        console.error('Error creating recipe:', err);
        res.status(500).json({ error: err.message });
    }
});

// ----------------------------------------------------------------------------
// Gemini Routes
// ----------------------------------------------------------------------------

app.post('/api/gemini/generate', async (req, res) => {
    try {
        const { ingredients } = req.body;
        if (!ingredients) {
            return res.status(400).json({ error: 'Ingredients are required' });
        }

        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `根据以下食材提供一个适合留学生的食谱：${ingredients}。请返回JSON格式，包含：title (标题), description (简短描述), ingredients (数组, 每项包含name和amount), steps (数组, 每项包含description)。`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        ingredients: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    amount: { type: Type.STRING }
                                }
                            }
                        },
                        steps: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    description: { type: Type.STRING }
                                }
                            }
                        }
                    },
                    required: ["title", "description", "ingredients", "steps"]
                }
            }
        });

        const result = JSON.parse(response.text);
        res.json(result);
    } catch (err) {
        console.error('Error with Gemini AI:', err);
        res.status(500).json({ error: 'Failed to generate recipe idea' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
