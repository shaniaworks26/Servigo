import pool from '../config/database.js';

export default async function globalTeardown() {
  try {
    // eslint-disable-next-line no-console
    console.log('[JEST-TEARDOWN] closing db pool');
    await pool.end();
    // eslint-disable-next-line no-console
    console.log('[JEST-TEARDOWN] db pool closed');
  } catch (error) {
    // Jest should still exit, but log if pool shutdown fails.
    // eslint-disable-next-line no-console
    console.error('Error closing database pool during global teardown:', error);
  }
}
