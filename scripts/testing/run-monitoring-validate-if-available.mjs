import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const requiredPaths = [
  'backend/scripts/validate-monitoring.mjs',
  'backend/config/runtimeSecrets.js',
  'backend/services/metricsService.js',
  'docker/alerts.yml',
];

const missing = requiredPaths.filter((file) => !existsSync(file));

if (missing.length > 0) {
  console.log('[monitoring:validate] Skipping because required monitoring files are missing in this branch snapshot.');
  for (const file of missing) {
    console.log(`- missing: ${file}`);
  }
  process.exit(0);
}

const result = spawnSync('node', ['backend/scripts/validate-monitoring.mjs'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
