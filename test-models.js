import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelArgs = process.argv[2] || 'gemini-1.5-flash-latest';
const model = genAI.getGenerativeModel({ model: modelArgs });
model.generateContent({
    contents: [
        { role: 'user', parts: [{ text: 'hola' }] }
    ]
}).then(r => console.log('OK', modelArgs, r.response.text().substring(0, 10))).catch(e => console.error('ERROR', modelArgs, e.message));
