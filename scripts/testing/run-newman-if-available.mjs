import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';

function writePlaceholderArtifacts() {
  mkdirSync('newman', { recursive: true });
  writeFileSync('newman/newman-junit.xml', '<?xml version="1.0" encoding="UTF-8"?><testsuite name="newman" tests="0" failures="0" skipped="1"></testsuite>\n');
  writeFileSync('newman/newman-report.html', '<html><body><h1>Newman skipped</h1><p>Required files missing in this branch snapshot.</p></body></html>\n');
}

const requiredPaths = ['scripts/api/run-newman.mjs'];
const missing = requiredPaths.filter((file) => !existsSync(file));

if (missing.length > 0) {
  console.log('[test:api:newman] Required API regression files are missing in this branch snapshot.');
  for (const file of missing) {
    console.log(`- missing: ${file}`);
  }
  writePlaceholderArtifacts();
  console.error('[test:api:newman] Failing because required API regression files are missing.');
  process.exit(1);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForBackendReady(url, timeoutMs = 90_000, intervalMs = 1500) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return;
      }
    } catch {
      // Keep polling until timeout.
    }

    await sleep(intervalMs);
  }

  throw new Error(`Timeout waiting for backend readiness at ${url}`);
}

function stopBackend(child) {
  if (!child || child.exitCode !== null) {
    return;
  }

  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore' });
    return;
  }

  child.kill('SIGTERM');
}

async function main() {
  const backend = spawn(
    'npm',
    ['run', 'backend:ci'],
    { stdio: 'inherit', shell: process.platform === 'win32' },
  );

  try {
    await waitForBackendReady('http://127.0.0.1:5005/health/ready');

    const result = spawnSync('node', ['scripts/api/run-newman.mjs'], {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    if (typeof result.status === 'number') {
      process.exit(result.status);
    }

    process.exit(1);
  } catch (error) {
    console.error(`[test:api:newman] FAIL: ${error.message}`);
    process.exit(1);
  } finally {
    stopBackend(backend);
  }
}

main();
