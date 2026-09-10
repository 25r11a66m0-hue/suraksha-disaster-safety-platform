/**
 * SURAKSHA Disaster Management Platform
 * Full-Stack Server Entry Point
 */

import express from 'express';
import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './backend/routes/api';

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API Routes mounted FIRST
  app.use('/api', apiRouter);

  // Catch-all for undefined API routes: return JSON 404 to avoid serving HTML
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      error: `API endpoint not found: ${req.method} ${req.originalUrl}`
    });
  });

  // Vite development middleware vs production static files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT, hmr: { server: httpServer, clientPort: 443 } },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[SURAKSHA] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[SURAKSHA] Fatal server startup failure:', err);
});
