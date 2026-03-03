import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
model.generateContent({
    contents: [
        { role: 'user', parts: [{text: 'hola'}] }
    ]
}).then(r => console.log('OK', r.response.text())).catch(e => console.error('ERROR', e.message));
