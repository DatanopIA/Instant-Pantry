import dotenv from 'dotenv';
dotenv.config();
import { AIGuard } from './api/utils/ai-guard.js';

async function run() {
    const defaultImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP..."; // a dummy base64 to test
    const guard = new AIGuard(process.env.GEMINI_API_KEY);
    console.log("Testing with GEMINI API KEY:", process.env.GEMINI_API_KEY ? "Set" : "Not Set");

    const prompt = `Analiza esta imagen (nevera, cocina o ticket de compra) y devuelve un JSON con:
        - name: Nombre claro del producto en español.
        - quantity: Cantidad estimada (número).
        - unit: Unidad (unidades, litros, kg, etc.).
        - expires_in_days: Días estimados para caducar de media para este tipo de producto.
        - is_food: Boolean indicando si es estrictamente un alimento o bebida.

        REGLA CRÍTICA: Debes ignorar o marcar como is_food: false cualquier producto de limpieza, droguería, higiene personal o hogar (lejía, detergente, limpiadores, papel wc, champú, etc.).
        Solo queremos llenar una despensa de ingredientes comestibles.
        
        Formato: { "items": [ { "name": "...", "quantity": 1, "unit": "...", "expires_in_days": 5, "is_food": true } ] }`;

    try {
        const visionData = await guard.call({
            prompt: [
                prompt,
                {
                    inlineData: {
                        data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGP6zwAAkwBtwX0ZKwAAAABJRU5ErkJggg==",
                        mimeType: "image/png"
                    }
                }
            ],
            format: 'json',
            model: "gemini-1.5-flash"
        });
        console.log("Success:", JSON.stringify(visionData, null, 2));
    } catch (e) {
        console.error("Failed:", e.message);
    }
}

run();
