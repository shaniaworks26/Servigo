import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const isCi = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

const requiredPaths = [
  'backend/server.js',
  'backend/scripts/run-migrations.mjs',
  'backend/scripts/seed-ci-data.mjs',
];

const missing = requiredPaths.filter((file) => !existsSync(file));

if (missing.length === 0) {
  const migrate = spawnSync('npm', ['run', 'db:migrate'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (typeof migrate.status === 'number' && migrate.status !== 0) {
    process.exit(migrate.status);
  }

  const seed = spawnSync('npm', ['run', 'db:seed:ci'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (typeof seed.status === 'number' && seed.status !== 0) {
    process.exit(seed.status);
  }

  const server = spawnSync('node', ['backend/server.js'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (typeof server.status === 'number') {
    process.exit(server.status);
  }

  process.exit(1);
}

console.log('[backend:ci] Starting mock backend because required backend runtime files are missing in this branch snapshot.');
for (const file of missing) {
  console.log(`- missing: ${file}`);
}

if (isCi) {
  console.error('[backend:ci] Failing in CI because required backend runtime files are missing.');
  process.exit(1);
}

const port = Number(process.env.PORT || 5005);

const server = createServer((req, res) => {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || '127.0.0.1'}`);
  const path = requestUrl.pathname;

  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (path === '/health' || path === '/health/ready') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', mode: 'mock' }));
    return;
  }

  if (path.startsWith('/api/favorites')) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'No token provided. Please login.' }));
    return;
  }

  if (path.startsWith('/api/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, items: [] }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true, mode: 'mock' }));
});

server.listen(port, '127.0.0.1', () => {
  console.log(`[backend:ci] Mock backend listening on http://127.0.0.1:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
