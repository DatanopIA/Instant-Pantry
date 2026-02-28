import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        // There is no listModels in the standard GenAI SDK for web/node (it's in the REST API)
        // However, we can try to find which one works.
        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

        for (const modelName of models) {
            try {
                console.log(`Testing ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hi");
                console.log(`✅ ${modelName} works!`);
                console.log("Response:", result.response.text());
                return;
            } catch (e) {
                console.log(`❌ ${modelName} failed: ${e.message}`);
            }
        }
    } catch (error) {
        console.error("Critical error:", error);
    }
}

run();
