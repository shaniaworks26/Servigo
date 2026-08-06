import 'dotenv/config';

function getArg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) {
    return undefined;
  }
  return process.argv[index + 1];
}

function isTruthy(value) {
  return String(value || '').toLowerCase() === 'true';
}

function checkRequired(keys) {
  return keys.filter((key) => !process.env[key] || String(process.env[key]).trim() === '');
}

function main() {
  const targetEnv = (getArg('--env') || process.env.APP_ENV || 'production').toLowerCase();

  const required = [
    'DATABASE_URL',
    'PGSSLMODE',
    'NODE_ENV',
    'APP_ENV',
    'FRONTEND_URL',
    'CORS_ORIGIN',
    'SECRET_PROVIDER',
    'SECRET_MANAGER_ENABLED',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'JWT_EMAIL_SECRET',
    'PASSWORD_RESET_DELIVERY_MODE',
  ];

  const missing = checkRequired(required);

  const resetMode = (process.env.PASSWORD_RESET_DELIVERY_MODE || '').toLowerCase();
  if (resetMode === 'email') {
    missing.push(...checkRequired(['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS']));
  }

  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_WEBHOOK_SECRET) {
    missing.push('STRIPE_WEBHOOK_SECRET');
  }

  if (process.env.STRIPE_WEBHOOK_SECRET && !process.env.STRIPE_SECRET_KEY) {
    missing.push('STRIPE_SECRET_KEY');
  }

  const uniqueMissing = [...new Set(missing)];

  const warnings = [];
  const dbUrl = process.env.DATABASE_URL || '';
  if (dbUrl && !dbUrl.startsWith('postgres://') && !dbUrl.startsWith('postgresql://')) {
    warnings.push('DATABASE_URL does not look like a PostgreSQL connection string.');
  }

  if (dbUrl && !dbUrl.includes('neon.tech')) {
    warnings.push('DATABASE_URL host is not a Neon endpoint (expected host to include neon.tech).');
  }

  if (!isTruthy(process.env.SECRET_MANAGER_ENABLED) && targetEnv === 'production') {
    warnings.push('SECRET_MANAGER_ENABLED is false in production. Confirm this is intentional.');
  }

  if (uniqueMissing.length > 0) {
    console.error('[predeploy] FAIL: missing required environment variables for Render deployment.');
    for (const name of uniqueMissing) {
      console.error(` - ${name}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`[predeploy] PASS: required Render variables are set for ${targetEnv}.`);

  if (warnings.length > 0) {
    console.warn('[predeploy] WARN:');
    for (const warning of warnings) {
      console.warn(` - ${warning}`);
    }
  }
}

main();
