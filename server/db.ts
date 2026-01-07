import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { performance } from "perf_hooks";
import ws from "ws";
import * as schema from "@shared/schema";
import { logDuration } from "./utils/timing";

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL_POOLER ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL or DATABASE_URL_POOLER must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: databaseUrl });

if (process.env.LOG_DB_QUERIES === "1") {
  // `Pool#query` has overloaded signatures; cast for safe forwarding.
  const originalQuery = pool.query.bind(pool) as unknown as (...args: any[]) => any;
  pool.query = async (...args: any[]) => {
    const start = performance.now();
    try {
      return await originalQuery(...args);
    } finally {
      const rawText = typeof args[0] === "string" ? args[0] : args[0]?.text;
      const sql = rawText ? String(rawText).replace(/\s+/g, " ").slice(0, 120) : "unknown";
      logDuration(`db.query ${sql}`, start);
    }
  };
}

export const db = drizzle({ client: pool, schema });
