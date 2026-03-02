import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Procesa una imagen de ticket mediante Gemini Vision 1.5 Flash
 * @param {string} imageBase64 - Imagen en formato base64
 * @returns {Object} - Datos estructurados del ticket
 */
export const processReceiptImage = async (imageBase64) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
    Analiza esta imagen de un ticket de compra de supermercado. 
    Extrae la lista de productos comprados. 
    Para cada producto, identifica: 
    - name: nombre del producto (normalizado en español)
    - quantity: cantidad comprada
    - price: precio unitario o total del item
    - category: categoría (ej: Lácteos, Frutas, Limpieza, etc.)

    Devuelve ÚNICAMENTE un objeto JSON con este formato:
    {
      "items": [
        { "name": "Leche", "quantity": 6, "price": 0.95, "category": "Lácteos" }
      ],
      "total_amount": 5.70,
      "currency": "EUR"
    }
  `;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg"
      }
    }
  ]);

  const response = await result.response;
  return JSON.parse(response.text());
};
