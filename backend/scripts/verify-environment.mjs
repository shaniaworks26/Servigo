import 'dotenv/config';

function getArg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) {
    return undefined;
  }
  return process.argv[index + 1];
}

function normalizeBaseUrl(value) {
  return String(value || '').replace(/\/+$/, '');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function validateBaseUrl(label, value) {
  if (!value) {
    return `${label} is missing.`;
  }

  if (/[<>]/.test(value)) {
    return `${label} contains placeholder brackets (< or >). Replace it with your real deployed URL.`;
  }

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return `${label} is not a valid URL: ${value}`;
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return `${label} must start with http:// or https://.`;
  }

  return null;
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    const body = await response.text();
    return { ok: response.ok, status: response.status, body };
  } finally {
    clearTimeout(timer);
  }
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function checkEndpoint(url, options = {}) {
  const {
    timeoutMs = 8000,
    expectedStatus = 200,
    expectedJsonFields = {},
    retries = 0,
    retryDelayMs = 1200,
  } = options;

  let lastResult = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const result = await fetchWithTimeout(url, timeoutMs);

      if (result.status !== expectedStatus) {
        lastResult = {
          type: 'fail',
          message: `${url} returned ${result.status} (expected ${expectedStatus}).`,
        };

        if (attempt < retries) {
          await sleep(retryDelayMs * (attempt + 1));
          continue;
        }

        return lastResult;
      }

      const parsed = parseJson(result.body);
      if (Object.keys(expectedJsonFields).length > 0) {
        if (!parsed) {
          lastResult = {
            type: 'fail',
            message: `${url} did not return valid JSON.`,
          };

          if (attempt < retries) {
            await sleep(retryDelayMs * (attempt + 1));
            continue;
          }

          return lastResult;
        }

        for (const [key, expectedValue] of Object.entries(expectedJsonFields)) {
          if (parsed[key] !== expectedValue) {
            lastResult = {
              type: 'fail',
              message: `${url} JSON field ${key} was ${JSON.stringify(parsed[key])}, expected ${JSON.stringify(expectedValue)}.`,
            };

            if (attempt < retries) {
              await sleep(retryDelayMs * (attempt + 1));
              continue;
            }

            return lastResult;
          }
        }
      }

      return {
        type: 'pass',
        message: `${url} is healthy (${result.status}).`,
      };
    } catch (error) {
      lastResult = {
        type: 'blocked',
        message: `${url} is unreachable: ${error.message}`,
      };

      if (attempt < retries) {
        await sleep(retryDelayMs * (attempt + 1));
        continue;
      }

      return lastResult;
    }
  }

  return lastResult || {
    type: 'blocked',
    message: `${url} is unreachable.`,
  };
}

async function run() {
  const envName = (getArg('--env') || process.env.APP_ENV || 'development').toLowerCase();
  const isDevelopment = envName === 'development';
  const frontendArg = getArg('--frontend-url');
  const backendArg = getArg('--backend-url');

  const defaultFrontend = isDevelopment ? 'http://127.0.0.1:4173' : process.env.FRONTEND_URL;
  const defaultBackend = isDevelopment
    ? 'http://127.0.0.1:5005'
    : process.env.BACKEND_URL || process.env.VITE_API_URL;

  const frontendBaseUrl = normalizeBaseUrl(frontendArg || defaultFrontend);
  const backendBaseUrl = normalizeBaseUrl(backendArg || defaultBackend);

  if (!frontendBaseUrl || !backendBaseUrl) {
    console.log(`[verify:${envName}] BLOCKED`);
    console.log('Missing frontend or backend URL. Set --frontend-url/--backend-url or FRONTEND_URL/BACKEND_URL.');
    process.exitCode = 2;
    return;
  }

  const urlIssues = [
    validateBaseUrl('FRONTEND_URL/--frontend-url', frontendBaseUrl),
    validateBaseUrl('BACKEND_URL/--backend-url', backendBaseUrl),
  ].filter(Boolean);

  if (urlIssues.length > 0) {
    console.log(`[verify:${envName}] BLOCKED`);
    for (const issue of urlIssues) {
      console.log(` - ${issue}`);
    }
    console.log('Example: npm run verify:staging -- --frontend-url https://my-app.vercel.app --backend-url https://my-api.onrender.com');
    process.exitCode = 2;
    return;
  }

  const endpointTimeoutMs = isDevelopment ? 8000 : 30000;
  const endpointRetries = isDevelopment ? 0 : 2;

  const checks = [
    {
      name: 'backend-ping',
      fn: () => checkEndpoint(`${backendBaseUrl}/api/ping`, {
        timeoutMs: endpointTimeoutMs,
        retries: endpointRetries,
        expectedJsonFields: { ok: true },
      }),
    },
    {
      name: 'backend-live',
      fn: () => checkEndpoint(`${backendBaseUrl}/health/live`, {
        timeoutMs: endpointTimeoutMs,
        retries: endpointRetries,
        expectedJsonFields: { status: 'live' },
      }),
    },
    {
      name: 'backend-ready',
      fn: () => checkEndpoint(`${backendBaseUrl}/health/ready`, {
        timeoutMs: endpointTimeoutMs,
        retries: endpointRetries,
        expectedJsonFields: { status: 'ready' },
      }),
    },
    {
      name: 'frontend-root',
      fn: () => checkEndpoint(frontendBaseUrl, {
        timeoutMs: endpointTimeoutMs,
        retries: endpointRetries,
        expectedStatus: 200,
      }),
    },
  ];

  const outcomes = [];
  for (const check of checks) {
    const result = await check.fn();
    outcomes.push({ name: check.name, ...result });
  }

  const blocked = outcomes.filter((item) => item.type === 'blocked');
  const failed = outcomes.filter((item) => item.type === 'fail');

  for (const outcome of outcomes) {
    console.log(`[verify:${envName}] ${outcome.name}: ${outcome.type.toUpperCase()} - ${outcome.message}`);
  }

  if (blocked.length > 0) {
    console.log(`[verify:${envName}] BLOCKED`);
    process.exitCode = 2;
    return;
  }

  if (failed.length > 0) {
    console.log(`[verify:${envName}] FAIL`);
    process.exitCode = 1;
    return;
  }

  console.log(`[verify:${envName}] PASS`);
}

run().catch((error) => {
  console.error('[verify] FAIL:', error);
  process.exitCode = 1;
});
