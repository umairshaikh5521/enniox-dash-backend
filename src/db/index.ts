import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { environment } from "../config/environment";
import * as schema from "./schema/user.schema";

const pool = new Pool({
  connectionString: environment.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
