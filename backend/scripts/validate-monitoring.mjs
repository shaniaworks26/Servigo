import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getRuntimeSecretsConfig } from '../config/runtimeSecrets.js';
import { getMetricsSnapshot } from '../services/metricsService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const alertsPath = path.resolve(__dirname, '../../docker/alerts.yml');

function fail(message) {
  console.error(`[monitoring:validate] FAIL: ${message}`);
  process.exit(1);
}

function main() {
  if (!existsSync(alertsPath)) {
    fail(`Missing alerts file at ${alertsPath}`);
  }

  const alerts = readFileSync(alertsPath, 'utf8');
  if (!alerts.includes('groups:') || !alerts.includes('alert:')) {
    fail('docker/alerts.yml must contain at least one alert rule group.');
  }

  const secretsConfig = getRuntimeSecretsConfig();
  const metrics = getMetricsSnapshot();

  if (!secretsConfig.provider) {
    fail('runtime secrets provider is not configured.');
  }

  console.log('[monitoring:validate] PASS');
  console.log(`[monitoring:validate] provider=${secretsConfig.provider} enabled=${secretsConfig.enabled}`);
  console.log(`[monitoring:validate] metrics-active=${metrics.active}`);
}

main();
