import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '@cocanvas/shared';

const { Pool } = pg;

// Prevent multiple connections in development (Next.js hot reloading)
const globalForDb = global as unknown as {
  pool: pg.Pool | undefined;
};

const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/cocanvas';

export const pool = globalForDb.pool ?? new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false },
});

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool;
}

export const db = drizzle(pool, { schema });
