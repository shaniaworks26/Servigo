import { spawn } from 'node:child_process';
import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';

const BACKEND_URL = process.env.PW_BACKEND_HEALTH_URL || 'http://127.0.0.1:5005/health/ready';
const FRONTEND_URL = process.env.PW_FRONTEND_HEALTH_URL || 'http://127.0.0.1:4173';
const STARTUP_TIMEOUT_MS = Number(process.env.PW_STARTUP_TIMEOUT_MS || 180000);
const POLL_INTERVAL_MS = Number(process.env.PW_POLL_INTERVAL_MS || 1500);

const userArgs = process.argv.slice(2);
const playwrightArgs = userArgs.length > 0
  ? userArgs
  : ['backend/tests/frontend.smoke.flow.test.js', '--project=chromium'];

const services = [];
let isShuttingDown = false;
const exec = promisify(execCallback);

function runShellCommand(command) {
  return new Promise((resolve) => {
    const child = spawn(command, {
      shell: true,
      stdio: 'ignore',
      env: process.env,
    });

    child.on('exit', () => resolve());
    child.on('error', () => resolve());
  });
}

async function killProcessTree(pid) {
  if (!pid) return;

  if (process.platform === 'win32') {
    await runShellCommand(`taskkill /PID ${pid} /T /F`);
    return;
  }

  try {
    process.kill(-pid, 'SIGTERM');
  } catch {
    // Ignore if process group does not exist.
  }
}

async function findListeningPids(port) {
  try {
    if (process.platform === 'win32') {
      const { stdout } = await exec(`netstat -ano -p tcp | findstr LISTENING | findstr :${port}`);
      const pids = new Set();

      for (const line of stdout.split(/\r?\n/)) {
        const match = line.match(new RegExp(`:${port}\\s+[^\\s]+\\s+LISTENING\\s+(\\d+)`, 'i'));
        if (match?.[1]) pids.add(Number(match[1]));
      }

      return Array.from(pids).filter((pid) => Number.isFinite(pid) && pid > 0 && pid !== process.pid);
    }

    const { stdout } = await exec(`lsof -ti tcp:${port} -sTCP:LISTEN`);
    return stdout
      .split(/\r?\n/)
      .map((value) => Number(value.trim()))
      .filter((pid) => Number.isFinite(pid) && pid > 0 && pid !== process.pid);
  } catch {
    return [];
  }
}

async function clearPort(port, label) {
  const pids = await findListeningPids(port);
  if (pids.length === 0) return;

  process.stdout.write(`[startup] Reclaiming ${label} port ${port} from existing process(es): ${pids.join(', ')}\n`);
  for (const pid of pids) {
    await killProcessTree(pid);
  }
}

function startService(name, command) {
  const child = spawn(command, {
    shell: true,
    env: process.env,
    stdio: 'pipe',
  });

  child.stdout.on('data', (chunk) => {
    process.stdout.write(`[${name}] ${chunk}`);
  });

  child.stderr.on('data', (chunk) => {
    process.stderr.write(`[${name}] ${chunk}`);
  });

  child.on('error', (error) => {
    process.stderr.write(`[${name}] failed to start: ${error.message}\n`);
  });

  services.push({ name, child });
  return { child };
}

async function waitForServiceStartup(service, url, label, timeoutMs, pollMs) {
  let startupComplete = false;

  const healthPromise = waitForHealthy(url, label, timeoutMs, pollMs).then(() => {
    startupComplete = true;
  });

  const earlyExitPromise = new Promise((_, reject) => {
    service.child.once('exit', (code, signal) => {
      if (!isShuttingDown && !startupComplete) {
        reject(new Error(`${service.name || label} exited before becoming healthy (code=${code}, signal=${signal || 'none'}).`));
      }
    });
  });

  await Promise.race([healthPromise, earlyExitPromise]);
}

async function waitForHealthy(url, label, timeoutMs, pollMs) {
  const startedAt = Date.now();
  let attempts = 0;
  let lastError = 'No response received yet';

  while (Date.now() - startedAt < timeoutMs) {
    attempts += 1;
    try {
      const response = await fetch(url, { method: 'GET' });
      if (response.ok) {
        const elapsed = Date.now() - startedAt;
        process.stdout.write(`[startup] ${label} healthy after ${elapsed}ms (${attempts} checks) -> ${url}\n`);
        return;
      }
      lastError = `HTTP ${response.status} ${response.statusText}`;
    } catch (error) {
      lastError = error?.message || String(error);
    }

    await new Promise((resolve) => setTimeout(resolve, pollMs));
  }

  throw new Error(
    `${label} did not become healthy within ${timeoutMs}ms. Last check result: ${lastError}. URL: ${url}`,
  );
}

async function shutdownServices() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  for (const { child } of services) {
    if (child.exitCode === null && !child.killed) {
      await killProcessTree(child.pid);
    }
  }

  const shutdownDeadlineMs = 10000;
  const start = Date.now();

  while (Date.now() - start < shutdownDeadlineMs) {
    const allStopped = services.every(({ child }) => child.exitCode !== null || child.killed);
    if (allStopped) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  for (const { child } of services) {
    if (child.exitCode === null && !child.killed) {
      await killProcessTree(child.pid);
    }
  }
}

async function runPlaywright() {
  return new Promise((resolve, reject) => {
    const command = `npx playwright test ${playwrightArgs.join(' ')}`;

    const child = spawn(command, {
      shell: true,
      env: process.env,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`Playwright terminated by signal ${signal}`));
        return;
      }
      resolve(code ?? 1);
    });
  });
}

async function main() {
  await clearPort(5005, 'backend');
  await clearPort(4173, 'frontend');

  process.stdout.write('[startup] Starting backend and frontend services for Playwright...\n');

  const backend = startService('backend', 'npm run backend:ci');
  const frontend = startService('frontend', 'npm run preview -- --host 127.0.0.1 --port 4173');

  backend.child.on('exit', (code, signal) => {
    if (!isShuttingDown && code !== 0) {
      process.stderr.write(`[backend] exited unexpectedly with code ${code} signal ${signal || 'none'}\n`);
    }
  });

  frontend.child.on('exit', (code, signal) => {
    if (!isShuttingDown && code !== 0) {
      process.stderr.write(`[frontend] exited unexpectedly with code ${code} signal ${signal || 'none'}\n`);
    }
  });

  await Promise.all([
    waitForServiceStartup({ ...backend, name: 'backend' }, BACKEND_URL, 'Backend', STARTUP_TIMEOUT_MS, POLL_INTERVAL_MS),
    waitForServiceStartup({ ...frontend, name: 'frontend' }, FRONTEND_URL, 'Frontend', STARTUP_TIMEOUT_MS, POLL_INTERVAL_MS),
  ]);

  process.stdout.write('[startup] Both services are healthy. Starting Playwright tests...\n');
  const exitCode = await runPlaywright();
  process.exitCode = exitCode;
}

for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, async () => {
    process.stdout.write(`[shutdown] Received ${signal}, stopping services...\n`);
    await shutdownServices();
    process.exit(130);
  });
}

main()
  .catch((error) => {
    process.stderr.write(`[startup] Failed to run Playwright workflow: ${error.message}\n`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await shutdownServices();
  });
