import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we load env vars from backend or root
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL || 'https://dsnfusumuonwnscjjnro.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const filePath = path.join(__dirname, 'recetas_biblioteca.json');
let raw = fs.readFileSync(filePath, 'utf8');
let recipes = JSON.parse(raw);

async function seed() {
    console.log(`Starting to seed ${recipes.length} recipes...`);

    const formattedRecipes = recipes.map(r => ({
        title: r.title || r.nombre || 'Receta sin título',
        description: r.description || r.descripcion || '',
        ingredients: r.ingredients || r.ingredientes || [],
        instructions: r.instructions || r.pasos || [],
        category: r.tags && r.tags.length > 0 ? r.tags[0] : null,
        difficulty: r.difficulty || r.dificultad || 'Media',
        prep_time: r.prepTime || r.tiempo || '30 min',
        tags: r.tags || []
    }));

    // Chunk array to avoid large inserts
    const chunkSize = 50;
    for (let i = 0; i < formattedRecipes.length; i += chunkSize) {
        const chunk = formattedRecipes.slice(i, i + chunkSize);
        const { error } = await supabase.from('global_recipes').insert(chunk);

        if (error) {
            console.error("Error inserting chunk:", error);
        } else {
            console.log(`Inserted chunk ${i / chunkSize + 1} (${chunk.length} recipes)`);
        }
    }

    console.log("Seeding process finished!");
}

seed();
