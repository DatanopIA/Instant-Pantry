import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL || 'https://dsnfusumuonwnscjjnro.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey || !process.env.GEMINI_API_KEY) {
    console.error("Faltan variables de entorno.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const categorias = [
    "Desayunos saludables",
    "Recetas Vegetarianas creativas",
    "Platos de cucharada (Sopas, Cremas)",
    "Platos principales de Carne y Pollo",
    "Recetas de Pescados",
    "Postres rápidos"
];

const iteracionesPorCat = 5;
const recetasPorLlamada = 10; // Reducido a 10 para mayor estabilidad en la IA

const filePath = path.join(__dirname, 'recetas_biblioteca.json');
let existentes = [];
if (fs.existsSync(filePath)) {
    existentes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
const titulosExistentes = new Set(existentes.map(r => r.title ? r.title.toLowerCase().trim() : ''));

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generarLote(categoria) {
    const prompt = `Actúa como un Chef experto. Necesito exactamente ${recetasPorLlamada} recetas únicas para la categoría "${categoria}".
Devuelve exclusivamente un JSON ARRAY, sin texto adicional y sin markdown. Formato recomendado:
[
  {
    "title": "Nombre",
    "description": "Descripción apetitosa",
    "prepTime": "Tiempo (ej. 15 min)",
    "difficulty": "Fácil, Media o Difícil",
    "ingredients": ["1 ing", "2 ing"],
    "instructions": ["paso 1", "paso 2"],
    "tags": ["${categoria}"]
  }
]`;

    try {
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) text = jsonMatch[0];
        return JSON.parse(text);
    } catch (e) {
        console.error(`Error generando lote de ${categoria}:`, e.message);
        return [];
    }
}

async function run() {
    let generadas = 0;

    for (const cat of categorias) {
        console.log(`\nGenerando recetas para: ${cat}`);
        for (let i = 0; i < iteracionesPorCat; i++) {
            console.log(`Lote ${i + 1}/${iteracionesPorCat} de ${cat}...`);
            let recipes = await generarLote(cat);

            const unicas = [];
            for (const r of recipes) {
                const tLine = r.title ? r.title.toLowerCase().trim() : '';
                if (tLine && !titulosExistentes.has(tLine)) {
                    titulosExistentes.add(tLine);
                    unicas.push(r);
                }
            }

            if (unicas.length > 0) {
                const formattedRecipes = unicas.map(r => ({
                    title: r.title || 'Sin Título',
                    description: r.description || '',
                    ingredients: r.ingredients || [],
                    instructions: r.instructions || [],
                    category: r.tags && r.tags.length > 0 ? r.tags[0] : null,
                    difficulty: r.difficulty || 'Media',
                    prep_time: r.prepTime || '30 min',
                    tags: r.tags || []
                }));

                const { error } = await supabase.from('global_recipes').insert(formattedRecipes);
                if (error) {
                    console.error("Error BD insertando:", error.message);
                } else {
                    generadas += unicas.length;

                    // Solo actualizamos de inmediato el archivo local si funciona en BD
                    existentes.push(...unicas);
                    fs.writeFileSync(filePath, JSON.stringify(existentes, null, 2), 'utf8');

                    console.log(`-> Añadidas: ${unicas.length}. Total generadas en esta sesión: ${generadas}. Total global: ${existentes.length}`);
                }
            }

            await delay(4000); // 4s para refrescar IP y cuotas de Gemini
        }
    }
    console.log(`¡Proceso en background finalizado con éxito!`);
}

run();
