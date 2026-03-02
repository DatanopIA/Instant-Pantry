import { supabaseAdmin } from '../utils/supabase.js';

/**
 * Servicio para gestionar el inventario y la normalización de productos
 */
export const InventoryService = {
    /**
     * Procesa los items escaneados y los guarda en el inventario del hogar
     */
    async addScannedItemsToInventory(householdId, items) {
        const results = [];

        // 0. Verificar suscripción y límites
        const { data: household } = await supabaseAdmin
            .from('households')
            .select('subscription_tier')
            .eq('id', householdId)
            .single();

        if (household?.subscription_tier === 'free') {
            const { count } = await supabaseAdmin
                .from('inventory_items')
                .select('*', { count: 'exact', head: true })
                .eq('household_id', householdId)
                .eq('status', 'active');

            if (count >= 30) {
                return items.map(item => ({
                    name: item.name,
                    status: 'error',
                    error: 'Límite de 30 productos alcanzado en el plan FREE. ¡Pásate a PRO para seguir escaneando!'
                }));
            }
        }

        for (const item of items) {
            try {
                // 1. Buscar o Crear el producto en el catálogo maestro
                let { data: product, error: pError } = await supabaseAdmin
                    .from('products_master')
                    .select('id')
                    .ilike('name', item.name)
                    .maybeSingle();

                if (!product) {
                    const { data: newProduct, error: createError } = await supabaseAdmin
                        .from('products_master')
                        .insert([{
                            name: item.name,
                            category: item.category,
                            base_unit: 'units'
                        }])
                        .select()
                        .single();

                    if (createError) throw createError;
                    product = newProduct;
                }

                // 2. Insertar en el inventario del hogar
                const { data: inventoryItem, error: iError } = await supabaseAdmin
                    .from('inventory_items')
                    .insert([{
                        household_id: householdId,
                        product_id: product.id,
                        quantity: item.quantity,
                        current_unit: 'units',
                        purchased_at: new Date().toISOString(),
                        status: 'active'
                    }])
                    .select()
                    .single();

                if (iError) throw iError;

                results.push({ name: item.name, status: 'saved', id: inventoryItem.id });
            } catch (err) {
                console.error(`Error procesando item ${item.name}:`, err);
                results.push({ name: item.name, status: 'error', error: err.message });
            }
        }

        return results;
    }
};
