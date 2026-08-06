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
    console.log('[db:seed:ci] DATABASE_URL is not set. Skipping seed.');
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ci_seed_markers (
      id SERIAL PRIMARY KEY,
      marker TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(
    `INSERT INTO ci_seed_markers (marker) VALUES ($1) ON CONFLICT (marker) DO NOTHING`,
    ['ci_seed_v1'],
  );

  console.log('[db:seed:ci] Seed complete.');
}

run()
  .catch((error) => {
    console.error('[db:seed:ci] Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
