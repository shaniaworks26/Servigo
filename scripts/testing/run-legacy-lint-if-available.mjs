import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const lintTargets = [
  'mobile-app/src',
  'admin-dashboard/src',
  'provider-dashboard/src',
  'backend/tmp',
  'backend/tmp_compare_schema.js',
];

const existingTargets = lintTargets.filter((target) => existsSync(target));

if (existingTargets.length === 0) {
  console.log('[lint:legacy] Skipping because no legacy or experimental lint targets exist in this branch snapshot.');
  process.exit(0);
}

const result = spawnSync('npx', ['oxlint', ...existingTargets], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
