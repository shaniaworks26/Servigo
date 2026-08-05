import express from 'express';
import cors from 'cors';
import { pathToFileURL } from 'node:url';

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '1mb' }));

  const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((value) => value.trim())
    : '*';

  app.use(cors({ origin: corsOrigin }));

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/health/live', (_req, res) => {
    res.status(200).json({ status: 'live' });
  });

  app.get('/health/ready', (_req, res) => {
    res.status(200).json({ status: 'ready' });
  });

  app.get('/health/startup', (_req, res) => {
    res.status(200).json({ status: 'started' });
  });

  app.get('/api/ping', (_req, res) => {
    res.status(200).json({ ok: true, service: 'servigo-backend' });
  });

  return app;
}

export function startServer() {
  const app = createApp();
  const port = Number(process.env.PORT || 5005);

  const server = app.listen(port, () => {
    console.log(`[backend] listening on ${port}`);
  });

  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer();
}
