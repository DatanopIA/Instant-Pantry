import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Intentando listar modelos...");
        // Nota: La librería a veces no expone listModels directamente fácil, 
        // así que vamos a probar una llamada simple al modelo base sin versión.
        console.log("API Key configurada:", process.env.GEMINI_API_KEY.substring(0, 5) + "...");
    } catch (e) {
        console.error("Error diagnosticando:", e);
    }
}

listModels();
