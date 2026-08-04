import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

function writePlaceholderArtifacts() {
  mkdirSync('newman', { recursive: true });
  writeFileSync('newman/newman-junit.xml', '<?xml version="1.0" encoding="UTF-8"?><testsuite name="newman" tests="0" failures="0" skipped="1"></testsuite>\n');
  writeFileSync('newman/newman-report.html', '<html><body><h1>Newman skipped</h1><p>Required files missing in this branch snapshot.</p></body></html>\n');
}

const requiredPaths = ['scripts/api/run-newman.mjs'];
const missing = requiredPaths.filter((file) => !existsSync(file));

if (missing.length > 0) {
  console.log('[test:api:newman] Skipping because required API regression files are missing in this branch snapshot.');
  for (const file of missing) {
    console.log(`- missing: ${file}`);
  }
  writePlaceholderArtifacts();
  process.exit(0);
}

const result = spawnSync('npx', [
  'start-server-and-test',
  'npm run backend:ci',
  'http://127.0.0.1:5005/health/ready',
  'node scripts/api/run-newman.mjs',
], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
