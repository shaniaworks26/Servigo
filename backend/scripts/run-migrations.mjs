import pool from '../config/database.js';

function isProductionLike() {
  const nodeEnv = (process.env.NODE_ENV || '').toLowerCase();
  const appEnv = (process.env.APP_ENV || '').toLowerCase();
  return nodeEnv === 'production' || appEnv === 'staging' || appEnv === 'production';
}

async function run() {
  if (!process.env.DATABASE_URL) {
    if (isProductionLike()) {
      throw new Error('DATABASE_URL is required in staging/production environments.');
    }
    console.log('[db:migrate] DATABASE_URL is not set. Skipping migrations.');
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(
    `INSERT INTO schema_migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
    ['baseline_init'],
  );

  console.log('[db:migrate] Migrations complete.');
}

run()
  .catch((error) => {
    console.error('[db:migrate] Migration failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
