// packages/APIS/pgPool.ts
import { Pool } from "pg";

let pool: Pool | null = null;

const getPgPool = (): Pool => {
  if (!pool || pool.ended) {
    pool = new Pool({
      connectionString: process.env.PG_DB_URI,
    });
  }
  return pool;
};


export default getPgPool;


export const destroyPgPool = (): void => {
  process.on("SIGINT", async () => {
    const pgPool = getPgPool();
    await pgPool.end();
    process.exit(0);
  });
}


