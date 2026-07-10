import { Pool, PoolClient } from "pg";

export * from "./postgres";

export type DbExecutor = Pool | PoolClient;
