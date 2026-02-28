import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Get models from the REST list
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const models = data.models
        .filter(m => m.supportedGenerationMethods.includes("generateContent"))
        .map(m => m.name.replace("models/", ""));

    console.log(`Found ${models.length} candidate models.`);

    for (const modelName of models) {
        try {
            process.stdout.write(`Testing ${modelName}... `);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: 'Hi' }] }] });
            console.log("✅ SUCCESS!");
            console.log("Response:", result.response.text());
            return;
        } catch (e) {
            console.log(`❌ FAILED: ${e.message.substring(0, 50)}...`);
        }
    }
}

run();
