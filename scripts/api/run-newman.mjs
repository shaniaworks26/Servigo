import { mkdirSync, writeFileSync } from 'node:fs';

const baseUrl = process.env.API_BASE_URL || 'http://127.0.0.1:5005';
const checks = [
  { name: 'health_ready', url: `${baseUrl}/health/ready`, expect: { status: 200, bodyIncludes: 'ready' } },
  { name: 'api_ping', url: `${baseUrl}/api/ping`, expect: { status: 200, bodyIncludes: '"ok":true' } },
];

async function runCheck(check) {
  const res = await fetch(check.url);
  const body = await res.text();
  const statusOk = res.status === check.expect.status;
  const bodyOk = body.includes(check.expect.bodyIncludes);

  return {
    name: check.name,
    status: res.status,
    ok: statusOk && bodyOk,
    details: statusOk && bodyOk
      ? 'ok'
      : `expected status ${check.expect.status} and body containing ${check.expect.bodyIncludes}`,
  };
}

function writeArtifacts(results) {
  const failures = results.filter((r) => !r.ok);

  mkdirSync('newman', { recursive: true });

  const junit = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<testsuite name="api-smoke" tests="${results.length}" failures="${failures.length}">`,
    ...results.map((r) => (
      r.ok
        ? `  <testcase classname="api" name="${r.name}" />`
        : `  <testcase classname="api" name="${r.name}"><failure message="${r.details}">status=${r.status}</failure></testcase>`
    )),
    '</testsuite>',
    '',
  ].join('\n');

  const htmlRows = results
    .map((r) => `<tr><td>${r.name}</td><td>${r.status}</td><td>${r.ok ? 'PASS' : 'FAIL'}</td><td>${r.details}</td></tr>`)
    .join('');

  const html = `<!doctype html><html><body><h1>API Smoke Report</h1><table border="1" cellpadding="6" cellspacing="0"><thead><tr><th>Check</th><th>Status</th><th>Result</th><th>Details</th></tr></thead><tbody>${htmlRows}</tbody></table></body></html>`;

  writeFileSync('newman/newman-junit.xml', junit);
  writeFileSync('newman/newman-report.html', html);
}

async function main() {
  const results = [];

  for (const check of checks) {
    try {
      results.push(await runCheck(check));
    } catch (error) {
      results.push({
        name: check.name,
        status: 0,
        ok: false,
        details: error.message,
      });
    }
  }

  writeArtifacts(results);

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.error('[test:api:newman] FAIL');
    for (const item of failed) {
      console.error(` - ${item.name}: ${item.details}`);
    }
    process.exit(1);
  }

  console.log('[test:api:newman] PASS');
}

main().catch((error) => {
  console.error('[test:api:newman] FAIL:', error);
  process.exit(1);
});
