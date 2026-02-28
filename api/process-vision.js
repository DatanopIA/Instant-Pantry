import { supabase } from './utils/supabase.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

/**
 * Escáner de Nevera/Despensa con Gemini Vision
 */
import { AIGuard } from './utils/ai-guard.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { image, household_id } = req.body;
        if (!image || !household_id) return res.status(400).json({ error: 'Faltan campos (imagen o household_id)' });
        if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY no configurada');

        const guard = new AIGuard(process.env.GEMINI_API_KEY);
        console.log(`[Vision IA] Escaneando con Guardrails...`);

        const prompt = `Analiza esta imagen y devuelve un JSON con:
        - name: Nombre en español.
        - quantity: Cantidad estimada (número).
        - unit: Unidad (unidades, litros, kg, etc.).
        - expires_in_days: Días estimados para caducar.
        
        Formato: { "items": [ { "name": "...", "quantity": 1, "unit": "...", "expires_in_days": 5 } ] }`;

        const visionData = await guard.call({
            prompt: [
                prompt,
                {
                    inlineData: {
                        data: image.split(',')[1] || image,
                        mimeType: "image/jpeg"
                    }
                }
            ],
            format: 'json',
            model: "gemini-2.5-flash"
        });

        const processedItems = visionData.items.map(item => {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + (item.expires_in_days || 7));
            return {
                household_id,
                name: item.name,
                quantity: item.quantity || 1,
                current_unit: item.unit || 'uds',
                expires_at: expiryDate.toISOString(),
                status: 'active',
                is_opened: false,
                metadata: { source: 'vision_ia', confidence: 0.95 }
            };
        });

        return res.status(200).json({
            success: true,
            items: processedItems,
            message: `Detección completada: ${processedItems.length} ingredientes.`
        });

    } catch (error) {
        console.error('Vision API Error:', error);
        return res.status(500).json({ error: 'Error en el escáner inteligente', details: error.message });
    }
}
