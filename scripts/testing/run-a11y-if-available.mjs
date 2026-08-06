import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const isCi = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

const requiredPaths = [
  'scripts/a11y/axe-audit.mjs',
  'index.html',
  'vite.config.js',
];

const missing = requiredPaths.filter((file) => !existsSync(file));

if (missing.length > 0) {
  console.log('[test:a11y] Required accessibility files are missing in this branch snapshot.');
  for (const file of missing) {
    console.log(`- missing: ${file}`);
  }
  if (isCi) {
    console.error('[test:a11y] Failing in CI because required accessibility files are missing.');
    process.exit(1);
  }
  console.log('[test:a11y] Skipping outside CI.');
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
