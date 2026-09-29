#!/usr/bin/env node
/**
 * Seed the Orbit demo data into DATABASE_URL (node-postgres).
 *
 * Runs from the compose `seed` job and `npm run db:seed`. Never part of a Vercel
 * build, so deployed databases get no demo rows. Safe to re-run: existing rows are kept.
 *
 * The owner defaults to "public-demo", the fixed auth-off owner in src/lib/orbit/api.ts.
 */
import pg from "pg";
import { seedOrbitDemo } from "../db/seed/orbit-demo.ts";

const databaseUrl = process.env.DATABASE_URL?.trim();
const ownerId = process.env.ORBIT_SEED_OWNER?.trim() || "public-demo";

if (!databaseUrl) {
  console.error("[seed] DATABASE_URL is required. The local PGlite dev database seeds itself on start.");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: databaseUrl, max: 1 });
try {
  await seedOrbitDemo({ query: async (text, params) => (await pool.query(text, params)).rows }, ownerId);
  console.log(`[seed] demo data is present for owner ${ownerId}.`);
} catch (error) {
  // OWASP A08:2025 Security Logging and Monitoring Failures. Log the error class and message only, never the connection string.
  console.error(`[seed] failed: ${error?.name ?? "Error"}: ${error?.message ?? "unknown error"}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}
