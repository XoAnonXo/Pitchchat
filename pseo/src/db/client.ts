import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

let pool: Pool | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getConnectionString() {
  return process.env.PSEO_DATABASE_URL ?? process.env.DATABASE_URL ?? "";
}

/**
 * Lazily initializes the pSEO database connection.
 *
 * IMPORTANT: The pSEO app has a seed-data fallback and can run without a DB.
 * In those cases this returns `null` and callers should degrade gracefully.
 */
export function getDb() {
  const connectionString = getConnectionString();
  if (!connectionString) {
    return null;
  }

  if (!pool) {
    pool = new Pool({ connectionString });
  }

  if (!dbInstance) {
    dbInstance = drizzle(pool);
  }

  return dbInstance;
}
