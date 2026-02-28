import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Importar handlers
import chatHandler from './ai/chat.js';
import visionHandler from './process-vision.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url} from ${req.headers.origin || 'unknown'}`);
    next();
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.json({ limit: '50mb' })); // Aumentar límite para imágenes

// Rutas
app.get('/api', (req, res) => {
    res.json({ message: "Instant Pantry API is running." });
});

app.post('/api/ai/chat', (req, res, next) => {
    console.log('[API] Procesando chat body:', JSON.stringify(req.body).substring(0, 50));
    next();
}, chatHandler);
app.post('/api/process-vision', visionHandler);

// Iniciar servidor solo si no estamos en Vercel (opcional, Vercel ignora el listen)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
    });
}

export default app;

