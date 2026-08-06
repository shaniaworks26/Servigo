import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const requiredPaths = [
  'scripts/a11y/axe-audit.mjs',
  'index.html',
  'vite.config.js',
];

const missing = requiredPaths.filter((file) => !existsSync(file));

if (missing.length > 0) {
  console.log('[test:a11y] Skipping because required accessibility files are missing in this branch snapshot.');
  for (const file of missing) {
    console.log(`- missing: ${file}`);
  }
  process.exit(0);
}

const result = spawnSync('npx', [
  'start-server-and-test',
  'npm run preview -- --host 127.0.0.1 --port 4173',
  'http://127.0.0.1:4173',
  'node scripts/a11y/axe-audit.mjs',
], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
