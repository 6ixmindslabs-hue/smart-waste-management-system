import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Simple Vercel-like routing
const apiDir = path.join(__dirname, 'api');

const registerRoutes = async (dir, basePath = '/api') => {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await registerRoutes(fullPath, `${basePath}/${entry.name}`);
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
            const routePath = `${basePath}/${entry.name.replace('.js', '')}`;
            try {
                const moduleUrl = new URL(`file://${fullPath}`).href;
                const module = await import(moduleUrl);
                const handler = module.default;
                
                if (typeof handler === 'function') {
                    app.all(routePath, async (req, res) => {
                        try {
                            await handler(req, res);
                        } catch (err) {
                            console.error(`Error executing handler for ${routePath}:`, err);
                            res.status(500).json({ error: 'Internal Server Error' });
                        }
                    });
                    console.log(`Registered route: ${routePath}`);
                }
            } catch (err) {
                console.error(`Failed to load route ${routePath}:`, err);
            }
        }
    }
};

registerRoutes(apiDir).then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`\n========================================`);
        console.log(`🚀 Local Backend Server is running`);
        console.log(`🌐 URL: http://localhost:${PORT}`);
        console.log(`========================================\n`);
    });
});
