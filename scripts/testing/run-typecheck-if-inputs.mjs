import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { spawnSync } from 'node:child_process';

const roots = ['src', 'backend', 'mobile-app', 'admin-dashboard', 'provider-dashboard'];
const exts = new Set(['.ts', '.tsx']);

function hasTypeScriptFile(dir) {
  if (!existsSync(dir)) {
    return false;
  }

  const stack = [dir];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = readdirSync(current);

    for (const entry of entries) {
      const fullPath = join(current, entry);
      let stat;
      try {
        stat = statSync(fullPath);
      } catch {
        continue;
      }

      if (stat.isDirectory()) {
        if (entry === 'node_modules' || entry === 'dist' || entry.startsWith('.')) {
          continue;
        }
        stack.push(fullPath);
        continue;
      }

      if (exts.has(extname(entry).toLowerCase())) {
        return true;
      }
    }
  }

  return false;
}

const shouldRunTypecheck = roots.some((root) => hasTypeScriptFile(root));

if (!shouldRunTypecheck) {
  console.log('[typecheck] No TypeScript input files found under configured roots. Skipping.');
  process.exit(0);
}

const result = spawnSync('npx', ['tsc', '--noEmit', '-p', 'tsconfig.json'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
