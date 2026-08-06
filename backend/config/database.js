import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

let pool;

if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: process.env.PGSSLMODE && process.env.PGSSLMODE !== 'disable'
      ? { rejectUnauthorized: false }
      : false,
  });
} else {
  pool = {
    async query() {
      throw new Error('DATABASE_URL is not set.');
    },
    async end() {
      return undefined;
    },
  };
}

export default pool;
