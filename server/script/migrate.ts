// scripts/migrate.ts
import dotenv from "dotenv";
dotenv.config();
import { Pool } from "pg";
import path from "path";
import fs from "fs";

const isRemote = process.env.DATABASE_URL?.includes("neon.tech");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRemote ? { rejectUnauthorized: false } : false,
});

async function runMigrations() {
  try {
    const sqlPath = path.join(__dirname, "../src/shared/db/schema.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");
    await pool.query(sql);
    console.log("Database tables initialized successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await pool.end();
  }
}

runMigrations();
