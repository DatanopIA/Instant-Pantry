import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // The listModels method is on the genAI object or requires a specific client
        // In @google/generative-ai, it's not directly exposed like this.
        // It's usually handled via the GoogleAIFileManager or similar for other parts.
        // Actually, let's try to fetch it via the REST API using the key to be sure what's available.
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
