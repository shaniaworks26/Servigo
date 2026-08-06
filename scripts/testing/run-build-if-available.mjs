import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const isCi = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

const requiredFiles = ['index.html', 'vite.config.js'];
const missing = requiredFiles.filter((file) => !existsSync(file));

if (missing.length > 0) {
  console.log('[build] Required frontend entry files are missing in this branch snapshot.');
  for (const file of missing) {
    console.log(`- missing: ${file}`);
  }
  if (isCi) {
    console.error('[build] Failing build in CI because required frontend files are missing.');
    process.exit(1);
  }
  console.log('[build] Skipping frontend build outside CI.');
  process.exit(0);
}

const result = spawnSync('npx', ['vite', 'build'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
