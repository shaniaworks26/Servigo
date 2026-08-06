import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const isCi = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

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
  console.log('[test:lighthouse] Required Lighthouse files are missing in this branch snapshot.');
  for (const file of missing) {
    console.log(`- missing: ${file}`);
  }
  writePlaceholderArtifact();
  if (isCi) {
    console.error('[test:lighthouse] Failing in CI because required Lighthouse files are missing.');
    process.exit(1);
  }
  console.log('[test:lighthouse] Skipping outside CI.');
  process.exit(0);
}

const result = spawnSync('npm', [
  'run',
  'test:lighthouse:smoke',
], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
