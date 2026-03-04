import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { supabase } from '../utils/supabase.js';
dotenv.config();

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { pantry, count = 5 } = req.body;

        // 1. Intentar buscar en la base de datos local (global_recipes) primero
        try {
            const { data: globalRecipes } = await supabase.from('global_recipes').select('*');
            if (globalRecipes && globalRecipes.length > 0) {
                const pantryItems = (pantry || []).map(p => p.toLowerCase());

                // Puntuar recetas según ingredientes coincidentes
                const scored = globalRecipes.map(r => {
                    let matchCount = 0;
                    if (pantryItems.length > 0 && Array.isArray(r.ingredients)) {
                        r.ingredients.forEach(ing => {
                            const ingLow = ing.toLowerCase();
                            if (pantryItems.some(p => ingLow.includes(p) || p.includes(ingLow))) {
                                matchCount++;
                            }
                        });
                    }
                    // Dar un poco de aleatoriedad para que no salgan siempre las mismas recetas
                    return { ...r, matchCount: matchCount + Math.random() * 0.5 };
                });

                scored.sort((a, b) => b.matchCount - a.matchCount);

                const topRecipes = scored.slice(0, count).map(r => ({
                    id: r.id,
                    title: r.title,
                    image: r.image_url || '',
                    time: r.prep_time,
                    difficulty: r.difficulty || 'Media',
                    ingredients: r.ingredients || [],
                    category: r.category || 'Sugerencia'
                }));

                // Si encontramos recetas con al menos 1 ingrediente en común, o la despensa está vacía, devolvemos la caché
                // para ahorrar muchísimos tokens de IA.
                if (topRecipes.some(r => r.matchCount >= 1) || pantryItems.length === 0) {
                    console.log(`[Cache Hit] Sirviendo ${topRecipes.length} recetas desde base de datos local.`);
                    return res.status(200).json(topRecipes);
                }
            }
        } catch (dbErr) {
            console.error('Error buscando recetas en cache:', dbErr);
        }

        // 2. Fallback a Gemini si no hay buenos matches
        if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY no configurada');

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Actúa como un Chef experto en cocina de aprovechamiento. 
Tu misión es proponer exactamente ${count} recetas distintas y creativas utilizando **estricta y exclusivamente** la siguiente lista de ingredientes que hay en la despensa: ${pantry && pantry.length > 0 ? pantry.join(', ') : 'Despensa vacía, en este caso puedes sugerir 5 recetas básicas con ingredientes muy comunes que cualquiera suele tener'}. 

Para cada receta, devuelve el siguiente formato, respondiendo SOLO con un JSON Array válido:
[
  {
    "id": "Un id único tipo string inventado, ej: p1",
    "title": "Nombre de la receta",
    "image": "Simplemente devuelve un string vacío '' o null. No es necesario.",
    "time": "Tiempo en minutos, ej: 15 min",
    "difficulty": "Dificultad, ej: Fácil, Media",
    "ingredients": ["Ingrediente 1", "Ingrediente 2"],
    "category": "Una categoría corta, ej: Cena rápida, Postre"
  }
]

Asegúrate de que las recetas propuestas realmente tengan sentido culinario y coincidan plenamente con los ingredientes indicados de la despensa (puedes asumir un mínimo de sal, aceite y agua). DEBES DEVOLVER EXACTAMENTE UN ARRAY JSON. No utilices Markdown alrededor del JSON.`;

        const result = await model.generateContent(prompt);
        let text = result.response.text();

        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            text = jsonMatch[0];
        }

        const recipesData = JSON.parse(text);

        return res.status(200).json(recipesData);

    } catch (error) {
        console.error('Pantry Recipes API Error:', error);
        return res.status(500).json({
            error: 'No pudimos generar las recetas para tu despensa',
            details: error.message
        });
    }
}
