import "dotenv/config";
import { createClient } from "@clickhouse/client";
import pg from "pg";

// PG Setup
const pgClient = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

// ClickHouse Setup
const clickhouse = createClient({
  url: process.env.CLICKHOUSE_URL || "http://localhost:8123",
  username: process.env.CLICKHOUSE_USER || "default",
  password: process.env.CLICKHOUSE_PASSWORD || "",
  database: process.env.CLICKHOUSE_DATABASE || "default",
});

async function main() {
  console.log("🗑️  Clearing databases...");

  // Clear Postgres
  try {
    await pgClient.connect();
    console.log("Connected to Postgres");

    // Get all table names
    const res = await pgClient.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);

    const tables = res.rows.map((r) => r.tablename);
    if (tables.length > 0) {
      console.log(`Found PG tables: ${tables.join(", ")}`);
      // Truncate all tables
      await pgClient.query(
        `TRUNCATE TABLE ${tables.map((t) => `"${t}"`).join(", ")} CASCADE`,
      );
      console.log("✅ Postgres tables truncated");
    } else {
      console.log("No PG tables found");
    }
  } catch (e) {
    console.error("Error clearing Postgres:", e);
  } finally {
    await pgClient.end();
  }

  // Clear ClickHouse
  try {
    console.log("Connected to ClickHouse");
    await clickhouse.command({
      query: "TRUNCATE TABLE IF EXISTS tunnel_events",
    });
    await clickhouse.command({
      query: "TRUNCATE TABLE IF EXISTS tunnel_stats_1m",
    });
    console.log("✅ ClickHouse tables truncated");
  } catch (e) {
    console.error("Error clearing ClickHouse:", e);
  }

  await clickhouse.close();
}

main();
