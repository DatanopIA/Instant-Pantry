import { supabaseAdmin } from './src/utils/supabase.js';

async function seedTestData() {
    console.log('🚀 Sembrando datos de prueba en Supabase...');

    // 1. Crear un Hogar de prueba
    const { data: household, error: hError } = await supabaseAdmin
        .from('households')
        .insert([{ name: 'Hogar de Prueba Maeki' }])
        .select()
        .single();

    if (hError) {
        console.error('❌ Error creando hogar:', hError);
        return;
    }

    console.log('✅ Hogar creado:', household.id);
    console.log('--------------------------------------------------');
    console.log('Copia este ID en tu archivo .env como TEST_HOUSEHOLD_ID:');
    console.log(household.id);
    console.log('--------------------------------------------------');
}

seedTestData();
