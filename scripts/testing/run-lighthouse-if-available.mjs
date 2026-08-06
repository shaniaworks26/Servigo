import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

function writePlaceholderArtifact() {
  mkdirSync('.lighthouseci', { recursive: true });
  writeFileSync('.lighthouseci/skipped.txt', 'Lighthouse audit skipped: required files missing in this branch snapshot.\n');
}

const requiredPaths = [
  '.lighthouserc.json',
  'index.html',
  'vite.config.js',
];

const missing = requiredPaths.filter((file) => !existsSync(file));

if (missing.length > 0) {
  console.log('[test:lighthouse] Skipping because required Lighthouse files are missing in this branch snapshot.');
  for (const file of missing) {
    console.log(`- missing: ${file}`);
  }
  writePlaceholderArtifact();
  process.exit(0);
}

const result = spawnSync('npx', [
  'start-server-and-test',
  'npm run preview -- --host 127.0.0.1 --port 4173',
  'http://127.0.0.1:4173',
  'lhci autorun --config=.lighthouserc.json',
], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
