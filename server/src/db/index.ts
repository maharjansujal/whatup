import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
const isRemote = process.env.DATABASE_URL?.includes("neon.tech");

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRemote ? { rejectUnauthorized: false } : false,
});
